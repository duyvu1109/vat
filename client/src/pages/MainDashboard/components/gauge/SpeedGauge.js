import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { useState, useEffect, useRef } from 'react';
export default function SpeedGauge(props) {
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

    const [attribute, setAttribute] = useState(props.attribute);
    const [arrayColor, setArrayColor] = useState();
    useEffect(() => {
        if (props.attribute) {
            if (props.attribute.color) {
                let newArrayColor = props.attribute.color.split('#');
                newArrayColor.shift();
                for (let i = 0; i < newArrayColor.length; i++) {
                    newArrayColor[i] = '#' + newArrayColor[i];
                }
                if (newArrayColor.length === 0) {
                    setArrayColor(['#FF5F6D', '#FFC371']);
                } else {
                    setArrayColor(newArrayColor);
                }
            }
            setAttribute(props.attribute);
        }
    }, [props.attribute]);

    return (
        <GaugeChart
            id="gauge-chart3"
            nrOfLevels={attribute ? attribute.number_of_element : 10}
            colors={arrayColor}
            textColor={attribute ? attribute.text_color : '#000000'}
            arcWidth={attribute ? attribute.arc_width : 0.3}
            percent={value / (attribute ? attribute.max_value : 100)}
            formatTextValue={() => value.toFixed(1) + (attribute ? attribute.signature : ' Km/h')}
            animate={attribute ? attribute.animate : false}
        />
    );
}
