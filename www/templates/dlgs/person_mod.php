<div id="person_mod_dlg" title="Редактирование пользователя" style="display: none;" class="ui-widget">
    <form>
        <div class="Field">
            <label for="surname" class="mandatory">Фамилия</label>
            <input maxlength="120" placeholder="Фамилия" name="surname" tabindex="1" style="text-transform: capitalize;" />
        </div>
        <div class="Field">
            <label for="name" class="mandatory">Имя</label>
            <input maxlength="120" placeholder="Имя" name="name" tabindex="2" style="text-transform: capitalize;" />
        </div>
        <div class="Field">
            <label for="middle" class="mandatory">Отчество</label>
            <input maxlength="120" placeholder="Отчество" name="middle" tabindex="3" style="text-transform: capitalize;" />
        </div>
        <div class="Field">
            <label for="pos" class="mandatory">Должность</label>
            <input maxlength="250" placeholder="Должность" name="pos" tabindex="7" />
        </div>
        <div class="Field">
            <label for="birthday" class="mandatory">Дата рождения</label>
            <input maxlength="120" placeholder="Дата рождения" name="birthday" tabindex="8" />
            <input name="dbdate" type="hidden" />
        </div>
    </form>
    <?php 
/*<!--
$name, $addr, $inn, $phone, $login, $pwd, $role, $parent

0    id          int,       <td>Логин</td>
1    display_name    text,  <td>Имя</td>
2    address     text,      <td>Адрес</td>
3    login       name,      <td>ИНН</td>
4    inn         text,      <td>Телефон</td>
5    phone       text,      <td>Роль</td>
6    role_id     int,       <td>Родитель</td>
7    role_name   text,      <td>Родители</td>
8    parent_id   int,
9    parent_name text,
10  path        text,
11  level       int
-->
 *
 */ ?>
</div>
