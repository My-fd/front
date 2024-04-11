"use client";
import _ from "lodash";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {useState} from "react";
import {Grid, Hidden, Paper, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import {ROUTES} from "../../../configs/routs";
import {API} from "../../api/api";
import theme from "../../../styles/theme/theme";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Unstable_Grid2";


interface IAd{
    title:string;
    description: string ;
    price: string | number;
    id: string | number
    isMy: boolean
    isAd: boolean,
    categories: any,
    category: any,
}

interface IProps{
    ad:IAd;
    user?: any;
}

const dummie = {
    "city": "FAKE Москва",
    "title": "FAKE платье дейнерис таргариен голубое",
    "category_id": "13",
    "subcategory_id": "2",
    "description": "FAKE платье длинное голубое хлопок размер 44",
    "price": 'FAKE 123456',
    "id": 15,
    "shipment": {
        "self": 'FAKE',
        "city": 'FAKE',
        "ru": 'FAKE'
    },
    user:{
        nickname: 'FAKE Alexander',
    },
    "attributes": [
        {
            "10": "FAKE Новое"
        },
        {
            "20": "FAKE Профессиональный пошив под заказ"
        },
        {
            "22": "FAKE S"
        },
        {
            "24": "FAKE унисекс"
        }
    ],
    updated_at: 'FAKE 13.04.1956',
    isMy: false
}

const AdPage = (props:IProps) => {
    // eslint-disable-next-line no-use-before-define
    const { isMy, city, title,description, price,updated_at, shipment, id, attributes , categories, category, subcategory_id, user:{nickname}} = _.merge({}, {...dummie}, {...props.ad});
    // const {title, description, price, id, isMy, isAd=false} = props.ad;
    const { data: sessionData }:any = useSession<any>()
    const [deleted, setDeleted] = useState(false);
    const removeAd = () =>{
        const res = API.deleteAd({id, token: sessionData?.user?.token})
        res.then((data)=>{
            setDeleted(data.status == 200)
        })
    }

    const baseSize = '100%';
    const photoSize = {xs: '100vw', md: baseSize }
    const categoryIconSize = 50,
        categoryIconStyles = {position:'absolute', bottom: -categoryIconSize/2, left: categoryIconSize/2, background:'#fff',
            borderRadius: categoryIconSize, border: `2px solid ${theme.palette.primary['main']}`,width: categoryIconSize, height:categoryIconSize, padding: '5px'}

    return (!deleted ? <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
            <Paper sx={{width:'100%', maxWidth:{xs: 600, lg: 'unset'}, marginX: 'auto'}}>
                <Box sx={{maxWidth: baseSize, maxHeight: baseSize, width:photoSize, height:photoSize, position:'relative', background: '#ddd', marginX:'auto'}}>
                    photo
                    <Box sx={categoryIconStyles} >
                        <BrushOutlinedIcon sx={{fontSize: 35, width: 35, height: 35}} color={'primary'}/>
                    </Box>
                </Box>
                <Box padding={4} height={2000}>
                    <Box sx={{ minHeight: 0, mb: 0}}>
                        <Typography variant="h4" sx={{color:'#222', fontWeight: 800}} display="block" gutterBottom>
                            {price} р.
                        </Typography>
                        <Box marginBottom={2}>
                            <Typography variant="button" gutterBottom sx={{color:'#222', fontWeight: 800, pb: 6}}>
                                {title}
                            </Typography>
                        </Box>
                        <Hidden lgUp>
                            <Contacts nickname={nickname}/>
                        </Hidden>
                        <Stack direction={"row"} justifyContent={"start"} alignItems={"center"}>
                            {/*<Typography variant={"adPageChapter"}>Адрес</Typography>*/}
                            <LocationOnOutlinedIcon color={'primary'}/>
                            <Typography variant={"subtitle1"}> {city} </Typography>
                        </Stack>
                        <Hidden lgUp>
                            <AccordionEl title={'Доставка'}>вления
                                <Shipment shipment={shipment}/>
                            </AccordionEl>
                        </Hidden>
                        <AccordionEl title={'Характеристики'}>
                            <Attributes attributes={attributes} categories={category['attributes']}/>
                        </AccordionEl>
                        <AccordionEl title={'Описание'}>
                            <Typography variant="body1" gutterBottom sx={{mb:2}}>
                                {description}
                            </Typography>
                        </AccordionEl>
                    </Box>

                    <Stack direction={"row"} justifyContent={"start"} alignItems={"center"}>
                        <CalendarMonthOutlinedIcon fontSize={'small'} color={'disabled'}/>
                        <Typography variant={"overline"} fontSize={14} color={'#888'}>{updated_at}</Typography>
                    </Stack>
                    <Typography variant={"overline"} fontSize={14} color={'#888'}>Кстати здесь мы указываем дату последнего редактирования или дату создания?</Typography>


                    {isMy && <>
                        <Link href={ROUTES.myAds.path  + '/' + id + '/edit'} >
                            <EditIcon/>
                        </Link>
                        <DeleteOutlineOutlinedIcon onClick={()=>removeAd()}/>
                    </>}
                </Box>
            </Paper>
        </Grid>
        <Grid  item xs={0} lg={4}>
            <Hidden lgDown>
                {/*<Box sx={{width:'100%',marginX: 'auto'}}></Box>*/}
                <Paper sx={{width:'100%', marginX: 'auto', padding: 4, position: 'sticky', top: 16}} >
                    <Shipment shipment={shipment}/>
                    <Contacts nickname={nickname}/>
                </Paper>
            </Hidden>
        </Grid>
    </Grid>: null)
};

export { AdPage };

const Attributes = ({attributes, categories}) => {
    const cat = _.keyBy(categories, 'id')
    const attr =  _.transform(attributes, (r, v, k) => {
        _.forEach(v, (vv, vk) => {
            r[k] = ({ name:  cat[vk]?.name, v:vv, id: vk})
        })
        return r
    }, [])

    return <>
        {attr.map((a, i) => {
            const {name, v, id} = a
            return <Stack key={id} direction={"row"} alignItems={"start"} marginBottom={1}>
                <Typography variant={"subtitle1"} sx={{minWidth: '12em'}} color={'#888'}>{name}</Typography>
                <Typography variant={"subtitle1"}>{v}</Typography>
            </Stack>
        })}
    </>
}

const Contacts = ({nickname}) => (<Box>
        <Typography variant="h6" gutterBottom sx={{color:'#222', fontWeight: 800}}>
            {nickname}
        </Typography>

        <Stack direction={"row"} justifyContent={"start"} alignItems={"center"} spacing={2} mb={4}>
            <Button variant="outlined" fullWidth >Написать</Button>
            <Button variant="outlined" fullWidth >Позвонить</Button>
        </Stack>
    </Box>
)

const Shipment = ({shipment}) => {
    const { self, city, ru, sng, w} = shipment
    return <>
        {self   && <Typography variant={"subtitle1"}>{self} Самовывоз</Typography>}
        {city   && <Typography variant={"subtitle1"}>{city} Доставка по городу</Typography>}
        {ru     && <Typography variant={"subtitle1"}>{ru  } Доставка по России</Typography>}
        {sng    && <Typography variant={"subtitle1"}>{sng } Доставка в страны СНГ</Typography>}
        {w      && <Typography variant={"subtitle1"}>{w   } Доставка по всему миру</Typography>}
    </>
}

const AccordionEl = (props) => {
    const {id, title, children} = props
    return <Accordion defaultExpanded>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id={id}
        >
            <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            {children}
        </AccordionDetails>
    </Accordion>
}


const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    // border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row-reverse',
    padding: '24px 0 0',
    minHeight: theme.spacing(4),
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(-90deg)',
    },
    '& .MuiAccordionSummary-content': {
        margin: 0,
        marginLeft: theme.spacing(1)
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    // borderBottom: '1px solid rgba(0, 0, 0, .125)',
    // '& .MuiAccordionDetails': {
    padding: '0 0 0 32px'
    // }
}));