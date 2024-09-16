import { DeleteOutlined, EditOutlined, FolderOpenOutlined, SearchOutlined, CopyOutlined } from '@ant-design/icons';
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
    Checkbox,
    Modal,
    message,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import NewDashboardForm from '~/pages/components/NewDashboardForm/NewDashboardForm';
import classNames from 'classnames/bind';
import styles from './Dashboards.module.scss';
import useAxios from '~/utils/useAxios';

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
const BASE_URL = process.env.REACT_APP_BASE_URL;
const Dashboards = () => {
    const api = useAxios();
    const [messageApi, contextHolder] = message.useMessage();
    const [count, setCount] = useState(2);
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [openCreateForm, setOpenCreateForm] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();
    const [form_edit] = Form.useForm();
    const user = localStorage.getItem('current_user');
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    // ============================ API ===============================
    useEffect(() => {
        api.get(`${BASE_URL}/dashboard/${JSON.parse(user)._id}/`)
            .then((res) => {
                let data = JSON.parse(res.data);
                const dataDashboard = data.map((value, index) => {
                    return {
                        key: value._id,
                        name: value.name,
                        description: value.description,
                        public: value.public,
                        link_public: value.link_public,
                        updated_at: _parse_date(new Date(value.updated_at)),
                    };
                });
                setDataSource(dataDashboard);
                setCount(dataDashboard.length);
            })
            .catch((err) => console.log(err.response));
    }, []);
    // =========================== API ===========================
    const showModalEdit = (record) => {
        form_edit.setFieldsValue({
            key: record.key,
            name: record.name,
            description: record.description,
            public: record.public,
            //     last_name: record.last_name,
            //     is_staff: record.is_staff ? 'admin' : 'student',
        });
        setIsModalEditOpen(true);
    };
    const handleCancelEdit = () => {
        setIsModalEditOpen(false);
    };
    const saveActionEdit = async (values) => {
        try {
            const row = values;
            const newData = [...dataSource];
            const index = newData.findIndex((item) => values.key === item.key);
            if (index > -1) {
                const item = newData[index];
                item.updated_at = _parse_date(new Date());
                item.public = values.public;
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
            api.put(`${BASE_URL}/dashboard/${values.key}/`, row)
                .then((res) => console.log('Edit successfully'))
                .catch((err) => console.log(err.response));
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
        setIsModalEditOpen(false);
    };
    const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
        const inputNode = inputType === 'checkbox' ? <Checkbox /> : <Input />;
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
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
        setCount(count - 1);
        api.delete(`${BASE_URL}/dashboard/${key}/`)
            .then((res) => {
                console.log('Delete successfully');
            })
            .catch((err) => console.log(err.response));
    };
    const handleAdd = () => {
        setOpenCreateForm(true);
    };
    const isEditing = (record) => record.key === editingKey;
    const cancel = () => {
        setEditingKey('');
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
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
            align: 'center',
            title: 'Public',
            dataIndex: 'public',
            key: 'public',
            width: '10%',
            editable: true,
            render: (_, record) => {
                return <Checkbox checked={record.public ? true : false}></Checkbox>;
            },
        },
        {
            align: 'center',
            title: 'Link Public',
            dataIndex: 'link_public',
            key: 'link_public',
            width: '20%',
            editable: true,
            render: (_, record) => {
                const copy = async () => {
                    await navigator.clipboard.writeText(record.link_public);
                    messageApi.open({
                        type: 'success',
                        content: 'Dashboard Id has been copied to clipboard',
                    });
                };
                return (
                    <>
                        {contextHolder}
                        <Space>
                            <Button onClick={copy}>
                                <CopyOutlined />
                                Copy Link
                            </Button>
                        </Space>
                    </>
                );
            },
        },
        {
            title: 'Updated time',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: '20%',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.updated_at > b.updated_at,
            editable: false,
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
                            disabled={editingKey !== ''}
                            onClick={() => showModalEdit(record)}
                            style={{
                                color: 'black',
                                marginRight: 6,
                            }}
                        >
                            <EditOutlined />
                        </Typography.Link>
                        <FolderOpenOutlined
                            style={{
                                marginRight: 6,
                            }}
                            onClick={() => navigate(`/maindashboard/${record.key}`)}
                        />
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                            <DeleteOutlined />
                        </Popconfirm>
                    </>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        // console.log(col);
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'public' ? 'checkbox' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <div className={cx('full-screen')}>
            {(openCreateForm || !count) && <NewDashboardForm setOpenCreateForm={setOpenCreateForm} />}
            {!openCreateForm && !!count && (
                <Card
                    title="Dashboards Manager"
                    style={{
                        width: '100%',
                    }}
                >
                    <Form form={form} component={false}>
                        <Button
                            onClick={handleAdd}
                            type="primary"
                            style={{
                                marginBottom: 16,
                            }}
                        >
                            Add new dashboard
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
                        <Modal
                            open={isModalEditOpen}
                            title="Edit Dashboard"
                            okText="Save"
                            cancelText="Cancel"
                            onCancel={handleCancelEdit}
                            onOk={() => {
                                form_edit
                                    .validateFields()
                                    .then((values) => {
                                        form_edit.resetFields();
                                        saveActionEdit(values);
                                    })
                                    .catch((info) => {
                                        console.log('Validate Failed:', info);
                                    });
                            }}
                        >
                            <Form form={form_edit} layout="vertical" name="form_in_modal">
                                <Form.Item name="key" hidden={true}>
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label="Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the Name!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter the Description!',
                                        },
                                    ]}
                                >
                                    <Input type="textarea" />
                                </Form.Item>
                                <Form.Item name="public" label="Public" valuePropName="checked">
                                    <Checkbox></Checkbox>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default Dashboards;
