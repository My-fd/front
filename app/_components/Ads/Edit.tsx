"use client";

import _ from "lodash";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"
import {FormContainer, AutocompleteElement, TextFieldElement, CheckboxElement, SliderElement} from 'react-hook-form-mui'
import {Box, Button, Chip, Paper, Stack, Step, StepLabel, Stepper, Typography} from "@mui/material";
import { getFieldsConfig, VALIDATABL_EFIELDS_PROPS } from "../../_constants/validatableFieldsProps";
import {API} from "../../api/api";
import * as React from "react";
import {useSession} from "next-auth/react";
import {ROUTES} from "../../../configs/routs";
import {useRouter} from "next/navigation";
import {AdPhotoUploader} from "../PhotoUploader/AdPhotoUploader";
import {convertFileToBase64} from "../../../utils/utils";


const FORM_FIELDS_NAMES = ['city', 'adName', 'adCategory', 'adSubCategory', 'adDescription', 'adPrice']
const ATTRIBUTES = 'attributes'
const FORM_CONFIG = {..._.merge({},
    getFieldsConfig(FORM_FIELDS_NAMES, {validationRules: {required: true}}),
    getFieldsConfig(['adShipmentSelf','adShipmentCity','adShipmentRu', 'adShipmentSng','adShipmentW']))
}
const fieldsDataConfig:any = {
    ...FORM_CONFIG.fieldsConfig,
}

const fieldsViewProps = {sx: {marginBottom: 2, minHeight: 80}}

const formName:any = 'editAdForm'

