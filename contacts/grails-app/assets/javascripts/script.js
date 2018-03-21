var confirmationModalWindow = $("#modal_confirmation");

var globalErrorsContainer = $("#global_errors_container");

var contactModalWindow = $("#modal_contact");
var contactModalWindowTitle = $("#modal_contact_title");
var contactModalWindowErrors = $("#modal_contact_errors");
var editButton = $("#button_edit");
var cancelButton = $("#button_cancel");
var saveButton = $("#button_save");

var fileUploadInput = $("#file_upload_input");
var fileUploadForm = $("#file_upload_form");

var contactFieldsWrappers = {
    surename: $("#contact_surename"),
    name: $("#contact_name"),
    patronymic: $("#contact_patronymic"),
    birthDate: $("#contact_birthDate"),
    phoneNumber: $("#contact_phoneNumber"),
    email: $("#contact_email")
};
var contactFieldsInputs = {
    surename: contactFieldsWrappers["surename"].find("input"),
    name: contactFieldsWrappers["name"].find("input"),
    patronymic: contactFieldsWrappers["patronymic"].find("input"),
    birthDate: contactFieldsWrappers["birthDate"].find("input"),
    phoneNumber: contactFieldsWrappers["phoneNumber"].find("input"),
    email: contactFieldsWrappers["email"].find("input")
};
var contactFieldsValidators = {
    surename: function(value) {
        var errors = [];
        if (value.length === 0) {
            errors.push("Необходимо указать фамилию.");
        }
        return errors;
    },
    name: function(value) {
        var errors = [];
        if (value.length === 0) {
            errors.push("Необходимо указать имя.");
        }
        return errors;
    },
    patronymic: function(value) {
        var errors = [];
        if (value.length === 0) {
            errors.push("Необходимо указать отчество.");
        }
        return errors;
    },
    birthDate: function(value) {
        var errors = [];
        var dateRegexp = /^\d{1,2}\.\d{1,2}.\d{4}$/;
        if (value.length === 0) {
            errors.push("Необходимо указать дату рождения.");
        } else if (!dateRegexp.test(value) || !moment(value, "DD.MM.YYYY").isValid() ||
            moment(value, "DD.MM.YYYY") > new Date()) {
            errors.push("Поле \"Дата рождения\" заполнено некорректно.");
        }
        // TODO
        return errors;
    },
    phoneNumber: function(value) {
        return [];
    },
    email: function(value) {
        var errors = [];
        var emailRegexp = /^[^\s@]+@[^\s@]+$/;
        if (value !== "" && !emailRegexp.test(value)) {
            errors.push("Поле \"E-mail\" заполнено некорректно.");
        }
        return errors;
    }
};

var currentContact = null;

function setContactModalWindowEditable(editable) {
    for (fieldName in contactFieldsWrappers) {
        contactFieldsWrappers[fieldName].toggleClass("transparent", !editable);
        contactFieldsWrappers[fieldName].removeClass("error");
    }
    for (fieldName in contactFieldsInputs) {
        contactFieldsInputs[fieldName].prop("disabled", editable ? null : "disabled")
    }
    if (editable) {
        editButton.hide();
        saveButton.show();
        cancelButton.show();
    } else {
        editButton.show();
        saveButton.hide();
        cancelButton.hide();
    }
}

function fillContactModalWindow(contact) {
    currentContact = contact;
    for (fieldName in contactFieldsInputs) {
        contactFieldsInputs[fieldName].val(contact[fieldName]);
    }
}

function showGlobalError(errorMessage) {
    var message = $("<div class=\"ui secondary inverted red segment\">" + errorMessage + "</div>");
    message.appendTo(globalErrorsContainer);
    message.delay(4000).fadeOut('slow');
}

$("#button_create").click(function() {
    contactModalWindowErrors.hide();
    setContactModalWindowEditable(true);
    fillContactModalWindow({
        id: null,
        surename: "",
        name: "",
        patronymic: "",
        birthDate: "",
        phoneNumber: "",
        email: ""
    });
    contactModalWindowTitle.html("Добавление контакта");
    cancelButton.hide();
    contactModalWindow.modal('show');
});

