import React from 'react';
import { Form, Col, Row, Input } from 'antd';
const ModalCustomMap = (props) => {
    return (
        <>
            <Row>
                <Col span={11}>
                    <Form.Item name="latitude" label="Latitude">
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <Form.Item name="longitude" label="Longitude">
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};
export default ModalCustomMap;
