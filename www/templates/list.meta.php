<?php
HTML::include_jquery();
HTML::include_jquery_ui();

HTML::include_bootstrap();
HTML::include_js('js/bootstrap-multiselect.js');
HTML::include_css('css/bootstrap-multiselect.css');

HTML::include_js('js/list.js');
HTML::twig_js_template_file('users_list');
HTML::twig_js_template_file('groups_select');
