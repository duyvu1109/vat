import React, { useState, useEffect, useRef } from 'react';
import Switch from 'react-switch';

export default function SwitchControl(props) {
    // Default attribute for button control
    const [attribute, setAttribute] = useState(props.attribute);
    useEffect(() => {
        if (props.attribute) {
            setAttribute(props.attribute);
        }
    }, [props.attribute]);

    const [checked, setChecked] = useState(false);
    const user = localStorage.getItem('current_user');
    let topicPub = user ? `/bkiot/${JSON.parse(user).username}/` : `/bkiot/${props.user}/`;
    const handleChange = (nextChecked) => {
        if (checked) {
            let payload = '{ "value": 0 }';
            props.callBackPublicData({
                topic: topicPub + props.dataListFeed[0].name,
                qos: 0,
                payload: payload,
            });
        } else {
            let payload = '{ "value": 1 }';
            props.callBackPublicData({
                topic: topicPub + props.dataListFeed[0].name,
                qos: 0,
                payload: payload,
            });
        }
        setChecked(nextChecked);
        props.callBackPublicData(nextChecked);
    };

    // Assign lastest value from database into value in first rendering
    let lastest_value = useRef(0)
    useEffect(() => {
        if (props.feedValues && props.feedValues.length) {
            const lastestElement = props.feedValues.reduce((max, element) => {
                if (new Date(element.time_stamp) > new Date(max.time_stamp)) {
                    return element;
                } else {
                    return max;
                }
            });
            lastest_value.current = lastestElement.value // Lastest value for fisrt rendering
        } else lastest_value.current = 0
        if (lastest_value.current) setChecked(true)
    }, []);

    let currentState = checked ? 1 : 0;
    if (props.dataSubFeed == 1 || props.dataSubFeed == 0) {
        if (props.dataSubFeed !== currentState) {
            if (props.dataSubFeed === 1) {
                setChecked(true);
            } else {
                if (props.dataSubFeed === 0) {
                    setChecked(false);
                }
            }
        }
    }
    return (
        <Switch
            offColor={attribute ? attribute.off_color : '#CC3300'}
            onColor={attribute ? attribute.on_color : '#009933'}
            borderRadius={0}
            handleDiameter={props.h * 15}
            width={props.w * 90}
            height={props.h * 30}
            onChange={handleChange}
            checked={checked}
            className="react-switch"
        />
    );
}

/* styles.css */
