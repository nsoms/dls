<?php
    global $user;
    if($user->is_anonymous() && HTML::page_name() != "login.php") {
        header("Location: login.php");
        exit(0);   
    }

    $menu = array(
        array(
            'pagename' => 'td.php',
            'caption' => 'Аттестации',
            'show' => $user->trday_see
        ),
        array(
            'pagename' => 'register.php',
            'caption' => 'Регистрация',
            'show' => $user->register_see
        ),
        array(
            'pagename' => 'commissions.php',
            'caption' => 'Комиссии',
            'show' => $user->comm_see
        ),
/*        array(
            'pagename' => 'roles.php',
            'caption' => 'Роли',
            'show' => $user->see_role
        ),*/
        array(
            'pagename' => 'orgs.php',
            'caption' => 'Организации',
            'show' => $user->orgs_see
        ),
        array(
            'pagename' => 'basetypes.php',
            'caption' => 'Области аттестации',
            'show' => $user->rules_see
        ),
        array(
            'pagename' => 'courses.php',
            'caption' => 'Курсы вопросов',
            'show' => $user->quest_see
        ),
        array(
            'pagename' => 'duties.php',
            'caption' => 'Платежи',
            'show' => $user->duties_see
        ),
        array(
            'pagename' => 'users.php',
            'caption' => 'Пользователи',
            'show' => 't'
        ),
        array(
            'pagename' => 'testing/online_test.php',
            'caption' => 'Тестирование',
            'show' => $user->testing_see
        ),
        array(
            'pagename' => 'online_activity.php',
            'caption' => 'Активность тестирования',
            'show' => $user->activity_see
        ),
        array(
            'pagename' => 'history.php',
            'caption' => 'История действий',
            'show' => $user->log_see
        ),
        array(
            'pagename' => 'reports.php',
            'caption' => 'Отчеты',
            'show' => $user->reports_see
        ),
        array(
            'pagename' => 'search.php',
            'caption' => 'Поиск',
            'show' => $user->trday_see
        )
    );
?>
<html>
    <head>
        <title><?php echo HTML::$title; ?></title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <?php 
        
            HTML::include_css(ROOT.'css/all.css');

            HTML::js('
                var S_AJAX_CONNECTION_ERROR = "Ошибка связи с сервером:";
                var S_AJAX_CONNECTION_TIMEOUT = "исчерпан лимит времени.";
                var S_AJAX_CONNECTION_ABORTED = "связь была отменена.";
                var S_AJAX_EMPTY_RESPONSE = "получен пустой ответ.";
                var S_AJAX_CONNECTION_PARSER_ERROR = "внутренняя ошибка сервера.";
                '
            );
            HTML::js('var AUTHENTICATED='.($user->is_anonymous()?'false;':'true;'));
            
            HTML::js('');
            HTML::include_js(ROOT.'js/d_rights.js');
            //HTML::include_js(ROOT.'js/search.js');
        ?>
        <?php HTML::write_css_files(); ?>
        <?php HTML::write_js_files(); ?>
        <?php HTML::write_js_code(); ?> 
      
    </head>
    <body>
        <div class="alert warning" style="display: none" id="g_warning">
            <p><span class="data"></span><span class="alertclose pointer"><img src="<?php echo ROOT; ?>img/alertclose.png" width="24" height="23" /></span></p>
        </div>
        <div class="alert info" style="display: none" id="g_info">
            <p><span class="data"></span><span class="alertclose pointer"><img src="<?php echo ROOT; ?>img/alertclose.png" width="24" height="23" /></span></p>
        </div>
        <div class="alert error" style="display: none" id="g_error">
            <p><span class="data"></span><span class="alertclose pointer"><img src="<?php echo ROOT; ?>img/alertclose.png" width="24" height="23" /></span></p>
        </div>
        <div class="alert success" style="display: none" id="g_success">
            <p><span class="data"></span><span class="alertclose pointer"><img src="<?php echo ROOT; ?>img/alertclose.png" width="24" height="23" /></span></p>
        </div>
        <div id="Top">
            <div id="LoginBox">
            <?php
              if (isset($user)&&!$user->is_anonymous())
              { 
                  echo $user->name, '&nbsp;<a href="' , ROOT , 'logout.php">Выйти</a>';
              }    
              else 
              {
                  echo '<a href="' , ROOT , 'login.php">Войти</a>';
              }
              ?>
              <span id="LoadingBox" style="display:none;">
                  <img src="<?php echo ROOT;?>img/load.gif" />
              </span>
            </div>
        </div>
        <div id="SuperContent">
            <div id="LeftMenu">
                <div id="Menu">
                    <ul>
    <?php
                    foreach ($menu as $m) {
                        if ( isset($user) && !$user->is_anonymous() && $m['show'] === 't' )
                            echo "<li",
                                ( HTML::page_name() == $m['pagename'] || HTML::page_path() . '/' . HTML::page_name() == $m['pagename'] ? ' class="selected"' : '' ),
                                "><a href='", ROOT, $m['pagename'], "'>", $m['caption'], "</a></li>\n";
                  }
    ?>                
                    </ul>
                </div>
                <?php HTML::placeholder('calendar'); ?>
            </div>
            <div id="Content">
                <div class="Title"><?php echo HTML::$page_title; ?></div>
                <div id="Error" style="display:none"><?php HTML::placeholder('errors'); ?></div>
                <div id="Status"><?php HTML::placeholder('errors'); ?></div>
                <div class="Buttons">
                    <?php HTML::placeholder('buttons'); ?>
                    <ul id="ButtonsUL"></ul>
                </div>
                <div class="Data">
