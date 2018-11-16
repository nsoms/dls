<?php

require_once(ROOT.'classes/session.php');
require_once(ROOT.'classes/db.php');

class User {
    public $id;
    public $name;
    public $login;
    public $role;
    public $role_name;

    public $groups_see;
    public $groups_mod;
    public $users_see;
    public $users_all_see;
    public $users_mod;
    public $users_role_set;
    public $log_see;


    public function __construct($id,$name,$role,$rolename, $login,
                                $groups_see, $groups_mod,
                                $users_see, $users_all_see,
                                $users_mod, $users_role_set,
                                $log_see) {
        $this->id = $id;
        $this->name = $name;
        $this->login = $login;
        $this->role = $role;
        $this->role_name        = $rolename;
        $this->groups_see       = $groups_see;
        $this->groups_mod       = $groups_mod;
        $this->users_see        = $users_see;
        $this->users_all_see    = $users_all_see;
        $this->users_mod        = $users_mod;
        $this->users_role_set   = $users_role_set;
        $this->log_see          = $log_see;
    }
    
    public static function from_row($row) {
        $u = new User(0,null,null,null,null,'f','f','f','f','f','f','t');
        list(
            $u->id,
            $u->name,
            $u->login,
            $u->role,
            $u->role_name,
            $u->groups_see,
            $u->groups_mod,
            $u->users_see,
            $u->users_all_see,
            $u->users_mod,
            $u->users_role_set,
            $u->log_see
        ) = $row;
        return $u;
    }
    
    public static function from_session() {
        Session::start();
        if (!isset($_SESSION['user_id'])) return User::create_anonymous();
        if (!isset($_SESSION['user_name'])) return User::create_anonymous();
        if (!isset($_SESSION['user_login'])) return User::create_anonymous();
        if (!isset($_SESSION['user_role'])) return User::create_anonymous();
        if (!isset($_SESSION['user_role_name'])) return User::create_anonymous();
        if (!isset($_SESSION['user_groups_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_groups_mod'])) return User::create_anonymous();
        if (!isset($_SESSION['user_users_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_users_all_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_users_mod'])) return User::create_anonymous();
        if (!isset($_SESSION['user_users_role_set'])) return User::create_anonymous();
        if (!isset($_SESSION['user_log_see'])) return User::create_anonymous();

        return new User($_SESSION['user_id'], $_SESSION['user_name'],
                        $_SESSION['user_role'], $_SESSION['user_role_name'],
                        $_SESSION['user_login'],
                        $_SESSION['user_groups_see'],
                        $_SESSION['user_groups_mod'],
                        $_SESSION['user_users_see'],
                        $_SESSION['user_users_all_see'],
                        $_SESSION['user_users_mod'],
                        $_SESSION['user_users_role_set'],
                        $_SESSION['user_log_see']
                        );
    }

    public static function create_anonymous() {
        return new User(0,'',0,null,null,'f','f','f','f','f','f','t');
    }
    
    public function is_anonymous() {
        return $this->id == 0;
    }
    
    public function is_local() {
        return $this->login !== null;
    }

    public function allowed_menu() {
        return $this->users_see == 't';
    }
    
    public function set_session() {
        Session::start();
        $_SESSION['user_id'] = $this->id;
        $_SESSION['user_name'] = $this->name;
        $_SESSION['user_login'] = $this->login;
        $_SESSION['user_role'] = $this->role;
        $_SESSION['user_role_name'] = $this->role_name;
        $_SESSION['user_groups_see']     = $this->groups_see;
        $_SESSION['user_groups_mod']     = $this->groups_mod;
        $_SESSION['user_users_see']      = $this->users_see;
        $_SESSION['user_users_all_see']  = $this->users_all_see;
        $_SESSION['user_users_mod']      = $this->users_mod;
        $_SESSION['user_users_role_set'] = $this->users_role_set;
        $_SESSION['user_log_see']        = $this->log_see;
    }
    
    public function require_login() {
        if ($this->is_anonymous()) {
            if (Util::$json_mode) 
                JSON::error(-1);
            Session::start();
/*            $request = Sanitize::attribute($_SERVER['REQUEST_URI']);
            if( strstr($request, 'login.php') === false ) {
                $_SESSION['login_redirect'] = $request;
                Header('Location: ' . ROOT . 'login.php?login_required=1');
            } else {
                $_SESSION['login_redirect'] = null;
                Header('Location: ' . ROOT . 'login.php');
            }*/
            Header('Location: ' . ROOT . 'login.php?login_required=1');
            exit(0);
        }
    }


    public function require_admin() {
        if ($this->is_anonymous()) {
            Header('Location: '.ROOT.'login.php?login_required=1');
            exit(0);
        }

        if( $this->role_name == 'admin' )
            return;

        if (Util::$json_mode)
            JSON::error(-1000);
        Header('Location: '.ROOT.'login.php?login_required=1');
        exit(0);
    }

}

?>
