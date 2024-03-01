"use client";

import {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {API} from "../../api/api";
import {Ad} from "./Ad";

const AdsList = (props) => {
    const [ads, setAds] = useState([]);
    const {isMy} = props
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

    return <Grid container rowSpacing={4} justifyContent={'start'}>
            {!!ads.length && ads.map(ad=>(<Grid item xs={12} md={6} lg={4}>
                <Ad key={ad.id} ad={{...ad,  isMy}}/>
            </Grid>))}
        </Grid>
};

export { AdsList };
