<div id="person_mod_dlg" title="Редактирование пользователя" style="display: none;" class="ui-widget">
    <form>
        <div class="Field">
            <label for="middle">Номер карты</label>
            <input maxlength="120" placeholder="Номер карты" name="card" tabindex="1" style="text-transform: capitalize;" />
        </div>
        <div>
            <table width="100%">
                <tr style="vertical-align: top">
                    <td style="width:50%">
                        <div class="Field">
                            <label for="surname" class="mandatory">Фамилия</label>
                            <input maxlength="120" placeholder="Фамилия" name="surname" tabindex="2" style="text-transform: capitalize;" />
                        </div>
                        <div class="Field">
                            <label for="name" class="mandatory">Имя</label>
                            <input maxlength="120" placeholder="Имя" name="name" tabindex="3" style="text-transform: capitalize;" />
                        </div>
                        <div class="Field">
                            <label for="middle" class="mandatory">Отчество</label>
                            <input maxlength="120" placeholder="Отчество" name="middle" tabindex="4" style="text-transform: capitalize;" />
                        </div>
                    </td>
                    <td style="width:50%; vertical-align: top">
                        <div class="Field">
                            <label for="birthday" class="mandatory">Дата рождения</label>
                            <input maxlength="120" placeholder="Дата рождения" name="birthday" tabindex="5" />
                            <input name="dbdate" type="hidden" />
                        </div>
                        <div class="Field">
                            <label for="regday">Дата регистрации</label>
                            <input maxlength="120" placeholder="Дата регистрации" name="regday" tabindex="5" disabled />
                        </div>
                        <div class="Field">
                            <label for="regclass">Класс регистрации</label>
                            <input maxlength="120" placeholder="Класс регистрации" name="regclass" tabindex="5" disabled />
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div id="groups">
            <select id="groups_select" multiple="multiple"></select>
        </div>
        <div class="Field" id="snapshot">
            <table width="100%" cellpadding="10">
                <tr>
                    <td width="50%">
                        <video id="video" width="320" height="240"></video>
                    </td>
                    <td>
                        <canvas id="canvas" width="320" height="240"></canvas>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" align="center">
                        <button id="snap">Снять</button>
                    </td>
                </tr>
            </table>
        </div>
        <div class="Field" id="curphoto">
            <table width="100%" cellpadding="10">
                <tr>
                    <td align="center">
                        <img src="img/load.gif" align="center" id="picname" />
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <button id="change">Сменить</button>
                    </td>
                </tr>
            </table>
        </div>
    </form>
</div>
