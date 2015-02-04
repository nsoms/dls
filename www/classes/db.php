<?php
require_once(ROOT.'config.php');
require_once(ROOT.'classes/user.php');

function pwhash($password) {
//    return $password;
    return hash('sha256',$password);
}

function parseCSV($str, $delimiter = ',', $enclosure = '"', $len = 4096)
{
    $fh = fopen('php://memory', 'rw');
    fwrite($fh, $str);
    rewind($fh);
    $result = fgetcsv( $fh, $len, $delimiter, $enclosure );
    fclose($fh);
    return $result;
}

class DB {
    public static function format_date( $date ) {
        date_default_timezone_set('Europe/Moscow');
        return date("d.m.Y h:i", strtotime($date));
    }    


    public static function parse_array( $text ) {
        if ($text === null) return array();
        $offset = 1;
        $output = array();
        if( '{}' == $text ) return $output;
        $limit = strlen( $text )-1;
        do {
            if( '{' != $text{$offset} ) {
                preg_match( "/(\\{?\"([^\"\\\\]|\\\\.)*\"|[^,{}]+)+([,}]+)/", $text, $match, 0, $offset );
                $offset += strlen( $match[0] );
                $output[] = ( '"' != $match[1]{0} ? $match[1] : stripcslashes( substr( $match[1], 1, -1 ) ) );
                if( '},' == $match[3] ) return $offset;
            } // else $offset = DB::parse_array( $text, $output[], $limit, $offset+1 );
        } while( $limit > $offset );

        return $output;
    }

    public static function parse_array_records($text) {
        $data = DB::parse_array($text);
        setlocale(LC_ALL, 'ru_RU.UTF-8');
        for( $i = 0; $i < sizeof($data); $i++ )
            $data[$i] = str_getcsv(trim($data[$i], "()"));

        return $data;
    }
    
    public static function parse_record($text) {
/*        $text = explode(',', trim($text, "()"));
        $text = "'" . implode("','", $text) . "'";
        $text = str_getcsv($text, ",", "'");*/
        $text = str_getcsv(trim($text, "()"), ",", '"');
        foreach($text as &$t)
            $t = trim($t, '"');
        return $text;
    }
    
    public static function parse_str_record($text) {
        $text = str_getcsv(trim($text, "()"), ",", "'");
        foreach($text as &$t)
            $t = trim($t, '"');
        return $text;
    }
    
    public function to_pg_array($set) {
        settype($set, 'array'); // can be called with a scalar or array
        $result = array();
        foreach ($set as $t) {
            if (is_array($t)) {
                $result[] = $this->to_pg_array($t);
            } else {
                $t = str_replace('"', '\\"', $t); // escape double quote
                if (!is_numeric($t)) { // quote only non-numeric values and not records
                    if(is_string($t) && strlen($t) > 0 && !($t[0] == '(' && $t[strlen($t) - 1] == ')'))
                        $t = '"' . $t . '"';
                }
                $result[] = $t;
            }
        }
        return '{' . implode(",", $result) . '}'; // format
    }

    public function pass_array($data/*, $is_string = false*/) {
    /*    $ds = array();
        if( empty($data) )
          return '{}';
        foreach($data as $d) {
/*            if( $is_string )
                $ds[] = '"' . pg_escape_string($d) . '"';
            else*
                $ds[] =  pg_escape_string($d);
        }
        return "'{" . implode(', ', $ds) . "}'";*/
        return $this->to_pg_array($data);
    }

    public function to_pg_array_e($set) {
        settype($set, 'array'); // can be called with a scalar or array
        $result = array();
        foreach ($set as $t) {
            if (is_array($t)) {
                $result[] = $this->to_pg_array($t);
            } else {
                if (!is_numeric($t)) { // quote only non-numeric values
                    //$t = '"' . $t . '"';
                    $t = "E'" . pg_escape_string($t) . "'";
                }
                $result[] = $t;
            }
        }
        return '{' . implode(",", $result) . '}'; // format
    }
    public function pass_array_escaped($data/*, $is_string = false*/) {
        return $this->to_pg_array_e($data);
    }    

