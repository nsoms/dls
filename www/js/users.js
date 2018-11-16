webpackJsonp([0],{

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

var Handlebars = __webpack_require__(2);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "    <option value=\"-1\">"
    + container.escapeExpression(((helper = (helper = helpers.additional || (depth0 != null ? depth0.additional : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"additional","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "    <option value=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\"\n            "
    + ((stack1 = (helpers.ifIn || (depth0 && depth0.ifIn) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.id : depth0),(depths[1] != null ? depths[1].sel : depths[1]),{"name":"ifIn","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n            "
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</option>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return " selected=\"selected\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.additional : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.groups : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});

/***/ }),

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(143)(false);
// imports


// module
exports.push([module.i, ".multiselect-container{position:absolute;list-style-type:none;margin:0;padding:0}.multiselect-container .input-group{margin:5px}.multiselect-container>li{padding:0}.multiselect-container>li>a.multiselect-all label{font-weight:700}.multiselect-container>li.multiselect-group label{margin:0;padding:3px 20px;height:100%;font-weight:700}.multiselect-container>li.multiselect-group-clickable label{cursor:pointer}.multiselect-container>li>a{padding:0}.multiselect-container>li>a>label{margin:0;height:100%;cursor:pointer;font-weight:400;padding:3px 20px 3px 40px}.multiselect-container>li>a>label.radio,.multiselect-container>li>a>label.checkbox{margin:0}.multiselect-container>li>a>label>input[type=checkbox]{margin-bottom:5px}.filter .btn{padding:6px 3px}.btn-group>.btn-group:nth-child(2)>.multiselect.btn{border-top-left-radius:4px;border-bottom-left-radius:4px}.form-inline .multiselect-container label.checkbox,.form-inline .multiselect-container label.radio{padding:3px 20px 3px 40px}.form-inline .multiselect-container li a label.checkbox input[type=checkbox],.form-inline .multiselect-container li a label.radio input[type=radio]{margin-left:-20px;margin-right:0}", ""]);

// exports


/***/ }),

/***/ 174:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($, ajax) {__webpack_require__(6);
var Handlebars = __webpack_require__(2);
if (typeof Handlebars.templates === 'undefined')
    Handlebars.templates = [];
Handlebars.templates.users_list = __webpack_require__(175);
Handlebars.templates.groups_select = __webpack_require__(14);

__webpack_require__(8);

var search_request = null;

var PersonModDlg = __webpack_require__(176);

$(document).ready(function() {
    bind_user_link();
    bind_filter();
    $('#FilterButton').click();
});

function bind_filter() {
    $('input', '#iFilter').keyup(function(event) {
        $('#FilterButton').click();
    });
    ajax({
        async: false,
        url: ROOT + 'mt/groups.php',
        data: {
            action: 'groups_list'
        },
        success: function(data) {
            $('#FilterGroup').html(Handlebars.templates.groups_select({
                'groups': data.groups/*,
                'additional': 'Все'*/
            }));
            $('#FilterGroup').multiselect({
                buttonText: function (options, select) {
                    if (options.length === 0) {
                        return 'Необходимо выбрать группы';
                    }
                    else {
                        var labels = [];
                        options.each(function () {
                            if ($(this).attr('label') !== undefined) {
                                labels.push($(this).attr('label'));
                            }
                            else {
                                labels.push($(this).html());
                            }
                        });
                        return labels.join(', ') + ' ';
                    }
                }
            }).change(function() {
                $('#FilterButton').click();
            });
        }
    });
    $('#FilterButton').click(function (event){
        event.preventDefault();

        if(search_request != null)
            search_request.cancel();

        search_request = ajax({
            url: ROOT + 'mt/users.php',
            data: {
                action: 'users_list',
                s: $('#FilterSurname').val(),
                c: $('#FilterCard').val(),
                g: $('#FilterGroup').val()
            },
            success: function(data) {
                $('#UsersList').html(Handlebars.templates.users_list(data));

                bind_user_link();
                $(document).scroll(0);
                search_request = null;
                bind_pupil_add();
                bind_teacher_add();
            }
        });
    });
}

function bind_user_link() {
    $('a.link', '#UsersList').click(function(event) {
        event.preventDefault();
        var user_id = $(this).data('user-id');
        PersonModDlg.edit(user_id, [], function () {
            $('#FilterButton').click();
        });
    });
}

function bind_pupil_add() {
    $('#AddPersonPupilBtn').click( function () {
        PersonModDlg.edit(-1, [$('#FilterGroup').val(), String(PUPIL_GROUP_ID)], function () {
            $('#FilterButton').click();
        });
    });
}

function bind_teacher_add() {
    $('#AddPersonTeacherBtn').click( function () {
        PersonModDlg.edit(-1, [String(TEACHER_GROUP_ID)], function () {
            $('#FilterButton').click();
        });
    });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(4)))

/***/ }),

/***/ 175:
/***/ (function(module, exports, __webpack_require__) {

var Handlebars = __webpack_require__(2);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data) {
    return "    <button class=\"btn btn-default\" type=\"button\" id=\"AddPersonPupilBtn\">Добавить ученика</button>\n    <button class=\"btn btn-default\" type=\"button\" id=\"AddPersonTeacherBtn\">Добавить учителя</button>\n";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.lambda, alias3=container.escapeExpression;

  return ((stack1 = helpers["if"].call(alias1,(data && data.first),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <tr>\n        <td>\n"
    + ((stack1 = helpers.ifCond.call(alias1,((stack1 = (depths[1] != null ? depths[1].user_rights : depths[1])) != null ? stack1.mod : stack1),"==","t",{"name":"ifCond","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            "
    + alias3(alias2(((stack1 = (depths[1] != null ? depths[1].user_rights : depths[1])) != null ? stack1.mod : stack1), depth0))
    + " "
    + alias3(alias2((depth0 != null ? depth0.surname : depth0), depth0))
    + " "
    + alias3(alias2((depth0 != null ? depth0.name : depth0), depth0))
    + " "
    + alias3(alias2((depth0 != null ? depth0.middlename : depth0), depth0))
    + "\n"
    + ((stack1 = helpers.ifCond.call(alias1,((stack1 = (depth0 != null ? depth0.user_rights : depth0)) != null ? stack1.mod : stack1),"==","t",{"name":"ifCond","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </td>\n\n        <td>"
    + alias3(alias2((depth0 != null ? depth0.card_number : depth0), depth0))
    + " &nbsp;</td>\n        <td>"
    + alias3(helpers.formatDate.call(alias1,(depth0 != null ? depth0.birthday : depth0),{"name":"formatDate","hash":{},"data":data}))
    + "</td>\n        <td>"
    + alias3((helpers.formatDateTime || (depth0 && depth0.formatDateTime) || helpers.helperMissing).call(alias1,(depth0 != null ? depth0.register : depth0),{"name":"formatDateTime","hash":{},"data":data}))
    + "</td>\n        <td>"
    + alias3(alias2((depth0 != null ? depth0.reg_form : depth0), depth0))
    + "</td>\n        <td>"
    + alias3(alias2((depth0 != null ? depth0.rolename : depth0), depth0))
    + "</td>\n        <td>"
    + ((stack1 = helpers.ifCond.call(alias1,(depth0 != null ? depth0.is_disabled : depth0),"==","t",{"name":"ifCond","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.program(12, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "</td>\n    </tr>\n"
    + ((stack1 = helpers["if"].call(alias1,(data && data.last),{"name":"if","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    return "            <thead>\n            <tr>\n                <th>ФИО</th>\n                <th>Номер карты</th>\n                <th>Дата рождения</th>\n                <th>Зарегистрирован</th>\n                <th>Класс регистрации</th>\n                <th>Роль</th>\n                <th>Отключен</th>\n            </tr>\n            </thead>\n        <tbody>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "            <a href=\"#\" class=\"link\" data-user-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "            </a>\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "Да";
},"12":function(container,depth0,helpers,partials,data) {
    return "Нет";
},"14":function(container,depth0,helpers,partials,data) {
    return "        </tbody>\n";
},"16":function(container,depth0,helpers,partials,data) {
    return "        <tbody>\n        <tr>\n            <td>Не найдено удовлетворяющих запросу персон</td>\n        </tr>\n        </tbody>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = helpers.ifCond.call(alias1,((stack1 = (depth0 != null ? depth0.user_rights : depth0)) != null ? stack1.mod : stack1),"==","t",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<table width=100% class=\"table table-hover\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.users : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.program(16, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n</table>";
},"useData":true,"useDepths":true});

/***/ }),

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(ajax, $) {/**
 * Person  add dialogue
 */
var Functions = __webpack_require__(6);
var Handlebars = __webpack_require__(2);
if (typeof Handlebars.templates === 'undefined')
    Handlebars.templates = [];
Handlebars.templates.groups_select = __webpack_require__(14);
Handlebars.templates.user_edit_dlg = __webpack_require__(177);

__webpack_require__(8);
var moment = __webpack_require__(0);
var BootstrapDialog = __webpack_require__(180);
__webpack_require__(181);
var parseDate = __webpack_require__(182);

var PersonModDlg = {
    user: {},
    groups: [],
    sel_groups: [],
    dlg: null,
    canvas: false,
    context: false,
    video: null,
    callback: function () {
    },
    element: null,
    edit: function (user_id, sel_groups, callback) {
        PersonModDlg.callback = callback;
        ajax({
            async: false,
            url: ROOT + 'mt/users.php',
            data: {
                action: 'user_info',
                id: user_id
            }
        }).then(function (data) {
            if (('user_rights' in data) && data.user_rights['mod'] !== 't')
                return;
            if (!('groups' in data) || !('users' in data))
                return;
            if (data.users.length === 1 && data.users[0].length !== 0) {
                PersonModDlg.user = data.users[0];
                PersonModDlg.groups = data.groups;
                PersonModDlg.sel_groups = PersonModDlg.user['group_ids'];
            }
            else {
                PersonModDlg.user = null;
                PersonModDlg.groups = data.groups;
                PersonModDlg.sel_groups = sel_groups;
            }

            PersonModDlg.show(PersonModDlg.user === null);
        });
    },
    show: function (new_person) {
        console.log(PersonModDlg.sel_groups);
        PersonModDlg.element = $(Handlebars.templates.user_edit_dlg(
            {
                'user': PersonModDlg.user,
                'groups': PersonModDlg.groups,
                'sel_groups': PersonModDlg.sel_groups,
                'ROOT': ROOT
            }
        ));
        PersonModDlg.dlg = new BootstrapDialog({
            type: BootstrapDialog.TYPE_PRIMARY,
            size: BootstrapDialog.SIZE_WIDE,
            message: PersonModDlg.element,
            onhidden: function () {
                PersonModDlg.stop_canvas();
                $('input[name="birthday"]', PersonModDlg.element).datepicker('destroy');
                PersonModDlg.callback = function () {
                };
            }
        });
        PersonModDlg.canvas = $('#canvas', PersonModDlg.element)[0];
        PersonModDlg.context = PersonModDlg.canvas.getContext("2d");
        PersonModDlg.video = $('#video', PersonModDlg.element)[0];

        PersonModDlg.bind();

        if (new_person || PersonModDlg.user['pic_name'] == '') {
            PersonModDlg.img_changed = true;
            PersonModDlg.play_canvas();
            $('#snapshot', PersonModDlg.element).show();
        } else {
            PersonModDlg.img_changed = false;
            PersonModDlg.stop_canvas();
            $('#curphoto', PersonModDlg.element).show();

        }

        if (new_person) {
            PersonModDlg.dlg.setTitle("Добавить персону");
            PersonModDlg.set_buttons('user_add', PersonModDlg.callback, null, PersonModDlg.sel_groups);
        } else {
            PersonModDlg.dlg.setTitle("Редактировать персону");
            PersonModDlg.set_buttons('user_mod', PersonModDlg.callback, PersonModDlg.user['id']);
        }
        PersonModDlg.dlg.open();
    },
    bind: function () {
        $('#groups_select', PersonModDlg.element).multiselect({
            //checkboxName: 'groups[]',
            buttonText: function (options, select) {
                if (options.length === 0) {
                    return 'Необходимо выбрать группы';
                }
                else {
                    var labels = [];
                    options.each(function () {
                        if ($(this).attr('label') !== undefined) {
                            labels.push($(this).attr('label'));
                        }
                        else {
                            labels.push($(this).html());
                        }
                    });
                    return labels.join(', ') + ' ';
                }
            }
        });
        $('input[name="birthday"]', PersonModDlg.element).datepicker({
            language: "ru",
            todayHighlight: true,
            toggleActive: false
        }).on('changeDate', function () {
            $('input[name="dbdate"]', PersonModDlg.element).val(
                moment($(this).datepicker('getDate')).format('YYYY-MM-DD')
            );
        });

        var vl = $('input[name="dbdate"]', PersonModDlg.element).val();
        var dt = new Date();
        if (vl != '')
            dt = new Date(vl);
        $('input[name="birthday"]', PersonModDlg.element).datepicker(
            'update',
            new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0)
        );

        PersonModDlg.bind_snap();
        PersonModDlg.bind_change();
    },
    bind_snap: function () {
        $('#snap', PersonModDlg.element).unbind('click').click(function (event) {
            event.preventDefault();
            PersonModDlg.context.drawImage(PersonModDlg.video, 0, 0, 320, 240);
        });
    },
    bind_change: function () {
        $('#change', PersonModDlg.element).unbind('click').click(function (event) {
            event.preventDefault();
            PersonModDlg.img_changed = true;
            PersonModDlg.play_canvas();
            $('#snapshot', PersonModDlg.element).show();
            $('#curphoto', PersonModDlg.element).hide();
        });
    },
    errBack: function (error) {
        console.error("Video capture error: ", error.code);
    },
    play_canvas: function () {
        // Grab elements, create settings, etc.
        var videoObj = {video: true, audio: false, facingMode: "user"};

        // Put video listeners into place
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { // Standard
            navigator.mediaDevices
                .getUserMedia(videoObj)
                .then(function (stream) {
                    PersonModDlg.video.srcObject = PersonModDlg.video.src = stream;
                    PersonModDlg.video.play();
                })
                .catch(PersonModDlg.errBack);
        }
    },
    stop_canvas: function () {
        var context = PersonModDlg.canvas.getContext("2d");
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        if (PersonModDlg.video && PersonModDlg.video.srcObject)
            PersonModDlg.video.srcObject
                .getTracks()
                .forEach(function (e) {
                    e.stop();
                });
    },
    validate: function () {
        var ret = true;
        $('label.mandatory', PersonModDlg.element).each(function (index) {
            if ($(this).next('input').val() == '') {
                $(this).next('input').addClass('danger');
                ret = false;
            }
            else
                $(this).next('input').removeClass('danger');
        });

        return ret;
    },
    set_buttons: function (action, callback, user_id, group_id) {
        if (PersonModDlg.dlg === null)
            return;
        PersonModDlg.dlg.setButtons(
            [
                {
                    label: 'Сохранить',
                    action: function () {
                        if (!PersonModDlg.validate())
                            return;

                        ajax({
                            method: 'post',
                            url: ROOT + 'mt/users.php',
                            data: {
                                action: action,
                                id: user_id,
                                group_id: group_id,
                                params: PersonModDlg.get_data()
                            },
                            success: function (data) {
                                if (callback)
                                    callback(data.id);
                                PersonModDlg.dlg.close();

                            }
                        });
                    }
                },
                {
                    label: 'Отмена',
                    action: function () {
                        PersonModDlg.dlg.close();
                    }
                }
            ]);
    },
    get_data: function () {
        var data = {};
        $('input', PersonModDlg.element).each(function () {
            data[$(this).attr('name')] = $(this).val();
        });
        data['canvas'] = (PersonModDlg.img_changed ? PersonModDlg.canvas.toDataURL("image/jpeg") : null);
        data['groups'] = $('#groups_select', PersonModDlg.element).val();

        return data;
    }
};

module.exports = PersonModDlg;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(1)))

/***/ }),

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

var Handlebars = __webpack_require__(2);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                                <option value=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\"\n                                        "
    + ((stack1 = (helpers.ifIn || (depth0 && depth0.ifIn) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.id : depth0),(depths[1] != null ? depths[1].sel_groups : depths[1]),{"name":"ifIn","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</option>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "selected";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing;

  return "<div id=\"person_mod_dlg\" title=\"Редактирование пользователя\">\n    <form role=\"form\">\n        <fieldset>\n            <div class=\"row\">\n                <div class=\"col-md-12\">\n                    <div class=\"form-group\">\n                        <label for=\"middle\">Номер карты</label>\n                        <input maxlength=\"120\" placeholder=\"Номер карты\" name=\"card\" tabindex=\"1\" class=\"form-control\"\n                               style=\"text-transform: capitalize;\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.card_number : stack1), depth0))
    + "\"/>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-md-6\">\n                    <div class=\"form-group\">\n                        <label for=\"surname\" class=\"mandatory\">Фамилия</label>\n                        <input maxlength=\"120\" placeholder=\"Фамилия\" name=\"surname\" tabindex=\"2\" class=\"form-control\"\n                               style=\"text-transform: capitalize;\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.surname : stack1), depth0))
    + "\"/>\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"name\" class=\"mandatory\">Имя</label>\n                        <input maxlength=\"120\" placeholder=\"Имя\" name=\"name\" tabindex=\"3\" class=\"form-control\"\n                               style=\"text-transform: capitalize;\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.name : stack1), depth0))
    + "\"/>\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"middle\" class=\"mandatory\">Отчество</label>\n                        <input maxlength=\"120\" placeholder=\"Отчество\" name=\"middle\" tabindex=\"4\" class=\"form-control\"\n                               style=\"text-transform: capitalize;\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.middlename : stack1), depth0))
    + "\"/>\n                    </div>\n                </div>\n                <div class=\"col-md-6\">\n                    <div class=\"form-group\">\n                        <label for=\"birthday\" class=\"mandatory\">Дата рождения</label>\n                        <input maxlength=\"120\" placeholder=\"Дата рождения\" name=\"birthday\" class=\"form-control\"\n                               tabindex=\"6\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.birthday : stack1), depth0))
    + "\" data-date-format=\"dd.mm.yyyy\"/>\n                        <input name=\"dbdate\" type=\"hidden\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.birthday : stack1), depth0))
    + "\" />\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"regday\">Дата регистрации</label>\n                        <input maxlength=\"120\" placeholder=\"Дата регистрации\" name=\"regday\" class=\"form-control\"\n                               tabindex=\"7\" disabled value=\""
    + alias2((helpers.formatDateTime || (depth0 && depth0.formatDateTime) || alias4).call(alias3,((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.register : stack1),{"name":"formatDateTime","hash":{},"data":data}))
    + "\"/>\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"regclass\">Класс регистрации</label>\n                        <input maxlength=\"120\" placeholder=\"Класс регистрации\" name=\"regclass\" class=\"form-control\"\n                               tabindex=\"8\" disabled value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.reg_form : stack1), depth0))
    + "\"/>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-md-12\">\n                    <div id=\"groups\" class=\"form-group\">\n                        <select id=\"groups_select\" multiple=\"multiple\" class=\"form-control\">\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.groups : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        </select>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-md-12\" id=\"snapshot\" style=\"display: none\" >\n                    <div class=\"col-md-6\">\n                        <video id=\"video\" width=\"320\" height=\"240\"></video>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <canvas id=\"canvas\" width=\"320\" height=\"240\"></canvas>\n                    </div>\n                    <div class=\"col-md-12\">\n                        <div class=\"form-group\">\n                            <div class=\"button-group\">\n                                <button class=\"btn btn-success\" id=\"snap\">Снять</button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-md-12\" id=\"curphoto\" style=\"display: none\">\n                    <div class=\"col-md-3\"></div>\n                    <div class=\"col-md-6\">\n                        <img src=\""
    + alias2(((helper = (helper = helpers.ROOT || (depth0 != null ? depth0.ROOT : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"ROOT","hash":{},"data":data}) : helper)))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.pic_name : stack1), depth0))
    + "\" align=\"center\" id=\"picname\"/>\n                    </div>\n                    <div class=\"col-md-3\"></div>\n                    <div class=\"col-md-12\">\n                        <div class=\"form-group\">\n                            <div class=\"button-group\">\n                                <button class=\"btn btn-success\" id=\"change\">Сменить</button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </fieldset>\n    </form>\n</div>\n";
},"useData":true,"useDepths":true});

/***/ }),

/***/ 179:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 15,
	"./af.js": 15,
	"./ar": 16,
	"./ar-dz": 17,
	"./ar-dz.js": 17,
	"./ar-kw": 18,
	"./ar-kw.js": 18,
	"./ar-ly": 19,
	"./ar-ly.js": 19,
	"./ar-ma": 20,
	"./ar-ma.js": 20,
	"./ar-sa": 21,
	"./ar-sa.js": 21,
	"./ar-tn": 22,
	"./ar-tn.js": 22,
	"./ar.js": 16,
	"./az": 23,
	"./az.js": 23,
	"./be": 24,
	"./be.js": 24,
	"./bg": 25,
	"./bg.js": 25,
	"./bm": 26,
	"./bm.js": 26,
	"./bn": 27,
	"./bn.js": 27,
	"./bo": 28,
	"./bo.js": 28,
	"./br": 29,
	"./br.js": 29,
	"./bs": 30,
	"./bs.js": 30,
	"./ca": 31,
	"./ca.js": 31,
	"./cs": 32,
	"./cs.js": 32,
	"./cv": 33,
	"./cv.js": 33,
	"./cy": 34,
	"./cy.js": 34,
	"./da": 35,
	"./da.js": 35,
	"./de": 36,
	"./de-at": 37,
	"./de-at.js": 37,
	"./de-ch": 38,
	"./de-ch.js": 38,
	"./de.js": 36,
	"./dv": 39,
	"./dv.js": 39,
	"./el": 40,
	"./el.js": 40,
	"./en-au": 41,
	"./en-au.js": 41,
	"./en-ca": 42,
	"./en-ca.js": 42,
	"./en-gb": 43,
	"./en-gb.js": 43,
	"./en-ie": 44,
	"./en-ie.js": 44,
	"./en-il": 45,
	"./en-il.js": 45,
	"./en-nz": 46,
	"./en-nz.js": 46,
	"./eo": 47,
	"./eo.js": 47,
	"./es": 48,
	"./es-do": 49,
	"./es-do.js": 49,
	"./es-us": 50,
	"./es-us.js": 50,
	"./es.js": 48,
	"./et": 51,
	"./et.js": 51,
	"./eu": 52,
	"./eu.js": 52,
	"./fa": 53,
	"./fa.js": 53,
	"./fi": 54,
	"./fi.js": 54,
	"./fo": 55,
	"./fo.js": 55,
	"./fr": 56,
	"./fr-ca": 57,
	"./fr-ca.js": 57,
	"./fr-ch": 58,
	"./fr-ch.js": 58,
	"./fr.js": 56,
	"./fy": 59,
	"./fy.js": 59,
	"./gd": 60,
	"./gd.js": 60,
	"./gl": 61,
	"./gl.js": 61,
	"./gom-latn": 62,
	"./gom-latn.js": 62,
	"./gu": 63,
	"./gu.js": 63,
	"./he": 64,
	"./he.js": 64,
	"./hi": 65,
	"./hi.js": 65,
	"./hr": 66,
	"./hr.js": 66,
	"./hu": 67,
	"./hu.js": 67,
	"./hy-am": 68,
	"./hy-am.js": 68,
	"./id": 69,
	"./id.js": 69,
	"./is": 70,
	"./is.js": 70,
	"./it": 71,
	"./it.js": 71,
	"./ja": 72,
	"./ja.js": 72,
	"./jv": 73,
	"./jv.js": 73,
	"./ka": 74,
	"./ka.js": 74,
	"./kk": 75,
	"./kk.js": 75,
	"./km": 76,
	"./km.js": 76,
	"./kn": 77,
	"./kn.js": 77,
	"./ko": 78,
	"./ko.js": 78,
	"./ky": 79,
	"./ky.js": 79,
	"./lb": 80,
	"./lb.js": 80,
	"./lo": 81,
	"./lo.js": 81,
	"./lt": 82,
	"./lt.js": 82,
	"./lv": 83,
	"./lv.js": 83,
	"./me": 84,
	"./me.js": 84,
	"./mi": 85,
	"./mi.js": 85,
	"./mk": 86,
	"./mk.js": 86,
	"./ml": 87,
	"./ml.js": 87,
	"./mn": 88,
	"./mn.js": 88,
	"./mr": 89,
	"./mr.js": 89,
	"./ms": 90,
	"./ms-my": 91,
	"./ms-my.js": 91,
	"./ms.js": 90,
	"./mt": 92,
	"./mt.js": 92,
	"./my": 93,
	"./my.js": 93,
	"./nb": 94,
	"./nb.js": 94,
	"./ne": 95,
	"./ne.js": 95,
	"./nl": 96,
	"./nl-be": 97,
	"./nl-be.js": 97,
	"./nl.js": 96,
	"./nn": 98,
	"./nn.js": 98,
	"./pa-in": 99,
	"./pa-in.js": 99,
	"./pl": 100,
	"./pl.js": 100,
	"./pt": 101,
	"./pt-br": 102,
	"./pt-br.js": 102,
	"./pt.js": 101,
	"./ro": 103,
	"./ro.js": 103,
	"./ru": 104,
	"./ru.js": 104,
	"./sd": 105,
	"./sd.js": 105,
	"./se": 106,
	"./se.js": 106,
	"./si": 107,
	"./si.js": 107,
	"./sk": 108,
	"./sk.js": 108,
	"./sl": 109,
	"./sl.js": 109,
	"./sq": 110,
	"./sq.js": 110,
	"./sr": 111,
	"./sr-cyrl": 112,
	"./sr-cyrl.js": 112,
	"./sr.js": 111,
	"./ss": 113,
	"./ss.js": 113,
	"./sv": 114,
	"./sv.js": 114,
	"./sw": 115,
	"./sw.js": 115,
	"./ta": 116,
	"./ta.js": 116,
	"./te": 117,
	"./te.js": 117,
	"./tet": 118,
	"./tet.js": 118,
	"./tg": 119,
	"./tg.js": 119,
	"./th": 120,
	"./th.js": 120,
	"./tl-ph": 121,
	"./tl-ph.js": 121,
	"./tlh": 122,
	"./tlh.js": 122,
	"./tr": 123,
	"./tr.js": 123,
	"./tzl": 124,
	"./tzl.js": 124,
	"./tzm": 125,
	"./tzm-latn": 126,
	"./tzm-latn.js": 126,
	"./tzm.js": 125,
	"./ug-cn": 127,
	"./ug-cn.js": 127,
	"./uk": 128,
	"./uk.js": 128,
	"./ur": 129,
	"./ur.js": 129,
	"./uz": 130,
	"./uz-latn": 131,
	"./uz-latn.js": 131,
	"./uz.js": 130,
	"./vi": 132,
	"./vi.js": 132,
	"./x-pseudo": 133,
	"./x-pseudo.js": 133,
	"./yo": 134,
	"./yo.js": 134,
	"./zh-cn": 135,
	"./zh-cn.js": 135,
	"./zh-hk": 136,
	"./zh-hk.js": 136,
	"./zh-tw": 137,
	"./zh-tw.js": 137
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 179;

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {__webpack_require__(10);

__webpack_require__(1);
__webpack_require__(11);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(4);

var Handlebars = __webpack_require__(2);
__webpack_require__(13)(Handlebars);

Handlebars.registerHelper('ifIn', function(elem, list, options) {
    if(list && list.constructor === Array && list.indexOf(elem) > -1) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('formatDate', formatDate);
Handlebars.registerHelper('formatDateTime', formatDateTime);

var SHOW_TIME = 5 * 1000; // 5 seconds


function formatDateTime( str ){
    if (str == null)
        return "";

    return str.substr(8,2) + "."
        + str.substr(5, 2) + "."
        + str.substr(0,4) + " "
        + str.substr(11,8);
}

function formatDate( str ){
    // 0123456789
    // 2014-07-06
    if (str == null)
        return "";
    return str.substr(8,2) + "."
        + str.substr(5, 2) + "."
        + str.substr(0,4);
}

// function highlights substring in string
function autocompl_highlight(s, t) {
    var matcher = new RegExp("("+$.ui.autocomplete.escapeRegex(t)+")", "ig" );
    return s.replace(matcher, "<strong>$1</strong>");
}

function clear_dialog( dlg_id ) {
    $(':text', dlg_id).val('');
    $('[type=number]', dlg_id).val('');
    $('[type=password]', dlg_id).val('');
    $('[type=hidden]', dlg_id).val('');
    $('textarea', dlg_id).val('');
    $('input:checked', dlg_id).attr('checked', false);
}

module.exports = {
    'clear_dialog': clear_dialog
};


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ })

},[174]);