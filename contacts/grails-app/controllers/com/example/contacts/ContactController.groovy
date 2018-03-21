package com.example.contacts

import grails.rest.RestfulController
import grails.transaction.Transactional
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.apache.commons.csv.CSVRecord
import org.springframework.web.servlet.ModelAndView

import java.nio.charset.StandardCharsets

@Transactional(readOnly = false)
class ContactController extends RestfulController {

    static allowedMethods = [
            index: "GET",
            upload: "POST",
            show: "GET",
            save: "POST",
            update: "PUT",
            delete: "DELETE"
    ]
    static responseFormats = ["json"]

    ContactController() {
        super(Contact)
    }

    @Override
    def index() {
        return new ModelAndView("/index", [contacts: Contact.list()])
    }

    def upload() {
        InputStream stream = request.getFile("contacts").getInputStream()
        CSVParser parser
        try {
            parser = CSVParser.parse(
                    stream,
                    StandardCharsets.UTF_16LE,
                    CSVFormat.DEFAULT.withDelimiter(';' as char).withHeader(
                            "id",
                            "name",
                            "birthDate",
                            "phoneNumber",
                            "email"
                    )
            )
        } catch (IOException e) {
            flash.error = "Ошибка при загрузке файла."
            redirect action: "index"
            return
        }

        List<Long> errorLines = []
        for (CSVRecord record in parser) {
            def name, birthDate, phoneNumber, email
            try {
                name = record.get("name")
                birthDate = record.get("birthDate")
                phoneNumber = record.get("phoneNumber")
                email = record.get("email")
            } catch (IllegalArgumentException e) {
                errorLines.push(record.getRecordNumber())
                continue
            }
            Contact contact = new Contact(
                    name: name,
                    birthDate: birthDate,
                    phoneNumber: phoneNumber,
                    email: email
            )
            if (contact.hasErrors() || !contact.validate()) {
                errorLines.push(record.getRecordNumber())
            } else {
                contact.save()
            }
        }
        if (errorLines.size() > 0) {
            flash.error = "Ошибка при загрузке файла (следующие строки некорректны: " + errorLines.join(", ") + ")."
        }
        redirect action: "index"
    }

}
