import React, { useState, useRef } from 'react';
import { dataWidgets } from '../datawidget/dataWidgets.js';
import { dataCharts } from '../datawidget/charts.js';
import { dataMaps } from '../datawidget/maps.js';
import { dataGauges } from '../datawidget/gauges.js';
import { dataControls } from '../datawidget/controls.js';
import { dataCards } from '../datawidget/cards.js';
import { dataDigitals } from '../datawidget/digitals.js';
import { dataStatistics } from '../datawidget/statistics.js'
import { PlusOutlined, CaretLeftOutlined } from '@ant-design/icons';
import {
    Modal,
    Row,
    Col,
    Card,
    Image,
    Space,
    Layout,
    Button,
    Drawer,
    FloatButton,
    Typography,
    Input,
    Form,
} from 'antd';
import ModalAddWidget from './ModalAddWidget';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import ModalCustomGauge from '../gauge/ModalCustomGauge.js';
import ModalCustomDigital from '../digital/ModalCustomDigital.js';
import ModalCustomControl from '../button/ModalCustomControl.js';
import ModalCustomCard from '../card/ModalCustomCard.js';
import ModalCustomImage from '../card/ModalCustomImage.js';
import ModalCustomMap from '../map/ModalCustomMap.js';
import ModalCustomChart from '../chart/ModalCustomChart.js';
import ModalCustomStatistic from '../statistic/ModalCustomStatistic.js';

