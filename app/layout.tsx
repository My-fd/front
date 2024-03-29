'use client';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import {ThemeProvider} from '@mui/material/styles';
import {createTheme} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme/theme';
import React from "react";
import {Header} from "./_components/Header/Header";
import {Providers} from "./_components/Providers";
import Theme from "../styles/theme/theme";
import { FormContainer, PasswordElement, PasswordRepeatElement, TextFieldElement, FormErrorProvider } from 'react-hook-form-mui'
import {VALIDATION_ERRORS_MESSAGES} from "./_constants/validatableFieldsProps";

export  function ThemeRegistry(props) {
    const { options, children } = props;

    const [{ cache, flush }] = React.useState(() => {
        const cache = createCache(options);
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null;
        }
        let styles = '';
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        );
    });

    const onProviderError = (e) => {
        // if(!VALIDATION_ERRORS_MESSAGES[e.type])console.log('e.type', e, e.type)
        return VALIDATION_ERRORS_MESSAGES[e.type] || e.message
    }

    return (
        <Providers>
        <CacheProvider value={cache}>
            <ThemeProvider theme={createTheme(theme)}>
                <FormErrorProvider onError={(e) => onProviderError(e)}>
                <CssBaseline />
                {children}
                </FormErrorProvider>
            </ThemeProvider>
        </CacheProvider>
        </Providers>
    );
}

export default function RootLayout(props) {
    const { children } = props;
    return (
        <html lang="en">
        <body style={{background: '#f5f4f4'}}>
        <ThemeRegistry options={{ key: 'mui' }}>
            <Header/>
            <div style={{maxWidth:Theme.breakpoints?.values.lg, width:'100%',margin: 'auto', paddingBottom: 70, marginTop: 96}}>
                {children}
            </div>
        </ThemeRegistry>
        </body>
        </html>
    );
}