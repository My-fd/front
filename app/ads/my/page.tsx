import {AdsList} from "../../_components/Ads/AdsList";
import {getServerSession} from "next-auth/next";
import {authConfig} from "../../../configs/auth";
import {API} from "../../api/api";

export default async function MyAdsPage() {
  const session: any = await getServerSession<any>(authConfig);
  let err
  const myAds = await API.getMyAds(session?.user)
      .then(({ data }) => {
        return data.data.data;
      })
      .catch((res) => {
          console.log('ошибка загрузки списка объявлений')
          err =  res
      })

  return (
      !err ? <AdsList ads={myAds} session={session}/> : <div>ошибка загрузки списка объявлений</div>
  );
}
