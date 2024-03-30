import {API} from "../../../api/api";
import {AdCard} from "../../../_components/Ads/AdCard";
import { notFound } from 'next/navigation';

export default async function Page({ params: {id} }: { params: { id: number |  string } }) {

    const ad = await  API.getAd(id)
        .then((r)=>{
            return r.data
        })
        .catch((r)=>{
            return notFound();
        })

    return <AdCard ad={{...ad.data, isAd: true, isMy: true}}/>
}