classNames.bind(styles);
const { Title } = Typography;
function Menu(props) {
    const [form] = Form.useForm();
    const [showButtonBack, setShowButtonBack] = useState(false);
    const [show, setShow] = useState(false);
    const [dataWidget, setWidget] = useState(dataWidgets);
    const [header, setHeader] = useState(' Select widgets bundle');
    const [openFeedForm, setOpenFeedForm] = useState(false);
    const childRef = useRef();
    const [newWidget, setNewWidget] = useState();
    const closeSidebar = () => setShow(false);
    const showSidebar = () => setShow(true);
    const [currentComponent, setCurrentComponent] = useState('');
    const showDetailWidgets = (widget) => {
        var newHeader;
        // Check child-widget
        if (
            widget.slice(-5) === 'Chart' ||
            widget.slice(-5) === 'Gauge' ||
            widget.slice(-7) === 'Control' ||
            widget.slice(-4) === 'Card' ||
            widget.slice(-8) === 'Location' ||
            widget.slice(-7) === 'Digital' ||
            widget.slice(-9) === 'Statistic'
        ) {
            setNewWidget(widget);
            if (widget.slice(-5) === 'Gauge') setCurrentComponent('gauge');
            else if (widget.slice(-7) === 'Digital') setCurrentComponent('digital');
            else if (widget.slice(-7) === 'Control') setCurrentComponent('control');
            else if (widget.slice(-8) === 'Location') setCurrentComponent('map');
            else if (widget.slice(-5) === 'Chart') setCurrentComponent('chart');
            else if (widget.slice(-9) === 'Statistic') setCurrentComponent('statistic');
            else if (widget === 'Simple Card') setCurrentComponent('card');
            else if (widget === 'Logo Card') setCurrentComponent('cardlogo');
            else if (widget === 'Clock Card') setCurrentComponent('clockcard');
            else setCurrentComponent('');
        }
        // Check parent-widget
        if (widget === 'Maps Location') {
            setWidget(dataMaps);
            newHeader = ' ' + widget + ': select widget';
            setShowButtonBack(true);
            setHeader(newHeader);
        }
        if (widget === 'Charts') {
            setWidget(dataCharts);
            newHeader = ' ' + widget + ': select widget';
            setShowButtonBack(true);
            setHeader(newHeader);
        }
        if (widget === 'Analogue gauges') {
            setWidget(dataGauges);
            newHeader = ' ' + widget + ': select widget';
            setShowButtonBack(true);
            setHeader(newHeader);
        }
        if (widget === 'Control widgets') {
            setWidget(dataControls);
            newHeader = ' ' + widget + ': select widget';
            setShowButtonBack(true);
            setHeader(newHeader);
        }
        if (widget === 'Cards') {
            setWidget(dataCards);
            newHeader = ' ' + widget + ': select widget';
            setShowButtonBack(true);
            setHeader(newHeader);
        }
        if (widget === 'Digital widgets') {
            setWidget(dataDigitals);
            newHeader = ' ' + widget + ': select widget';
            setShowButtonBack(true);
            setHeader(newHeader);
        }
        if (widget === 'Statistic') {
            setWidget(dataStatistics);
            newHeader = ' ' + widget + ': select widget';
            setShowButtonBack(true);
            setHeader(newHeader);
        }
        if (dataWidget !== dataWidgets) {
            setOpenFeedForm(true);
            closeSidebar();
            setWidget(dataWidgets);
        }
    };
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
        // number_of_arr
        return allAttribute;
    };

    const handleInputFormDigital = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'min_value') allAttribute[prop] = 0;
                if (prop == 'max_value') allAttribute[prop] = 100;
                if (prop == 'widget_color') allAttribute[prop] = '#5C90FA';
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
                if (prop == 'background_color') allAttribute[prop] = '#FF3300';
                if (prop == 'value_color') allAttribute[prop] = 'white';
                if (prop == 'signature') allAttribute[prop] = '%';
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

    const handleInputFormCardClock = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
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
        }
        return allAttribute;
    };

    const handleInputFormStatistic = (allAttribute) => {
        for (var prop in allAttribute) {
            if (!allAttribute[prop]) {
                if (prop == 'background') allAttribute[prop] = '#ffffff';
                if (prop == 'precision') allAttribute[prop] = 2;
                if (prop == 'equation') allAttribute[prop] = 'avg';
                if (prop == 'value_color') allAttribute[prop] = '#2ec27e';
                if (prop == 'suffix') allAttribute[prop] = '%';
                if (prop == 'title') allAttribute[prop] = '';
                if (prop == 'name_color') allAttribute[prop] = '#000000';
            }
        }
        return allAttribute;
    };

    const handleButtonOk = () => {
        let allAttribute = form.getFieldsValue();
        childRef.current.callBack();
        if (currentComponent === 'gauge') {
            props.getDataWidget(newWidget, handleInputFormGauge(allAttribute));
        } else if (currentComponent === 'digital') {
            props.getDataWidget(newWidget, handleInputFormDigital(allAttribute));
        } else if (currentComponent === 'control') {
            props.getDataWidget(newWidget, handleInputFormControl(allAttribute));
        } else if (currentComponent === 'card') {
            props.getDataWidget(newWidget, handleInputFormCard(allAttribute));
        } else if (currentComponent === 'map') {
            props.getDataWidget(newWidget, handleInputFormMap(allAttribute));
        } else if (currentComponent === 'chart') {
            props.getDataWidget(newWidget, handleInputFormChart(allAttribute));
        } else if (currentComponent === 'statistic') {
            props.getDataWidget(newWidget, handleInputFormStatistic(allAttribute));
        } else if (currentComponent === 'cardlogo') {
            props.getDataWidget(newWidget, handleInputFormCardLogo(allAttribute));
        } else if (currentComponent === 'clockcard') {
            props.getDataWidget(newWidget, handleInputFormCardClock(allAttribute));
        } else props.getDataWidget(newWidget, {});
        handleReset();
        setOpenFeedForm(false);
    };
    const rollBackMenuWidgets = () => {
        setShowButtonBack(false);
        setWidget(dataWidgets);
        setHeader(' Select widgets bundle');
    };
    const handleReset = () => {
        form.resetFields();
        setStateImg(true);
    };
    const renderCustomWidget = () => {
        if (currentComponent === 'gauge') return <ModalCustomGauge />;
        else if (currentComponent === 'digital') return <ModalCustomDigital />;
        else if (currentComponent === 'control') return <ModalCustomControl />;
        else if (currentComponent === 'cardlogo')
            return <ModalCustomImage getSrcImage={getSrcImage} stateImg={stateImg} setStateImg={setStateImg} />;
        else if (currentComponent === 'card') return <ModalCustomCard />;
        else if (currentComponent === 'map') return <ModalCustomMap />;
        else if (currentComponent === 'chart') return <ModalCustomChart />;
        else if (currentComponent === 'statistic') return <ModalCustomStatistic />;
        return <></>;
    };
    return (
        <>
            <FloatButton
                aria-label="create"
                onClick={showSidebar}
                className={styles.bottom}
                icon={<PlusOutlined />}
            ></FloatButton>
            <Modal
                centered
                open={openFeedForm}
                onOk={handleButtonOk}
                onCancel={() => {
                    form.resetFields();
                    setOpenFeedForm(false);
                    setStateImg(true);
                }}
                width={1000}
            >
                <Form form={form}>
                    <Row>
                        <Col span={10}>
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
                            <Form.Item style={{ marginLeft: '10px' }} name={'name_color'}>
                                <input type="color" />
                            </Form.Item>
                        </Col>
                    </Row>
                    {renderCustomWidget()}
                </Form>
                {currentComponent === 'map' || currentComponent === 'cardlogo' || currentComponent === 'clockcard' ? (
                    <></>
                ) : (
                    <Title level={5}>Connect a Feed</Title>
                )}
                <ModalAddWidget
                    ref={childRef}
                    getDataFeed={props.getDataFeed}
                    allDataFeed={props.allDataFeed}
                    widgetType={currentComponent}
                />
            </Modal>
            <Layout className={styles.layoutGrid}></Layout>
            <Layout>
                <Drawer
                    placement="right"
                    open={show}
                    onClose={closeSidebar}
                    size={'large'}
                    title={
                        <Space size={15}>
                            {showButtonBack && (
                                <Button aria-label="create1" onClick={rollBackMenuWidgets}>
                                    <CaretLeftOutlined />
                                </Button>
                            )}
                            <h2>{header}</h2>
                        </Space>
                    }
                >
                    {dataWidget.map((widget, index, array) => {
                        if (index % 2 !== 0 || index > dataWidget.length - 1) {
                            return <Layout key={index * 10}></Layout>;
                        } else {
                            return (
                                <Row key={index * 10} gutter={16}>
                                    <Col span={12}>
                                        <Card
                                            title={array[index].title}
                                            key={array[index].id}
                                            onClick={() => {
                                                showDetailWidgets(array[index].title);
                                            }}
                                        >
                                            <Row gutter={16}>
                                                <Col span={12}>
                                                    <Image
                                                        variant="left"
                                                        width={155}
                                                        height={135}
                                                        src={array[index].image}
                                                        className={styles.imageContent}
                                                        preview={false}
                                                    />
                                                </Col>
                                                <Col span={12}>
                                                    <Typography className={styles.contenCard}>
                                                        {array[index].content}
                                                    </Typography>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                    {array[index + 1] && (
                                        <Col span={12}>
                                            <Card
                                                title={array[index + 1].title}
                                                key={array[index + 1].id}
                                                onClick={() => {
                                                    showDetailWidgets(array[index + 1].title);
                                                }}
                                            >
                                                <Row gutter={16}>
                                                    <Col span={12}>
                                                        <Image
                                                            variant="left"
                                                            width={155}
                                                            height={135}
                                                            src={array[index + 1].image}
                                                            className={styles.imageContent}
                                                            preview={false}
                                                        />
                                                    </Col>
                                                    <Col span={12}>
                                                        <Typography className={styles.contenCard}>
                                                            {array[index + 1].content}
                                                        </Typography>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    )}
                                </Row>
                            );
                        }
                    })}
                </Drawer>
            </Layout>
        </>
    );
}
export default Menu;
