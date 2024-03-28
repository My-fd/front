import {AdsList} from "../_components/Ads/AdsList";
import {API} from "../api/api";

export default async function AdsPage() {
  let err
  let adsPage = await API.getAds()
      .then(({ data }) => {
        return data.data.data;
      })
      .catch((res) => {
          console.log('ошибка загрузки списка объявлений')
        err =  res
      })

  return !err ? <AdsList ads={adsPage}/> : <div>ошибка загрузки списка объявлений</div>
}
