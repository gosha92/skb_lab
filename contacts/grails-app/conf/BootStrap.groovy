import com.example.contacts.Contact

class BootStrap {

    def init = { servletContext ->

        new Contact(
                name:"Иван",
                surename:"Иванов",
                patronymic:"Иванович",
                birthDate:new Date(1, 1, 1970),
                phoneNumber:"8 (912) 123 45 67",
                email:"ivanov@mail.ru"
        ).save()

        new Contact(
                name:"Петров",
                surename:"Пётр",
                patronymic:"Петрович",
                birthDate:new Date(2, 1, 1970),
                phoneNumber:"8 (904) 123 45 67",
                email:"petrov@mail.ru"
        ).save()

    }

    def destroy = {
    }
}
