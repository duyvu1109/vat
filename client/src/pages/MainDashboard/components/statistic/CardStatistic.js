import React, { useState, useEffect, useRef } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
// import TensorFlow from './TensorFlow';

function linearRegression(data) {
    const n = data.length;
    let x = 0;
    let y = 0;
    let xy = 0;
    let xx = 0;
    let yy = 0;

    for (let i = 0; i < n; i++) {
        x += i;
        y += data[i];
        xy += i * data[i];
        xx += i * i;
        yy += data[i] * data[i];
    }

    const slope = (n * xy - x * y) / (n * xx - x * x);
    const intercept = (y - slope * x) / n;
    const rSquared = Math.pow((n * xy - x * y) / Math.sqrt((n * xx - x * x) * (n * yy - y * y)), 2);

    return {slope, intercept, rSquared};
}

export default function CardStatistic(props) {
    let value = 0;
    let predictValue = 0;
    let title = 'Average';
    const [data, setData] = useState([0]);
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
                return object.value;
            });
        }
        data_first_rendering.current = result;
        setData(result);
    }, []);

    useEffect(() => {
        if (props.attribute) setAttribute(props.attribute);
        if (props.dataSubFeed) {
            let newData = data || data_first_rendering.current;
            if (data.length >= 30) {
                data.shift();
            }
            newData.push(props.dataSubFeed);
            setData(newData);
        }
    }, [props.dataSubFeed, props.attribute]);

    if (data && data.length) {
        if (attribute.equation == 'avg') {
            value = data.reduce((acc, curr) => acc + curr, 0) / data.length;
            title = "Average feed\'s value in the last 7 days";
        } else if (attribute.equation == 'sum') {
            value = data.reduce((acc, curr) => acc + curr, 0);
            title = "Sum feed\'s value in the last 7 days";
        } else if (attribute.equation == 'max') {
            value = Math.max(...data);
            title = "Max feed\'s value in the last 7 days";
        } else {
            value = Math.min(...data);
            title = "Min feed\'s value in the last 7 days";
        }
        let regressionLine = linearRegression(data);
        // Predict the next value using the linear regression line
        predictValue = regressionLine.slope * data.length + regressionLine.intercept;

    }
    return (
        <>
            <Col>
                <Statistic
                    style={{ background: attribute.background, margin: '10px' }}
                    title={title}
                    value={data.length != 0 ? value : 0}
                    precision={attribute.precision}
                    valueStyle={{
                        color: attribute.value_color,
                    }}
                    suffix={attribute.suffix}
                />
            </Col>
            <Col>
                <Statistic
                    style={{ background: attribute.background, margin: '10px' }}
                    title={"Next value"}
                    value={data.length != 0 ? predictValue : 0}
                    precision={attribute.precision}
                    valueStyle={{
                        color: attribute.value_color,
                    }}
                    suffix={attribute.suffix}
                />
            </Col>
            
        </>
    );
}
