
/* returns list of groups for given params */
CREATE OR REPLACE FUNCTION
    users_get (
        viewer_id   int,
        in_id       int,
        in_card_number  text,   -- check equality
        in_surname      text,   -- check substring
        in_name         text    -- check substring
) RETURNS TABLE (
    id              int,
    card_number     text,                                   -- номер карты
    surname         text,                                   -- фамилия
    name            text,                                   -- имя
    middlename      text,                                   -- отчество
    pic_name        text,                                   -- имя файла фотографии
    birthday        date,                                   -- дата рождения
    register        timestamp with time zone,               -- дата регистрации
    reg_form        text,                                   -- класс регистрации
    login           name,                                   -- логин для авторизации
    role_id         int,                                    -- guest по-умолчанию
    rolename        text,                                   -- роль
    is_disabled     bool                                    -- включен/выключен
) AS $$
    SELECT
        users.id,
        card_number,
        surname,
        users.name,
        middlename,
        pic_name,
        birthday,
        register,
        reg_form,
        login,
        role_id,
        (SELECT rolename FROM roles WHERE id=role_id),
        is_disabled
     FROM users
        WHERE
            (allowed_users_see(viewer_id, id) AND NOT is_disabled)
            AND allowed_users_all_see(viewer_id, id)
            AND (in_id IS NULL AND TRUE OR id=$1)
            AND (in_name IS NULL AND TRUE OR name ILIKE '%' || in_name || '%')
            AND (allowed_groups)
        ORDER BY name;
$$ LANGUAGE SQL STABLE;

/* creates new groups with given params */
CREATE OR REPLACE FUNCTION
    user_add (
        viewer_id   int,
        in_card_number  text,
        in_surname      text,
        in_name         text,
        in_middlename   text,
        in_pic_name     text,
        in_birthday     date,
        in_reg_form     text,
        in_role_id      int
) RETURNS int AS $$
/*  id              serial PRIMARY KEY,
    card_number     text,                                   -- номер карты
    surname         text not null,                          -- фамилия
    name            text not null,                          -- имя
    middlename      text not null,                          -- отчество
    pic_name        text,                                   -- имя файла фотографии
    birthday        date not null default '1970-01-01',     -- дата рождения
    register        timestamp with time zone default now(), -- дата регистрации
    reg_form        text,                                   -- класс регистрации
    login           name,                                   -- логин для авторизации
    passwd          text,                                   -- пароль
    role_id         int default 3,                          -- guest по-умолчанию
    is_disabled     bool default false,                     -- включен/выключен
 */
    DECLARE
        allowed bool;
        res int;
    BEGIN
        allowed := allowed_users_mod(viewer_id, NULL);

        IF NOT allowed THEN
            RETURN -2;   -- not enough rights to modify groups
        END IF;

        INSERT INTO users(
                card_number,
                surname,
                name,
                middlename,
                pic_name,
                birthday,
                reg_form,
                role_id
            ) VALUES (
                in_card_number,
                in_surname,
                in_name,
                in_middlename,
                in_pic_name,
                in_birthday,
                in_reg_form,
                in_role_id
            )
            RETURNING id INTO res;

        RETURN res;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN -1;     -- unique violation
        WHEN OTHERS THEN
            RETURN -1000;  -- unknown error
    END;
$$ LANGUAGE plpgsql VOLATILE;

/* modyfies user with given params */
CREATE OR REPLACE FUNCTION
    user_mod (
        viewer_id   int,
        in_id       int,
        in_card_number  text,
        in_surname      text,
        in_name         text,
        in_middlename   text,
        in_pic_name     text,
        in_birthday     date,
        in_reg_form     text,
        in_role_id      int
) RETURNS int AS $$
/*  id              serial PRIMARY KEY,
    card_number     text,                                   -- номер карты
    surname         text not null,                          -- фамилия
    name            text not null,                          -- имя
    middlename      text not null,                          -- отчество
    pic_name        text,                                   -- имя файла фотографии
    birthday        date not null default '1970-01-01',     -- дата рождения
    register        timestamp with time zone default now(), -- дата регистрации
    reg_form        text,                                   -- класс регистрации
    login           name,                                   -- логин для авторизации
    passwd          text,                                   -- пароль
    role_id         int default 3,                          -- guest по-умолчанию
    is_disabled     bool default false,                     -- включен/выключен
 */
    DECLARE
        allowed bool;
        res int;
    BEGIN
        allowed := allowed_users_mod(viewer_id, NULL);

        IF NOT allowed THEN
            RETURN -2;   -- not enough rights to modify groups
        END IF;

        INSERT INTO users(
                card_number,
                surname,
                name,
                middlename,
                pic_name,
                birthday,
                reg_form,
                login,
                passwd,
                role_id
            ) VALUES (
                in_card_number
                in_surname
                in_name
                in_middlename
                in_pic_name
                in_birthday
                in_reg_form
                in_login
                in_passwd
                in_role_id
            )
            RETURNING id INTO res;

        RETURN res;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN -1;     -- unique violation
        WHEN OTHERS THEN
            RETURN -1000;  -- unknown error
    END;
$$ LANGUAGE plpgsql VOLATILE;
