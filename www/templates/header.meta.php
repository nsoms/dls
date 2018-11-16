<?php
HTML::include_js(ROOT . 'js/vendor.js');
HTML::include_css(ROOT . 'js/vendor.css');

HTML::js('
                var S_AJAX_CONNECTION_ERROR = "Ошибка связи с сервером:";
                var S_AJAX_CONNECTION_TIMEOUT = "исчерпан лимит времени.";
                var S_AJAX_CONNECTION_ABORTED = "связь была отменена.";
                var S_AJAX_EMPTY_RESPONSE = "получен пустой ответ.";
                var S_AJAX_CONNECTION_PARSER_ERROR = "внутренняя ошибка сервера.";'
);