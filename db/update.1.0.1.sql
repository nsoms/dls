BEGIN;

-- creating table for logging actions
CREATE TABLE log(
    id              serial PRIMARY KEY,
    card            text,                                   -- номер карты
    reader          text,                                   -- считыватель
    time            timestamp with time zone default now()  -- дата события
);

-- alter table to add log_see access right
ALTER TABLE roles ADD COLUMN log_see bool DEFAULT TRUE;

UPDATE sysvariables SET var_data='1.0.1' WHERE var_name='version';

END;