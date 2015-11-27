BEGIN;

-- update users table to add position for person
ALTER TABLE users ADD COLUMN position TEXT;

UPDATE sysvariables SET var_data='1.0.2' WHERE var_name='version';

END;