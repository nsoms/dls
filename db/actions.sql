/* logs action for given card, reader */
DROP FUNCTION IF EXISTS log_action (text, text);
DROP FUNCTION IF EXISTS log_action (text, text, BOOL);
CREATE OR REPLACE FUNCTION
    log_action (
        in_card         text,   -- card number
        in_reader       text,   -- reader
        in_result       BOOLEAN -- access result
) RETURNS INT AS $$
    INSERT INTO log (card, reader, result) VALUES ($1, $2, $3) RETURNING id
$$ LANGUAGE SQL VOLATILE;

/* function checks ability to open door - currently always open, but log everything */
CREATE OR REPLACE FUNCTION
    check_card (
        in_card         text,   -- card number
        in_reader       text    -- reader
) RETURNS BOOL AS $$
    DECLARE
        allowed bool;
    BEGIN
        -- find group with access
        SELECT (COUNT(*) > 0) INTO allowed FROM access WHERE
            group_id IN (SELECT groups_by_card($1)) AND
            access.access AND
            (start_time IS NULL OR current_time >= start_time) AND
            (end_time IS NULL OR current_time <= end_time) AND
            (reader IS NULL OR reader = $2);

        --         SELECT FALSE INTO allowed; -- disable all access

        PERFORM log_action(in_card, in_reader, allowed);
        RETURN allowed;
    END
$$ LANGUAGE plpgsql VOLATILE;

DROP FUNCTION IF EXISTS log_list();
DROP FUNCTION IF EXISTS log_list(int, int);
CREATE OR REPLACE FUNCTION
    log_list(
        lim     int,
        offs    int
) RETURNS TABLE (
    id              int,
    reader          text,                                   -- считыватель
    action_time     timestamp with time zone,               -- время события
    card_number     text,                                   -- номер карты
    user_id         int,                                    -- id пользователя
    surname         text,                                   -- фамилия
    name            text,                                   -- имя
    middlename      text,                                   -- отчество
    pic_name        text,                                   -- имя файла фотографии
    groups          text[],                                 -- группы пользователя
    result          boolean                                 -- результат разрешили или нет
) AS $$
    SELECT
        log.id,
        log.reader,
        log.time,
        log.card,
        users.id,
        users.surname,
        users.name,
        users.middlename,
        users.pic_name,
        ARRAY(SELECT groups.name FROM groups JOIN user_groups ON groups.id=user_groups.group_id WHERE user_id = users.id ORDER BY groups.name),
        result
    FROM log
    LEFT OUTER JOIN  users ON log.card=users.card_number
    ORDER BY log.time DESC
    LIMIT   $1
    OFFSET  $2
$$ LANGUAGE SQL STABLE;


