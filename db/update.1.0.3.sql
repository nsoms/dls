BEGIN;

-- create index on user_groups table
CREATE INDEX user_groups_user_id_idx ON user_groups (user_id);
CREATE INDEX user_groups_group_id_idx ON user_groups (group_id);

-- create index on groups(name)
CREATE INDEX groups_name_idx ON groups(name);

-- create index users(card_number)
CREATE INDEX users_card_number_idx ON users(card_number);

-- create index log table
CREATE INDEX log_card_idx ON log(card);
CREATE INDEX log_time_idx ON log  (time DESC);

UPDATE sysvariables SET var_data='1.0.3' WHERE var_name='version';

END;