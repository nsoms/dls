<?php
define('PROJECT_NAME', 'DLS');
define('TWIG_PHP_TPL_DIR', '/tmp/twig_cache_' . PROJECT_NAME);

define('DB_CONNECTION_STRING', 'dbname=dls user=dls connect_timeout=5');

class DLSConfig {
    public static $teachers_group_name = 'Учитель';
    public static $pupils_group_name = 'Ученик';
};
?>
