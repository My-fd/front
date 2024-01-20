"use client";

import {Paper, Typography} from "@mui/material";
import {profilePaperSx} from "../../../styles/styles";
import {ROUTES} from "../../../configs/routs";
import EditIcon from '@mui/icons-material/Edit';
import Link from "next/link";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {API} from "../../api/api";
import {useSession} from "next-auth/react";
import {useState} from "react";

const Ad = ({ad={}}) => {
    const {title, description, price, id} = ad
    const { data: sessionData } = useSession()
    const [deleted, setDeleted] = useState(false);

    const removeAd = () =>{
        const res = API.deleteAd({id, token: sessionData?.user?.token})
        res.then((data)=>{
            setDeleted(data.status == 200)
        })
    }

    return (!deleted ? <Paper sx={{...profilePaperSx}}>
        <Typography variant="h4" gutterBottom>
            <Link href={ROUTES.myAds.path  + '/' + ad.id}>{title}</Link>
            <Link href={ROUTES.myAds.path  + '/' + id + '/edit'} >
                <EditIcon/>
            </Link>
            <DeleteOutlineOutlinedIcon onClick={()=>removeAd()}/>
        </Typography>
        <Typography variant="body1" gutterBottom>
            {description}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
            {price} руб.
        </Typography>

    </Paper>: null)
};

export { Ad };
