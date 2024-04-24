"use client"
import _ from "lodash";

import {
    Dropzone,
    ExtFile, FileInputButton,
    FileMosaic,
    FileMosaicProps,
} from "@files-ui/react";
import {useEffect, useState} from "react";
import './styles.css'
import Stack from "@mui/material/Stack";
import ImageEditor from "./ImgEditor";
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import {fileListToExtFileArray} from "@files-ui/core";

export  function AdPhotoUploader({onChange=null, imgs=[]}) {
    // @ts-ignore
    const [extFiles, setExtFiles] = useState<ExtFile[]>(fileListToExtFileArray( _.values(imgs)));
    const [currentFileIndex, setCurrentFileIndex] = useState<number | undefined>(0);

    useEffect(()=>{
        setCurrentFileIndex(currentFileIndex || 0)
        if(onChange) onChange(_.map(extFiles, f => f.file))
    }, [extFiles])

    const updateFile = (incommingFile: ExtFile) => {
        const fs : (ExtFile | File)[] = extFiles.map( (f, i) => (i == currentFileIndex ? incommingFile : f.file))
        // @ts-ignore
        const filesList: ExtFile[] = fileListToExtFileArray(fs)
        setExtFiles(filesList)
    };
    const onDelete = (id: FileMosaicProps["id"]) => {
        setExtFiles(extFiles.filter((x) => x.id !== id));
        if(id == extFiles[currentFileIndex]?.id) setCurrentFileIndex(0)
    };

    const handleStart = (filesToUpload: ExtFile[]) => {
        console.log("advanced demo start upload", filesToUpload);
    };
    const handleFinish = (uploadedFiles: ExtFile[]) => {
        console.log("advanced demo finish upload", uploadedFiles);
    };
    const handleAbort = (id: FileMosaicProps["id"]) => {
        setExtFiles(
            extFiles.map((ef) => {
                if (ef.id === id) {
                    return { ...ef, uploadStatus: "aborted" };
                } else return { ...ef };
            })
        );
    };
    const handleCancel = (id: FileMosaicProps["id"]) => {
        setExtFiles(
            extFiles.map((ef) => {
                if (ef.id === id) {
                    return { ...ef, uploadStatus: undefined };
                } else return { ...ef };
            })
        );
    };

    const areaStyles = {height: {xs: '60vw', md: 500}, lineHeight: {xs: '60vw', md: '500px'}, width: '100%', textAlign: 'center'}
    const previewStyles =  {xs: '30vw', sm:'20vw', md: 100}
    // @ts-ignore
    return (
        <Box paddingY={2}>
            {extFiles[currentFileIndex]
                ? <ImageEditor img={extFiles.length && extFiles[currentFileIndex]} areaStyles={areaStyles} updateFile={updateFile}/>
                :<Dropzone {...dropZoneConfig} info
                    // @ts-ignore
                    style={{...areaStyles, border: 'none'}}
                    value={extFiles}
                    onChange={(files) => setExtFiles(_.concat(extFiles, files)) }
                    onUploadStart={handleStart}
                    onUploadFinish={handleFinish}
                >
                    <Stack alignItems={'center'}>
                        <BackupOutlinedIcon sx={{fontSize: 160, opacity: 0.07}} />
                        <div>Нажмите или перетащите изображения в это поле</div>
                    </Stack>
                </Dropzone>
            }
            <Grid container columns={{xs: 3, sm:5}} spacing={2} marginBottom={4}>
                {extFiles.map((file, ind) => (
                    <Grid item xs={1} key={file.id} sx={{width:previewStyles, height:previewStyles, padding: 1}}>
                        <FileMosaic
                            style={{width: '100%', height: '100%'}}
                            {...file}
                            onDelete={onDelete}
                            onClick={() => setCurrentFileIndex(ind)}
                            onAbort={handleAbort}
                            onCancel={handleCancel}
                            resultOnTooltip={false}
                            backgroundBlurImage={false}
                            name={''}
                            valid={file.valid}
                            preview
                        />
                    </Grid>
                ))}
                {!!extFiles.length && dropZoneConfig.maxFiles > extFiles.length
                    && <Grid item xs={1}  sx={{display: 'flex', flexWrap: 'wrap', alignContent: 'space-between', justifyContent: 'space-around', width: previewStyles, height: previewStyles, padding: 3}}>
                        <FileInputButton onChange={(files) => setExtFiles(_.concat(extFiles, files))}
                                         variant="text"
                                         style={{border: '4px dashed rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.1)'}}>
                            <AddCircleOutlineIcon sx={{fontSize: 48}}/>
                        </FileInputButton>
                    </Grid>}
            </Grid>

        </Box>
    );
}


const dropZoneConfig = {
    minHeight:"195px",
    maxFiles:10,
    maxFileSize:2 * 1024 * 1024,
    label:"Нажмите или перетащите изображения в это поле",
    accept:".png,image/*",
    name:'image',
    fakeUpload: true,
    footer:false,
    autoClean: true,
    localization:'RU-ru',
    actionButtons: {position: "after"}

}