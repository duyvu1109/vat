import React from 'react';
import { Image } from 'antd';
import { useState, useEffect } from 'react';
import logoBK from '~/assets/images/logo_BK.png';

function ImageDashboard(props) {
    const [src, setSrc] = useState(logoBK);
    const [attribute, setAttribute] = useState(props.attribute);
    useEffect(() => {
        if (props.attribute) {
            if (props.attribute.image_data === '') {
                setSrc(logoBK);
            } else {
                setSrc(props.attribute.image_data);
            }
            setAttribute(props.attribute);
        }
    }, [props.attribute]);
    return (
        <div>
            <Image variant="top" src={src} style={{ width: props.w * 100, height: props.h * 58 }} />
        </div>
    );
}

export default ImageDashboard;
