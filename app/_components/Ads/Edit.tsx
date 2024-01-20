"use client";

import _ from "lodash";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"
import {FormContainer, AutocompleteElement, TextFieldElement, CheckboxElement} from 'react-hook-form-mui'
import {Box, Button, InputAdornment, Paper, Stack, Typography} from "@mui/material";
import { getFieldsConfig, VALIDATABL_EFIELDS_PROPS } from "../../_constants/validatableFieldsProps";
import {API} from "../../api/api";
import {profilePaperSx} from "../../../styles/styles";
import * as React from "react";
import {CostumeIcon, MakeupIcons, WigIcon, ClothesIcon, CraftIcon} from "../Icons";
import {useSession} from "next-auth/react";
import {ROUTES} from "../../../configs/routs";
import {NAVIGATION_FIELDS_NAMES} from "../../_constants/fieldsNames";
import {useRouter} from "next/navigation";


const FORM_FIELDS_NAMES = ['city', 'adName', 'adCategory', 'adDescription', 'adPrice']
const FORM_CONFIG = {..._.merge({},
    getFieldsConfig(FORM_FIELDS_NAMES, {validationRules: {required: true}}),
    getFieldsConfig(['adShipment']))
}
const fieldsDataConfig:any = {
    ...FORM_CONFIG.fieldsConfig,
}

const fieldsViewProps = { sx: {marginBottom: 2, minHeight: 80}}

const formName:any = 'profileForm'

const EditAd = ({ad={}, update= false}) => {
    const { data: sessionData } = useSession()
    const  router = useRouter()
    const [categories, setCategories] = useState([]);
    const formContext = useForm<{name: string;}>({defaultValues: {...FORM_CONFIG.defaultValues, ...ad, category_id:ad.category.id}});
    const { handleSubmit, clearErrors, formState: {errors, isValid}, setError, setValue, getValues} = formContext;

    useEffect(()=>{
        API.getCategories()
            .then(({ data }) => {
                setCategories(data.data)
                return data.response;
            })
            .catch((res) => {
                console.log('error res', res)
        })
    }, []);

    const validAction = async (data) => {
        const {token} = sessionData?.user
        const serverData = {..._.pick(data, _.concat(_.values(FORM_CONFIG.serverNames), 'id')), token}
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

    const invalidAction = (err, e) => {console.log('invalidAction', err, e )}


    return  (<Paper sx={profilePaperSx}>
                <FormContainer  formContext={formContext} handleSubmit={handleSubmit((data, e) => validAction(data), (err, e) => invalidAction(err, e))}>
                    <TextFieldElement {...fieldsDataConfig.adName} {...fieldsViewProps} fullWidth />
                    <SelectCategory {...{fieldsData:fieldsDataConfig.adCategory, fieldsViewProps, categories, val: getValues(fieldsDataConfig.adCategory.name)}}/>
                    {/*<SelectCategory {...{fieldsData:fieldsDataConfig.adSubCategory, fieldsViewProps, categories, val: getValues(fieldsDataConfig.adSubCategory.name)}}/>*/}
                    <TextFieldElement {...fieldsDataConfig.adDescription} multiline {...fieldsViewProps} fullWidth />
                    <TextFieldElement {...fieldsDataConfig.city} {...fieldsViewProps} fullWidth/>
                    <TextFieldElement {...fieldsDataConfig.adPrice} {...fieldsViewProps} sx={{lineHeight: 1.1, fontSize: 13 }} fullWidth />
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
                </FormContainer>
        </Paper>
    )

};

export { EditAd };
const iconSize = 24;
const CategoriesIcons = {
    1: <WigIcon fill={'#7862E4'} height={iconSize} width={iconSize}/>,
    2: <CostumeIcon fill={'#7862E4'} height={iconSize} width={iconSize}/>,
    3: <ClothesIcon fill={'#7862E4'} height={iconSize} width={iconSize}/>,
    4: <CraftIcon fill={'#7862E4'} height={iconSize} width={iconSize}/>,
    5: <MakeupIcons fill={'#7862E4'} height={iconSize} width={iconSize}/>,
}

const SelectCategory = (props) => {
    const {fieldsData, fieldsViewProps, categories, val} = props
    const [value, setValue] = React.useState(val);
    const c = _.keyBy(categories, 'id')
    return <AutocompleteElement
        rules={{required: true}}
        {...fieldsData}   fullWidth
        options={_.keys(c)}
        textFieldProps = {{
            valueKey: 'id',
            labelKey: 'name',
            ...fieldsViewProps,
            InputProps:{
                startAdornment: (
                    <InputAdornment position="start">
                        {CategoriesIcons[value]}
                    </InputAdornment>
                ),
            },
            inputProps:{value:c[value]?.name || ''}
            }}
        autocompleteProps={{
            onChange: (a,b,c) => {
                setValue(b || null)
            },
            renderOption:(a,b) => {
                return (<Stack {...a} sx={{alignItems: 'flex-start'}} direction={"row"} spacing={1}>
                    <Box>{CategoriesIcons[b] || <div style={{height: iconSize, width: iconSize}}></div>}</Box>
                    <Box>{c[b]?.name}</Box>
                </Stack>);
            }}}/>
}
