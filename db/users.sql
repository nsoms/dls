/* returns list of groups for given params */
DROP FUNCTION IF EXISTS check_pwd(text,text);
CREATE OR REPLACE FUNCTION
    check_pwd (
        in_login      text,
        in_passwd     text
) RETURNS TABLE (
    id              int,
    name            text,                                   -- имя
    login           name,                                   -- логин для авторизации
    role_id         int,                                    -- guest по-умолчанию
    rolename        name,                                   -- роль
    groups_see      bool,
    groups_mod      bool,
    users_see       bool,
    users_all_see   bool,
    users_mod       bool,
    users_role_set  bool,
    log_see         bool
) AS $$
    SELECT
        users.id,
        surname,
        login,
        role_id,
        rolename,
        groups_see,
        groups_mod,
        users_see,
        users_all_see,
        users_mod,
        users_role_set,
        log_see
    FROM users
        JOIN roles ON roles.id=users.role_id
        WHERE
            NOT is_disabled
            AND login = $1 AND passwd = $2
$$ LANGUAGE SQL STABLE;

/* returns list of groups for given params */
DROP FUNCTION IF EXISTS users_get ( int, int, text, text, text, int[] );
CREATE OR REPLACE FUNCTION
    users_get (
        viewer_id   int,
        in_id       int,
        in_card_number  text,   -- check equality
        in_surname      text,   -- check substring
        in_name         text,   -- check substring
        in_groups       int[]   -- array of groups
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
    rolename        name,                                   -- роль
    is_disabled     bool,                                   -- включен/выключен
    group_ids       int[]                                   -- группы пользователя
) AS $$
    SELECT DISTINCT
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
        is_disabled,
        ARRAY(SELECT group_id FROM user_groups WHERE user_id = users.id)
     FROM users
         JOIN user_groups ON user_groups.user_id=users.id
        WHERE
            (allowed_users_see($1, id) AND NOT is_disabled)
            AND allowed_users_all_see($1, id)
            AND ($2 IS NULL AND TRUE OR id=$2)
            AND ($3 IS NULL AND TRUE OR card_number = $3)
            AND ($4 IS NULL AND TRUE OR surname ILIKE '%' || $4 || '%')
            AND ($5 IS NULL AND TRUE OR name ILIKE '%' || $5 || '%')
            AND ($6 IS NULL AND TRUE OR user_groups.group_id = ANY($6))
        ORDER BY surname, name, middlename
$$ LANGUAGE SQL STABLE;


/* creates new groups with given params */
CREATE OR REPLACE FUNCTION
    user_add (
        viewer_id       int,    -- $1
        in_card_number  text,   -- $2
        in_surname      text,   -- $3
        in_name         text,   -- $4
        in_middlename   text,   -- $5
        in_pic_name     text,   -- $6
        in_birthday     date,   -- $7
        in_reg_form     text,   -- $8
        in_group_ids    int[],  -- $9
        in_position     text    -- $10
) RETURNS int AS $$
    DECLARE
        allowed bool;
        res int;
    BEGIN
        allowed := allowed_users_mod(viewer_id, NULL);

        RAISE LOG '%', $9;
        RAISE LOG '%, %', array_length($9, 1), array_to_string($9, ', ');

        IF NOT allowed THEN
            RETURN -3;   -- not enough rights to modify groups
        END IF;

        INSERT INTO users(
                card_number,
                surname,
                name,
                middlename,
                pic_name,
                birthday,
                reg_form,
                position
            ) VALUES (
                in_card_number,
                in_surname,
                in_name,
                in_middlename,
                in_pic_name,
                in_birthday,
                in_reg_form,
                in_position
            )
            RETURNING id INTO res;

        INSERT INTO user_groups (user_id, group_id)
            SELECT res, UNNEST(in_group_ids);

        RETURN res;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN -1;     -- unique violation
        WHEN OTHERS THEN
            RETURN -1000;  -- unknown error
    END;
$$ LANGUAGE plpgsql VOLATILE;


/* modifies user with given params */
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
        in_group_ids    int[],
        in_position     text
) RETURNS int AS $$
    DECLARE
        allowed bool;
        res int;
    BEGIN
        allowed := allowed_users_mod(viewer_id, NULL);

        IF NOT allowed THEN
            RETURN -3;   -- not enough rights to modify users
        END IF;

        UPDATE users
            SET (
                card_number,
                surname,
                name,
                middlename,
                birthday,
                reg_form,
                position
            ) = (
                in_card_number,
                in_surname,
                in_name,
                in_middlename,
                in_birthday,
                in_reg_form,
                in_position
            )
            WHERE id=in_id
            RETURNING id INTO res;

        IF in_pic_name IS NOT NULL THEN
            UPDATE users SET pic_name = in_pic_name WHERE id=in_id;
        END IF;

        DELETE FROM user_groups WHERE user_id=res;
        INSERT INTO user_groups (user_id, group_id)
            SELECT res, UNNEST(in_group_ids);

        RETURN res;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN -1;     -- unique violation
        WHEN OTHERS THEN
            RETURN -1000;  -- unknown error
    END;
$$ LANGUAGE plpgsql VOLATILE;


/* modifies user sets login, password and role */
CREATE OR REPLACE FUNCTION
    user_set_login (
        viewer_id   int,
        in_id       int,
        in_login    text,
        in_passwd   text,
        in_role_id  int
) RETURNS int AS $$
    DECLARE
        allowed bool;
        res int;
    BEGIN
        allowed := allowed_users_role_set(viewer_id, NULL);

        IF NOT allowed THEN
            RETURN -3;   -- not enough rights to modify users
        END IF;

        UPDATE users
            SET (
                login,
                passwd,
                role_id
            ) = (
                in_login,
                in_passwd,
                in_role_id
            )
            WHERE id=in_id
            RETURNING id INTO res;

        RETURN res;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN -1;     -- unique violation
        WHEN OTHERS THEN
            RETURN -1000;  -- unknown error
    END;
$$ LANGUAGE plpgsql VOLATILE;


/* disables or enables user */
CREATE OR REPLACE FUNCTION
    user_endisable (
    viewer_id   int,
    in_id       int
) RETURNS int AS $$
    DECLARE
        allowed bool;
        res int;
    BEGIN
        allowed := allowed_users_role_set(viewer_id, NULL);

        IF NOT allowed THEN
            RETURN -3;   -- not enough rights to modify users
        END IF;

        UPDATE users
            SET is_disabled = NOT is_disabled
            WHERE id=in_id
            RETURNING id INTO res;

        RETURN res;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN -1;     -- unique violation
        WHEN OTHERS THEN
            RETURN -1000;  -- unknown error
    END;
$$ LANGUAGE plpgsql VOLATILE;
