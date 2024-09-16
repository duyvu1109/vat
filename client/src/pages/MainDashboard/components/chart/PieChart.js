import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function Chart(props) {
    const [data, setData] = useState([]);
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
                .slice(0, 4)
                .reverse();
            
            result = data_7_days_sorted.map((object) => {
                return {
                    name: nameOfValue,
                    value: object.value,
                };
            });
        }
        data_first_rendering.current = result;
        setData(result);
    }, []);

    useEffect(() => {
        if (props.dataSubFeed) {
            let newData = data || data_first_rendering.current;
            if (data.length >= 4) {
                data.shift();
            }
            newData.push({
                name: nameOfValue,
                value: props.dataSubFeed,
            });
            setData(newData);
        }
    }, [props.dataSubFeed]);

    return (
        <ResponsiveContainer width="100%" height="60%">
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}
