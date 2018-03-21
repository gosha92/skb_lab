<!DOCTYPE html>
<html>

<head>
    <title>Контакты</title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <asset:stylesheet src="semantic/semantic.min.css"/>
    <asset:stylesheet src="semantic/calendar.min.css"/>
    <asset:stylesheet src="style.css"/>
    <asset:javascript src="jquery-3.3.1.min.js"/>
    <asset:javascript src="semantic/semantic.min.js"/>
    <asset:javascript src="semantic/calendar.min.js"/>
    <asset:javascript src="moment/moment.min.js"/>
</head>

<body>

<!-- МЕНЮ -->
<div class="ui fixed menu">
    <div class="ui container">
        <div class="borderless header item">
            <div>
                <i class="large address book outline icon"></i>Контакты
            </div>
        </div>
        <div class="right borderless item">
            <button class="ui green button" id="button_create">
                <i class="plus icon"></i>Добавить контакт
            </button>
            <span>&nbsp;&nbsp;</span>
            <button class="ui blue button" id="button_upload">
                <i class="upload icon"></i>Загрузить контакты
            </button>
        </div>
    </div>
</div>

<div class="ui main container">
    <!-- ТАБЛИЦА -->
    <table class="ui selectable unstackable table">
        <thead>
            <tr>
                <th class="collapsing">ФИО</th>
                <th class="collapsing">Возраст</th>
                <th class="six wide"></th>
            </tr>
        </thead>
        <tbody>
            <g:each var="contact" in="${contacts}">
            <tr data-id="${contact.id}">
                <td>${contact.fio}</td>
                <td>${contact.age}</td>
                <td class="right aligned">
                    <button class="ui three wide icon button button_view">
                        <i class="eye icon"></i>
                    </button>
                    <button class="ui three wide icon button button_remove">
                        <i class="trash alternate outline red icon"></i>
                    </button>
                </td>
            </tr>
            </g:each>
        </tbody>
    </table>
</div>

<!-- МОДАЛЬНОЕ ОКНО С ПОДТВЕРЖДЕНИЕМ УДАЛЕНИЯ -->
<div class="ui tiny basic modal" id="modal_confirmation">
    <div class="ui icon header">
        Удалить контакт?
    </div>
    <div class="actions">
        <div class="ui basic cancel inverted button">
            <i class="remove icon"></i>Отмена
        </div>
        <div class="ui red inverted button" id="button_remove_confirmed">
            <i class="checkmark icon"></i>Удалить
        </div>
    </div>
</div>

<!-- МОДАЛЬНОЕ ОКНО С ДЕТАЛИЗИРОВАННОЙ ИНФОРМАЦИЕЙ О КОНТАКТЕ -->
<div class="ui modal" id="modal_contact">
    <i class="close icon"></i>
    <div class="header" id="modal_contact_title">Контакт</div>
    <div class="content">
        <div class="ui form">
            <div class="field">
                <div class="ui field labeled input" id="contact_surename">
                    <div class="ui label">Фамилия <span class="asterisk">*</span></div>
                    <input type="text" name="surename" maxlength="50" style="padding-left: 14px !important;">
                </div>
                <div class="ui field labeled input" id="contact_name">
                    <div class="ui label">Имя <span class="asterisk">*</span></div>
                    <input type="text" name="name" maxlength="50" style="padding-left: 14px !important;">
                </div>
                <div class="ui field labeled input" id="contact_patronymic">
                    <div class="ui label">Отчество <span class="asterisk">*</span></div>
                    <input type="text" name="patronymic" maxlength="50" style="padding-left: 14px !important;">
                </div>
                <div class="ui field labeled input" id="contact_birthDate">
                    <div class="ui label">Дата рождения <span class="asterisk">*</span></div>
                    <input type="text" name="birthDate" style="padding-left: 14px !important;">
                </div>
                <div class="ui field labeled input" id="contact_phoneNumber">
                    <div class="ui label">Телефон</div>
                    <input type="text" name="phoneNumber" maxlength="50" style="padding-left: 14px !important;">
                </div>
                <div class="ui field labeled input" id="contact_email">
                    <div class="ui label">E-mail</div>
                    <input type="text" name="email" maxlength="50" style="padding-left: 14px !important;">
                </div>
            </div>
        </div>
        <div class="ui secondary inverted red segment" id="modal_contact_errors"></div>
    </div>
    <div class="actions">
        <button class="ui blue button" id="button_edit">
            <i class="edit outline icon"></i>Редактировать
        </button>
        <button class="ui green button" id="button_save">
            <i class="save outline icon"></i>Сохранить
        </button>
        <button class="ui black button" id="button_cancel">
            <i class="undo icon"></i>Отменить
        </button>
    </div>
</div>

<!-- СООБЩЕНИЯ ОБ ОШИБКАХ -->
<div id="global_errors_container">
    <g:if test="${flash.error}">
    <div class="ui secondary inverted red segment">${flash.error}</div>
    </g:if>
</div>

<!-- СКРЫТАЯ ФОРМА ДЛЯ ЗАГРУЗКИ ФАЙЛА -->
<form method="POST" action="/contacts/upload" enctype="multipart/form-data" id="file_upload_form">
    <input name="contacts" type="file" id="file_upload_input"/>
</form>

<asset:javascript src="script.js"/>

</body>
</html>
