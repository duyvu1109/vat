import React from 'react';
import { Gauge, G2 } from '@ant-design/plots';
import { useState, useEffect, useRef } from 'react';
import { Typography } from 'antd';
const { Title } = Typography;
export default function CompassGauge(props) {
    const { registerShape, Util } = G2; //
    registerShape('point', 'triangle-gauge-indicator', {
        draw(cfg, container) {
            const { indicator, defaultColor } = cfg.customInfo;
            const { pointer } = indicator;
            const group = container.addGroup();

            const center = this.parsePoint({
                x: 0,
                y: 0,
            });

            if (pointer) {
                const { startAngle, endAngle } = Util.getAngle(cfg, this.coordinate);
                const radius = this.coordinate.getRadius();
                const midAngle = (startAngle + endAngle) / 2;
                const { x: x1, y: y1 } = Util.polarToCartesian(
                    center.x,
                    center.y,
                    radius * 0.52,
                    midAngle + Math.PI / 30,
                );
                const { x: x2, y: y2 } = Util.polarToCartesian(
                    center.x,
                    center.y,
                    radius * 0.52,
                    midAngle - Math.PI / 30,
                );
                const { x, y } = Util.polarToCartesian(center.x, center.y, radius * 0.6, midAngle);
                const path = [['M', x1, y1], ['L', x, y], ['L', x2, y2], ['Z']]; // pointer

                group.addShape('path', {
                    name: 'pointer',
                    attrs: {
                        path,
                        fill: defaultColor,
                        ...pointer.style,
                    },
                });
            }

            return group;
        },
    });

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

    const [arrayColor, setArrayColor] = useState(['#30BF78']);
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
        range: {
            color: arrayColor ? arrayColor[0] : '#30BF78',
        },
        innerRadius: attribute ? 1 - attribute.arc_width : 0.75,
        indicator: {
            shape: 'triangle-gauge-indicator',
            pointer: {
                style: {
                    fill: arrayColor ? arrayColor[0] : '#30BF78',
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
                    fontSize: 22 + 'px',
                    lineHeight: 22 + 'px',
                    color: attribute ? props.attribute.name_color : '#000000',
                },
                offsetY: 20,
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
                offsetY: -10,
            },
        },
    };
    return (
        <>
            <Gauge radius={0.8} {...config}></Gauge>
        </>
    );
}
