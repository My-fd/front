import Link from "next/link";
import * as React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import {Box, Stack} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import {AddCircleRounded} from "@mui/icons-material";
import {Logo} from "../../_elements/logo";
import {FIELDS_NAMES} from "../../_constants/fieldsNames";
import {ROUTES} from "../../../configs/routs";

const menuItems = {
    [FIELDS_NAMES.main]:{
        ...ROUTES[FIELDS_NAMES.main],
        icon: <Logo size={24}/>
    },
    [FIELDS_NAMES.favorites]:{
        ...ROUTES[FIELDS_NAMES.favorites],
        icon: <FavoriteBorderOutlinedIcon color='secondary'/>
    },
    [FIELDS_NAMES.notice]:{
        ...ROUTES[FIELDS_NAMES.notice],
        icon: <NotificationsNoneOutlinedIcon color='secondary'/>
    },
    [FIELDS_NAMES.myAds]:{
        ...ROUTES[FIELDS_NAMES.myAds],
        icon: <AddCircleRounded color='secondary' sx={{fontSize: '30px'}}/>
    },
    [FIELDS_NAMES.messages]:{
        ...ROUTES[FIELDS_NAMES.messages],
        icon: <EmailOutlinedIcon color='secondary'/>
    },
    [FIELDS_NAMES.profile]:{
        ...ROUTES[FIELDS_NAMES.profile],
        icon: <AccountCircleOutlinedIcon color='secondary'/>
    },
    [FIELDS_NAMES.cart]:{
        ...ROUTES[FIELDS_NAMES.cart],
        icon: <ShoppingCartOutlinedIcon color='secondary'/>
    },
}

const NavigationIconButton = ({type, count, label, sx}) => {
    const IconContent =  () => <>
        {menuItems[type].icon}
        {!!label && <Typography color="secondary" paddingLeft={1} variant="subtitle1">
            {menuItems[type].label}
        </Typography>}
    </>
    return <IconButton size="large"  sx={sx?.icon}>
        {count ? <Badge badgeContent={count} color={'secondary'}
                        sx={{'.MuiBadge-badge': {zoom: 0.85}}}>
                <IconContent/>
            </Badge>
            : <IconContent/>}
    </IconButton>
}

export const DesktopNavigationIconButton = (props) => <Link href={menuItems[props.type].path}><NavigationIconButton {...props}/></Link>

export const MobileNavigationIconButton = (props: any) => {
    const {type, name } = props

    return (<Link href={menuItems[props.type].path} style={{textDecoration: 'none'}}><Box sx={{maxHeight: props.maxHeight}}>
        <Stack alignItems={'center'}>
            <NavigationIconButton {...props} sx={{icon: {paddingBottom: 0.5}}}/>
            <Typography color="secondary"  sx={{zoom: {xxs: 0.75, xs: 1}}} variant="caption" display="block" gutterBottom>
                { name || menuItems[type]?.label}
            </Typography>
        </Stack>
    </Box></Link>)

}
