BEGIN;

-- create table with door access rights
CREATE TABLE access(
    id          SERIAL PRIMARY KEY,
    group_id    INT NOT NULL REFERENCES groups(id),  -- группа пользователей, которым предоставляется доступ
    reader      TEXT, -- номер считывателя к которому предоставляется доступ. Если NULL - то ко всем считывателям
    access      BOOL DEFAULT FALSE, -- право можно/нельзя
    start_time  TIME DEFAULT '00:00:00', -- время начала правила
    end_time    TIME DEFAULT '24:00:00' -- время окончания правила
);
CREATE INDEX access_group_reader_idx ON access(group_id, reader);
CREATE INDEX access_group_idx ON access(group_id);

-- Добавим правило, что учителям всегда можно
INSERT INTO access (group_id, reader, access) VALUES
    ((SELECT id FROM groups WHERE name='Учитель'), NULL, TRUE);
-- Добавим правило, что персоналу всегда можно
INSERT INTO access (group_id, reader, access) VALUES
    ((SELECT id FROM groups WHERE name='Персонал'), NULL, TRUE);
-- Ученикам можно только с 7:00 до 20:00
INSERT INTO access (group_id, reader, access, start_time, end_time) VALUES
    ((SELECT id FROM groups WHERE name='Ученик'), NULL, TRUE, '07:00:00', '20:00:00');
-- Выпускникам можно только с 7:00 до 20:00
INSERT INTO access (group_id, reader, access, start_time, end_time) VALUES
    ((SELECT id FROM groups WHERE name='Выпускник'), NULL, TRUE, '07:00:00', '20:00:00');

-- add column to log - was access granted or not
ALTER TABLE log ADD COLUMN result BOOL;

UPDATE sysvariables SET var_data='1.0.4' WHERE var_name='version';

END;