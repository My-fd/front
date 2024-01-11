export const VALIDATABL_EFIELDS_PROPS:any = {
    nickname:   {   name: 'nickname',               type: '',       label: 'Никнейм',          helperText: ' '},
    name:       {   name: 'name',                   type: '',       label: 'Имя',              helperText: ' '},
    surname:    {   name: 'surname',                type: '',       label: 'Фамилия',          helperText: ' '},
    patronymic: {   name: 'patronymic',             type: '',       label: 'Отчество',         helperText: ' '},
    about:      {   name: 'about',                  type: '',       label: 'О себе',           helperText: ' '},
    email:      {   name: 'email',                  type: 'email',  label: 'Почта',            helperText: ' '},
    pass:       {   name: 'password',               type: '',       label: 'Пароль',           helperText: ' '},
    passR:      {   name: 'password_confirmation',  type: '',       label: 'Повторите пароль', helperText: ' '},
    phone:      {   name: 'phone',                  type: '',       label: 'Телефон',          helperText: ' '},
    city:       {   name: 'city',                   type: '',       label: 'Город',            helperText: ' '},
}

const maxLength = 64, aboutLength = 1024, emailLength = 255;

export const VALIDATION_RULES:any = {
    nickname: {
        required: true,
        maxLength: {
            value: maxLength,
            message: `Никнейм не должно быть длиннее ${maxLength} символов`
        }},
    name: {
        required: true,
        maxLength: {
            value: maxLength,
            message: `Имя не должно быть длиннее ${maxLength} символов`
        }},

    surname: {
        required: true,
        maxLength: {
            value: maxLength,
            message: `Фамилия не должна быть длиннее ${maxLength} символов`
        }},

    patronymic: {
        // required: true,
        maxLength: {
            value: maxLength,
            message: `Отчество не должно быть длиннее ${maxLength} символов`
        }},

    about: {
        // required: true,
        maxLength: {
            value: aboutLength,
            message: `Имя не должно быть длиннее ${aboutLength} символов`
        }},

    email: {
        required: true,
        pattern: {
            value:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Введите почту в формате _______@___.___',
        },
        maxLength: {
            value: emailLength,
            message: `Почта не должна быть длиннее ${emailLength} символов`
        }
    },
    phone: {
        required: true,
        pattern: {
            value:/^(\+7)[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
            message: 'В номере телефона допущена ошибка. Допустимые форматы: +79_________, +7-9__-___-__-__, +7(9__)_______',
        },
    },
    city: {
        // required: true,
        maxLength: {
            value: 100,
            message: "Название города не должно быть длиннее 100 символов"
        }},

}

export const VALIDATION_ERRORS_MESSAGES = {
    required:'Это поле обязательно для заполнения',
}