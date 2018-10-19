-- Объекты системы:
-- -1. Роли
DROP TABLE IF EXISTS roles CASCADE;
-- 0. Пользователи системы
DROP TABLE IF EXISTS users CASCADE;
-- Системная таблица
DROP TABLE IF EXISTS sysvariables CASCADE;


CREATE PROCEDURAL LANGUAGE plpgsql;

-- таблица ролей пользователей интерфейса системы
CREATE TABLE roles(
    id              serial PRIMARY KEY,
    rolename        name NOT NULL,
    groups_see      bool DEFAULT TRUE,
    groups_mod      bool DEFAULT FALSE,
    users_see       bool DEFAULT TRUE,
    users_all_see   bool DEFAULT FALSE,
    users_mod       bool DEFAULT FALSE,
    users_role_set  bool DEFAULT FALSE,
    log_see         bool DEFAULT TRUE,
    UNIQUE(rolename)
);
INSERT INTO roles(rolename) VALUES ('admin'), ('user'), ('guest');

-- update admin roles
UPDATE roles SET
    (groups_see, groups_mod,
     users_see, users_all_see,
     users_mod, users_role_set) =
    (TRUE, TRUE,
    TRUE, TRUE,
    TRUE, TRUE) where id=1;


-- таблица пользователей
CREATE TABLE users(
    id              serial PRIMARY KEY,
    card_number     text,                                   -- номер карты
    surname         text not null,                          -- фамилия
    name            text not null,                          -- имя
    middlename      text,                                   -- отчество
    pic_name        text,                                   -- имя файла фотографии
    birthday        date not null default '1970-01-01',     -- дата рождения
    position        TEXT,                                   -- должность
    register        timestamp with time zone default now(), -- дата регистрации
    reg_form        text,                                   -- класс регистрации
    login           name,                                   -- логин для авторизации
    passwd          text,                                   -- пароль
    role_id         int not null default 3,                 -- guest по-умолчанию
    is_disabled     bool default false,                     -- включен/выключен
    UNIQUE (surname, name, reg_form, birthday),
    FOREIGN KEY(role_id) REFERENCES roles
);
CREATE UNIQUE INDEX users_login_uni_idx ON users(login) WHERE login IS NOT NULL;
CREATE INDEX users_card_number_idx ON users(card_number);

INSERT INTO users(surname,name,login,passwd,role_id)
    VALUES ('Администратор', '', 'admin', '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5', 1); -- qwerty

-- таблица групп пользователей
CREATE TABLE groups(
    id              serial PRIMARY KEY,
    name            text
);
CREATE INDEX groups_name_idx ON groups(name);

INSERT INTO groups(name) VALUES ('Ученик'), ('Учитель'), ('Выпускник'), ('Персонал');

-- талица отнесенности пользователей к группе
CREATE TABLE user_groups(
    user_id         int,
    group_id        int,
    FOREIGN KEY(user_id) REFERENCES users,
    FOREIGN KEY(group_id) REFERENCES groups
);
CREATE INDEX user_groups_user_id_idx ON user_groups (user_id);
CREATE INDEX user_groups_group_id_idx ON user_groups (group_id);


-- Лог доступа в систему. Кто, с каого считывателя
CREATE TABLE log(
    id              serial PRIMARY KEY,
    card            text,                                   -- номер карты
    reader          text,                                   -- считыватель
    time            timestamp with time zone default now(), -- дата события
    result          BOOL                                    -- результат - можно было или нельзя
);
CREATE INDEX log_card_idx ON log(card);
CREATE INDEX log_time_idx ON log(time DESC);

-- Таблица прав доступа для групп пользователей
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

-- системная таблица
CREATE TABLE sysvariables(
    var_name    name,
    var_data    text,
    UNIQUE(var_name)
);


INSERT INTO sysvariables VALUES ('version', '1.0.4');

