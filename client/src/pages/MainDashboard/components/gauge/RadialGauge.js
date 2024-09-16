import React from 'react';
import { Gauge } from '@ant-design/plots';
import { useState, useEffect, useRef } from 'react';
import { Typography } from 'antd';
const { Title } = Typography;

export default function RadialGauge(props) {
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

    const [arrayColor, setArrayColor] = useState(['#F4664A', '#FAAD14', '#30BF78']);
    const [attribute, setAttribute] = useState(props.attribute);
    const [name, setName] = useState('');
    useEffect(() => {
        if (props.name) setName(props.name);
        if (props.attribute) {
            if (props.attribute.color) {
                let newArrayColor = props.attribute.color.split('#');
                newArrayColor.shift();
                for (let i = 0; i < newArrayColor.length; i++) {
                    newArrayColor[i] = '#' + newArrayColor[i];
                }
                if (newArrayColor.length != 0) {
                    setArrayColor(newArrayColor);
                }
            }
            setAttribute(props.attribute);
        }
    }, [props.attribute, props.name]);
    let config = {
        percent: value / (attribute ? attribute.max_value : 100),
        type: 'meter',
        meter: {
            steps: attribute ? attribute.number_of_element : 10,
            stepRatio: 0.6,
        },
        innerRadius: attribute ? 1 - attribute.arc_width : 0.75,
        range: {
            ticks: [0, 1 / 3, 2 / 3, 1],
            color: arrayColor,
        },
        indicator: {
            pointer: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
            pin: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
        },
        axis: {
            label: {
                formatter(v) {
                    return Number(v) * attribute.max_value;
                },
            },
            subTickLine: {
                count: 3,
            },
        },
        statistic: {
            title: {
                customHtml: name,
                position: 'start',
                style: {
                    fontSize: 24 + 'px',
                    lineHeight: 24 + 'px',
                    color: attribute ? props.attribute.name_color : '#000000',
                },
                offsetY: 25,
                offsetX: 0,
            },
            content: {
                formatter: ({ percent }) => {
                    return (
                        (percent * (attribute ? attribute.max_value : 100)).toFixed(1) +
                        (attribute ? ' ' + attribute.signature : ' ℃')
                    );
                },
                style: {
                    fontSize: props.w * 5 + 'px',
                    lineHeight: props.w * 5 + 'px',
                    color: attribute ? attribute.text_color : '#000000',
                },
                offsetY: -12,
            },
        },
    };

    return (
        <>
            <Gauge radius={0.8} {...config}></Gauge>
        </>
    );
}
