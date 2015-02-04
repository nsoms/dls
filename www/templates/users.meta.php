<?php
list($users) = $args;

HTML::include_jquery();
HTML::include_jquery_ui();

HTML::include_js('js/users.js');
HTML::twig_js_template_file('users_list');

HTML::include_dlg('person_mod', array());
