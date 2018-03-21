package com.example.contacts

import grails.converters.JSON
import org.grails.databinding.BindingFormat

class Contact {

    static {
        JSON.registerObjectMarshaller(Contact) {
            [
                id: it.id,
                surename: it.surename,
                name: it.name,
                patronymic: it.patronymic,
                birthDate: it.birthDate.format("dd.MM.yyyy"),
                phoneNumber: it.phoneNumber,
                email: it.email
            ]
        }
    }

    static constraints = {
        surename nullable: true, size: 0..50
        name nullable: false, size: 1..50
        patronymic nullable: true, size: 0..50
        birthDate nullable: false, validator: {it <= new Date()}
        phoneNumber nullable: true,  size: 0..50
        email nullable: true, size: 0..50, matches: "^[^\\s@]+@[^\\s@]+\$"
    }

    String surename
    String name
    String patronymic
    @BindingFormat('dd.MM.yyyy')
    Date birthDate
    String phoneNumber
    String email

    static transients = ['fio', 'age']

    String getFio() {
        [surename, name, patronymic].stream().filter{ field -> field != null }.collect().join(" ")
    }

    Integer getAge() {
        Date currentDate = new Date()
        int years = currentDate[Calendar.YEAR] - birthDate[Calendar.YEAR];
        boolean hasBirthday = currentDate[Calendar.MONTH] > birthDate[Calendar.MONTH] ||
                (currentDate[Calendar.MONTH] == birthDate[Calendar.MONTH] &&
                currentDate[Calendar.DAY_OF_MONTH] >= birthDate[Calendar.DAY_OF_MONTH])
        hasBirthday ? years : years - 1
    }

}
