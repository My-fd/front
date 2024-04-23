"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import _ from "lodash";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./styles.scss"
import {convertFileToBase64} from "../../../utils/utils";

const AdPageGallery = ({imgs}) => {
    const [images, setImages] = useState(imgs);

    const convertImages = (files) => {
        const t = convertFileToBase64(files)

        // @ts-ignore
        t.then( a=> setImages(_.map(a, i => ({
                thumbnail: i,
                original: i,
            }))))
    }

    useEffect(()=>{
        console.log('images', images);
    }, [images])

    useEffect(()=>{
        convertImages(imgs)

    }, [imgs])

    return <div>
        <ImageGallery
            items={images}
            // thumbnailPosition={'right'}
            showBullets={true}
            showNav={false}
            showPlayButton={false}/>
    </div>
};

export { AdPageGallery };

