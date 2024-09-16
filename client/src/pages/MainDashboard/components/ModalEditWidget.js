// import 'antd/dist/antd.min.css'
import { Table, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { forwardRef, useImperativeHandle } from 'react';
import useAxios from '~/utils/useAxios';

// rowSelection object indicates the need for row selection
const BASE_URL = process.env.REACT_APP_BASE_URL;

const ModalEditWidget = (props, ref) => {
    const api = useAxios();
    let selectedRowKeys1 = [];
    if (props.dataListFeed) {
        props.dataListFeed.map((value, index) => {
            selectedRowKeys1.push(props.dataListFeed[index].key);
        });
    }
    const rowSelection = {
        defaultSelectedRowKeys: selectedRowKeys1,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };
    const [dataSource, setDataSource] = useState(props.allDataFeed);
    const [selectedRow, setSelectedRow] = useState();
    const selectionType = 'radio';
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
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
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
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
    const columns = [
        {
            title: 'Feed name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Recorded',
            dataIndex: 'updateTime',
            sorter: (a, b) => a.recorded - b.recorded,
        },
    ];
    // const callBackWhenClickButton = () => {
    //   props.getDataFeed(selectedRow)
    // }
    useImperativeHandle(ref, () => ({
        callBack(title, allAttribute) {
            if (!selectedRow) props.getDataFeed(props.dataListFeed, title, allAttribute);
            else props.getDataFeed(selectedRow, title, allAttribute);
        },
    }));

    return (
        <>
            {props.widgetType.slice(-8) === 'Location' ||
            props.widgetType === 'Logo Card' ||
            props.widgetType === 'Clock Card' ? (
                <></>
            ) : (
                <>
                    <Table
                        pagination={{ pageSize: 3 }}
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={dataSource}
                    />
                </>
            )}
        </>
    );
};
export default forwardRef(ModalEditWidget);
