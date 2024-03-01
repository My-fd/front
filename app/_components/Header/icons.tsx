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
import {NAVIGATION_FIELDS_NAMES} from "../../_constants/fieldsNames";
import {ROUTES} from "../../../configs/routs";

const menuItems = {
    [NAVIGATION_FIELDS_NAMES.main]:{
        ...ROUTES[NAVIGATION_FIELDS_NAMES.main],
        icon: <Logo size={24}/>
    },
    [NAVIGATION_FIELDS_NAMES.favorites]:{
        ...ROUTES[NAVIGATION_FIELDS_NAMES.favorites],
        icon: <FavoriteBorderOutlinedIcon color='secondary'/>
    },
    [NAVIGATION_FIELDS_NAMES.notice]:{
        ...ROUTES[NAVIGATION_FIELDS_NAMES.notice],
        icon: <NotificationsNoneOutlinedIcon color='secondary'/>
    },
    [NAVIGATION_FIELDS_NAMES.create]:{
        ...ROUTES[NAVIGATION_FIELDS_NAMES.create],
        icon: <AddCircleRounded color='secondary' sx={{fontSize: '30px'}}/>
    },
    [NAVIGATION_FIELDS_NAMES.messages]:{
        ...ROUTES[NAVIGATION_FIELDS_NAMES.messages],
        icon: <EmailOutlinedIcon color='secondary'/>
    },
    [NAVIGATION_FIELDS_NAMES.profile]:{
        ...ROUTES[NAVIGATION_FIELDS_NAMES.profile],
        icon: <AccountCircleOutlinedIcon color='secondary'/>
    },
    [NAVIGATION_FIELDS_NAMES.cart]:{
        ...ROUTES[NAVIGATION_FIELDS_NAMES.cart],
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
