<?php

require_once('init.php');

define('JSONP_ENABLED',false);

class JSON {    
    public static function reply($data) { //,$send_status=true) {
        //global $user;
        global $start_time;
        if(is_array($data) && Util::$json_mode)
            $data['exec'] = microtime(true) - $start_time;
        $res = json_encode($data);
        if (JSONP_ENABLED && isset($_GET['callback'])) 
            echo $_GET['callback'],'(',$res,')';
        else 
            echo $res;
        exit(0);
    }    
    
    public static function error($errid) {
        JSON::reply(array(
            'error'=>Errors::get($errid)
        ));
    }

    public static function uploadfile_error($str) {
        JSON::reply(array("jquery-upload-file-error" => $str));
    }
}

?>