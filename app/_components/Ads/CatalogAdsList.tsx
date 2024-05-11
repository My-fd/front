"use client";

import _ from "lodash";
import * as React from "react";
import { useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import { Button, Divider, Grid, Breadcrumbs, Drawer, Box, ListItem, ListItemIcon, ListItemText, List, Collapse, Chip } from "@mui/material";
import {AdCard} from "./AdCard";
import {StarBorder, ExpandLess, ExpandMore} from "@mui/icons-material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {CheckboxButtonGroup, FormContainer, SliderElement, TextFieldElement} from "react-hook-form-mui";
import {useCategories} from "../../../hooks/CategoriesHook";
import { VALIDATABL_EFIELDS_PROPS} from "../../_constants/validatableFieldsProps";
import Stack from "@mui/material/Stack";
import {useDebounceEffect} from "../../../hooks/useDebounceEffect";

const shipmentOptions = _.map(['adShipmentSelf','adShipmentCity','adShipmentRu', 'adShipmentSng','adShipmentW'], o => VALIDATABL_EFIELDS_PROPS[o].label)
const priceOptions= [0, 1000000]


const CatalogAdsList = (props) => {
    const [open, setOpen] = useState(false);
    const {session, ads} = props
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [categoryId, setCategoryId] = useState(+searchParams.get('category_id'));
    const [subcategoryId, setSubcategoryId] = useState(+searchParams.get('subcategory_id'));
    const {categories, attributes, subcategories, category, subcategory} = useCategories({category:  categoryId, subcategory: subcategoryId})
    const formContext = useForm<any>();
    const { handleSubmit, resetField, watch, getValues, setValue, reset} = formContext;
    const watchAll = watch()
    const [path, setPath] = useState('');

    useDebounceEffect(function(){router.push(pathname + '?' + path)}, 300, [path])

    const validAction = (filters) => {
        setOpen(false)
    }

    const invalidAction = (data, e) => {console.log('invalidAction data', data)}

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        params.forEach((v,key) => {
            if(!_.includes(['category_id', 'subcategory_id'], key))setValue(key, params.getAll(key))
        })
        setCategoryId(+params.get('category_id'))
        setSubcategoryId(+params.get('subcategory_id'))
    }, [])

    useEffect(()=>{
        const params = new URLSearchParams(searchParams)
        _.forEach(getValues(), (v, key) => {
            params.delete(key)

            if(!_.some(attributes, {id: Number(key)}) && !_.includes(['category_id', 'subcategory_id', 'city', 'price', 'shipment'], key)) {
                return
            }
            if ((v && _.compact(v).length ) && !_.isEqual(params.getAll(key), v)) {
                _.isArray(v) ? _.forEach(v, i => params.append(key, i)) : params.append(key, v)
            }
        })

        categoryId ? params.set('category_id', String(categoryId)) : params.delete('category_id')
        subcategoryId ? params.set('subcategory_id', String(subcategoryId)) : params.delete('subcategory_id')
        setPath(params.toString())
    }, [watchAll, categoryId, subcategoryId])
    

    return <>

        <Drawer open={open} onClose={()=>setOpen(!open)}
                PaperProps={{sx: {width: {xs:'100%', sm: 360}, padding: 2}}}>
            <Box role="presentation">
                <List component="nav" aria-labelledby="nested-list-subheader" subheader={
                    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
                <span onClick={()=>{
                    setCategoryId(undefined)
                    setSubcategoryId(undefined)
                }}>Категории</span>
                        {category?.name && <span onClick={()=> setSubcategoryId(undefined)}>{category.name}</span>}
                        {subcategory?.name && <span>{subcategory.name}</span>}
                    </Breadcrumbs>
                }>

                    {categories.map((c) =>
                        <Box key={c.id}>
                            {(!category) && <ListItem disablePadding onClick={() => {
                                setCategoryId(c.id)
                                setSubcategoryId(undefined)
                            }}>
                                <ListItemIcon sx={{minWidth: 0}}>
                                    <StarBorder/>
                                </ListItemIcon>
                                <ListItemText primary={c.name}/>
                            </ListItem>}
                            {c.subcategory.map(s => category?.id == c.id && !subcategory ?
                                <ListItem key={s.id} disablePadding onClick={()=> {
                                    setCategoryId(c.id)
                                    setSubcategoryId(s.id)
                                }}>
                                    <ListItemIcon sx={{minWidth: 0}}>
                                        <StarBorder/>
                                    </ListItemIcon>
                                    <ListItemText primary={s.name}/>
                                </ListItem> : null)}
                        </Box>)}
                    <Divider/>

                        {/*Фильтры*/}
                        <FormContainer formContext={formContext}
                            handleSubmit={handleSubmit((data, e) => validAction(data), (err, e) => invalidAction(err, e))}>

                            <ListItem disablePadding>
                                <ListItemText sx={{pl: 2, mt:4}} primary={'Цена'}/>
                            </ListItem>
                            <Box sx={{width: '100%', paddingTop: 4, paddingRight: 4, paddingLeft: 2}}><SliderElement {...{
                                name: 'price', type: 'number', valueLabelDisplay: 'on',
                                marks: _.map(priceOptions, (o) => ({value: Number(o), label: o})),
                                min: Number(_.min(priceOptions)), max: Number(_.max(priceOptions)), step: 1, defaultValue: priceOptions
                            }}/></Box>

                            <ListItem disablePadding>
                                <ListItemText sx={{pl: 2, pt: 4}} primary={'Город'}/>
                            </ListItem>
                            <TextFieldElement sx={{pl: 2, mb:4}}name={'city'}  size={'small'} fullWidth/>

                            <FilterItem {...{id: 'shipment', options:shipmentOptions, name: 'Доставка', type:'list', formContext}}/>

                            {!!attributes.length && !!categoryId && attributes.map(a => <FilterItem key={a.id} {...{...a, formContext}}/>)}

                            <Box textAlign={"center"} margin={2}>
                                <Button variant='contained' type={'submit'} color={'primary'} > применить </Button>
                            </Box>

                        </FormContainer>


                </List>
            </Box>
        </Drawer>

        <Box sx={{ my: 4 ,  width:'100%', maxWidth: {xs: 400, md: 1500}, marginX: 'auto'}}>
            <Stack spacing={4} justifyContent={'flex-end'}>

                <Button fullWidth variant="contained"  color={'primary'} onClick={() => setOpen(!open)}>
                    <FilterAltOutlinedIcon/> Фильтры
                </Button>
                <Stack direction={'row'}  spacing={1} flexWrap='wrap' useFlexGap>
                    {!category  && <>
                        {_.map(categories, c => <Chip label={c.name} color={'primary'}  size={'small'} variant="outlined" onClick={() => setCategoryId(c.id)} />
                        )}
                    </>}
                    {!subcategory && category?.name && <>
                        <Chip label={category.name} color={'primary'}  size={'small'}  onDelete={()=> setCategoryId(undefined)} />
                        {_.map(subcategories, s => <Chip label={s.name} color={'primary'}  size={'small'} variant="outlined" onClick={() => setSubcategoryId(s.id)} />
                        )}
                    </>}
                    {subcategory?.name && <Chip label={subcategory.name} color={'primary'}  size={'small'}  onDelete={()=> setSubcategoryId(undefined)} />}

                    {_.map(watchAll, (v, k) => {
                            if (!v || !_.compact(v)) return null
                            if (k == 'price') { // @ts-ignore
                                return <Chip label={'Цена'} color={'primary'} size={'small'} onDelete={() => setValue(k)}/>
                            }
                            return _.map(v, fv => <Chip label={fv} color={'primary'} size={'small'}
                                                 onDelete={() => setValue(k, _.without(v, fv))}/>)
                        }
                    )}
                </Stack>
            </Stack>
        </Box>

        <Grid container rowSpacing={4} justifyContent={'start'}>
                {!!ads.length && ads.map(ad=>(<Grid key={ad.id} item xs={12} md={6} lg={4} padding={2}>
                    <AdCard ad={{...ad,  isMy: !!session}}/>
                </Grid>))}
            </Grid>
    </>
};

