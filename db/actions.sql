/* logs action for given card, reader */
DROP FUNCTION IF EXISTS log_action ( text, text);
CREATE OR REPLACE FUNCTION
    log_action (
        in_card         text,   -- card number
        in_reader       text    -- reader
) RETURNS INT AS $$
    INSERT INTO log (card, reader) VALUES ($1, $2) RETURNING id
$$ LANGUAGE SQL VOLATILE;

/* function checks ability to open door - currently always open, but log everything */
CREATE OR REPLACE FUNCTION
    check_card (
        in_card         text,   -- card number
        in_reader       text    -- reader
) RETURNS BOOL AS $$
    BEGIN
        SELECT log_action(in_card, in_reader);

        RETURN TRUE; -- superhack
    END
$$ LANGUAGE plpgsql VOLATILE;

CREATE OR REPLACE FUNCTION
    log_list(
) RETURNS TABLE (
    id              int,
    reader          text,                                   -- считыватель
    action_time     timestamp with time zone,               -- время события
    card_number     text,                                   -- номер карты
    surname         text,                                   -- фамилия
    name            text,                                   -- имя
    middlename      text,                                   -- отчество
    pic_name        text,                                   -- имя файла фотографии
    groups          text[]                                  -- группы пользователя
) AS $$
    SELECT
        log.id,
        log.reader,
        log.time,
        log.card,
        users.surname,
        users.name,
        users.middlename,
        users.pic_name,
        ARRAY(SELECT groups.name FROM groups JOIN user_groups ON groups.id=user_groups.group_id WHERE user_id = users.id)
    FROM log
    JOIN users ON log.card=users.card_number
$$ LANGUAGE SQL STABLE
