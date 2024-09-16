import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
export default function Chart(props) {
    const [data, setData] = useState([]);
    const [state, setState] = useState(Date.now());
    const [attribute, setAttribute] = useState(props.attribute);

    // Assign data for the last 7 days from database to data in first rendering
    const nameOfValue = 'topic';
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
                let seconds = date.getSeconds();
                let minutes = date.getMinutes();
                let hour = date.getHours();
                return {
                    name: hour + ':' + minutes + ':' + seconds,
                    [nameOfValue]: object.value,
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
            let seconds = date.getSeconds();
            let minutes = date.getMinutes();
            let hour = date.getHours();
            let newData = data || data_first_rendering.current;
            if (data.length >= 30) {
                data.shift();
            }
            newData.push({
                name: hour + ':' + minutes + ':' + seconds,
                [nameOfValue]: props.dataSubFeed,
            });
            setData(newData);
            setState(Date.now());
        }
    }, [props.dataSubFeed, props.attribute]);

    return (
        <ResponsiveContainer width="99%" height="95%">
            <LineChart
                key={state}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 45,
                }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    fill={attribute ? attribute.background : '#ADC5A2'}
                    stroke={attribute ? attribute.grid_color : '#ADC5A2'}
                />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
                <Line
                    type={attribute ? attribute.curve_type : 'monotone'}
                    dataKey={nameOfValue}
                    stroke={attribute ? attribute.color_value : '#888CB6'}
                    unit={attribute ? ' ' + attribute.signature : ' Km/h'}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
