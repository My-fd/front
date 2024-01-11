import axios from "axios";

const API_CONFIG = {
    baseURL :  "http://api.cd86156.tw1.ru/v1", //process.env.API_URL,
    changeProfile: "/changeProfile", //process.env.API_PATH_CHANGE_PROFILE,
    getProfile: "/profile", //process.env.API_PATH_CHANGE_PROFILE,
}

async function postRequest(path, options, config={}) {
    return await axios
        .post(API_CONFIG.baseURL + path, options, config)
}

async function getRequest(path, config={}) {
    return await axios
        .get(API_CONFIG.baseURL + path, config)
}

export const API = {
    changeProfile:function (data) {
        const p = data.phone.replace( /[^\+0-9]/g,'')
        const d = {phone: p.substr(-10), country_code: p.replace(p.substr(-10),'')  }
        return postRequest(
            API_CONFIG.changeProfile,
            {...data, ...d},
            {headers: {Authorization: 'Bearer ' + data.token}})
        },
    getProfile:function (data){
        return getRequest(
            API_CONFIG.getProfile,
            {headers: {Authorization: 'Bearer ' + data.token}})
    }
}