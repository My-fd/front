"use client";

import _ from "lodash";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import {Box, Button, Hidden, Paper, Stack, Typography} from "@mui/material";
import { VALIDATABL_EFIELDS_PROPS, VALIDATION_RULES } from "../../_constants/validatableFieldsProps";
import {Logout} from "../Logout";
import {API} from "../../api/api";
import {profilePaperSx} from "../../../styles/styles";


const fieldsDataProps:any = {
    name: {...VALIDATABL_EFIELDS_PROPS.name , validation: VALIDATION_RULES.name},
    surname: {...VALIDATABL_EFIELDS_PROPS.surname , validation: VALIDATION_RULES.surname},
    patronymic: {...VALIDATABL_EFIELDS_PROPS.patronymic , validation: VALIDATION_RULES.patronymic},
    about: {...VALIDATABL_EFIELDS_PROPS.about , validation: VALIDATION_RULES.about},
    email: {...VALIDATABL_EFIELDS_PROPS.email, validation: VALIDATION_RULES.email},
    phone: {...VALIDATABL_EFIELDS_PROPS.phone, validation: VALIDATION_RULES.phone},
    city: {...VALIDATABL_EFIELDS_PROPS.city, validation: VALIDATION_RULES.city},
}

const fieldsViewProps = { sx: {marginBottom: 2}}

const formName:any = 'profileForm'

const Profile = (props) => {
    const {session} = props;
    const formContext = useForm<{name: string;}>();
    const { handleSubmit, clearErrors, formState: {errors, isValid}, setError, setValue} = formContext;
    const [editProfile, setEditProfile] = useState(false);
    const [user, setUser] = useState<any>({});

    useEffect(()=>{
        setUser(session?.user)
        API.getProfile(session?.user)
            .then(({ data }) => {
                setUser({...session?.user, ...data.data});
                return data.response;
            })
            .catch((res) => {
            if (res.response.status == 401) console.log('redirect')
        })
    }, [session?.user]);

    useEffect(()=>{
        if(editProfile)
            _.forIn(user, function(v:any,k:any){
                setValue(k, v)
            })
        const name: any = 'phone', value:any = user.country_code + user.phone;


        setValue(name, value )


    }, [editProfile])

    const validAction = async (data) => {
        const res = API.changeProfile(data);
        res.then(({ data }) => {
                setUser(data.data);
                setEditProfile(false)
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
    const {name, surname, patronymic, about, email, phone, country_code, city, nickname} = user;
    return  (<Paper sx={profilePaperSx}>
            {!editProfile && <Stack spacing={2}>
                <Box alignSelf={'center'} width={200} height={200} sx={{background: '#f2f2f2'}}>ava</Box>
                <Typography variant={'h5'} alignSelf={'center'} style={{marginBottom: 8}}>{nickname}</Typography>

                {(name || surname || patronymic) && <Box>ФИО: {name} {patronymic} {surname} </Box>}
                {country_code && phone && <Box>Телефон: {country_code}{phone}</Box>}
                {email && <Box>email: {email}</Box>}
                {about && <Box>О себе: {about}</Box>}
                {city && <Box>Город: {city}</Box>}
                <Stack spacing={2} style={{marginTop: 32}} >
                    <Button onClick={()=>setEditProfile(true)} variant='contained' type={'submit'}
                            color={'primary'} size={"large"} fullWidth> редактировать </Button>
                    <Hidden smDown ><Logout/></Hidden>
                </Stack>
            </Stack>}
            {editProfile &&
                <FormContainer  formContext={formContext} handleSubmit={handleSubmit((data, e) => validAction(data), (err, e) => invalidAction(err, e))}>
                    <TextFieldElement {...fieldsDataProps.name} {...fieldsViewProps} fullWidth />
                    <TextFieldElement {...fieldsDataProps.patronymic} {...fieldsViewProps} fullWidth />
                    <TextFieldElement {...fieldsDataProps.surname} {...fieldsViewProps} fullWidth />
                    <TextFieldElement {...fieldsDataProps.about} multiline {...fieldsViewProps} fullWidth />
                    <TextFieldElement {...fieldsDataProps.email} {...fieldsViewProps} fullWidth />
                    <TextFieldElement {...fieldsDataProps.phone} {...fieldsViewProps} fullWidth onChange={ (name:any='phone') => clearErrors(name)}/>
                    <TextFieldElement {...fieldsDataProps.city} {...fieldsViewProps} fullWidth/>
                    <Box  style={{position: 'relative'}}  >
                        <Button variant='outlined' sx={{marginBottom: 2}} onClick={()=>{
                            setEditProfile(false)
                            clearErrors()
                        }} color={'primary'} size={"large"} fullWidth> отменить </Button>

                        <Button
                            disabled={!!_.keys(errors).length && !isValid}
                            variant='contained' type={'submit'} color={'primary'} size={"large"} fullWidth> сохранить </Button>
                        <ErrorMessage errors={errors} name={formName} render={({ message }) =>{
                            return <Typography  color={'error'}  variant="caption" display="block" gutterBottom> {!!_.keys(errors).length && !isValid ? message : ''}</Typography>}}/>
                    </Box>
                </FormContainer>}
        </Paper>
    )

};

export { Profile };
