import {API} from "../../api/api";
import {Ad} from "../../_components/Ads/Ad";
import { notFound } from 'next/navigation';

export default async function Page({ params: {id} }: { params: { id: number |  string } }) {

    const ad = await  API.getAd(id)
        .then((r)=>{
            return r.data
        })
        .catch((r)=>{
            return notFound();
        })

    return <Ad ad={{...ad.data, isAd: true}}/>
}
