-- Объекты системы:
-- -1. Роли
DROP TABLE IF EXISTS roles CASCADE;
-- 0. Пользователи системы
DROP TABLE IF EXISTS users CASCADE;
-- Системная таблица
DROP TABLE IF EXISTS sysvariables CASCADE;


CREATE PROCEDURAL LANGUAGE plpgsql;

-- таблица ролей
CREATE TABLE roles(
    id              serial PRIMARY KEY,
    rolename        name NOT NULL,
    
    UNIQUE(rolename)
);
INSERT INTO roles(rolename) VALUES ('admin', 'user', 'guest');


-- таблица пользователей
CREATE TABLE users(
    id              serial PRIMARY KEY,
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
    UNIQUE (surname, name, reg_form, birthday),
    FOREIGN KEY(role_id) REFERENCES roles
);
CREATE UNIQUE INDEX users_login_uni_idx ON users(login) WHERE login IS NOT NULL;

INSERT INTO users(display_name,login,passwd,role_id)
    VALUES ('Администратор', 'admin', '08bc0e80658615a6bd4753f279d45c0fb495c60bf64309a90f8313fea61757a1', 1);

-- таблица групп пользователей
CREATE TABLE groups(
    id              serial PRIMARY KEY,
    name            text
);

-- талица отнесенности пользователей к группе
CREATE TABLE user_groups(
    user_id         int,
    group_id        int,
    FOREIGN KEY(user_id) REFERENCES users,
    FOREIGN KEY(group_id) REFERENCES groups
);


-- системная таблица
CREATE TABLE sysvariables(
    var_name    name,
    var_data    text,
    UNIQUE(var_name)
);

INSERT INTO sysvariables VALUES ('version', '1.0.0');

