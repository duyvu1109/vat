import React from 'react';
import { Image } from 'antd';
import classNames from 'classnames/bind';
import styles from './Card.module.scss';
const cx = classNames.bind(styles);
function QRcodeCard() {
    return (
        <>
            <Image variant="top" className={cx('size-qrcode')} />
        </>
    );
}

export default QRcodeCard;
