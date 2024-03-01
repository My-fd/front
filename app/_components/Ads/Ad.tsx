"use client";

import {Paper, Typography} from "@mui/material";
import {cardWidth} from "../../../styles/styles";
import {ROUTES} from "../../../configs/routs";
import EditIcon from '@mui/icons-material/Edit';
import Link from "next/link";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {API} from "../../api/api";
import {useSession} from "next-auth/react";
import {useState} from "react";
import Box from "@mui/material/Box";
import theme from "../../../styles/theme/theme";
import {NextLink} from "../Link";
import Stack from "@mui/material/Stack";
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';

interface IAd{
    title:string;
    description: string ;
    price: string | number;
    id: string | number
    isMy: boolean
    isAd: boolean
}

interface IProps{
    ad:IAd;
}

const Ad = (props:IProps) => {
    const {title, description, price, id, isMy, isAd=false} = props.ad;
    // const { data: sessionData } = useSession()
    const { data: sessionData }:any = useSession<any>()
    const [deleted, setDeleted] = useState(false);

    const removeAd = () =>{
        const res = API.deleteAd({id, token: sessionData?.user?.token})
        res.then((data)=>{
            setDeleted(data.status == 200)
        })
    }

    const baseSize = 300;
    const photoSize = {xs: '100vw', md: baseSize }
    const categoryIconSize = 50,
        categoryIconStyles = {position:'absolute', bottom: -categoryIconSize/2, left: categoryIconSize/2, background:'#fff',
            borderRadius: categoryIconSize, border: `2px solid ${theme.palette.primary['main']}`,width: categoryIconSize, height:categoryIconSize, padding: '5px'}

    return (!deleted ? <Paper sx={{width:cardWidth, maxWidth: baseSize, marginX: 'auto'}}>
        <Box sx={{maxWidth: baseSize, maxHeight: baseSize, width:photoSize, height:photoSize, position:'relative', background: '#ddd', marginX:'auto'}}>
            photo
            <Box sx={categoryIconStyles} >
                <BrushOutlinedIcon sx={{fontSize: 35, width: 35, height: 35}} color={'primary'}/>
            </Box>
        </Box>
        <Box padding={4}>
            <Box sx={{ minHeight: !isAd ? 100 : 0, mb: !isAd ? 0 : 2}}>
            <NextLink href={(isMy ? ROUTES.myAds.path : ROUTES.ads.path)  + '/' + id}>
                <Typography variant="button" gutterBottom sx={{color:'#222', fontWeight: 800, pb: 6}}>
                    {title}
                </Typography>
            </NextLink>
            </Box>
            {isAd && <Typography variant="body1" gutterBottom sx={{mb:2}}>
                {description}
            </Typography>}
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant="h6" sx={{color:'#222', fontWeight: 800}} display="block" gutterBottom>
                    {price} р.
                </Typography>
                <Box>
                    <Typography variant={"subtitle1"}>Москва</Typography>
                    <Typography variant={"caption"} color={'#888'}>12.12.2012</Typography>
                </Box>
            </Stack>

        {isMy && <>
            <Link href={(isMy ? ROUTES.myAds.path : ROUTES.ads.path)  + '/' + id + '/edit'} >
                <EditIcon/>
            </Link>
            <DeleteOutlineOutlinedIcon onClick={()=>removeAd()}/>
        </>}

        </Box>


    </Paper>: null)
};

export { Ad };
