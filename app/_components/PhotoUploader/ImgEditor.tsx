import React, {useState, useRef, useEffect} from 'react'

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from '../../../hooks/useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'
import {Box, Slider, Badge, Stack, SliderThumb} from "@mui/material";
import Rotate90DegreesCcwOutlinedIcon from '@mui/icons-material/Rotate90DegreesCcwOutlined';
import Rotate90DegreesCwOutlinedIcon from '@mui/icons-material/Rotate90DegreesCwOutlined';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import CropOutlinedIcon from '@mui/icons-material/CropOutlined';
import IconButton from "@mui/material/IconButton";

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 100,
                height: 100,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function ImageEditor(props) {
    const [imgSrc, setImgSrc] = useState('')
    const [imageFile, setImageFile] = useState(props?.img);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const blobUrlRef = useRef('')
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale, setScale] = useState<number>(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(1)

    useEffect(() => {
        setCrop(undefined) // Makes crop preview update between images.
        const reader = new FileReader()
        reader.addEventListener('load', () =>
            setImgSrc(reader.result?.toString() || ''),
        )
        reader.readAsDataURL(props?.img?.file)
    }, [imageFile, props?.img])

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    async function onCropClick() {
        const image = imgRef.current
        const previewCanvas = previewCanvasRef.current
        if (!image || !previewCanvas || !completedCrop) {
            throw new Error('Crop canvas does not exist')
        }

        setScale(1)
        setRotate(0)

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        const offscreen = new OffscreenCanvas(
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
        )
        const ctx = offscreen.getContext('2d')
        if (!ctx) {
            throw new Error('No 2d context')
        }

        ctx.drawImage( previewCanvas, 0, 0, previewCanvas.width, previewCanvas.height, 0, 0, offscreen.width, offscreen.height)
        const blob = await offscreen.convertToBlob({type: 'image/png'})

        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current)
        }
        blobUrlRef.current = URL.createObjectURL(blob)

        if(blobUrlRef?.current) setImgSrc( blobUrlRef.current)
        const file = new File([blob], imageFile.file.name, {type: 'image/png'})
        props.updateFile(file)

    }

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop, scale, rotate],
    )

    // @ts-ignore
    return (
        <div className="App">
            {!!imgSrc && (
                <Box sx={props.areaStyles}>
                    <ReactCrop onChange={(_, percentCrop) => setCrop(percentCrop)}
                               onComplete={(c) => setCompletedCrop(c)}
                               crop={crop} minWidth={160} maxWidth={1600} minHeight={90} maxHeight={900}>
                        <img ref={imgRef} alt="Crop me" src={imgSrc} style={{transform: `scale(${scale}) rotate(${rotate}deg)`}} onLoad={onImageLoad}/>
                    </ReactCrop>
                </Box>
            )}
            <Stack direction={'row'} justifyContent={"space-evenly"} spacing={2} marginY={2} alignItems={'center'}>
                <IconButton color="primary" aria-label="crop image" onClick={onCropClick}>
                    <CropOutlinedIcon />
                </IconButton>
                <Stack minWidth={'150px'} direction={'row'} spacing={1}>
                    <Rotate90DegreesCcwOutlinedIcon fontSize={'small'} onClick={() => setRotate(rotate - 90)}/>
                    <Slider size={'small'} defaultValue={0} step={10} value={rotate} min={-180} max={180}
                            valueLabelDisplay='auto'
                            onChange={(e, v) => setRotate(Math.min(180, Math.max(-180, Number(v))))}
                            slots={{thumb: (props) => ValueLabelComponent({...props, value: (rotate.toString())})}}                                    />
                    <Rotate90DegreesCwOutlinedIcon fontSize={'small'} onClick={() => setRotate(rotate + 90)}/>
                </Stack>
                <Stack minWidth={'150px'} direction={'row'} spacing={1}>
                    <ZoomOutOutlinedIcon onClick={() => {
                        //@ts-ignore
                        setScale((scale - 0.1).toFixed(1))
                    }}/>
                    <Slider size={'small'} defaultValue={1} value={scale} step={0.1} min={0.5} max={4}
                            valueLabelDisplay='auto'
                            onChange={(e, v) => setScale(Number(v))}
                            slots={{thumb: (props) => ValueLabelComponent({...props, value: scale.toString()})}}
                    />
                    <ZoomInOutlinedIcon onClick={() => {
                        //@ts-ignore
                        setScale((+scale + 0.1).toFixed(1))
                    }}/>
                </Stack>
            </Stack>
            {!!completedCrop && (
                <div style={{display: 'none'}}>
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            border: '1px solid black',
                            objectFit: 'contain',
                            width: completedCrop.width,
                            height: completedCrop.height,
                        }}
                    />
                </div>
            )}
        </div>
    )
}

const ValueLabelComponent = (props) => {
    return <SliderThumb {...props}>
        {props.children}
        <Badge badgeContent={props.value} color="primary" max={360}/></SliderThumb>
}
