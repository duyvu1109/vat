import React from 'react';
import { Typography } from 'antd';
import { useState, useEffect, useRef } from 'react';
const { Title } = Typography;

function SimpleCard(props) {
    const [attribute, setAttribute] = useState(props.attribute);
    useEffect(() => {
        if (props.attribute) setAttribute(props.attribute);
    }, [props.attribute]);

    // Assign lastest value from database into value in first rendering
    let lastest_value = useRef(0);
    useEffect(() => {
        if (props.feedValues && props.feedValues.length) {
            const lastestElement = props.feedValues.reduce((max, element) => {
                if (new Date(element.time_stamp) > new Date(max.time_stamp)) {
                    return element;
                } else {
                    return max;
                }
            });
            lastest_value.current = lastestElement.value; // Lastest value for fisrt rendering
        } else lastest_value.current = 0;
    }, []);

    var value = props.dataSubFeed ? props.dataSubFeed : lastest_value.current;

    const titleCard = {
        color: attribute.name_color || 'white',
    };
    const titleContent = {
        fontSize: '70px',
        color: attribute.value_color || 'white',
        margin: '20px',
    };

    return (
        <div>
            <Title style={titleCard} level={1}>
                {props.name}
            </Title>
            <Title style={titleContent} level={4}>
                {value.toFixed(1)} {attribute.signature}
            </Title>
        </div>
    );
}

export default SimpleCard;
