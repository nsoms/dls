
/* returns list of groups for given params */
CREATE OR REPLACE FUNCTION
    groups_get (
        viewer_id   int,
        in_id       int,
        in_name     text   -- check substring
) RETURNS SETOF groups AS $$
    SELECT * FROM groups
        WHERE
            allowed_groups_see($1, id)
            AND ($2 IS NULL AND TRUE OR id=$2)
            AND ($3 IS NULL AND TRUE OR name ILIKE '%' || $3 || '%')
        ORDER BY name
$$ LANGUAGE SQL STABLE;

/* creates new groups with given params */
CREATE OR REPLACE FUNCTION
    group_add (
        viewer_id   int,
        in_name     text
) RETURNS int AS $$
    DECLARE
        allowed bool;
        res int;
    BEGIN
        allowed := allowed_groups_mod(viewer_id, NULL);

        IF NOT allowed THEN
            RETURN -2;   -- not enough rights to modify groups
        END IF;

        INSERT INTO groups (name) VALUES ( in_name )
            RETURNING id INTO res;

        RETURN res;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN -1;     -- unique violation
        WHEN OTHERS THEN
            RETURN -1000;  -- unknown error
    END;
$$ LANGUAGE plpgsql VOLATILE;

/* creates new groups with given params */
CREATE OR REPLACE FUNCTION
    group_mod (
        viewer_id   int,
        in_id       int,
        in_name     text
) RETURNS int AS $$
    DECLARE
        allowed bool;
        res int;
    BEGIN
        allowed := allowed_groups_mod(viewer_id, in_id);

        IF NOT allowed THEN
            RETURN -2;   -- not enough rights to modify groups
        END IF;

        UPDATE groups
            SET name = in_name
            WHERE id=in_id;

        RETURN in_id;
    EXCEPTION
        WHEN unique_violation THEN
            RETURN -1;     -- unique violation
        WHEN OTHERS THEN
            RETURN -1000;  -- unknown error
    END;
$$ LANGUAGE plpgsql VOLATILE;
