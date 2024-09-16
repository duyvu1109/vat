import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Chart(props) {
    const [data, setData] = useState([]);
    const [state, setState] = useState(Date.now());
    const [attribute, setAttribute] = useState(props.attribute);

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
                .slice(0, 6)
                .reverse();
            
            result = data_7_days_sorted.map((object) => {
                let date = new Date(object.time_stamp);
                let seconds = date.getSeconds();
                let minutes = date.getMinutes();
                let hour = date.getHours();
                return {
                    subject: hour + ':' + minutes + ':' + seconds,
                    fullMark: 150,
                    [nameOfValue]: object.value,
                };
            });
        }
        data_first_rendering.current = result;
        setData(result);
    }, []);

    useEffect(() => {
        if (props.attribute) setAttribute(props.attribute);
        if (props.dataSubFeed) {  
            let date = new Date();
            let seconds = date.getSeconds();
            let minutes = date.getMinutes();
            let hour = date.getHours();
            let newData = data || data_first_rendering.current;
            if (data.length >= 6) {
                data.shift();
            }
            newData.push({
                subject: hour + ':' + minutes + ':' + seconds,
                fullMark: 150,
                [nameOfValue]: props.dataSubFeed,
            });
            setData(newData);
            setState(Date.now());
        }
    }, [props.dataSubFeed, props.attribute]);
    
    return (
        <ResponsiveContainer width="100%" height="95%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data} key={state}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    fill={attribute ? attribute.background : '#ADC5A2'}
                    stroke={attribute ? attribute.grid_color : '#ADC5A2'}
                />
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Mike" dataKey={nameOfValue} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    );
}
