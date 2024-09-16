import React from 'react';
import { InputNumber, Form, Col, Row, Input } from 'antd';

const ModalCustomDigital = (props) => {
    return (
        <>
            <Row>
                <Col span={6}>
                    <Form.Item name="min_value" label="Min Value">
                        <InputNumber min={1} max={1000} initialvalues={10} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="max_value" label="Max Value">
                        <InputNumber min={1} max={1000} initialvalues={100} />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item name="widget_color" label="Color">
                        <Input placeholder="Please enter title color" />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item style={{ marginLeft: '10px' }} name='widget_color'>
                        <input type="color" />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};
export default ModalCustomDigital;
