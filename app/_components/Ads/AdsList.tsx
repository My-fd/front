"use client";

import {useEffect, useState} from "react";
import {Stack} from "@mui/material";
import {API} from "../../api/api";
import {Ad} from "./Ad";

const AdsList = () => {
    const [ads, setAds] = useState([]);

    useEffect(()=>{
        API.getAds()
            .then(({ data }) => {
                setAds(data.data.data);
                return data.response;
            })
            .catch((res) => {
                console.log('ошибка загрузки списка объявлений')
            })
    }, []);

    return  <Stack spacing={2} alignItems={"center"}>
        {!!ads.length && ads.map(ad=>( <Ad key={ad.id} ad={ad}/>))}
            </Stack>
};

export { AdsList };
