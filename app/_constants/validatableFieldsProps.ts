export const VALIDATABL_EFIELDS_PROPS:any = {
    nickname:      {   name: 'nickname',               label: 'Никнейм',                    helperText: ' ', type: '',       },
    name:          {   name: 'name',                   label: 'Имя',                        helperText: ' ', type: '',       },
    surname:       {   name: 'surname',                label: 'Фамилия',                    helperText: ' ', type: '',       },
    patronymic:    {   name: 'patronymic',             label: 'Отчество',                   helperText: ' ', type: '',       },
    about:         {   name: 'about',                  label: 'О себе',                     helperText: ' ', type: '',       },
    email:         {   name: 'email',                  label: 'Почта',                      helperText: ' ', type: 'email',  },
    pass:          {   name: 'password',               label: 'Пароль',                     helperText: ' ', type: '',       },
    passR:         {   name: 'password_confirmation',  label: 'Повторите пароль',           helperText: ' ', type: '',       },
    phone:         {   name: 'phone',                  label: 'Телефон',                    helperText: ' ', type: '',       },
    city:          {   name: 'city',                   label: 'Город',                      helperText: 'Укажите где находится товар', type: '',       },
    adName:        {   name: 'title',                  label: 'Название',                   helperText: ' ', type: '',       },
    adCategory:    {   name: 'parent_id',              label: 'Категория',                  helperText: ' ', type: '',       },
    adSubCategory: {   name: 'category_id',            label: 'Подкатегория',               helperText: ' ', type: '',       },
    adDescription: {   name: 'description',            label: 'Описание',                   helperText: ' ', type: '',       },
    adPrice:       {   name: 'price',                  label: 'Цена',                       helperText: ' ', type: 'number', },
    adShipmentSelf:{   name: 'shipment.self',          label: 'Самовывоз',                  helperText: '' },
    adShipmentCity:{   name: 'shipment.city',          label: 'по городу',         helperText: '' },
    adShipmentRu:  {   name: 'shipment.ru',            label: 'по России',         helperText: '' },
    adShipmentSng: {   name: 'shipment.sng',           label: 'в страны СНГ',      helperText: '' },
    adShipmentW:   {   name: 'shipment.w',             label: 'по всему миру',     helperText: '' },
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
    adName:{
        required: true,
        maxLength: {
            value: 100,
            message: "Название объявления не должно быть длиннее 100 символов"
        }
    },
    adCategory:{
        required: true,
    },
    adSubCategory:{
        required: true,
    },
    adDescription:{
        required: true,
        maxLength: {
            value: 5000,
            message: "Описание объявления не должно быть длиннее 5000 символов"
        }
    },
    adPrice:{
        maxLength: {
            value: 10,
            message: "Описание объявления не должно быть длиннее 5000 символов"
        }},
    adShipment:{}
}

const FIELDS_DEFAULT_VALUES = {
    adShipment: true
}

export const VALIDATION_ERRORS_MESSAGES = {
    required:'Это поле обязательно для заполнения',
}

export function getFieldsConfig(fields=[], options={validationRules: {}}){
    let config = <any>{serverNames:{}, fieldsConfig:{}, defaultValues:{}}
    fields.map(f => {
        const severName = VALIDATABL_EFIELDS_PROPS[f].name
        config.serverNames[f] = severName
        config.defaultValues[severName] = FIELDS_DEFAULT_VALUES[f]
        config.fieldsConfig[f] = {...VALIDATABL_EFIELDS_PROPS[f], validation: VALIDATION_RULES[f] || {}, ...options.validationRules}
    })
    return config
}
