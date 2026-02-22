-- 1. Исправляем функцию получения роли (предотвращаем рекурсию)
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role AS $$
DECLARE
    _role user_role;
BEGIN
    -- plpgsql не инлайнится, что спасает от циклов RLS
    SELECT role INTO _role FROM public.profiles WHERE id = auth.uid();
    RETURN _role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Убираем рекурсию из таблиц профилей и обновляем правила
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles; -- Вот этой строки не хватало
DROP POLICY IF EXISTS "Everyone authenticated can read profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;

CREATE POLICY "Everyone authenticated can read profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update profiles" ON profiles FOR UPDATE USING (get_my_role() = 'admin' OR auth.uid() = id);
CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE USING (get_my_role() = 'admin');

-- 3. Добавляем WITH CHECK для остальных таблиц, чтобы админы могли создавать записи
DROP POLICY IF EXISTS "Admins can do everything on groups" ON groups;
CREATE POLICY "Admins can do everything on groups" ON groups FOR ALL USING (get_my_role() = 'admin') WITH CHECK (get_my_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage students" ON students;
CREATE POLICY "Admins can manage students" ON students FOR ALL USING (get_my_role() = 'admin') WITH CHECK (get_my_role() = 'admin');

DROP POLICY IF EXISTS "Admins can manage attendance" ON attendance;
CREATE POLICY "Admins can manage attendance" ON attendance FOR ALL USING (get_my_role() = 'admin') WITH CHECK (get_my_role() = 'admin');


-- 4. Исправляем RPC для создания пользователей (убираем устаревшие поля)
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

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
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN 
        RAISE EXCEPTION 'Access denied. Only admins can create users.'; 
    END IF;
    
    -- Вставляем ТОЛЬКО существующие в новых версиях Supabase колонки
    INSERT INTO auth.users (
        id, 
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at, 
        raw_app_meta_data, 
        raw_user_meta_data, 
        created_at, 
        updated_at
    )
    VALUES (
        gen_random_uuid(), 
        'authenticated', 
        'authenticated', 
        in_email, 
        extensions.crypt(in_password, extensions.gen_salt('bf')), 
        now(), 
        '{"provider":"email","providers":["email"]}', 
        jsonb_build_object('full_name', in_full_name), 
        now(), 
        now()
    )
    RETURNING id INTO new_user_id;

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    )
    VALUES (
        gen_random_uuid(), new_user_id, jsonb_build_object('sub', new_user_id, 'email', in_email), 'email', in_email, now(), now(), now()
    );

    INSERT INTO public.profiles (id, full_name, role, group_id) 
    VALUES (new_user_id, in_full_name, in_role, in_group_id) 
    ON CONFLICT (id) DO UPDATE SET 
        role = EXCLUDED.role, 
        group_id = EXCLUDED.group_id,
        full_name = EXCLUDED.full_name;
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth, extensions;