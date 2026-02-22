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


-- 1. Обновляем создание пользователя (чиним связку identity для корректного входа)
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
    
    -- Генерируем ID заранее
    new_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
        id, aud, role, email, encrypted_password, email_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    )
    VALUES (
        new_user_id, 'authenticated', 'authenticated', in_email, 
        -- Важно: используем cost=10 для совместимости с Supabase GoTrue
        extensions.crypt(in_password, extensions.gen_salt('bf', 10)), 
        now(), '{"provider":"email","providers":["email"]}', 
        jsonb_build_object('full_name', in_full_name), now(), now()
    );

    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    )
    VALUES (
        gen_random_uuid(), new_user_id, jsonb_build_object('sub', new_user_id, 'email', in_email), 
        'email', new_user_id::text, now(), now(), now()
    );

    INSERT INTO public.profiles (id, full_name, role, group_id) 
    VALUES (new_user_id, in_full_name, in_role, in_group_id);
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth, extensions;

-- 2. Функция для обновления логина и пароля
CREATE OR REPLACE FUNCTION update_user_credentials_admin(
    target_user_id UUID,
    new_email TEXT DEFAULT NULL,
    new_password TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN 
        RAISE EXCEPTION 'Access denied.'; 
    END IF;

    IF new_email IS NOT NULL AND new_email != '' THEN
        UPDATE auth.users SET email = new_email WHERE id = target_user_id;
        UPDATE auth.identities SET identity_data = jsonb_set(identity_data, '{email}', to_jsonb(new_email)) WHERE user_id = target_user_id AND provider = 'email';
    END IF;

    IF new_password IS NOT NULL AND new_password != '' THEN
        UPDATE auth.users SET encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')) WHERE id = target_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth, extensions;

-- 3. Функция для полного удаления пользователя
CREATE OR REPLACE FUNCTION delete_user_admin(target_user_id UUID)
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN 
        RAISE EXCEPTION 'Access denied.'; 
    END IF;
    
    -- Сначала удаляем профиль, потом сам аккаунт из auth
    DELETE FROM public.profiles WHERE id = target_user_id;
    DELETE FROM auth.users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;
