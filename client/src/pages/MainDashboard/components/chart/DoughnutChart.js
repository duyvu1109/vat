import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Typography } from 'antd';
const { Title } = Typography;
const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#00C5CD">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

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
                .slice(0, 5)
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
            if (data.length >= 5) {
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
        <ResponsiveContainer width="100%" height="100%">
            <PieChart
                width={250}
                height={250}
                margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    fill={attribute ? attribute.background : '#ADC5A2'}
                    stroke={attribute ? attribute.grid_color : '#ADC5A2'}
                />
                <Pie
                    key={state}
                    activeIndex={0}
                    activeShape={renderActiveShape}
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#4169E1"
                    dataKey={nameOfValue}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
