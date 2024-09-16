import { DeleteOutlined, EditOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import {
    Form,
    Button,
    Input,
    Space,
    Table,
    Popconfirm,
    Typography,
    InputNumber,
    Card,
    Modal,
    Select,
    notification,
    Checkbox,
} from 'antd';
import React, { useRef, useState, useEffect, useContext } from 'react';
import Highlighter from 'react-highlight-words';
import classNames from 'classnames/bind';
import styles from './Users.module.scss';
import axios from 'axios';
import Moment from 'react-moment';
import { useNavigate } from 'react-router-dom';
import useAxios from '~/utils/useAxios';
import AuthContext from '~/context/AuthContext';
const { Option } = Select;

const cx = classNames.bind(styles);
const _parse_date = (date) => {
    let day;
    let month;
    if (date.getMonth() + 1 < 10) {
        month = '0' + parseInt(date.getMonth() + 1);
    } else {
        month = parseInt(date.getMonth() + 1);
    }
    if (date.getDate() < 10) {
        day = '0' + date.getDate();
    } else {
        day = date.getDate();
    }
    return day + '/' + month + '/' + date.getFullYear();
};

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Users = () => {
    const api = useAxios();
    const navigate = useNavigate();
    const { user, setUser, logoutUser } = useContext(AuthContext);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        api.get(`${BASE_URL}/user/`)
            .then((res) => {
                const dataUser = res.data.map((value, index) => {
                    return {
                        key: value._id,
                        username: value.username,
                        first_name: value.first_name,
                        last_name: value.last_name,
                        password: value.password,
                        is_staff: value.is_staff,
                        is_block: value.is_block,
                        max_feeds: value.max_feeds,
                        max_dashboards: value.max_dashboards,
                        updated_at: _parse_date(new Date(value.updated_at)),
                        last_login: <Moment fromNow>{value.last_login}</Moment>,
                    };
                });
                setDataSource(dataUser);
            })
            .catch((err) => {
                console.log(err.response);
                if (err.request.status === 403) {
                    logoutUser();
                    navigate('/error');
                }
            });
    }, []);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const handleDelete = (key) => {
        api.delete(`${BASE_URL}/user/${key}/`)
            .then((res) => {
                const newData = dataSource.filter((item) => item.key !== key);
                setDataSource(newData);
            })
            .catch((err) => console.log(err.response));
    };
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalResetPass, setIsModalResetPass] = useState(false);
    const [form_add] = Form.useForm();
    const [form_edit] = Form.useForm();
    const [form_reset_pass] = Form.useForm();
    const showModal = () => {
        setIsModalOpen(true);
    };
    const showModalEdit = (record) => {
        form_edit.setFieldsValue({
            key: record.key,
            username: record.username,
            first_name: record.first_name,
            last_name: record.last_name,
            is_staff: record.is_staff ? 'admin' : 'student',
            is_block: record.is_block,
            max_feeds: record.max_feeds,
            max_dashboards: record.max_dashboards,
        });
        setIsModalEditOpen(true);
    };
    const showModalResetPass = (record) => {
        form_reset_pass.setFieldsValue({
            key: record.key,
        });
        setIsModalResetPass(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleCancelResetPass = () => {
        setIsModalResetPass(false);
    };
    const handleCancelEdit = () => {
        setIsModalEditOpen(false);
    };
    const saveActionEdit = async (values) => {
        try {
            let check_value_valid = true;
            if (!(values.max_feeds > 0 && values.max_dashboards > 0)) {
                check_value_valid = false;
                openNotification(`The number of feeds and dashboards must be a positive integer.`);
            }
            if (check_value_valid) {
                values.is_staff = values.is_staff === 'admin' ? 1 : 0;
                const row = values;
                const newData = [...dataSource];
                const index = newData.findIndex((item) => values.key === item.key);
                if (index > -1) {
                    const item = newData[index];
                    item.updated_at = _parse_date(new Date());
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    setDataSource(newData);
                } else {
                    newData.push(row);
                    setDataSource(newData);
                }
                api.patch(`${BASE_URL}/user/${values.key}/`, row)
                    .then((res) => {
                        console.log('Edit successfully');
                        if (values.username == user.username) {
                            const new_user = {
                                _id: user._id,
                                is_staff: user.is_staff,
                                username: user.username,
                                first_name: values.first_name,
                                last_name: values.last_name,
                            };
                            setUser(new_user)
                            localStorage.setItem('current_user', JSON.stringify(new_user));
                        }
                    })
                    .catch((err) => console.log(err.response));
                setIsModalEditOpen(false);
                form_edit.resetFields();
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const saveActionResetPass = async (values) => {
        try {
            setIsModalResetPass(false);
            api.patch(`${BASE_URL}/user/${values.key}/`, values)
                .then((res) => {
                    console.log('Reset password successfully');
                })
                .catch((err) => console.log(err.response));
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        {
            title: 'Username/Email',
            dataIndex: 'username',
            key: 'username',
            width: '17%',
            ...getColumnSearchProps('username'),
            sorter: (a, b) => a.username.length - b.username.length,
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
            width: '15%',
            ...getColumnSearchProps('first_name'),
            sorter: (a, b) => a.first_name.length - b.first_name.length,
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
            width: '15%',
            ...getColumnSearchProps('last_name'),
            sorter: (a, b) => a.last_name.length - b.last_name.length,
        },
        {
            title: 'Role',
            dataIndex: 'is_staff',
            key: 'is_staff',
            width: '5%',
            render: (_, record) => {
                let role_name = record.is_staff ? 'Admin' : 'Student';
                return <span> {role_name} </span>;
            },
        },
        {
            title: 'Feeds',
            dataIndex: 'max_feeds',
            key: 'max_feeds',
            width: '5%',
        },
        {
            title: 'Dashboards',
            dataIndex: 'max_dashboards',
            key: 'max_dashboards',
            width: '5%',
        },
        {
            title: 'Block',
            dataIndex: 'is_block',
            key: 'is_block',
            width: '5%',
            render: (_, record) => {
                return <Checkbox checked={record.is_block ? true : false}></Checkbox>;
            },
        },
        {
            title: 'Last Login',
            dataIndex: 'last_login',
            key: 'last_login',
            width: '13%',
            defaultSortOrder: 'descend',
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: '10%',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.updated_at > b.updated_at,
        },
        {
            title: 'Options',
            key: 'option',
            fixed: 'right',
            width: '10%',
            render: (_, record) => {
                return (
                    <>
                        <Typography.Link
                            onClick={() => showModalEdit(record)}
                            style={{
                                color: 'black',
                                marginRight: 6,
                            }}
                        >
                            <EditOutlined />
                        </Typography.Link>
                        <Typography.Link
                            onClick={() => showModalResetPass(record)}
                            style={{
                                color: 'black',
                                marginRight: 6,
                            }}
                        >
                            <ReloadOutlined />
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                            <DeleteOutlined />
                        </Popconfirm>
                    </>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
            }),
        };
    });
    const [nonti, contextHolder] = notification.useNotification();
    const openNotification = (message) => {
        nonti.info({
            message: message,
            description: `Please try again!`,
            placement: 'topRight',
        });
    };

    const onCreate = (values) => {
        let check_value_valid = true;

        for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[i].username === values.username) {
                check_value_valid = false;
                openNotification(`This username already exists.`);
                break;
            }
        }
        if (!(values.max_feeds > 0 && values.max_dashboards > 0)) {
            check_value_valid = false;
            openNotification(`The number of feeds and dashboards must be a positive integer.`);
        }
        if (check_value_valid) {
            const newValue = {
                username: values.username,
                first_name: values.first_name,
                last_name: values.last_name,
                password: values.password,
                is_staff: values.is_staff === 'admin' ? 1 : 0,
                is_block: values.is_block,
                max_feeds: values.max_feeds,
                max_dashboards: values.max_dashboards,
            };
            axios
                .post(`${BASE_URL}/user/`, newValue, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${JSON.parse(localStorage.authTokens).access}`,
                    },
                })
                .then((res) => {
                    var date = new Date();
                    setDataSource([
                        ...dataSource,
                        {
                            key: res.data._id,
                            username: values.username,
                            first_name: values.first_name,
                            last_name: values.last_name,
                            password: values.password,
                            is_staff: values.is_staff === 'admin' ? 1 : 0,
                            is_block: values.is_block,
                            max_feeds: values.max_feeds,
                            max_dashboards: values.max_dashboards,
                            updated_at: _parse_date(date),
                        },
                    ]);
                })
                .catch((err) => console.log(err.response));
            setIsModalOpen(false);
            form_add.resetFields();
        }
    };
    return (
        <div className={cx('full-screen')}>
            {contextHolder}
            <Modal
                open={isModalOpen}
                title="Create a new user"
                okText="Create"
                cancelText="Cancel"
                onCancel={() => {
                    form_add.resetFields();
                    handleCancel();
                }}
                onOk={() => {
                    form_add
                        .validateFields()
                        .then((values) => {
                            onCreate(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={form_add} layout="horital" name="form_in_modal">
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="first_name"
                        label="First Name"
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
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the last name!',
                            },
                        ]}
                    >
                        <Input type="textarea" />
                    </Form.Item>
                    <Form.Item
                        name="is_staff"
                        label="Role"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter role of user!',
                            },
                        ]}
                    >
                        <Select placeholder="Select a option and change input text above">
                            <Option value="admin">Admin</Option>
                            <Option value="student">Student</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="max_feeds"
                        label="Number Of Feeds"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the number of feeds!',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        name="max_dashboards"
                        label="Number Of Dashboards"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the number of dashboards!',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="is_block" label="Block" valuePropName="checked">
                        <Checkbox></Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={isModalResetPass}
                title="Reset password of user"
                okText="Save"
                cancelText="Cancel"
                onCancel={handleCancelResetPass}
                onOk={() => {
                    form_reset_pass
                        .validateFields()
                        .then((values) => {
                            form_reset_pass.resetFields();
                            saveActionResetPass(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={form_reset_pass} layout="vertical" name="form_in_modal">
                    <Form.Item name="key" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={isModalEditOpen}
                title="Edit User"
                okText="Save"
                cancelText="Cancel"
                onCancel={handleCancelEdit}
                onOk={() => {
                    form_edit
                        .validateFields()
                        .then((values) => {
                            saveActionEdit(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={form_edit} layout="horital" name="form_in_modal">
                    <Form.Item name="key" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Username"
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
                        label="First Name"
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
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the last name!',
                            },
                        ]}
                    >
                        <Input type="textarea" />
                    </Form.Item>
                    <Form.Item
                        name="is_staff"
                        label="Role"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select placeholder="Select a option and change input text above">
                            <Option value="admin">Admin</Option>
                            <Option value="student">Student</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="max_feeds"
                        label="Number Of Feeds"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the number of feeds!',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        name="max_dashboards"
                        label="Number Of Dashboards"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the number of dashboards!',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="is_block" label="Block" valuePropName="checked">
                        <Checkbox></Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
            <Card
                title="Users Manager"
                style={{
                    width: '100%',
                }}
            >
                <Form form={form} component={false}>
                    <Button
                        onClick={showModal}
                        type="primary"
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        Add new user
                    </Button>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        columns={mergedColumns}
                        dataSource={dataSource}
                        rowClassName="editable-row"
                        pagination={{
                            pageSize: 5,
                        }}
                    />
                </Form>
            </Card>
        </div>
    );
};

export default Users;
