import React, { useState, useRef } from 'react';
import ModalEditWidget from './ModalEditWidget';
import { Card, Button, Modal, Popconfirm, Input, Typography, Form, Row, Col } from 'antd';
import { DeleteFilled, EditFilled, CloseOutlined } from '@ant-design/icons';
import ModalCustomGauge from './gauge/ModalCustomGauge.js';
import ModalCustomDigital from './digital/ModalCustomDigital.js';
import ModalCustomControl from './button/ModalCustomControl.js';
import ModalCustomCard from './card/ModalCustomCard.js';
import ModalCustomImage from './card/ModalCustomImage.js';
import ModalCustomMap from './map/ModalCustomMap';
import ModalCustomChart from './chart/ModalCustomChart';
import ModalCustomStatistic from './statistic/ModalCustomStatistic.js';

const { Title } = Typography;

function SettingCard(props) {
    const [form] = Form.useForm();
    const confirmDeleteWidget = () => {
        props.onRemoveItem(props.id);
    };
    const [open, setOpen] = useState(
        props.optionEditFeed ? false : props.nameCanTurnOnFeedForm == props.id ? true : false,
    );
    const handleClose = () => {
        setOpen(false);
        setStateImg(true);
        props.setOptionEditFeed(true);
    };
    const childRef = useRef();
    const handleInputFormGauge = (allAttribute) => {
        allAttribute['color'] = '';
        let counter = 0;
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'animate') allAttribute[prop] = false;
                if (prop == 'arc_width') allAttribute[prop] = 0.3;
                if (prop == 'max_value') allAttribute[prop] = 100;
                if (prop == 'text_color') allAttribute[prop] = '#000000';
                if (prop == 'number_of_element') allAttribute[prop] = 20;
                if (prop == 'signature') allAttribute[prop] = 'Km/h';
                if (prop == 'title') allAttribute[prop] = '';
                if (prop == 'name_color') allAttribute[prop] = '#000000';
            } else {
                if (prop.substring(0, 9) == 'arr_color') {
                    allAttribute['color'] = allAttribute['color'] + allAttribute[prop];
                    counter++;
                }
            }
        }
        for (let i = counter; i < allAttribute.number_of_arr; i++) {
            allAttribute['color'] += '#000000';
        }
        return allAttribute;
    };

    const handleInputFormDigital = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'widget_corlor') allAttribute[prop] = '#5C90FA';
                if (prop == 'min_value') allAttribute[prop] = 0;
                if (prop == 'max_value') allAttribute[prop] = 100;
                if (prop == 'title') allAttribute[prop] = '';
                if (prop == 'name_color') allAttribute[prop] = '#000000';
            }
        }
        return allAttribute;
    };
    const handleInputFormControl = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'on_color') allAttribute[prop] = '#009933';
                if (prop == 'off_color') allAttribute[prop] = '#CC3300';
                if (prop == 'title') allAttribute[prop] = '';
                if (prop == 'name_color') allAttribute[prop] = '#000000';
            }
        }
        return allAttribute;
    };

    const handleInputFormCard = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'value_color') allAttribute[prop] = 'white';
                if (prop == 'background_color') allAttribute[prop] = '#FF3300';
                if (prop == 'signature') allAttribute[prop] = '%';
                if (prop == 'title') allAttribute[prop] = '';
                if (prop == 'name_color') allAttribute[prop] = '#000000';
            }
        }
        return allAttribute;
    };

    let newSrc = '';
    const getSrcImage = (src) => {
        newSrc = src;
    };
    const [stateImg, setStateImg] = useState(false);
    const handleInputFormCardLogo = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'image_data') allAttribute[prop] = newSrc;
                if (prop == 'title') allAttribute[prop] = '';
                if (prop == 'name_color') allAttribute[prop] = '#000000';
            }
            if (allAttribute[prop]) {
                if (prop == 'image_data' && newSrc === '') {
                    allAttribute[prop] = '';
                } else {
                    if (prop == 'image_data') {
                        allAttribute[prop] = newSrc;
                    }
                }
            }
        }
        return allAttribute;
    };

    const handleInputFormCardClock = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'title') allAttribute[prop] = '';
                if (prop == 'name_color') allAttribute[prop] = '#000000';
            }
        }
        return allAttribute;
    };

    const handleInputFormMap = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'latitude') allAttribute[prop] = 10;
                if (prop == 'longitude') allAttribute[prop] = 106;
                if (prop == 'title') allAttribute[prop] = '';
                if (prop == 'name_color') allAttribute[prop] = '#000000';
            }
        }
        return allAttribute;
    };

    const handleInputFormChart = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'signature') allAttribute[prop] = 'Km/h';
                if (prop == 'color_value') allAttribute[prop] = '#62a0ea';
                if (prop == 'curve_type') allAttribute[prop] = 'monotone';
                if (prop == 'grid_color') allAttribute[prop] = '#99c1f1';
                if (prop == 'background') allAttribute[prop] = '#ffffff';
                if (prop == 'title') allAttribute[prop] = '';
                if (prop == 'name_color') allAttribute[prop] = '#000000';
            }
        }
        return allAttribute;
    };

    const handleInputFormStatistic = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'background') allAttribute[prop] = '#ffffff';
                if (prop == 'precision') allAttribute[prop] = 2;
                if (prop == 'value_color') allAttribute[prop] = '#2ec27e';
                if (prop == 'equation') allAttribute[prop] = 'avg';
                if (prop == 'suffix') allAttribute[prop] = '%';
                if (prop == 'title') allAttribute[prop] = '';
                if (prop == 'name_color') allAttribute[prop] = '#000000';
            }
        }
        return allAttribute;
    };

    const handleButtonOk = () => {
        let allAttribute;
        if (props.widgetType.slice(-5) === 'Gauge') {
            allAttribute = handleInputFormGauge(form.getFieldsValue());
        }
        if (props.widgetType.slice(-7) === 'Digital') {
            allAttribute = handleInputFormDigital(form.getFieldsValue());
        }
        if (props.widgetType.slice(-7) === 'Control') {
            allAttribute = handleInputFormControl(form.getFieldsValue());
        }
        if (props.widgetType === 'Simple Card') {
            allAttribute = handleInputFormCard(form.getFieldsValue());
        }
        if (props.widgetType === 'Logo Card') {
            allAttribute = handleInputFormCardLogo(form.getFieldsValue());
        }
        if (props.widgetType === 'Clock Card') {
            allAttribute = handleInputFormCardClock(form.getFieldsValue());
        }
        if (props.widgetType.slice(-8) === 'Location') {
            allAttribute = handleInputFormMap(form.getFieldsValue());
        }
        if (props.widgetType.slice(-5) === 'Chart') {
            allAttribute = handleInputFormChart(form.getFieldsValue());
        }
        if (props.widgetType.slice(-9) === 'Statistic') {
            allAttribute = handleInputFormStatistic(form.getFieldsValue());
        }
        childRef.current.callBack(allAttribute.title, allAttribute);
        handleClose();
        props.setDisabled(false);
    };

    let newArrayColor_Gauge = [];
    const get_initial_values_form_edit_widget = () => {
        let initialValues = {};
        if (props.widgetType.slice(-5) === 'Gauge') {
            newArrayColor_Gauge = props.attribute.color.split('#');
            newArrayColor_Gauge.shift();
            initialValues = {
                title: props.name,
                name_color: props.attribute.name_color,
                number_of_element: props.attribute.number_of_element,
                arc_width: props.attribute.arc_width,
                signature: props.attribute.signature,
                text_color: props.attribute.text_color,
                max_value: props.attribute.max_value,
                number_of_arr: newArrayColor_Gauge.length,
                animate: props.attribute.animate,
            };
            for (let i = 0; i < newArrayColor_Gauge.length; i++) {
                initialValues['arr_color' + i] = '#' + newArrayColor_Gauge[i];
            }
        } else if (props.widgetType.slice(-7) === 'Digital') {
            initialValues = {
                title: props.name,
                name_color: props.attribute.name_color,
                min_value: props.attribute.min_value,
                max_value: props.attribute.max_value,
                widget_color: props.attribute.widget_color,
            };
        } else if (props.widgetType.slice(-7) === 'Control') {
            initialValues = {
                title: props.name,
                name_color: props.attribute.name_color,
                on_color: props.attribute.on_color,
                off_color: props.attribute.off_color,
            };
        } else if (props.widgetType === 'Simple Card') {
            initialValues = {
                title: props.name,
                name_color: props.attribute.name_color,
                background_color: props.attribute.background_color,
                value_color: props.attribute.value_color,
                signature: props.attribute.signature,
            };
        } else if (props.widgetType === 'Logo Card') {
            newSrc = props.attribute.image_data;
            initialValues = {
                title: props.name,
                name_color: props.attribute.name_color,
                image_data: props.attribute.image_data,
            };
        } else if (props.widgetType === 'Clock Card') {
            initialValues = {
                title: props.name,
                name_color: props.attribute.name_color,
            };
        } else if (props.widgetType.slice(-8) === 'Location') {
            initialValues = {
                title: props.name,
                name_color: props.attribute.name_color,
                latitude: props.attribute.latitude,
                longitude: props.attribute.longitude,
            };
        } else if (props.widgetType.slice(-5) === 'Chart') {
            initialValues = {
                title: props.name,
                name_color: props.attribute.name_color,
                signature: props.attribute.signature,
                color_value: props.attribute.color_value,
                curve_type: props.attribute.curve_type,
                grid_color: props.attribute.grid_color,
                background: props.attribute.background,
            };
        } else if (props.widgetType.slice(-9) === 'Statistic') {
            initialValues = {
                title: props.name,
                name_color: props.attribute.name_color,
                background: props.attribute.background,
                precision: props.attribute.precision,
                suffix: props.attribute.suffix,
                equation: props.attribute.equation,
                value_color: props.attribute.value_color,
            };
        }
        return initialValues;
    };

    const renderCustomWidget = () => {
        if (props.widgetType.slice(-5) === 'Gauge')
            return <ModalCustomGauge number_of_arr={newArrayColor_Gauge.length} />;
        else if (props.widgetType.slice(-7) === 'Digital') {
            return <ModalCustomDigital />;
        } else if (props.widgetType.slice(-7) === 'Control') {
            return <ModalCustomControl />;
        } else if (props.widgetType === 'Simple Card') {
            return <ModalCustomCard />;
        } else if (props.widgetType === 'Logo Card') {
            return (
                <ModalCustomImage
                    getSrcImage={getSrcImage}
                    stateImg={stateImg}
                    setStateImg={setStateImg}
                    initialValues={get_initial_values_form_edit_widget()}
                />
            );
        } else if (props.widgetType.slice(-8) === 'Location') {
            return <ModalCustomMap />;
        } else if (props.widgetType.slice(-5) === 'Chart') {
            return <ModalCustomChart />;
        } else if (props.widgetType.slice(-9) === 'Statistic'){
            return <ModalCustomStatistic />;
        }
        return <></>;
    };
    return (
        <>
            <Card size="small" bordered={false}>
                <Button
                    type="primary"
                    onClick={() => {
                        setOpen(true);
                        props.setOptionEditFeed(false, props.id);
                    }}
                    icon={<EditFilled />}
                    size="small"
                />
                <Popconfirm
                    placement="top"
                    title={'Are you sure you want to remove this widget?'}
                    onConfirm={confirmDeleteWidget}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" icon={<DeleteFilled />} size="small" danger />
                </Popconfirm>
                <Button icon={<CloseOutlined />} size="small" onClick={props.onCloseCard} />
            </Card>
            {
                <Modal
                    title=""
                    centered
                    onClose={handleClose}
                    open={open}
                    onOk={handleButtonOk}
                    onCancel={handleClose}
                    width={1000}
                >
                    <Form form={form} initialValues={get_initial_values_form_edit_widget()}>
                        <Row>
                            <Col span={11}>
                                <Title level={5}>Title of Widget</Title>
                                <Form.Item name="title">
                                    <Input placeholder="Please enter title of widget" />
                                </Form.Item>
                            </Col>
                            <Col span={2}></Col>
                            <Col span={8}>
                                <Title level={5}>Title Color</Title>
                                <Form.Item name="name_color">
                                    <Input placeholder="Please enter title color" />
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Title style={{ marginLeft: '10px' }} level={5}>
                                    Color
                                </Title>
                                <Form.Item style={{ marginLeft: '10px' }} name="name_color">
                                    <input type="color" />
                                </Form.Item>
                            </Col>
                        </Row>
                        {renderCustomWidget()}
                    </Form>
                    {props.widgetType.slice(-8) === 'Location' ||
                    props.widgetType === 'Logo Card' ||
                    props.widgetType === 'Clock Card' ? (
                        <></>
                    ) : (
                        <Title level={5}>Connect a Feed</Title>
                    )}
                    <ModalEditWidget
                        getDataFeed={props.getDataFeed}
                        dataListFeed={props.dataListFeed}
                        allDataFeed={props.allDataFeed}
                        widgetType={props.widgetType}
                        ref={childRef}
                    />
                </Modal>
            }
        </>
    );
}
export default SettingCard;