export { CatalogAdsList };


const FilterItem  = (props) => {
    const {name, ...others} = props
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <ListItem disablePadding onClick={()=>setIsOpen(!isOpen)}>
        <ListItemText sx={{pl: 2}} primary={name}/>
        {isOpen ? <ExpandLess/> : <ExpandMore/>}
    </ListItem>
        <Collapse in={isOpen}  sx={{pl: 4}} timeout="auto" unmountOnExit>
            <GetFilterElementByType {...others}/>
        </Collapse>
    </>
}

const GetFilterElementByType = (props) => {
    const {id, options, formContext, type, onChange, name} = props

    switch (type){
        case 'range':
        case 'checkbox': {
            formContext.setValue(String(id), [Number(_.min(options)),Number(_.max(options))])
            return <Box sx={{width: '100%', paddingTop: 4, paddingRight: 4, paddingLeft: 2}}><SliderElement {...{
                name: String(id), label: '', type: 'number', valueLabelDisplay: 'on',
                marks: _.map(options, (o) => ({value: Number(o), label: o})),
                min: Number(_.min(options)), max: Number(_.max(options)), step: 0.5, defaultValue: 0
            }}/></Box>
        }

        case 'select' :
        case 'list' : {
            return <CheckboxButtonGroup
                name={String(id)}
                options={_.map(options, (o, i) => ({id: o, label: o}))}
            />
        }
    }
}