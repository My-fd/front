import {CatalogAdsList} from "../_components/Ads/CatalogAdsList";
import {API} from "../api/api";
import {Suspense} from "react";

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

    return !err ? <Suspense><CatalogAdsList ads={adsPage}/></Suspense> : <div>ошибка загрузки списка объявлений</div>
}
