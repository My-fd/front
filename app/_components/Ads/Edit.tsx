"use client";

import _ from "lodash";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"
import {FormContainer, AutocompleteElement, TextFieldElement, CheckboxElement} from 'react-hook-form-mui'
import {Box, Button, Paper, Stack, Step, StepLabel, Stepper, Typography} from "@mui/material";
import { getFieldsConfig, VALIDATABL_EFIELDS_PROPS } from "../../_constants/validatableFieldsProps";
import {API} from "../../api/api";
import {profilePaperSx} from "../../../styles/styles";
import * as React from "react";
// import {CostumeIcon, MakeupIcons, WigIcon, ClothesIcon, CraftIcon} from "../Icons";
import {useSession} from "next-auth/react";
import {ROUTES} from "../../../configs/routs";
import {NAVIGATION_FIELDS_NAMES} from "../../_constants/fieldsNames";
import {useRouter} from "next/navigation";
import {createAd} from "../../../data/dummies";


const FORM_FIELDS_NAMES = ['city', 'adName', 'adCategory', 'adSubCategory', 'adDescription', 'adPrice']
const ATTRIBUTES = 'attributes'
const FORM_CONFIG = {..._.merge({},
    getFieldsConfig(FORM_FIELDS_NAMES, {validationRules: {required: true}}),
    getFieldsConfig(['adShipment']))
}
const fieldsDataConfig:any = {
    ...FORM_CONFIG.fieldsConfig,
}

const fieldsViewProps = { sx: {marginBottom: 2, minHeight: 80}}

const formName:any = 'editAdForm'

