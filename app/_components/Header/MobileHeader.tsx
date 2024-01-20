"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {Stack} from "@mui/material";
import * as React from "react";
import {MobileNavigationIconButton} from "./icons";
import {NAVIGATION_FIELDS_NAMES} from "../../_constants/fieldsNames";

const MobileHeader = ({user}) => {

    return (
        <AppBar position="fixed"  sx={{ top: 'auto', bottom: 0, background: '#fff' }}>
            <Toolbar>
                <Stack direction={'row'} alignItems={'flex-end'} justifyContent={'space-between'} width='100%'>
                    <MobileNavigationIconButton mobile type={NAVIGATION_FIELDS_NAMES.main} />
                    <MobileNavigationIconButton mobile count='200' type={NAVIGATION_FIELDS_NAMES.favorites} />
                    <MobileNavigationIconButton mobile type={NAVIGATION_FIELDS_NAMES.myAds}/>
                    <MobileNavigationIconButton mobile count='10' type={NAVIGATION_FIELDS_NAMES.messages} />
                    <MobileNavigationIconButton mobile type={NAVIGATION_FIELDS_NAMES.profile} name={user?.name}/>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};
export {MobileHeader};