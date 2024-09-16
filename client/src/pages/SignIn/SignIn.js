import React from 'react';
import { Button, Form, Input, Card, Divider, Image, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import logo_BK from '~/assets/images/logo_BK.png';
import styles from './SignIn.module.scss';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useCallback } from 'react';
import AuthContext from '~/context/AuthContext';
import { validateTokenAndObtainSession } from '~/context/ValidateGGAuthen';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { notifyError } from '~/utils/notifications';

const cx = classNames.bind(styles);
const BASE_URL = process.env.REACT_APP_BASE_URL;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const SignIn = () => {
    const navigate = useNavigate();
    const { authTokens, loginUser } = useContext(AuthContext);
    useEffect(() => {
        if (authTokens && authTokens.access) navigate('/dashboard');

        function start() {
            gapi.client.init({
                clientId: GOOGLE_CLIENT_ID,
                scope: 'email',
            });
        }
        gapi.load('client:auth2', start);
    });
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (message, placement) => {
        api.info({
            message: message,
            description: `Please try again!`,
            placement,
        });
    };
    const onFinish = (values) => {
        axios
            .post(`${BASE_URL}/signIn/`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                loginUser(res.data);
                navigate(`/dashboard`);
            })
            .catch((err) => {
                let message = `Wrong username or password.`;
                if (err && err.response && err.response.status === 423)
                    message = `Your account has been locked. Please contact your administrator.`;
                openNotification(message, 'topRight');
            });
    };
    // Google Authentication
    const handleUserInit = useCallback(
        (resp) => {
            if (resp.ok) {
                const resp_data = JSON.parse(resp.data);
                let data_login = {
                    access: resp_data.access,
                    refresh: resp_data.refresh,
                    user: {
                        _id: resp_data._id,
                        is_staff: resp_data.is_staff,
                        username: resp_data.username,
                        first_name: resp_data.first_name,
                        last_name: resp_data.last_name,
                    },
                };
                loginUser(data_login);
                navigate('/dashboard');
            }
        },
        [navigate, loginUser],
    );
    const onGoogleLoginSuccess = useCallback(
        (response) => {
            const idToken = response.tokenId;
            const data = {
                email: response.profileObj.email,
                first_name: response.profileObj.givenName,
                last_name: response.profileObj.familyName,
            };
            validateTokenAndObtainSession({ data, idToken }).then(handleUserInit);
        },
        [handleUserInit],
    );
    return (
        <div className={cx('center-form-create')}>
            {contextHolder}
            <Card className={cx('card-login')}>
                <Image width={70} preview={false} src={logo_BK} />
                <h1 className={cx('title-login')}>Sign In to VAT Server</h1>
                <Divider />
                <div className={cx('btn-google-login')}>
                    <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Sign in with Google"
                        onSuccess={onGoogleLoginSuccess}
                        onFailure={({ details }) => notifyError(details)}
                    />
                </div>
                <Divider plain>
                    <span className={cx('divider-or')}>Or</span>
                </Divider>
                <Form onFinish={onFinish} layout="vertical" className="row-col">
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
                    <Form.Item>
                        <Button type="primary" className={cx('btn-signin')} htmlType="submit" style={{ width: '100%' }}>
                            SIGN IN
                        </Button>
                    </Form.Item>
                    <p className={cx('text-bottom')}>
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </p>
                </Form>
            </Card>
        </div>
    );
};
export default SignIn;
