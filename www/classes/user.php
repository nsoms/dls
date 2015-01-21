<?php

require_once(ROOT.'classes/session.php');
require_once(ROOT.'classes/db.php');

class User {
    public $id;
    public $name;
    public $address;
    public $login;
    public $inn;
    public $phone;
    public $role;
    public $role_name;
    public $parent_id;
    public $parent_name;
    
    public $see_role;
    public $orgs_see;
    public $rules_see;
    public $quest_see;
    public $tickt_see;
    public $cours_see;
    public $comm_see;
    public $trday_see;
    public $trday_mod;
    public $register_see;
    public $register_mod;
    public $testing_see;
    public $activity_see;
    public $duties_see;
    public $log_see;
    public $test_pass;
    public $reports_see;
    
    public function __construct($id,$name,$role,$rolename, $login,
                    $see_role, $orgs_see, $rules_see, $quest_see, $tickt_see, $cours_see,
                    $comm_see, $trday_see, $trday_mod, 
                    $register_see, $register_mod,
                    $testing_see, $activity_see, $duties_see, $log_see, $test_pass, $reports_see) {
        $this->id = $id;
        $this->name = $name;
        $this->login = $login;
        $this->role = $role;
        $this->role_name = $rolename;
        $this->address = $this->inn = $this->phone = $this->parent_id = null;
        $this->see_role = $see_role; 
        $this->orgs_see = $orgs_see;
        $this->rules_see = $rules_see;
        $this->quest_see = $quest_see;
        $this->tickt_see = $tickt_see;
        $this->cours_see = $cours_see;
        $this->comm_see = $comm_see;
        $this->trday_see = $trday_see;
        $this->trday_mod = $trday_mod;
        $this->register_see = $register_see;
        $this->register_mod = $register_mod;
        $this->testing_see = $testing_see;
        $this->activity_see = $activity_see;
        $this->duties_see = $duties_see;
        $this->log_see = $log_see;
        $this->test_pass = $test_pass;
        $this->reports_see = $reports_see;
    }
    
    public static function from_row($row) {
        //print_r($row);
        $u = new User(0,null,null,null,null,'f','f','f','f','f','f','f','f','f','f','f','f','f','f','f','f', 'f');
        list(
            $a,
            $u->see_role, 
            $u->orgs_see, 
            $u->rules_see,
            $u->quest_see,
            $u->tickt_see,
            $u->cours_see,
            $u->comm_see,
            $u->trday_see,
            $u->trday_mod,
            $u->register_see,
            $u->register_mod,
            $u->testing_see,
            $u->activity_see,
            $u->duties_see,
            $u->log_see,
            $u->test_pass,
            $u->reports_see
        ) = $row;
        list(
            $u->id,
            $u->name,
            $u->address,
            $u->login,
            $u->inn,
            $u->phone,
            $u->role,
            $u->role_name,
            $u->parent_id,
            $u->parent_name
        ) = $a;
        return $u;
    }
    
    public static function from_session() {
        Session::start();
        if (!isset($_SESSION['user_id'])) return User::create_anonymous();
        if (!isset($_SESSION['user_name'])) return User::create_anonymous();
        if (!isset($_SESSION['user_role'])) return User::create_anonymous();
        if (!isset($_SESSION['user_role_name'])) return User::create_anonymous();
        if (!isset($_SESSION['user_see_role'])) return User::create_anonymous();
        if (!isset($_SESSION['user_orgs_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_rules_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_quest_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_tickt_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_cours_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_comm_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_trday_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_trday_mod'])) return User::create_anonymous();
        if (!isset($_SESSION['user_register_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_register_mod'])) return User::create_anonymous();
        if (!isset($_SESSION['user_testing_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_activity_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_duties_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_log_see'])) return User::create_anonymous();
        if (!isset($_SESSION['user_test_pass'])) return User::create_anonymous();
        if (!isset($_SESSION['user_reports_see'])) return User::create_anonymous();
        if (!array_key_exists('user_login',$_SESSION)) return User::create_anonymous();
        return new User($_SESSION['user_id'],$_SESSION['user_name'],
                        $_SESSION['user_role'],$_SESSION['user_role_name'],
                        $_SESSION['user_login'],
                        $_SESSION['user_see_role'], $_SESSION['user_orgs_see'], 
                        $_SESSION['user_rules_see'], $_SESSION['user_quest_see'],
                        $_SESSION['user_tickt_see'], $_SESSION['user_cours_see'],
                        $_SESSION['user_comm_see'], 
                        $_SESSION['user_trday_see'],$_SESSION['user_trday_mod'],
                        $_SESSION['user_register_see'],$_SESSION['user_register_mod'],
                        $_SESSION['user_testing_see'], $_SESSION['user_activity_see'],
                        $_SESSION['user_duties_see'], $_SESSION['user_log_see'],
                        $_SESSION['user_test_pass'],
                        $_SESSION['user_reports_see']
                        );
    }
    
    public static function create_anonymous() {
        return new User(0,'',0,null,null,'f','f','f','f','f','f','f','f','f','f','f','f','f','f','f','f','f');
    }
    
    public function is_anonymous() {
        return $this->id == 0;
    }
    
    public function is_local() {
        return $this->login !== null;
    }
    
    public function set_session() {
        Session::start();
        $_SESSION['user_id'] = $this->id;
        $_SESSION['user_name'] = $this->name;
        $_SESSION['user_login'] = $this->login;
        $_SESSION['user_role'] = $this->role;
        $_SESSION['user_role_name'] = $this->role_name;
        $_SESSION['user_see_role'] = $this->see_role;
        $_SESSION['user_orgs_see'] = $this->orgs_see;
        $_SESSION['user_rules_see'] = $this->rules_see;
        $_SESSION['user_quest_see'] = $this->quest_see;
        $_SESSION['user_tickt_see'] = $this->tickt_see;
        $_SESSION['user_cours_see'] = $this->cours_see;
        $_SESSION['user_comm_see'] = $this->comm_see;
        $_SESSION['user_trday_see'] = $this->trday_see;
        $_SESSION['user_trday_mod'] = $this->trday_mod;
        $_SESSION['user_register_see'] = $this->register_see;
        $_SESSION['user_register_mod'] = $this->register_mod;
        $_SESSION['user_testing_see'] = $this->testing_see;
        $_SESSION['user_activity_see'] = $this->activity_see;
        $_SESSION['user_duties_see'] = $this->duties_see;
        $_SESSION['user_log_see'] = $this->log_see;
        $_SESSION['user_test_pass'] = $this->test_pass;
        $_SESSION['user_reports_see'] = $this->reports_see;
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

    public function allowed_log_see() {
        return ($this->log_see === 't');
    }
}

?>