const EditAd = ({ad={}, id, update= false}:any) => {
    const { data: sessionData }:any = useSession()
    const  router = useRouter()
    const [categories, setCategories] = useState<any>([]);
    const formContext = useForm<any>({defaultValues: { ...FORM_CONFIG.defaultValues, ...ad, parent_id: ad?.category?.parent_id, category_id:ad?.category?.id}});
    const { handleSubmit, clearErrors, formState: {errors, isValid}, setError, setValue, trigger,getValues, watch, reset} = formContext;
    const watchCategory = watch(FORM_CONFIG.fieldsConfig.adCategory.name);
    const watchSubcategory = watch(FORM_CONFIG.fieldsConfig.adSubCategory.name);
    const [attributes, setAttributes] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [images, setImages] = useState();

    useEffect(()=>{
        // console.log('ad', ad)
        API.getCategories()
            .then(({ data }) => {
                setCategories(data.data)
                return data.response;
            })
            .catch((res) => {
                console.log('error res', res)
        })
    }, []);

    useEffect(()=>{
        const subcategories = categories[watchCategory]?.subcategory
        // console.log('categories', categories)
        setValue(fieldsDataConfig.adSubCategory.name, undefined);
        setSubcategories(subcategories)
        setAttributes([])

    }, [watchCategory, categories])

    useEffect(()=>{
        if (!subcategories || !watchSubcategory) return
        // console.log('subcategories', subcategories)

        setValue(ATTRIBUTES, []);
        const attributes = (subcategories[watchSubcategory] || {})[ATTRIBUTES];
        setAttributes(attributes)
    }, [watchSubcategory, subcategories])

    const validAction = async (data) => {
        const {token} = sessionData?.user
        const attrs = _.transform(data[ATTRIBUTES], (r ,v,k)=> {
            if (v) r[`attributes[${String(k)}]`]= _.find(attributes, {id:k}).options[v]
            return r
        },{})
        const serverData = {..._.pick(data, _.concat(_.values(FORM_CONFIG.serverNames), 'id', 'shipment')),
        ...attrs,
            images: convertImages(images),
            category_id: subcategories[watchSubcategory].id,
            parent_id: subcategories[watchSubcategory].parent_id,
            id: ad.id,
            token}
        console.log('serverData', serverData)
        // return true
        const res = update ? API.updateAd(serverData): API.createAd(serverData);
        res.then(({data}) => {
                const goTo = ROUTES.myAds.path
                // router.push(goTo);
            return data.data;
        })
            .catch((res) => {
                const {response} = res
                let errors = [] ;
                // if (!response) return
                errors = [{name: formName, message: response.data.message}]
                if (response.status == 401) errors = [{name: formName, message: 'Ошибка авторизации. Попробуйте обновить страницу' }]
                if (response.status == 422) errors = _.map(_.toPairs(response.data.errors),(i:Array<any>) => ({name:i[0],  message: _.flatten(i[1]) }))
                errors.map(({ name, message }) => {
                    setError(name, { message })
                })
            })
    };

    const invalidAction = (err, e) => {console.log('invalidAction', errors )}

    const convertImages = (files) => {
        const t = convertFileToBase64(files)

        // @ts-ignore
        t.then( a=> setImages(_.mapKeys(a, (v, k)=> ('images['+k+']'))))// eslint-disable-line no-use-before-define
    }

        /////////////////////////stepper
    const steps = [
        '', '','',''//'Выберете подходящие категории','Опишите лот','Доставка'
    ]

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {

        // console.log('getValues()', getValues('attributes'))

        trigger()
        if(isValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1)
            reset(undefined, { keepDirtyValues: true });
        }
    };

    const handleBack = () => {
        reset(undefined, { keepDirtyValues: true });
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const cardWidth = {width: {xs: '100%', md: 800}}
    const mainBoxStyles = {margin: '0 auto', ...cardWidth};
    const photoBoxStyles = {margin: '24px auto 0', border:'0 solid rgba(120,120,120, 0.2)', padding: 1, borderWidth: '1px 1px 0 1px'};

    return  (<Box sx={mainBoxStyles}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const isActive = _.indexOf(steps,label) == activeStep;
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{isActive ? label : ''}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {!!categories.length && <FormContainer
                formContext={formContext}
                handleSubmit={handleSubmit((data, e) => validAction(data), (err, e) => invalidAction(err, e))}>
                {activeStep == 0 && <Box sx={photoBoxStyles}>
                    <AdPhotoUploader imgs={images} onChange={(imgs) => setImages(imgs)}/>
                </Box>}
                <Paper sx={{padding: 4, ...cardWidth}}>
                    {activeStep == 0 && <>
                        <TextFieldElement {...fieldsDataConfig.adName} {...fieldsViewProps} fullWidth/>
                        <SelectCategory {...{
                            fieldsData: fieldsDataConfig.adCategory,
                            textFieldProps: {valueKey: 'id', labelKey: 'name'},
                            fieldsViewProps, formContext,
                            options: categories,
                            val: getValues(fieldsDataConfig.adCategory.name)
                        }}/>
                        {!!subcategories?.length && <SelectCategory {...{
                            fieldsData: fieldsDataConfig.adSubCategory,
                            textFieldProps: {valueKey: 'id', labelKey: 'name'},
                            fieldsViewProps, formContext,
                            options: subcategories,
                            // onChange: (a,b,c)=>{console.log('a,b,c', a)},
                            val: getValues(fieldsDataConfig.adSubCategory.name)
                        }}/>}</>}
                    {activeStep == 1 && <>
                        {attributes?.map(a => generateField({...a, formContext, getValues}))}
                    </>
                    }
                    {activeStep == 2 && <>
                        <TextFieldElement {...fieldsDataConfig.adDescription} multiline {...fieldsViewProps} fullWidth/>
                        <TextFieldElement {...fieldsDataConfig.adPrice} {...fieldsViewProps}
                                          sx={{lineHeight: 1.1, fontSize: 13}} fullWidth/>
                    </>
                    }

                    {activeStep == 3 && <>
                        <Stack mb={4}>
                            <TextFieldElement {...fieldsDataConfig.city} {...fieldsViewProps} fullWidth/>

                            <CheckboxElement {...fieldsDataConfig.adShipmentSelf}/>
                            <CheckboxElement {...fieldsDataConfig.adShipmentCity}/>
                            <CheckboxElement {...fieldsDataConfig.adShipmentRu}/>
                            <CheckboxElement {...fieldsDataConfig.adShipmentSng}/>
                            <CheckboxElement {...fieldsDataConfig.adShipmentW}/>
                        </Stack>
                        <Box style={{position: 'relative'}}>
                            <Button variant='outlined' sx={{marginBottom: 2}} onClick={() => {
                                clearErrors()
                            }} color={'primary'} size={"large"} fullWidth> отменить </Button>
                            <Button
                                disabled={!!_.keys(errors).length && !isValid}
                                variant='contained' type={'submit'} color={'primary'} size={"large"}
                                fullWidth> сохранить </Button>
                            {process.env.NODE_ENV == 'development' && <Button
                                onClick={() => {
                                    trigger()
                                    reset(undefined, {keepDirtyValues: true});
                                }}
                                variant='contained' color={'primary'} size={"large"}
                                fullWidth> reeval </Button>}
                            <ErrorMessage errors={errors} name={formName} render={({message}) => {
                                return <Typography color={'error'} variant="caption" display="block"
                                                   gutterBottom> {!!_.keys(errors).length && !isValid ? message : ''}</Typography>
                            }}/>

                        </Box>
                    </>}

                </Paper>

            </FormContainer>}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                >
                    Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                {activeStep !== steps.length - 1 && <Button
                    // disabled={ !isValid}
                    onClick={handleNext}>
                    Next
                </Button>}
            </Box></Box>
    )

};

