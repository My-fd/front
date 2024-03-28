import {AdsList} from "./_components/Ads/AdsList";
import {API} from "./api/api";
export default async function Home() {
    let err
    let mainPageAds = await API.getAds()
        .then(({ data }) => {
            return data.data.data.slice(0,4);
        })
        .catch((res) => {
            console.log('ошибка загрузки списка объявлений')
            err =  res
        })

    return !err ? <AdsList ads={mainPageAds}/> : <div>ошибка загрузки списка объявлений</div>

}