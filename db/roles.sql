CREATE OR REPLACE FUNCTION
    allowed_groups_see(
        in_viewer_id    int,
        in_id           int
) RETURNS bool AS $$
    SELECT groups_see
        FROM roles
        WHERE id=(SELECT role_id FROM users WHERE id=in_viewer_id);
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION
    allowed_groups_mod(
        in_viewer_id    int,
        in_id           int
) RETURNS bool AS $$
    SELECT groups_mod
        FROM roles
        WHERE id=(SELECT role_id FROM users WHERE id=in_viewer_id);
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION
    allowed_users_see(
        in_viewer_id    int,
        in_id           int
) RETURNS bool AS $$
    SELECT users_see
        FROM roles
        WHERE id=(SELECT role_id FROM users WHERE id=in_viewer_id);
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION
    allowed_users_all_see(
        in_viewer_id    int,
        in_id           int
) RETURNS bool AS $$
    SELECT users_all_see
        FROM roles
        WHERE id=(SELECT role_id FROM users WHERE id=in_viewer_id);
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION
    allowed_users_mod(
        in_viewer_id    int,
        in_id           int
) RETURNS bool AS $$
    SELECT users_mod
        FROM roles
        WHERE id=(SELECT role_id FROM users WHERE id=in_viewer_id);
$$ LANGUAGE SQL STABLE;