export { EditAd };
// const iconSize = '24';
// const color = '#7862E4';
// const CategoriesIcons = {
//     1: <WigIcon fill={color} height={iconSize} width={iconSize}/>,
//     2: <CostumeIcon fill={color} height={iconSize} width={iconSize}/>,
//     3: <ClothesIcon fill={color} height={iconSize} width={iconSize}/>,
//     4: <CraftIcon fill={color} height={iconSize} width={iconSize}/>,
//     5: <MakeupIcons fill={color} height={iconSize} width={iconSize}/>,
// }

const SelectCategory = (props) => {
    const {fieldsData, fieldsViewProps, textFieldProps, options: opts, val, onChange, formContext,autocompleteProps, ...other} = props
    const {getValues, clearErrors} = formContext;
    const [value, setValue] = React.useState(val);

    useEffect(()=>{
        setValue(val)
    }, [val])

    return <AutocompleteElement
        {...other}
        rules={{required: true}}
        {...fieldsData}   fullWidth
        options={_.keys(opts)}
        textFieldProps = {{
            ...fieldsViewProps,
            // InputProps:{
            //     startAdornment: (
            //         <InputAdornment position="start">
            //             <Box
            //                 component="img"
            //                 sx={{
            //                     height: iconSize,
            //                     width: iconSize,
            //                     // maxHeight: { xs: 233, md: 167 },
            //                     // maxWidth: { xs: 350, md: 250 },
            //                 }}
            //                 alt={options[value]?.name}
            //                 src={options[value]?.image_url}
            //             />
            //         </InputAdornment>
            //     ),
            // },
            inputProps:{value:opts[value]?.name || ''}
            }}
        autocompleteProps={{
            onChange: (a,b,c) => {
                const key = textFieldProps?.valueKey || 'id';
                const val = opts[b] ? opts[b][key] : null;
                setValue( val)
                clearErrors()

                console.log('getValues(),b,c', getValues(),b,opts[b])
                if(onChange) onChange(opts[b])
            },
            renderOption:(a,b) => {
                return (<Stack {...a as any} sx={{alignItems: 'flex-start'}} direction={"row"} spacing={1}>
                    {/*<Box>{false || <div style={{height: iconSize, width: iconSize}}></div>}</Box>*/}
                    <Box>{opts[b]?.name}</Box>
                </Stack>);
            }}}/>
}

function generateField (props){
    const {type, options, name, id, formContext, getValues} = props
    let field
    const FIELD_NAME = ATTRIBUTES + '.' + id
    switch (type){
        case 'checkbox' : {
            // console.log('options', getValues(ATTRIBUTES[FIELD_NAME+'-d']))
            field = <Dioptries {...{options, name, fieldName: FIELD_NAME, getValues}}/>
            break;
        }
        case 'select' :
        case 'list' : {
            // const {options, name, id} = a
            const opts = _.map(options, (i, ind) =>({id: ind, name: i}))
            field=(<div key={id}>
                <SelectCategory {...{
                    fieldsData: {name: FIELD_NAME, label: name},
                    fieldsViewProps, formContext,
                    textFieldProps: { valueKey: 'name', labelKey: 'name' },
                    // onChange: (a) => {console.log('a', a)},
                    val: getValues(FIELD_NAME),
                    options: opts}}/>
            </div>)

            break;
        }
    }
    return field
}

const Dioptries = (props) => {
    const { name, fieldName, options, getValues} = props
    const [checked, setChecked] = useState(false);
    const opts = _.map(options, (o) => +o)
    const marks = _.map(options, (o) => ({value: o, label: o}))
    // console.log('opts', opts)
    return <>
        <CheckboxElement {...{
            name: 'dioptries', label: name, checked,
            onChange: () => {
                setChecked(!checked)
            }
        }}/>
        <SliderElement {...{
            name: fieldName, label: '', type: 'number',
            disabled: !getValues('dioptries'), marks: marks,
            min: _.min(opts), max: _.max(opts), step: 0.5, defaultValue: 0
        }}/>
    </>
}
