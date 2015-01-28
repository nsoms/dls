
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
    rolename        text,
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
            allowed_groups_see(viewer_id, id)
            AND (in_id IS NULL AND TRUE OR id=$1)
            AND (in_name IS NULL AND TRUE OR name ILIKE '%' || in_name || '%')
        ORDER BY name;
$$ LANGUAGE SQL STABLE;

/* creates new groups with given params */
CREATE OR REPLACE FUNCTION
    group_add (
        viewer_id   int,
        in_name     text
) RETURNS int AS $$
    DECLARE
        allowed bool;
        res int;
    BEGIN
        allowed := allowed_groups_mod(viewer_id, NULL);

        IF NOT allowed THEN
            RETURN -2;   -- not enough rights to modify groups
        END IF;

        INSERT INTO groups (name) VALUES ( in_name )
            RETURNING id INTO res;

        RETURN res;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN -1;     -- unique violation
        WHEN OTHERS THEN
            RETURN -1000;  -- unknown error
    END;
$$ LANGUAGE plpgsql VOLATILE;

/* creates new groups with given params */
CREATE OR REPLACE FUNCTION
    group_mod (
        viewer_id   int,
        in_id       int,
        in_name     text
) RETURNS int AS $$
    DECLARE
        allowed bool;
        res int;
    BEGIN
        allowed := allowed_groups_mod(viewer_id, in_id);

        IF NOT allowed THEN
            RETURN -2;   -- not enough rights to modify groups
        END IF;

        UPDATE groups
            SET name = in_name
            WHERE id=in_id;

        RETURN in_id;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN -1;     -- unique violation
        WHEN OTHERS THEN
            RETURN -1000;  -- unknown error
    END;
$$ LANGUAGE plpgsql VOLATILE;
