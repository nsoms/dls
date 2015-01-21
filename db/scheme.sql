-- Объекты системы:
-- -1. Роли
DROP TABLE IF EXISTS roles CASCADE;
-- 0. Пользователи системы
DROP TABLE IF EXISTS users CASCADE;
-- Системная таблица
DROP TABLE IF EXISTS sysvariables CASCADE;


CREATE PROCEDURAL LANGUAGE plpgsql;

CREATE TABLE roles(
    id              serial PRIMARY KEY,
    rolename        name NOT NULL,
    
    UNIQUE(rolename)
);

INSERT INTO roles(rolename) VALUES ('admin', 'user', 'guest');

CREATE TABLE users(
    id              serial PRIMARY KEY,
    surname         text not null,
    name            text not null,
    middlename      text not null,
    birthday        date not null default '1970-01-01',
    register        timestamp with time zone default now(),
    reg_form        text,
    login           name,
    passwd          text,
    role_id         int default 3, -- guest
    is_disabled     bool default false,
    UNIQUE (surname, name, reg_form, birthday),
    FOREIGN KEY(role_id) REFERENCES roles
);
CREATE UNIQUE INDEX users_login_uni_idx ON users(login) WHERE login IS NOT NULL;

INSERT INTO users(display_name,login,passwd,role_id)
    VALUES ('Администратор', 'admin', '08bc0e80658615a6bd4753f279d45c0fb495c60bf64309a90f8313fea61757a1', 1);


CREATE TABLE sysvariables(
    var_name    name,
    var_data    text,
    UNIQUE(var_name)
);

INSERT INTO sysvariables VALUES ('version', '1.0.0');

