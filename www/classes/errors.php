<?php 

class Errors {
    private static $errors = array(
        -1 => 'Такая запись уже добавлена',
        -2 => 'Недостаточно прав для управления группами',
        -3 => 'Недостаточно прав для управления пользователями',

        -900 => 'Неверный логин или пароль',
        -1000 => 'Непредвиденная ошибка'
    );
    public static function get($id) {
        if  ($id<-5000) $id=-1000;
        return Errors::$errors[$id];
    }
}

class Messages {
    private static $msgs = array (
        "User" => 'User',
        "has marked question" => 'has marked question',
        "as" => 'as',
        "Not an answer" => 'Not an answer',
        "Low quality" => 'Low quality',
        "It is spam" => 'It is spam',
        "Other" => 'Other',
        "Alert notification" => 'Alert notification',
        "has marked answer for question" => 'has marked answer for question',
        "has marked comment for question" => 'has marked comment for question'
    );
    
    public function get ($id) {
        return Messages::$msgs[$id];
    }
}

?>