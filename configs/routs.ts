import {FIELDS_NAMES} from "../app/_constants/fieldsNames";

export const ROUTES = {
    [FIELDS_NAMES.main]: {
        path: '/',
        label: 'Главная'
    },
    [FIELDS_NAMES.profile]:{
        path: `/${[FIELDS_NAMES.profile]}`,
        // path: '/',
        label: 'Профиль'
    },
    [FIELDS_NAMES.signin]:{
        path: `/${[FIELDS_NAMES.signin]}`,
        label: 'Вход/Регистрация'
    },
    [FIELDS_NAMES.favorites]:{
        path: `/${[FIELDS_NAMES.favorites]}`,
        label:'Избранное'
    },
    [FIELDS_NAMES.cart]:{
        path: `/${[FIELDS_NAMES.cart]}`,
        label:'Корзина'
    },
    [FIELDS_NAMES.messages]:{
        path: `/${[FIELDS_NAMES.messages]}`,
        label:'Сообщения'
    },
    [FIELDS_NAMES.notice]:{
        path: `/${[FIELDS_NAMES.notice]}`,
        label:'Уведомления'
    },
    [FIELDS_NAMES.myAds]:{
        path: `/${[FIELDS_NAMES.myAds]}`,
        label:'Мои объявления'
    },
}