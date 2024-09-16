import React from 'react';
import { Form, Col, Row, Input, DatePicker, Space, Select } from 'antd';
const { RangePicker } = DatePicker;
const ModalCustomStatistic = (props) => {
    return (
        <>
            <Row>
                
                <Col span={6}>
                    <Form.Item name="precision" label="Precision">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="suffix" label="Suffix" style={{ marginLeft: '10px' }}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="background" label="Background" style={{ marginLeft: '10px' }}>
                        <Input />
                    </Form.Item>
                </Col>  
                <Col span={6}>
                    <Form.Item name="background" label="Color" style={{ marginLeft: '10px' }}>
                        <input type="color" />
                    </Form.Item>
                </Col>  
            </Row>
            <Row>
                <Col span={6}>
                    <Form.Item name="equation" label="Equation">
                    <Select
                        defaultValue="avg"
                        // style={{
                        //     width: 120,
                        // }}
                        options={[
                            {
                                value: 'avg',
                                label: 'avg',
                            },
                            {
                                value: 'sum',
                                label: 'sum',
                            },
                            {
                                value: 'max',
                                label: 'max',
                            },
                            {
                                value: 'min',
                                label: 'min',
                            },
                        ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item name="value_color" label="Color of value" style={{ marginLeft: '10px' }}>
                        <Input />
                    </Form.Item>
                </Col>  
                <Col span={6}>
                    <Form.Item name="value_color" label="Color" style={{ marginLeft: '10px' }}>
                        <input type="color" />
                    </Form.Item>
                </Col> 
            </Row>
        </>
    );
};
export default ModalCustomStatistic;
