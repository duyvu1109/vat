import React from 'react';
import { Form, Col, Row, Input, Select } from 'antd';
const ModalCustomChart = (props) => {
    return (
        <>
            <Row>
                <Col span={6}>
                    <Form.Item name="curve_type" label="Curve Type">
                    <Select
                        style={{
                            width: 120,
                        }}
                        options={[
                            {
                                value: 'basic',
                                label: 'basic',
                            },
                            {
                                value: 'basisClosed',
                                label: 'basisClosed',
                            },
                            {
                                value: 'basisOpen',
                                label: 'basisOpen',
                            },
                            {
                                value: 'linear',
                                label: 'linear',
                            },
                            {
                                value: 'linearClosed',
                                label: 'linearClosed',
                            },
                            {
                                value: 'monotoneX',
                                label: 'monotoneX',
                            },
                            {
                                value: 'monotoneY',
                                label: 'monotoneY',
                            },
                            {
                                value: 'monotone',
                                label: 'monotone',
                            },
                            {
                                value: 'step',
                                label: 'step',
                            },
                            {
                                value: 'stepBefore',
                                label: 'stepBefore',
                            },
                            {
                                value: 'stepAfter',
                                label: 'stepAfter',
                            },  
                            {
                                value: 'natural',
                                label: 'natural',
                            },                  
                        ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item style={{ marginLeft: '10px' }} name="signature" label="Signature">
                        <Input placeholder="Special symbol to show next value"/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item style={{ marginLeft: '10px' }} name="color_value" label="Color Value">
                        <Input placeholder="Value Color"/>
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item style={{ marginLeft: '10px' }} name="color_value" label="Color">
                        <input type="color" />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={6}>
                    <Form.Item name="grid_color" label="Grid Color">
                        <Input placeholder="Grid Color" />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item style={{ marginLeft: '10px' }} name="grid_color" label="Color">
                        <input type="color" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item style={{ marginLeft: '10px' }} name="background" label="Background">
                        <Input placeholder="Grid Color" />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item style={{ marginLeft: '10px' }} name="background" label="Color">
                        <input type="color" />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};
export default ModalCustomChart;
