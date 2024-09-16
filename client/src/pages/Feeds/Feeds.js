import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Form, Button, Input, Space, Table, Popconfirm, Typography, InputNumber, Card, Modal } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import classNames from 'classnames/bind';
import styles from './Feeds.module.scss';
import axios from 'axios';
import useAxios from '~/utils/useAxios';
import { notifyError } from '~/utils/notifications';

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

const Feeds = () => {
    const api = useAxios();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [dataSource, setDataSource] = useState([]);
    const user = localStorage.getItem('current_user');
    useEffect(() => {
        api.get(`${BASE_URL}/feed/${JSON.parse(user)._id}/`)
            .then((res) => {
                let data = JSON.parse(res.data);
                const dataFeed = data.map((value, index) => {
                    return {
                        key: value._id,
                        name: value.name,
                        value: value.value,
                        description: value.description,
                        createTime: _parse_date(new Date(value.created_at)),
                        updateTime: _parse_date(new Date(value.updated_at)),
                    };
                });
                setDataSource(dataFeed);
            })
            .catch((err) => console.log(err.response));
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
        api.delete(`${BASE_URL}/feed/${key}/`)
            .then((res) => {
                console.log('Delete successfully');
                const newData = dataSource.filter((item) => item.key !== key);
                setDataSource(newData);
            })
            .catch((err) => console.log(err.response));
    };
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...dataSource];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                let item = newData[index];
                item.updateTime = _parse_date(new Date());
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setDataSource(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setDataSource(newData);
                setEditingKey('');
            }
            const user = localStorage.getItem('current_user');
            const updateRow = {
                id: key,
                name: row.name,
                description: row.description,
                updated_at: new Date(),
                user: JSON.parse(user)._id,
            };
            api.put(`${BASE_URL}/feed/${key}/`, updateRow)
                .then((res) => {
                    console.log('Edit successfully');
                })
                .catch((err) => console.log(err.response));
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.length - b.name.length,
            editable: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '20%',
            ...getColumnSearchProps('description'),
            editable: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '20%',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.createTime > b.createTime,
            editable: false,
        },
        {
            title: 'Updated At',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: '20%',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.updateTime > b.updateTime,
            editable: false,
        },
        {
            title: 'Options',
            key: 'option',
            fixed: 'right',
            width: '30%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link
                            disabled={editingKey !== ''}
                            onClick={() => {
                                edit(record);
                            }}
                            style={{
                                color: 'black',
                                marginRight: 6,
                            }}
                        >
                            <EditOutlined />
                        </Typography.Link>
                        <Popconfirm
                            placement="topRight"
                            title='If this feed is permanently deleted, any widgets connected to this feed will also be
                            deleted.'
                            onConfirm={() => handleDelete(record.key)}
                        >
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
                editing: isEditing(record),
            }),
        };
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form1] = Form.useForm();
    const showModal = () => {
        setIsModalOpen(true);
    };

    const onSave = (values) => {
        let check = true;
        dataSource.map((feed) => {
            if (feed.name === values.name) {
                check = false;
                setIsModalOpen(false);
            }
        });
        if (check) {
            const user = localStorage.getItem('current_user');
            const newValue = {
                user: JSON.parse(user)._id,
                name: values.name,
                value: values.value,
                description: values.description,
            };
            axios
                .post(`${BASE_URL}/feed/`, newValue, {
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
                            key: res.data,
                            name: values.name,
                            description: values.description,
                            value: values.value,
                            createTime: _parse_date(date),
                            updateTime: _parse_date(date),
                            // user: JSON.parse(user)(res.data).user,
                        },
                    ]);
                })
                .catch((err) => {
                    if (err && err.response.status === 405)
                        notifyError('You have reached the maximum number of feeds.');
                });
            setIsModalOpen(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className={cx('full-screen')}>
            <Modal
                open={isModalOpen}
                title="Create a new feed"
                okText="Create"
                cancelText="Cancel"
                onCancel={handleCancel}
                onOk={() => {
                    form1
                        .validateFields()
                        .then((values) => {
                            form1.resetFields();
                            onSave(values);
                        })
                        .catch((info) => {
                            // console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={form1} layout="vertical" name="form_in_modal" initialValues={{ Value: '0' }}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input type="textarea" />
                    </Form.Item>
                    <Form.Item name="value" label="Value" initialValue={'0'} style={{ display: 'none' }}>
                        <Input type="textarea" disabled={true} />
                    </Form.Item>
                </Form>
            </Modal>
            <Card
                title="Feeds Manager"
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
                        Add new feed
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
                            onChange: cancel,
                        }}
                    />
                </Form>
            </Card>
        </div>
    );
};

export default Feeds;
