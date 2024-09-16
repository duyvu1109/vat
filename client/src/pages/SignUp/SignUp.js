import React from 'react';
import { Button, Form, Input, Card, Divider, Image, Row, Col, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import logo_BK from '~/assets/images/logo_BK.png';
import styles from './SignUp.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
const BASE_URL = process.env.REACT_APP_BASE_URL
const SignUp = () => {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement) => {
        api.info({
            message: `This username already exists.`,
            description: `Please try again!`,
            placement,
        });
    };

    const onFinish = (values) => {
        if (values) {
            axios
                .post(`${BASE_URL}/signUp/`, values, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((res) => {
                    navigate(`/`);
                })
                .catch((err) => {
                    openNotification('topRight');
                });
        }
    };
    return (
        <div className={cx('center-form-create')}>
            {contextHolder}
            <Card className={cx('card-login')}>
                <Image width={70} preview={false} src={logo_BK} />
                <h1 className={cx('title-login')}>Get started with VAT Server</h1>
                <Divider />
                <Form onFinish={onFinish} layout="vertical" className="row-col">
                    <Row gutter={16}>
                        <Col span={12}>
                            {' '}
                            <Form.Item
                                className={cx('text-input')}
                                label="First name"
                                name="first_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your first name!',
                                    },
                                ]}
                            >
                                <Input placeholder="Name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {' '}
                            <Form.Item
                                className={cx('text-input')}
                                label="Last name"
                                name="last_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your last name!',
                                    },
                                ]}
                            >
                                <Input placeholder="Username" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            {' '}
                            <Form.Item
                                className={cx('text-input')}
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input placeholder="Username" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            {' '}
                            <Form.Item
                                className={cx('text-input')}
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" className={cx('btn-signin')} htmlType="submit" style={{ width: '100%' }}>
                            SIGN UP
                        </Button>
                    </Form.Item>
                    <p className={cx('text-bottom')}>
                        Do you already have an account? <Link to="/login">Log in</Link>
                    </p>
                </Form>
            </Card>
        </div>
    );
};

export default SignUp;