    public static function pass_int_array($data) {
        $ds = array();
        if( empty($data) )
            return '{}';
        foreach($data as $d)
            if( is_array($d) ) 
                $ds[] = DB::pass_array($d);
            else
                $ds[] = '' . intval($d) . '';
        return '{' . implode(',', $ds) . '}';
    }
    
    private $acon;
    private $cstring;
    private $disable;
    public function __construct($constring) {
        $this->acon = null;
        $this->cstring = $constring;
        $this->disable = false;
    }
    public function __destruct() {
        if ($this->acon) pg_close($this->acon);
    }
    public function error($msg=null) {
        if ($this->disable) return;
        $this->disable = true;
        if ($this->acon) pg_close($this->acon);
        $this->acon=null;
        Util::error($msg?$msg:pg_last_error());
    }

    public function get_con() {
        if ($this->disable) 
            return null;
        if (!$this->acon) 
            $this->acon = pg_connect($this->cstring) 
                or $this->error('Failed to connect to postgres.');
        return $this->acon;
    }
    
    private static function all_rows($result) {
        $rows = array();
        while ($row = pg_fetch_row($result)) {
            $rows[] = $row;
        }
        return $rows;
    }
    
    private static function one_val($result) {
        $row = pg_fetch_row($result);
        if (!$row) 
            return null;
        return $row[0];
    }

    static function one_row($result) {
        $row = pg_fetch_row($result);
        if (!$row)
            return null;
        return $row;
    }

    public function check_auth($username, $password) {
        $res = pg_query_params(
            $this->get_con(),
            'SELECT * FROM check_pwd($1,$2)', 
            array($username,pwhash($password))) or $this->error();

        $row = pg_fetch_row($res);
        if (!$row) 
            return null;
        //$row[0] = DB::parse_record($row[0]);
        return User::from_row($row);
    }


    /************************************************
     * GROUPS FUNCTIONS
     */
    public function groups_get($user_id, $id, $name)
    {
        $res = pg_query_params(
            $this->get_con(),
            'SELECT * FROM groups_get($1, $2, $3)',
            array($user_id, $id, $name)) or $this->error();
        return $this->all_rows($res);
    }

    public function group_add($user_id, $name)
    {
        $res = pg_query_params(
            $this->get_con(),
            'SELECT * FROM group_add($1, $2)',
            array($user_id, $name)) or $this->error();
        return $this->one_val($res);
    }


    /************************************************
     * USERS FUNCTIONS
     */

    public function user_add($user_id, $card, $surname, $name, $middle, $pic_name, $bday, $reg_form, $group_ids)
    {
        $res = pg_query_params(
            $this->get_con(),
            'SELECT * FROM user_add($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            array($user_id, $card, $surname, $name, $middle, $pic_name, $bday, $reg_form, DB::pass_array($group_ids))) or $this->error();
        return $this->one_val($res);
    }

    public function users_get ( $user_id, $id, $card, $surname, $name, $groups ){
        $res = pg_query_params(
            $this->get_con(),
            'SELECT * FROM users_get($1, $2, $3, $4, $5, $6)',
            array($user_id, $id, $card, $surname, $name, $groups)) or $this->error();
        return $this->all_rows($res);
    }

    /************************************************
     * ROLES FUNCTIONS
     */
    public function get_roles($user_id) {
        $res = pg_query_params(
            $this->get_con(),
            'SELECT * FROM get_roles($1)', 
            array($user_id)) or $this->error();
        return $this->all_rows($res);
    }
    
    public function get_user_roles($user_id) {
        $res = pg_query_params(
            $this->get_con(),
            'SELECT * FROM get_user_roles($1)', 
            array($user_id)) or $this->error();
        $row = pg_fetch_row($res);
        if (!$row) 
            return null;
        return $row;
    }
}

$db = new DB (DB_CONNECTION_STRING);

?>
