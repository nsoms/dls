<?php /* Работа с сессиями и аутентификацией */

class Session {
    public static $started=false;
    public static function start() {
        if (Session::$started) return;
        //if (session_id()=="") return;
        session_start();
        Session::$started = true;
    }
    public static function destroy() {
        session_destroy();
        Session::$started = false;
    }
}

?>