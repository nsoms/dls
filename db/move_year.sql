BEGIN;

/* id |   name
----+-----------
  1 | Ученик
  2 | Учитель
  3 | Выпускник
  4 | 08-1
  5 | 08-2
  6 | 08-3
  7 | 09-1
  8 | 09-2
  9 | 09-3
 10 | 09-4
 11 | 09-5
 12 | 10-1
 13 | 10-2
 14 | 10-3
 15 | 10-4
 16 | 10-5
 17 | 10-6
 18 | 11-1
 19 | 11-2
 20 | 11-3
 21 | 11-4
 22 | 11-5   */

-- Выпускники
--      1. Заменяем группу Ученик на Выпускник только у тех детей, которые входят в 11-е классы
UPDATE user_groups
    SET group_id = (SELECT id FROM groups WHERE name='Выпускник')
    WHERE
        group_id = (SELECT id FROM groups WHERE name='Ученик')
        AND user_id IN (
            SELECT user_id FROM user_groups WHERE group_id IN (
                SELECT id FROM groups WHERE name LIKE '11-_'
            )
        );

--      2. Добавляем всех учеников, которые стали выпускниками в новую группу 'Выпускник 2015'
INSERT INTO groups (name) VALUES (CONCAT('Выпускник ', date_part('year', now())));
INSERT INTO user_groups (user_id, group_id)
    SELECT user_id, lastval()
        FROM user_groups
        WHERE group_id IN (
            SELECT id FROM groups WHERE name LIKE '11-_'
        );

--      3. заменяем название группы 11-? на 'Выпускник 11-?, 2015'
UPDATE groups
    SET name = CONCAT('Выпускник ', name, ', ', date_part('year', now()))
    WHERE name LIKE '11-_';


-- Переводим классы
UPDATE groups SET name = REPLACE (name, '10', '11') WHERE name LIKE '10-_';
UPDATE groups SET name = REPLACE (name, '09', '10') WHERE name LIKE '09-_';
UPDATE groups SET name = REPLACE (name, '08', '09') WHERE name LIKE '08-_';

COMMIT;