import {NAVIGATION_FIELDS_NAMES} from "../app/_constants/fieldsNames";

export const ROUTES = {
    [NAVIGATION_FIELDS_NAMES.main]: {
        path: '/',
        label: 'Главная'
    },
    [NAVIGATION_FIELDS_NAMES.profile]:{
        path: `/${[NAVIGATION_FIELDS_NAMES.profile]}`,
        // path: '/',
        label: 'Профиль'
    },
    [NAVIGATION_FIELDS_NAMES.signin]:{
        path: `/${[NAVIGATION_FIELDS_NAMES.signin]}`,
        label: 'Вход/Регистрация'
    },
    [NAVIGATION_FIELDS_NAMES.favorites]:{
        path: `/${[NAVIGATION_FIELDS_NAMES.favorites]}`,
        label:'Избранное'
    },
    [NAVIGATION_FIELDS_NAMES.cart]:{
        path: `/${[NAVIGATION_FIELDS_NAMES.cart]}`,
        label:'Корзина'
    },
    [NAVIGATION_FIELDS_NAMES.messages]:{
        path: `/${[NAVIGATION_FIELDS_NAMES.messages]}`,
        label:'Сообщения'
    },
    [NAVIGATION_FIELDS_NAMES.notice]:{
        path: `/${[NAVIGATION_FIELDS_NAMES.notice]}`,
        label:'Уведомления'
    },
    [NAVIGATION_FIELDS_NAMES.myAds]:{
        path: `/${[NAVIGATION_FIELDS_NAMES.myAds]}`,
        label:'Мои объявления',
    },
    [NAVIGATION_FIELDS_NAMES.create]:{
        path: `/${[NAVIGATION_FIELDS_NAMES.create]}`,
    },
}