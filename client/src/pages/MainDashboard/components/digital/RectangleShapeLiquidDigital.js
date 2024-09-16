import { Liquid } from '@ant-design/plots';
import { useState, useEffect, useRef } from 'react';

export default function RectangleShapeLiquidDigital(props) {
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
    }, []);
    let value = props.dataSubFeed ? props.dataSubFeed : lastest_value.current;

    const [attribute, setAttribute] = useState(props.attribute);
    useEffect(() => {
        if (props.attribute) {
            setAttribute(props.attribute);
        }
    }, [props.attribute]);
    if (attribute && attribute.min_value && attribute.max_value) {
        value = (value < attribute.min_value) ? attribute.min_value : value;
        value = (value > attribute.max_value) ? attribute.max_value : value;
    }
    const config = {
        percent: value / (attribute ? attribute.max_value : 100),
        shape: 'rect',
        outline: {
            border: 4,
            distance: 8,
        },
        wave: {
            length: 128,
        },
        pattern: {
            type: 'line',
        },
        color: attribute.widget_color || '#5C90FA',
        height: 30,
        width: 10,
    };
    return <Liquid {...config} />;
}
