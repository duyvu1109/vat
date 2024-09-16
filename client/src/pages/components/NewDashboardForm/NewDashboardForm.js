import React from 'react';
import { Button, Form, Input, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './NewDashboardForm.module.scss';
import { notifyError } from '~/utils/notifications';

const cx = classNames.bind(styles);
const { TextArea } = Input;
const layout = {
    labelCol: {
        span: 4,
    },
};
const tailButton = {
    wrapperCol: {
        offset: 14,
        span: 16,
    },
};
const BASE_URL = process.env.REACT_APP_BASE_URL;
const NewDashboardForm = ({ setOpenCreateForm }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const onFinish = (values) => {
        if (values && values.name && values.description) {
            const user = localStorage.getItem('current_user');
            let textOfHref = window.location.href;
            const newValue = {
                user: JSON.parse(user)._id,
                name: values.name,
                public: false,
                description: values.description,
                link_public: textOfHref.substring(0, textOfHref.lastIndexOf('/')) + '/maindashboard/public/',
            };
            axios
                .post(`${BASE_URL}/dashboard/`, newValue, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${JSON.parse(localStorage.authTokens).access}`,
                    },
                })
                .then((res) => {
                    navigate(`/maindashboard/${res.data}`);
                })
                .catch((err) => {
                    if (err && err.response.status === 405)
                        notifyError('You have reached the maximum number of dashboards.');
                });
        }
    };
    const onReset = () => {
        form.resetFields();
    };
    return (
        <div className={cx('center-form-create')}>
            <Card title="Create new dashboard" style={{ backgroundColor: '#f7f7f8' }}>
                <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <TextArea rows={4} size="large" />
                    </Form.Item>
                    <Form.Item {...tailButton}>
                        <Button type="primary" htmlType="submit" onClick={onFinish}>
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset} style={{ marginLeft: 6, marginRight: 6 }}>
                            Reset
                        </Button>
                        <Button
                            htmlType="button"
                            onClick={() => setOpenCreateForm(false)}
                            style={{ backgroundColor: '#9da5b1' }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
export default NewDashboardForm;
