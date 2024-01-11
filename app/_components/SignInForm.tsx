"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {ROUTES} from "../../configs/routs";
import {FIELDS_NAMES} from "../_constants/fieldsNames";
import {useForm} from "react-hook-form";
import { FormContainer, PasswordElement, PasswordRepeatElement, TextFieldElement } from 'react-hook-form-mui'
import {Box, Button, Divider, Paper, Stack, Tab, Tabs, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import { VALIDATABL_EFIELDS_PROPS, VALIDATION_RULES } from "../_constants/validatableFieldsProps";
import _ from "lodash";
import { ErrorMessage } from "@hookform/error-message"

const SIGN_IN = 'SignIn',
    SIGN_UP = 'SignUp'


const SignInForm = () => {
  const  router = useRouter()
  const searchParams = useSearchParams()
  const formContext = useForm<{name: string;}>();
  const { handleSubmit, clearErrors, reset, setError} = formContext;
  const [tab, setTab] = useState('');

  useEffect(()=>{
      setTab(SIGN_IN)
  }, [])

  const validAction = async (data) => {

    const {email} = data
    const opt = { ...data, login: email,  redirect: false}

    let res
    switch (tab){
      case SIGN_IN: res = await signIn("signIn", opt); break;
      case SIGN_UP: res = await signIn("signUp", opt); break;
    }

    if (res && !res.error) {
      const goTo  = searchParams.get('callbackUrl') || ROUTES[FIELDS_NAMES.profile].path
      router.push(goTo);
    } else {
      setError('root.serverError', {
        message: res.error
      }, )
    }
  };

 const invalidAction = (err, e) => {console.log('invalidAction', err, e )}

  return  (<Paper sx={{margin: '48px auto', width: '100%', maxWidth: '400px'}}>
        {!!tab && <div>
          <FormContainer FormProps={{onChange: () => clearErrors()}} formContext={formContext} handleSubmit={handleSubmit((data, e) => validAction(data), (err, e) => invalidAction(err, e))}>
            <Tabs aria-label="basic tabs example" variant="fullWidth" value={tab}
                  onChange={(e, v) => {reset({});setTab(v); }}>
              <Tab label="Вход" value={SIGN_IN}/>
              <Tab label="Регистрация" value={SIGN_UP}/>
            </Tabs>
            <Divider/>
            <CustomTabPanel value={tab} index={SIGN_IN}>
              <SignIn formContext={formContext}/>
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={SIGN_UP}>
              <SignUp formContext={formContext}/>
            </CustomTabPanel>
          </FormContainer></div>}
      </Paper>
)

};

export { SignInForm };

const fieldsDataProps:any = {
  nickname: {...VALIDATABL_EFIELDS_PROPS.nickname , validation: VALIDATION_RULES.nickname},
  email: {...VALIDATABL_EFIELDS_PROPS.email, validation: VALIDATION_RULES.email},
  pass: {...VALIDATABL_EFIELDS_PROPS.pass, required: true},
  passR: {...VALIDATABL_EFIELDS_PROPS.passR, required: true},
}

const fieldsViewProps = { sx: {marginBottom: 3}}

const SignIn = ({formContext}) => {
  const {formState: {errors, isValid}} = formContext

  return <div>
    <TextFieldElement {...fieldsDataProps.email} {...fieldsViewProps} fullWidth />
    <PasswordElement {...fieldsDataProps.pass} {...fieldsViewProps} fullWidth />
    <Box  style={{position: 'relative'}}  >
      <ErrorMessage errors={errors} name="root.serverError" render={({ message }) =>
          <Typography sx={{position: 'absolute', top: '-24px'}} color={'error'}  variant="caption" display="block" gutterBottom> {!!_.keys(errors).length && !isValid ? message : ''}</Typography>}/>
      <Button disabled={!!_.keys(errors).length && !isValid} variant='contained' type={'submit'} color={'primary'} size={"large"} fullWidth> войти </Button>
    </Box>
    </div>
}

const SignUp = ({formContext}) => {
  const {formState: {errors, isValid}} = formContext

  return <div>
    <TextFieldElement {...fieldsDataProps.nickname} {...fieldsViewProps} fullWidth />
    <TextFieldElement {...fieldsDataProps.email} {...fieldsViewProps} fullWidth />
    <PasswordElement {...fieldsDataProps.pass} {...fieldsViewProps} fullWidth />
    <PasswordRepeatElement {...fieldsDataProps.passR} passwordFieldName={fieldsDataProps.pass.name} {...fieldsViewProps} fullWidth />
    <Box  style={{position: 'relative'}}  >
      <ErrorMessage errors={errors} name="root.serverError" render={({ message }) =>
          <Typography sx={{position: 'absolute', top: '-24px'}} color={'error'}  variant="caption" display="block" gutterBottom> {!!_.keys(errors).length && !isValid ? message : ''}</Typography>}/>
      <Button disabled={!!_.keys(errors).length && !isValid} variant='contained' type={'submit'} color={'primary'} size={"large"} fullWidth> зарегистрироваться </Button>
    </Box>
  </div>
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box sx={{ p: 3 }}>
              <Typography>{children}</Typography>
            </Box>
        )}
      </div>
  );
}
