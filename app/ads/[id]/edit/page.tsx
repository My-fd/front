import {EditAd} from "../../../_components/Ads/Edit";
import {API} from "../../../api/api";
import {notFound} from "next/navigation";


export default async function MyAds({params:{id}}) {

  // const ad = await
  return (
      <EditAd id={id} update/>
  );
}
