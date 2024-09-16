import { Form, Button, Input, Typography, Col, Row, Progress } from 'antd';
import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ChangeInfo.module.scss';
import { useNavigate } from 'react-router-dom';
import useAxios from '~/utils/useAxios';
import AuthContext from '~/context/AuthContext';
import { notifyError } from '~/utils/notifications';
import { notifySuccess } from '~/utils/notifySuccess';

const { Title } = Typography;
const cx = classNames.bind(styles);
const BASE_URL = process.env.REACT_APP_BASE_URL;

const ChangeInfo = () => {
    const { user, setUser } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [feedPercent, setFeedPercent] = useState(0);
    const [dashboardPercent, setDashboardPercent] = useState(0);
    const api = useAxios();
    const onFinish = (values) => {
        let newPassword = 'no';
        if (!values.password || values.password == '') {
            newPassword = 'no';
        } else {
            newPassword = values.password;
        }
        const newValue = {
            username: values.username,
            first_name: values.first_name,
            last_name: values.last_name,
            password: newPassword,
        };
        api.put(`${BASE_URL}/oneuser/`, newValue)
            .then((res) => {
                const new_user = {
                    _id: user._id,
                    is_staff: user.is_staff,
                    username: user.username,
                    first_name: values.first_name,
                    last_name: values.last_name,
                };
                notifySuccess('Successfully!');
                localStorage.setItem('current_user', JSON.stringify(new_user));
                setUser(new_user);
            })
            .catch((err) => notifyError('Something went wrong!'));
    };

    const navigate = useNavigate();
    useEffect(() => {
        api.get(`${BASE_URL}/oneuser/`)
            .then((res) => {
                let returnValue = JSON.parse(res.data);
                let data = returnValue.data[0];
                setFeedPercent(((returnValue.feed * 100) / data.max_feeds).toFixed(2));
                setDashboardPercent(((returnValue.dashboard * 100) / data.max_dashboards).toFixed(2));
                form.setFieldsValue({
                    key: data.key,
                    username: data.username,
                    first_name: data.first_name,
                    last_name: data.last_name,
                });
            })
            .catch((err) => {
                console.log(err.response);
                if (err.request.status === 403) {
                    navigate('/error');
                }
            });
    }, []);

    return (
        <Row>
            <Col span={12}>
                <Title level={2}>Profile</Title>
                <Form
                    form={form}
                    name="dynamic_form_complex"
                    onFinish={onFinish}
                    style={{ maxWidth: 600 }}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        label="Username:"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the username!',
                            },
                        ]}
                    >
                        <Input disabled={true} />
                    </Form.Item>
                    <Form.Item
                        name="first_name"
                        label="First Name:"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the first name!',
                            },
                        ]}
                    >
                        <Input type="textarea" />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        label="Last Name:"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the last name!',
                            },
                        ]}
                    >
                        <Input type="textarea" />
                    </Form.Item>
                    <Form.Item name="password" label="New Password: Leave blank if you don't want to change">
                        <Input type="password" placeholder="Leave blank if you don't want to change" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
            <Col span={12}>
                <Title level={2} style={{ margin: '00px 0px 0px 220px' }}>
                    Account Status
                </Title>
                <Row>
                    <Col style={{ margin: '70px 0px 0px 150px' }} span={6}>
                        <Title style={{ margin: '0px 0px 20px 50px' }} level={4}>
                            Feeds
                        </Title>
                        <Progress type="circle" percent={feedPercent} width={150} />
                    </Col>
                    <Col style={{ margin: '70px 0px 10px 50px' }} span={6}>
                        <Title style={{ margin: '0px 0px 20px 25px' }} level={4}>
                            Dashboard
                        </Title>
                        <Progress type="circle" percent={dashboardPercent} width={150} />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default ChangeInfo;