const EditAd = ({ad={}, update= false}:any) => {
    const { data: sessionData }:any = useSession()
    const  router = useRouter()
    const [categories, setCategories] = useState<any>([]);
    const formContext = useForm<any>({defaultValues: { ...FORM_CONFIG.defaultValues, ...ad, category_id:ad?.category?.id}});
    const { handleSubmit, clearErrors, formState: {errors, isValid}, setError, setValue, trigger,getValues, watch} = formContext;
    const watchCategory = watch(FORM_CONFIG.fieldsConfig.adCategory.name);
    const watchSubcategory = watch(FORM_CONFIG.fieldsConfig.adSubCategory.name);
    const [attributes, setAttributes] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    useEffect(()=>{
        API.getCategories()
            .then(({ data }) => {
                let cat = {}
                _.map(data.data, (i)=>{
                    if(!i.parent_id) cat[i.id] = {...(cat[i.id]||{}), ...i}
                    if(!!i.parent_id) cat[i.parent_id].subcategories = _.concat((cat[i.parent_id].subcategories || []), i)
                })
                setCategories(_.values(cat))

                setCategories(cat)
                return data.response;
            })
            .catch((res) => {
                console.log('error res', res)
        })
    }, []);

    useEffect(()=>{
        const subcategories = categories[watchCategory]?.subcategories
        // console.log('categories', categories)
        setValue(fieldsDataConfig.adSubCategory.name, undefined);
        setSubcategories(subcategories)
        setAttributes([])

    }, [watchCategory, categories])

    useEffect(()=>{
        if (!subcategories || !watchSubcategory) return
        setValue(ATTRIBUTES, []);
        const attributes = (subcategories[watchSubcategory] || {})[ATTRIBUTES];
        setAttributes(attributes)
    }, [watchSubcategory, subcategories])

    const validAction = async (data) => {
        const {token} = sessionData?.user
        const attrs = _.transform(data[ATTRIBUTES], (r ,v,k)=> {
            if (v) r.push({'attribute_id': k, 'value': v})
            return r
        },[])
        const serverData = {..._.pick(data, _.concat(_.values(FORM_CONFIG.serverNames), 'id')),
            // [ATTRIBUTES]:attrs,
            token}

        // return true
        const res = update ? API.updateAd(serverData): API.createAd(serverData);
        res.then(({ data }) => {
                const goTo = ROUTES[NAVIGATION_FIELDS_NAMES.myAds].path
                router.push(goTo);
            return data.response;
        })
            .catch((res) => {
                const {response} = res
                let errors = [] ;
                errors = [{name: formName, message: response.data.message}]
                if (response.status == 401) errors = [{name: formName, message: 'Ошибка авторизации. Попробуйте обновить страницу' }]
                if (response.status == 422) errors = _.map(_.toPairs(response.data.errors),(i:Array<any>) => ({name:i[0],  message: _.flatten(i[1]) }))
                errors.map(({ name, message }) => {
                    setError(name, { message })
                })
            })
    };

    const invalidAction = (err, e) => {console.log('invalidAction', errors )}

    /////////////////////////stepper
    const steps = [
        '', '','',''//'Выберете подходящие категории','Опишите лот','Доставка'
    ]

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        trigger()
        if(isValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1)
            clearErrors()
        };
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    return  (<Box sx={{margin: '24px auto', width: {xs: '100%', md: '400px'}}}>
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
            <Paper sx={profilePaperSx}>
                <FormContainer 
                    formContext={formContext} handleSubmit={handleSubmit((data, e) => validAction(data), (err, e) => invalidAction(err, e))}>
                    {activeStep == 0 && <>
                        <TextFieldElement {...fieldsDataConfig.adName} {...fieldsViewProps} fullWidth/>
                        <SelectCategory {...{
                        fieldsData: fieldsDataConfig.adCategory,
                        fieldsViewProps, formContext,
                        options: categories,
                        val: getValues(fieldsDataConfig.adCategory.name)
                    }}/>
                    {!!subcategories?.length && <SelectCategory {...{
                        fieldsData: fieldsDataConfig.adSubCategory,
                        fieldsViewProps, formContext,
                        options: subcategories,
                        // onChange: (a,b,c)=>{console.log('a,b,c', a)},
                        val: getValues(fieldsDataConfig.adSubCategory.name)
                    }}/>}</>}
                    {activeStep == 1 && <>
                        {attributes?.map(a=>{
                            const {options, name, id} = a
                            const opts = _.map(options, (i, ind) =>({id: ind, name: i}))
                            const FIELD_NAME = ATTRIBUTES + '.' + id
                            return <div key={id}>
                                <SelectCategory {...{
                                    fieldsData: {name: FIELD_NAME, label: name},
                                    fieldsViewProps, formContext,
                                    // onChange: () => {;console.log('getValues()',getValues() );clearErrors()},
                                    val: getValues(FIELD_NAME),
                                    options: opts}}/>
                            </div>

                        })}
                    </>
                    }
                    {activeStep == 2 && <>
                        <TextFieldElement {...fieldsDataConfig.adDescription} multiline {...fieldsViewProps} fullWidth />
                        <TextFieldElement {...fieldsDataConfig.adPrice} {...fieldsViewProps} sx={{lineHeight: 1.1, fontSize: 13}} fullWidth />
                    </>
                    }

                    {activeStep == 3 && <>
                        <TextFieldElement {...fieldsDataConfig.city} {...fieldsViewProps} fullWidth/>
                        <CheckboxElement {...fieldsDataConfig.adShipment} />
                        <Box  style={{position: 'relative'}}  >
                            <Button variant='outlined' sx={{marginBottom: 2}} onClick={()=>{
                                clearErrors()
                            }} color={'primary'} size={"large"} fullWidth> отменить </Button>
                            <Button
                                disabled={!!_.keys(errors).length && !isValid}
                                variant='contained' type={'submit'} color={'primary'} size={"large"} fullWidth> сохранить </Button>
                            <ErrorMessage errors={errors} name={formName} render={({ message }) =>{
                                return <Typography  color={'error'}  variant="caption" display="block" gutterBottom> {!!_.keys(errors).length && !isValid ? message : ''}</Typography>}}/>

                        </Box>
                    </>}



                </FormContainer>
        </Paper>
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
    const {fieldsData, fieldsViewProps, options: opts, val, onChange, formContext} = props
    const {getValues} = formContext;
    const [value, setValue] = React.useState(val);

    useEffect(()=>{
        setValue(val)
    }, [val])

    return <AutocompleteElement
        rules={{required: true}}
        {...fieldsData}   fullWidth
        options={_.keys(opts)}
        textFieldProps = {{
            valueKey: 'id',
            labelKey: 'name',
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
                setValue(opts[b]?.id || null)
                // console.log('getValues(),b,c', getValues(),b,opts[b])
                if(onChange) onChange(opts[b])
            },
            renderOption:(a,b) => {
                return (<Stack {...a as any} sx={{alignItems: 'flex-start'}} direction={"row"} spacing={1}>
                    {/*<Box>{false || <div style={{height: iconSize, width: iconSize}}></div>}</Box>*/}
                    <Box>{opts[b]?.name}</Box>
                </Stack>);
            }}}/>
}
