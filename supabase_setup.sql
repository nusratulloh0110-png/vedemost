-- ВНИМАНИЕ: ЭТОТ СКРИПТ ПОЛНОСТЬЮ СБРОСИТ БАЗУ И СОЗДАСТ ЕЁ ЗАНОВО
-- ЭТО РЕШИТ ВСЕ ПРОБЛЕМЫ С ПРАВАМИ (RLS) И РЕКУРСИЕЙ

-- 0. ПОЛНАЯ ОЧИСТКА
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS create_user_admin(text, text, text, user_role, uuid);
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;

-- 1. ТИПЫ
CREATE TYPE user_role AS ENUM ('admin', 'tutor', 'starosta');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'excused', 'late', 'left_early');

-- 2. ТАБЛИЦЫ
CREATE TABLE groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'starosta' NOT NULL,
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- 3. БЕЗОПАСНОСТЬ (RLS)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- 4. Вспомогательные функции (обходят RLS для предотвращения рекурсии)
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 4.1 ПОЛИТИКИ
CREATE POLICY "Admins can do everything on groups" ON groups FOR ALL USING (get_my_role() = 'admin');
CREATE POLICY "Everyone authenticated can read groups" ON groups FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (get_my_role() = 'admin');

CREATE POLICY "Admins and Tutors can read all students" ON students FOR SELECT USING (get_my_role() IN ('admin', 'tutor'));
CREATE POLICY "Starostas can read students in their group" ON students FOR SELECT USING (
  get_my_role() = 'starosta' 
  AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.group_id = students.group_id)
);
CREATE POLICY "Admins can manage students" ON students FOR ALL USING (get_my_role() = 'admin');

CREATE POLICY "Everyone authenticated can read attendance" ON attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage attendance" ON attendance FOR ALL USING (get_my_role() = 'admin');
CREATE POLICY "Starostas can manage attendance for their group" ON attendance FOR ALL USING (
  get_my_role() = 'starosta' 
  AND EXISTS (
    SELECT 1 FROM profiles p 
    JOIN students s ON s.group_id = p.group_id 
    WHERE p.id = auth.uid() AND s.id = attendance.student_id
  )
);

-- 5. ТРИГГЕР ДЛЯ ПРОФИЛЕЙ
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Пользователь'), 'starosta')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. ФУНКЦИЯ СОЗДАНИЯ ПОЛЬЗОВАТЕЛЕЙ (RPC)
-- Убедимся, что расширение pgcrypto установлено в схеме extensions или public
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION create_user_admin(
    in_email TEXT, 
    in_password TEXT, 
    in_full_name TEXT, 
    in_role user_role, 
    in_group_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE 
    new_user_id UUID;
BEGIN
    -- Проверка прав (только админ может создавать пользователей)
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN 
        RAISE EXCEPTION 'Access denied. Only admins can create users.'; 
    END IF;
    
    -- Создаем пользователя в auth.users
    INSERT INTO auth.users (
        id, 
        instance_id,
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at, 
        raw_app_meta_data, 
        raw_user_meta_data, 
        created_at, 
        updated_at, 
        confirmation_token, 
        recovery_token, 
        email_change_token_new,
        is_super_admin
    )
    VALUES (
        gen_random_uuid(), 
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 
        'authenticated', 
        in_email, 
        crypt(in_password, gen_salt('bf')), 
        now(), 
        '{"provider":"email","providers":["email"]}', 
        jsonb_build_object('full_name', in_full_name), 
        now(), 
        now(),
        '', '', '',
        false
    )
    RETURNING id INTO new_user_id;

    -- Вставляем в auth.identities
    INSERT INTO auth.identities (
        id, 
        user_id, 
        identity_data, 
        provider, 
        provider_id, 
        last_sign_in_at, 
        created_at, 
        updated_at
    )
    VALUES (
        gen_random_uuid(), 
        new_user_id, 
        jsonb_build_object('sub', new_user_id, 'email', in_email), 
        'email', 
        in_email, 
        now(), 
        now(), 
        now()
    );

    -- Создаем профиль в публичной таблице
    INSERT INTO public.profiles (id, full_name, role, group_id) 
    VALUES (new_user_id, in_full_name, in_role, in_group_id) 
    ON CONFLICT (id) DO UPDATE SET 
        role = EXCLUDED.role, 
        group_id = EXCLUDED.group_id,
        full_name = EXCLUDED.full_name;
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth, extensions;

-- 7. АВТО-ПОВЫШЕНИЕ ДО АДМИНА ДЛЯ nusratikk@gmail.com
DO $$
BEGIN
    UPDATE public.profiles 
    SET role = 'admin' 
    WHERE id IN (SELECT id FROM auth.users WHERE email = 'nusratikk@gmail.com');
END $$;
