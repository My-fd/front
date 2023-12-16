import Box from "@mui/material/Box";
import Image from "next/image";
import * as React from "react";

export const Logo = ({size}) =>
    <Box sx={{minWidth: size, maxWidth:size, width: size, minHeight: size, maxHeight:size, height: size}}>
        <Image src={'/logo.jpg'} alt={'logo'} width={size} height={size}/>
    </Box >
