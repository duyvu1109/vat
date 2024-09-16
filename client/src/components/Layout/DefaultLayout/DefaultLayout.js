import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AppstoreOutlined,
    DashboardOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Space } from 'antd';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import logo_BK from '~/assets/images/logo_BK.png';
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import AuthContext from '~/context/AuthContext';
import { useContext } from 'react';

const cx = classNames.bind(styles);
const { Header, Sider, Footer, Content } = Layout;

const menuBar_admin = [
    {
        key: '1',
        icon: <DashboardOutlined />,
        label: <Link to="/dashboard">Dashboards</Link>,
    },
    {
        key: '2',
        icon: <AppstoreOutlined />,
        label: <Link to="/feeds">Feeds</Link>,
    },
    {
        key: '3',
        icon: <UserOutlined />,
        label: <Link to="/users">Users</Link>,
    },
];

const menuBar_student = [
    {
        key: '1',
        icon: <DashboardOutlined />,
        label: <Link to="/dashboard">Dashboards</Link>,
    },
    {
        key: '2',
        icon: <AppstoreOutlined />,
        label: <Link to="/feeds">Feeds</Link>,
    },
];
var menuBar = [];
const DefaultLayout = ({ children }) => {
    var textOfHref = window.location.href;
    const { user, authTokens, logoutUser } = useContext(AuthContext);
    if (authTokens && authTokens.user && authTokens.user.is_staff === true) {
        menuBar = menuBar_admin;
    } else {
        menuBar = menuBar_student;
    }
    const menuDropDownAvatar = [
        {
            label: <Avatar size={48} src={logo_BK} />,
            key: 'SubMenu',
            children: [
                {
                    label: <Link to="/editinfo ">Change Information</Link>,
                    icon: <SettingOutlined />,
                    key: 'editinfo',
                },
                {
                    label: (
                        <Link to="/login" onClick={logoutUser}>
                            Logout
                        </Link>
                    ),
                    icon: <LogoutOutlined />,
                    key: 'logout',
                },
            ],
        },
    ];
    const thirdIndex = (text, symbol) => {
        var count = 0;
        for (var i = 0; i < text.length; i++) {
            if (text[i] === symbol) {
                count++;
            }
            if (count === 3) {
                return i;
            }
        }
    };
    const fourIndex = (text, symbol) => {
        var count = 0;
        for (var i = 0; i < text.length; i++) {
            if (text[i] === symbol) {
                count++;
            }
            if (count === 4) {
                return i;
            }
        }
        return text.length;
    };
    const currentMenu = useRef('');
    let key;
    if (textOfHref.substring(thirdIndex(textOfHref, '/') + 1, fourIndex(textOfHref, '/')) === 'users') {
        key = '3';
        currentMenu.current = 'Users';
    } else {
        if (textOfHref.substring(thirdIndex(textOfHref, '/') + 1, fourIndex(textOfHref, '/')) === 'feeds') {
            key = '2';
            currentMenu.current = 'Feeds';
        } else {
            if (textOfHref.substring(thirdIndex(textOfHref, '/') + 1, fourIndex(textOfHref, '/')) === 'dashboard') {
                key = '1';
                currentMenu.current = 'Dashboards';
            } else {
                if (textOfHref.substring(thirdIndex(textOfHref, '/') + 1, fourIndex(textOfHref, '/')) === 'editinfo') {
                    key = '';
                    currentMenu.current = 'Change Information';
                } else {
                    key = '1';
                    currentMenu.current = 'Dashboards';
                }
            }
        }
    }
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Layout
            style={{
                minHeight: '101vh',
            }}
        >
            <Sider
                width={220}
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    backgroundColor: '#202537',
                }}
            >
                <Space size="middle" style={{ height: '64px' }}>
                    <Avatar size={48} src={logo_BK} style={{ marginLeft: 20 }} />
                    {!collapsed && <h2 style={{ color: 'white', display: 'inline-block' }}>VAT Server</h2>}
                </Space>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={key}
                    style={{
                        height: '100%',
                        borderRight: 0,
                        backgroundColor: '#282d40',
                        paddingTop: 20,
                    }}
                    items={menuBar}
                />
            </Sider>
            <Layout className={cx('site-layout')}>
                <Header
                    className={cx('site-layout-background')}
                    style={{
                        padding: 0,
                    }}
                >
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: cx('trigger'),
                        onClick: () => setCollapsed(!collapsed),
                    })}

                    <div
                        mode="horizontal"
                        style={{
                            display: 'inline-block',
                        }}
                        children={<h3>{currentMenu.current}</h3>}
                    ></div>
                    <div
                        className={cx('name-header')}
                        style={{
                            display: 'inline-block',
                            float: 'right',
                        }}
                        children={<h3>{'Hi, ' + user.first_name + ' ' + user.last_name}</h3>}
                    ></div>
                    <Menu
                        mode="horizontal"
                        items={menuDropDownAvatar}
                        style={{
                            display: 'inline-block',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                        }}
                        triggerSubMenuAction="click"
                        selectable={false}
                    />
                </Header>
                <Content
                    className={cx('site-layout-background')}
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: '70vh',
                    }}
                >
                    {children}
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                        margin: '0px',
                    }}
                >
                    Capstone Project ©2022 Created by VAT Team
                </Footer>
            </Layout>
        </Layout>
    );
};
export default DefaultLayout;
