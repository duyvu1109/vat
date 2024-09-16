import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useRef } from 'react';
var date1 = new Date();
var time_position_first_render = date1.getTime();
export default function Chart(props) {
    const [data, setData] = useState([]);
    const [state, setState] = useState(Date.now());
    const [attribute, setAttribute] = useState(props.attribute);
    // Assign data for the last 7 days from database to data in first rendering
    let data_first_rendering = useRef([]);
    useEffect(() => {
        let result = [];
        if (props.feedValues && props.feedValues.length) {
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const data_7_days = props.feedValues.filter((element) => {
                const datetime = new Date(element.time_stamp);
                return datetime >= oneWeekAgo && datetime <= now;
            });

            const data_7_days_sorted = data_7_days
                .sort((a, b) => new Date(b.time_stamp) - new Date(a.time_stamp))
                .slice(0, 30)
                .reverse();

            result = data_7_days_sorted.map((object) => {
                let date = new Date(object.time_stamp);
                let time = date.getTime();
                return {
                    x: (time_position_first_render - time) / 1000,
                    y: object.value,
                };
            });
        }
        data_first_rendering.current = result;
        setData(result);
    }, []);

    useEffect(() => {
        if (props.attribute)  setAttribute(props.attribute);
        if (props.dataSubFeed) {
            let date = new Date();
            let time = date.getTime();
            let newData = data || data_first_rendering.current;
            if (data.length >= 30) {
                data.shift();
            }
            newData.push({
                x: (time - time_position_first_render) / 1000, // Chênh lệch x giây = time gửi data - time first render trang
                y: props.dataSubFeed,
            });
            setData(newData);
            setState(Date.now());
        }
    }, [props.dataSubFeed, props.attribute]);
    
    return (
        <ResponsiveContainer width="99%" height="95%">
            <ScatterChart
                key={state}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 20,
                }}
                width={500}
                height={300}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    fill={attribute ? attribute.background : '#ADC5A2'}
                    stroke={attribute ? attribute.grid_color : '#ADC5A2'}
                />
                <XAxis type="number" dataKey="x" name="Time" unit=" s" />
                <YAxis type="number" dataKey="y" name="Value" unit="" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="A school" data={data} fill="#8884d8" />
            </ScatterChart>
        </ResponsiveContainer>
    );
}
