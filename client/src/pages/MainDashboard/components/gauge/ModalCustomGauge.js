import React, { useState, useEffect } from 'react';
import { InputNumber, Form, Col, Row, Input } from 'antd';
import { Checkbox } from '@material-ui/core';
const ModalCustomGauge = (props, ref) => {
    const [numberArrayColor, setNumberArrayColor] = useState(0);
    const onChange = (value) => {
        setNumberArrayColor(value);
    };
    useEffect(() => {
        if (props.number_of_arr) {
            setNumberArrayColor(props.number_of_arr);
        }
    }, [props.number_of_arr]);

    const genarateInputColor = () => {
        const children = [];

        for (var i = 0; i < numberArrayColor - 1; i += 2) {
            children.push(
                <Row key={i}>
                    <Col span={6}>
                        <Form.Item key={i} name={'arr_color' + i} label={'Array Color ' + i}>
                            <Input placeholder="Text Color" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item key={i} style={{ marginLeft: '10px' }} name={'arr_color' + i} label="Color">
                            <input type="color" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item key={(i + 3) * 5} name={'arr_color' + (i + 1)} label={'Array Color ' + (i + 1)}>
                            <Input placeholder="Text Color" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            key={(i + 3) * 5}
                            style={{ marginLeft: '10px' }}
                            name={'arr_color' + (i + 1)}
                            label="Color"
                        >
                            <input type="color" />
                        </Form.Item>
                    </Col>
                </Row>,
            );
        }
        if (numberArrayColor % 2 != 0) {
            children.push(
                <Row key={numberArrayColor}>
                    <Col span={6}>
                        <Form.Item
                            name={'arr_color' + (numberArrayColor - 1)}
                            label={'Array Color ' + (numberArrayColor - 1)}
                        >
                            <Input placeholder="Array Color" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            style={{ marginLeft: '10px' }}
                            name={'arr_color' + (numberArrayColor - 1)}
                            label="Color"
                        >
                            <input type="color" />
                        </Form.Item>
                    </Col>
                </Row>,
            );
        }
        return <>{children}</>;
    };
    return (
        <>
            <Row>
                <Col span={6}>
                    <Form.Item name="number_of_element" label="Number of Element">
                        <InputNumber min={1} max={50} initialvalues={2} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="signature" label="Signature">
                        <Input placeholder="Special symbol to show next value" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item style={{ marginLeft: '10px' }} name="text_color" label="Text Color">
                        <Input placeholder="Text Color" />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item style={{ marginLeft: '10px' }} name="text_color" label="Color">
                        <input type="color" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={7}>
                    <Form.Item name="number_of_arr" label="Number Of Array Color">
                        <InputNumber min={1} max={10} onChange={onChange} />
                    </Form.Item>
                </Col>
                <Col span={5}>
                    <Form.Item name="arc_width" label="Arc Width">
                        <InputNumber min={0} max={1} step={0.1} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="animate" label="Animate" valuePropName="checked">
                        <Checkbox />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="max_value" label="Max Value">
                        <InputNumber min={1} max={10000} initialvalues={100} />
                    </Form.Item>
                </Col>
            </Row>
            {genarateInputColor()}
        </>
    );
};
export default ModalCustomGauge;
