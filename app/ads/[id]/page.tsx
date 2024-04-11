import {API} from "../../api/api";
import {AdPage} from "../../_components/Ads/AdPage";
import { notFound } from 'next/navigation';
import {convertCategories} from "../../../utils/utils";
import {height} from "@mui/system";

export default async function Page({ params: {id} }: { params: { id: number |  string } }) {

    const ad = await  API.getAd(id)
        .then((r)=>{
            return r.data
        })
        .catch((r)=>{
            return notFound();
        })

    const categories = await API.getCategories()
        .then(({ data }) => {
            // return data.data;
            return convertCategories(data.data);
        })
        .catch((res) => {
            // console.log('error res', res)
        })

    // console.log('categories', categories)
    return <AdPage ad={{...ad.data, isAd: true, categories}}/>
}
