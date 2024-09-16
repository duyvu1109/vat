import React from 'react';
import { Form, Col, Row, Input, Typography } from 'antd';

const { Title } = Typography;

const ModalCustomCard = (props) => {
    return (
        <>
            <Row>
                <Col span={6}>
                    <Title level={5}>Background Color</Title>
                    <Form.Item name="background_color">
                        <Input placeholder="Please enter title color" />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Title style={{ marginLeft: '10px' }} level={5}>
                        Color
                    </Title>
                    <Form.Item style={{ marginLeft: '10px' }} name={'background_color'}>
                        <input type="color" />
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Title level={5}> Value Color</Title>
                    <Form.Item name="value_color">
                        <Input placeholder="Please enter title color" />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Title style={{ marginLeft: '10px' }} level={5}>
                        Color
                    </Title>
                    <Form.Item style={{ marginLeft: '10px' }} name='value_color'>
                        <input type="color" />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Title level={5}> Signature </Title>
                    <Form.Item name="signature">
                        <Input placeholder="*C/%" />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};
export default ModalCustomCard;
