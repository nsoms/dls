<?php
list($users) = $args;
?>

<div id="icontent">

    <div id="iFilter">
        <table width="100%" class="table">
        <tr>
            <td><label for="FilterSurname" style="width:100%">Фамилия</label>
                <input id="FilterSurname" style="width:100%"/></td>
            <td><label for="FilterCard" style="width:100%">Номер карты</label>
                <input id="FilterCard" style="width:100%"/></td>
            <td><label for="FilterGroup" style="width:100%">Группа</label>
                <select id="FilterGroup" style="width:100%"></select></td>
            <td colspan="4"><input type="button" id="FilterButton" value="Фильтровать" class="btn btn-sm btn-primary"/></td>
        </tr>
        </table>

    </div>
    <div id="UsersList">
    </div>
</div>


