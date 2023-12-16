export const VALIDATABL_EFIELDS_PROPS = {
    name:   {   name: 'nickname',               type: '',      label: 'Имя(Никнейм)',     helperText: ' '},
    email:  {   name: 'email',                  type: 'email', label: 'Почта',            helperText: ' '},
    pass:   {   name: 'password',               type: '',      label: 'Пароль',           helperText: ' '},
    passR:  {   name: 'password_confirmation',  type: '',      label: 'Повторите пароль', helperText: ' '},
}

export const VALIDATION_RULES = {
    name: {
        required: true,
        maxLength: {
            value: 20,
            message: "Имя не должно быть длиннее 20 символов"
        }},

    email: {
        required: true,
        pattern: {
            value:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Введите почту в формате _______@___.___',
        },
    }

}

export const VALIDATION_ERRORS_MESSAGES = {
    required:'Это поле обязательно для заполнения',
}