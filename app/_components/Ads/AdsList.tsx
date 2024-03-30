"use client";

import {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import {AdCard} from "./AdCard";

const AdsList = (props) => {
    const [ads, setAds] = useState(props.ads);
    const {session, filters} = props

    useEffect(() => {
        if (!filters) return
        //здесь мы будем запрашивать объявления с учетом фильтров выбраных пользователем и передавать результат в setAds
        setAds([])
    }, [filters]);

    return <Grid container rowSpacing={4} justifyContent={'start'}>
            {!!ads.length && ads.map(ad=>(<Grid key={ad.id} item xs={12} md={6} lg={4}>
                <AdCard ad={{...ad,  isMy: !!session}}/>
            </Grid>))}
        </Grid>
};

export { AdsList };
