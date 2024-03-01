import {EditAd} from "../../../_components/Ads/Edit";
import {API} from "../../../api/api";
import {notFound} from "next/navigation";


export default async function MyAds({params:{id}}) {

  const ad = await  API.getAd(id)
      .then((r)=>{
        return r.data
      })
      .catch((r)=>{
        return notFound();
      })
  return (
      <EditAd ad={ad.data} update/>
  );
}
