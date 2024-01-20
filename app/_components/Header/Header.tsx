"use client";

import {DesktopHeader} from "./DesktopHeader";
import {MobileHeader} from "./MobileHeader";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Box from '@mui/material/Box';
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface IUser  {
    id?: string;
    name?: string;
    nickname?: any;
}

const Header = () => {
    const { data }:any = useSession<any>()
    const [user, setUser] = useState<IUser>();
    const [isClient, setIsClient] = useState(false)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(()=>{
        setUser({...data?.user, name: (data?.user?.nickname || data?.user?.name )})
    }, [data])

    useEffect(() => {
        setIsClient(true)
    }, [])

    return  (<>
        {isClient && <Box sx={{}}>
                <DesktopHeader user={user}/>
            {isMobile && <MobileHeader  user={user}/>}
        </Box>}
    </>)
}

export { Header }
