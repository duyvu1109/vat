import React from 'react';
import { Form, Col, Row, Input, Typography } from 'antd';

const { Title } = Typography;

const ModalCustomControl = (props) => {
    return (
        <>
            <Row>
                <Col span={8}>
                    <Title level={5}>Color Of On State</Title>
                    <Form.Item name="on_color">
                        <Input placeholder="Please enter title color" />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Title style={{ marginLeft: '10px' }} level={5}>
                        Color
                    </Title>
                    <Form.Item style={{ marginLeft: '10px' }} name={'on_color'}>
                        <input type="color" />
                    </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={8}>
                    <Title level={5}>Color Of Off State</Title>
                    <Form.Item name="off_color">
                        <Input placeholder="Please enter title color" />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Title style={{ marginLeft: '10px' }} level={5}>
                        Color
                    </Title>
                    <Form.Item style={{ marginLeft: '10px' }} name={'off_color'}>
                        <input type="color" />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};
export default ModalCustomControl;
