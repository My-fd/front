"use client";
import Link from "next/link";
import {signOut} from "next-auth/react";
import {styled, useTheme} from '@mui/material/styles';
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import {ClickAwayListener, Collapse} from "@mui/material";
import Button from '@mui/material/Button';
import {DesktopNavigationIconButton} from "./icons";
import Theme from "../../../styles/theme/theme";
import {Logo} from "../../_elements/logo";
import {ROUTES} from "../../../configs/routs";
import {useEffect, useState} from "react";
import {FIELDS_NAMES} from "../../_constants/fieldsNames";

interface IUser {
    id: string;
    name: string;
    nickname: string;
}

const DesktopHeader = (props) => {
    const [user, setUser] = useState<IUser>();
    const [isLoggedin, setIsLoggedin] = useState<Boolean>(!!user?.id);
    const [isSearching, setIsSearching] = useState<Boolean>(false);
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.up(800));
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(()=>{
        setUser(props.user)
    }, [props])

    useEffect(()=>{
        setIsLoggedin(!!user?.name)
    }, [user])

    return (
            <AppBar position="absolute" sx={{ background: '#fff', flexWrap:'wrap', alignContent: 'space-between'}} >
                <Stack direction={'row'} alignItems={'center'} width={'100%'} justifyContent={"space-around"}>
                <Toolbar  sx={{maxWidth:Theme.breakpoints?.values.lg, width:'100%', padding: 0}} >
                    <Logo size={40}/>
                    <ClickAwayListener onClickAway={() => setIsSearching(false)}>
                        {<Stack width={isSearching && '100%'}>
                            {<Collapse collapsedSize={100} timeout={500} sx={{ minHeight: 40, '.MuiCollapse-wrapperInner': {width: '100%'}, width: '100%!important'}} orientation="horizontal" in={!!isSearching}>
                                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} position={"relative"} height={40}>
                                    {isSearching && < >
                                        <SearchIconWrapper>
                                            <TuneRoundedIcon/>
                                        </SearchIconWrapper>
                                        <StyledInputBase variant="standard" autoFocus={!!isSearching} placeholder="Поиск…" inputProps={{'aria-label': 'поиск'}}/>
                                    </>
                                    }
                                    <SearchIconWrapper onClick={() => !isSearching ? setIsSearching(true) : console.log('search')} style={{right: 0}}>
                                        <SearchIcon/>
                                    </SearchIconWrapper>
                                </Stack>
                            </Collapse>}
                        </Stack>}

                    </ClickAwayListener>
                    {!isMobile && <Box sx={{flexGrow: 1}}/>}
                    {!isMobile && !isSearching && <Stack flexDirection={"row"} alignItems={"center"}>
                        <Favorite/>
                        {isLoggedin && <Notice/>}
                        {isLoggedin && <Messages/>}
                        <Cart/>
                        {isLoggedin && <Link href={ROUTES.myAds.path}><Button size="medium" aria-label={ROUTES.myAds.label} color="secondary"  sx={{minWidth: 127}}>Мои объявления</Button></Link>}
                        {!isLoggedin && <Link href={ROUTES.signin.path} style={{textDecoration: 'none'}}>
                            <Button size={"small"} sx={{minWidth: 215}} aria-label={ROUTES.signin.label} color="secondary">
                            <LoginOutlinedIcon/>
                            <Typography paddingLeft={1} variant="subtitle1">
                                {ROUTES.signin.label}
                            </Typography>
                        </Button></Link>}
                        {isLoggedin && <Link href={ROUTES.profile.path}><Button size="medium" aria-label="Имя" color="secondary">
                            <AccountCircleOutlinedIcon/>
                            {isTablet && <Typography variant="button">{user?.name}</Typography>}
                        </Button></Link>}
                    </Stack>}
                    {!isMobile && <Button variant="contained" size="small" sx={{maxHeight: 36, minWidth: 210}} color={'secondary'}>Разместить
                        объявление</Button>}
                </Toolbar>
                </Stack>
            </AppBar>
    )
}

export { DesktopHeader };

const Favorite = () =>  <DesktopNavigationIconButton {...{ count: 9, type: FIELDS_NAMES.favorites}}/>
const Notice = () =>    <DesktopNavigationIconButton {...{ count: 4, type: FIELDS_NAMES.notice}}/>
const Messages = () =>  <DesktopNavigationIconButton {...{ count: 7, type: FIELDS_NAMES.messages}}/>
const Cart = () =>      <DesktopNavigationIconButton {...{ count: 200, type: FIELDS_NAMES.cart}}/>

const SearchIconWrapper = styled('div')(({ theme }) => ({
    color: theme.palette.secondary.main,
    padding: theme.spacing(0, 2),
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(TextField)(({ theme }) => ({

    color: theme.palette.secondary.main,
    width: '100%',
    '& .MuiInputBase-input': {
        color: theme.palette.secondary.main,
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: '16px',
    },

    '& .MuiInput-underline:before':{
        borderBottomColor: theme.palette.secondary.main+'!important'
    }
}));
