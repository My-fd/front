"use client";

import * as React from "react";
import {useState} from "react";
import {AdPhotoUploader} from "./PhotoUploader/AdPhotoUploader";
import {AdPageGallery} from "./Gallery/AdPage";
const DevComponent = () => {
    const [images, setImages] = useState([]);

    return <>dev client
        <AdPhotoUploader imgs={images} onChange={(imgs) => setImages(imgs)}/>
        {images.length && <AdPageGallery imgs={images}/>}

    </>
};

export { DevComponent };
