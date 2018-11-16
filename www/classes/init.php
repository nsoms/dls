<?php // общий код инициалзации

require_once(ROOT.'classes/session.php');
require_once(ROOT.'classes/user.php');

global $start_time;

function get_or_post($name) {
    if (isset($_POST[$name])) return $_POST[$name];
    if (isset($_GET[$name])) return $_GET[$name];
    return null;
}

function get_or_post_int($name) {
    $val = get_or_post($name);
    if ($val===null) return null;
    if (!is_numeric($val)) return null;
    return (int)$val;
}

class Sanitize {
    public static function attribute($val) {
        // to prevent breaking from attr='val' or attr="val" in HTML
        if ($val===null) return null;
        return str_replace(array('"',"'"),'',$val);
    }

    public static function clean($str) {
        return htmlentities($str);
    }
}

class Util {
    public static $json_mode = false;
    public static function set_json_mode($cond = true) {
        global $start_time;
        $start_time = microtime(true);
        if ($cond===true) {
            Util::$json_mode = true;
            return;
        } 
        if ($cond===false) return;
        if (is_string($cond)) $cond=array($cond);
        foreach ($cond as $v) {
            if (get_or_post($v)===null) return;
        }
        Util::$json_mode = true;
    }
    public static function error($msg) {
        if (Util::$json_mode) {
            require_once(ROOT.'classes/json.php');
            JSON::error(-1000);
        }
        require_once(ROOT.'classes/html.php');  
        HTML::error(-1000);
    }
    public static function array_to_assoc( &$arr ) {
        $res = array();
        foreach ($arr as $key => $value) {
            if( !isset($value['name']) || !isset($value['value']) )
                return false;
            $res[$value['name']] = $value['value'];
        }
        $arr = $res;
        return true;
    }
}

include_once(ROOT.'config.auto.php');
include_once(ROOT . 'config.php');

error_reporting(E_ALL);
//error_reporting(0);  
ini_set("display_errors", 1);

mb_internal_encoding("UTF-8");

$user = User::from_session();

if (!$user->is_anonymous()) {
    $user->set_session();
}

date_default_timezone_set('Europe/Moscow');

//include (ROOT.'templates/'.Locale::$locale.'/errors.php');
include (ROOT.'classes/errors.php');