$("#button_upload").click(function() {
    fileUploadInput.trigger('click');
});

$(".button_remove").click(function() {
    currentContact = {
        id: $(this).closest("tr").data("id")
    };
    confirmationModalWindow.modal('show');
});

$(".button_view").click(function() {
    var self = $(this);
    self.addClass("loading disabled");

    var contactId = $(this).closest("tr").data("id");
    console.log("Opening contact id=" + contactId);
    $.ajax({
        url: "contact/" + contactId,
        method: "GET",
        success: function(contact) {
            setContactModalWindowEditable(false);
            fillContactModalWindow(contact);
            contactModalWindowErrors.hide();
            contactModalWindowTitle.html("Просмотр контакта");
            contactModalWindow.modal('show');
        },
        error: function(error) {
            console.log("Error on opening contact: ", error);
            showGlobalError("Ошибка при открытии контакта.");
        }
    }).always(function() {
        self.removeClass("loading disabled");
    });
});

editButton.click(function() {
    setContactModalWindowEditable(true);
    contactModalWindowTitle.html("Редактирование контакта");
});

cancelButton.click(function() {
    contactModalWindowErrors.hide();
    setContactModalWindowEditable(false);
    fillContactModalWindow(currentContact);
    contactModalWindowTitle.html("Просмотр контакта");
});

saveButton.click(function() {
    var errors = [];
    for (fieldName in contactFieldsValidators) {
        var input = contactFieldsInputs[fieldName];
        var wrapper = contactFieldsWrappers[fieldName];
        var validator = contactFieldsValidators[fieldName];
        var fieldErrors = validator(input.val());
        wrapper.toggleClass("error", fieldErrors.length > 0);
        errors = errors.concat(fieldErrors);
    }

    if (errors.length > 0) {
        var html = [];
        for (i in errors) {
            html.push("<p>");
            html.push(errors[i]);
            html.push("</p>");
        }
        contactModalWindowErrors.html(html.join(""));
        contactModalWindowErrors.show();
    } else {
        saveButton.addClass("loading disabled");
        contactModalWindowErrors.hide();
        var contact = {};
        for (fieldName in contactFieldsInputs) {
            contact[fieldName] = contactFieldsInputs[fieldName].val();
        }
        if (currentContact["id"] == null) {
            console.log("Creating contact " + JSON.stringify(contact));
            $.ajax({
                async: false,
                url: "contact/",
                method: "POST",
                datatype: "json",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(contact),
                success: function() {
                    location.reload();
                },
                error: function(error) {
                    contactModalWindowErrors.show();
                    contactModalWindowErrors.html("<p>Ошибка при добавлении контакта.</p>");
                    console.log("Error on creating contact: ", error);
                }
            }).always(function() {
                saveButton.removeClass("loading disabled");
            });
        } else {
            contact["id"] = currentContact["id"];
            console.log("Saving contact " + JSON.stringify(contact));
            $.ajax({
                async: false,
                url: "contact/" + contact["id"],
                method: "PUT",
                datatype: "json",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(contact),
                success: function() {
                    location.reload();
                },
                error: function(error) {
                    contactModalWindowErrors.show();
                    contactModalWindowErrors.html("<p>Ошибка при сохранении контакта.</p>");
                    console.log("Error on saving contact: ", error);
                }
            }).always(function() {
                saveButton.removeClass("loading disabled");
            });
        }
    }
});

$("#button_remove_confirmed").click(function() {
    console.log("Removing contact id=" + currentContact["id"]);

    var self = $(this);

    confirmationModalWindow.modal('hide');
    $.ajax({
        url: "contact/" + currentContact["id"],
        method: "DELETE",
        success: function() {
            location.reload();
        },
        error: function(error) {
            console.log("Error on removing contact: ", error);
            showGlobalError("Ошибка при удалении контакта.");
        }
    }).always(function() {
    });
});

fileUploadInput.change(function() {
    fileUploadForm.submit();
});

globalErrorsContainer.find("div").delay(4000).fadeOut('slow');
