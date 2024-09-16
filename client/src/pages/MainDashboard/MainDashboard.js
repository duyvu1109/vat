import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import Menu from './components/Menu/Menu';
import Widget from './components/widget/Widget';
import { FloatButton, Layout, Typography } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core';
import { SaveOutlined, EditOutlined } from '@ant-design/icons';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { v4 } from 'uuid';

import SpeedGauge from './components/gauge/SpeedGauge.js';
import RadialGauge from './components/gauge/RadialGauge';
import TempGauge from './components/gauge/TempGauge.js';
import CompassGauge from './components/gauge/CompassGauge.js';

import LineChart from './components/chart/LineChart';
import BarChart from './components/chart/BarChart';
import ScatterChart from './components/chart/ScatterChart.js';
import RadarChart from './components/chart/RadarChart.js';
import PieChart from './components/chart/PieChart.js';
import DoughnutChart from './components/chart/DoughnutChart.js';

import SwitchControl from './components/button/SwitchControl.js';
import SwitchExample from './components/button/SwitchExample.js';

import SimpleCard from './components/card/SimpleCard.js';
import ClockWidget from './components/card/Clock/ClockWidget';
import ImageDashboard from './components/card/ImageDashboard.js';

import HeatMapLocation from './components/map/HeatMapLocation.js';
import MapLocation from './components/map/MapLocation.js';
import LoadMap from './components/map/LoadMap.js';
import Weather from './components/map/Weather.js';

import RectangleShapeLiquidDigital from './components/digital/RectangleShapeLiquidDigital.js';
import CircleShapeLiquidDigital from './components/digital/CircleShapeLiquidDigital.js';

import CardStatistic from './components/statistic/CardStatistic.js';

import ServeMqtt from '~/components/Mqtt/index';

import axios from 'axios';

import Moment from 'react-moment';

import classNames from 'classnames/bind';
import styles from './MainDashboard.module.scss';
import useAxios from '~/utils/useAxios';

const { Title } = Typography;
classNames.bind(styles);
const componentList = {
    'Line Chart': LineChart,
    'Bar Chart': BarChart,
    'Radial Bar Chart': ScatterChart,
    'Radar Chart': RadarChart,
    'Pie Chart': PieChart,
    'Doughnut Chart': DoughnutChart,
    'Toggle Control': SwitchExample,
    'Simple Card': SimpleCard,
    'Logo Card': ImageDashboard,
    'Speed Gauge': SpeedGauge,
    'Radial Gauge': RadialGauge,
    'Compass Gauge': CompassGauge,
    'Clock Card': ClockWidget,
    'Switch Control': SwitchControl,
    'Temp Gauge': TempGauge,
    'Map Location': MapLocation,
    'Weather Location': Weather,
    'Rectangle Shape Liquid Digital': RectangleShapeLiquidDigital,
    'Circle Shape Liquid Digital': CircleShapeLiquidDigital,
    'Card Statistic': CardStatistic,
    'HeatMap Location': HeatMapLocation,
};
const drawerWidth = 240;
var listWidget = {};
var newWidgetId;
var topicConnected = [];

const BASE_URL = process.env.REACT_APP_BASE_URL;

function GridLayout(props) {
    LoadMap();
    const api = useAxios();
    const user = localStorage.getItem('current_user');
    // useState
    var textOfHref = window.location.href;
    var MainDashboardId = textOfHref.substring(textOfHref.lastIndexOf('/') + 1);
    const [titleDashboard, setTitleDashboard] = useState('');
    const [compactType, setCompactType] = useState(null);
    const [layouts, setLayouts] = useState({ lg: [] });
    const [option, setOption] = useState(true);
    const [optionWaitApi, setOptionWaitApi] = useState(false);
    const [optionEditFeed, setOptionEditFeed] = useState(true);
    const [allDataFeed, setAllDataFeed] = useState();
    const [dataFeedOfNewWidget, setDataFeedOfNewWidget] = useState();
    const [nameCanTurnOnFeedForm, setNameCanTurnOnFeedForm] = useState();

    // Function
    const setOptionEditFeedF = (state, nameCanTurnOnFeedForm) => {
        setOptionEditFeed(state);
        setNameCanTurnOnFeedForm(nameCanTurnOnFeedForm);
    };
    const onRemoveItem = (id) => {
        setLayouts((current) => ({
            lg: current.lg.filter((item) => item.i !== id),
        }));
    };
    const handleUnsub = (topic) => {
        childRef.current.handleUnsub(topic);
    };
    const onLayoutSave = (_) => {
        var updatedLayouts = { lg: [] };
        for (let i = 0; i < layouts.lg.length; i++) {
            updatedLayouts.lg.push(layouts.lg[i]);
            // push data of new Widget
            if (listWidget[updatedLayouts.lg[i].i]) {
                let listFeedOfWidget = [];
                listWidget[updatedLayouts.lg[i].i].map((value, index) => {
                    listFeedOfWidget.push(value.key);
                });
                updatedLayouts.lg[i].feeds = listFeedOfWidget;
            }
        }
        for (const key in listWidget) {
            if (listWidget.hasOwnProperty(key)) {
                listWidget[key].map((value) => {
                    let topic = `/bkiot/${JSON.parse(user).username}/`;
                    topic += value.name;
                    childRef.current.handleSubscribe(topic, 0);
                });
            }
        }
        var getApi = `${BASE_URL}/maindashboard/${MainDashboardId}/`;
        axios
            .post(getApi, updatedLayouts.lg, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(localStorage.authTokens).access}`,
                },
            })
            .then((res) => {})
            .catch((err) => {
                console.log(err.response);
            });
        setLayouts(updatedLayouts);
        setOption(!option);
    };
    const onLayoutEdit = () => {
        for (const key in listWidget) {
            if (listWidget.hasOwnProperty(key)) {
                listWidget[key].map((value) => {
                    let topic = `/bkiot/${JSON.parse(user).username}/`;
                    topic += value.name;
                    handleUnsub(topic);
                });
            }
        }
        var updatedLayouts = { lg: [] };
        for (let i = 0; i < layouts.lg.length; i++) {
            updatedLayouts.lg.push(layouts.lg[i]);
        }
        setLayouts(updatedLayouts);
        setOption(!option);
    };
    const getDataFeed = (data) => {
        setDataFeedOfNewWidget(data);
    };
    const getDataWidget = (widget, allAttribute) => {
        let w = 3;
        let h = 5;
        if (widget.slice(-5) === 'Gauge') {
            if (widget === 'Speed Gauge' || widget === 'Temp Gauge') {
                w = 3;
                h = 2.5;
            } else {
                w = 3;
                h = 3.5;
            }
        }
        if (widget.slice(-7) === 'Control') {
            w = 3;
            h = 2;
        }
        if (widget.slice(-7) === 'Digital') {
            w = 3;
            h = 5.5;
        }
        if (widget.slice(-4) === 'Card') {
            if (widget === 'Logo Card') {
                w = 3;
                h = 4.5;
            } else if (widget === 'Clock Card') {
                w = 5;
                h = 3;
            } else {
                w = 3.2;
                h = 4;
            }
        }
        if (widget.slice(-8) === 'Location') {
            if (widget === 'Weather Location') {
                w = 5;
                h = 5;
            } else {
                w = 3;
                h = 4;
            }
        }
        if (widget.slice(-5) === 'Chart') {
            if (widget === 'Doughnut Chart') {
                w = 4.2;
                h = 4;
            } else {
                w = 3;
                h = 4;
            }
        }
        if (widget.slice(-9) === 'Statistic') {
            w = 3;
            h = 2.8;
        }
        var uuidKey = v4();
        let newLayout = {
            w: w,
            h: h,
            x: 0,
            y: 15,
            name: allAttribute.title,
            i: uuidKey,
            type: widget,
            attribute: allAttribute,
        };
        newWidgetId = uuidKey;
        listWidget[uuidKey] = [];
        setLayouts((prevState) => ({
            lg: [...prevState.lg, newLayout],
        }));
    };
    const getAllAttributeGauge = (newAttribute, value) => {
        newAttribute.animate = value.animate;
        newAttribute.arc_width = value.arc_width;
        newAttribute.max_value = value.max_value;
        newAttribute.name_color = value.name_color;
        newAttribute.number_of_element = value.number_of_element;
        newAttribute.signature = value.signature;
        newAttribute.text_color = value.text_color;
        newAttribute.color = value.color;
        return newAttribute;
    };
    const getAllAttributeDigital = (newAttribute, value) => {
        newAttribute.widget_color = value.widget_color;
        newAttribute.max_value = value.max_value;
        newAttribute.min_value = value.min_value;
        newAttribute.name_color = value.name_color;
        return newAttribute;
    };
    const getAllAttributeControl = (newAttribute, value) => {
        newAttribute.on_color = value.on_color;
        newAttribute.off_color = value.off_color;
        newAttribute.name_color = value.name_color;
        return newAttribute;
    };
    const getAllAttributeCard = (newAttribute, value) => {
        newAttribute.background_color = value.background_color;
        newAttribute.value_color = value.value_color;
        newAttribute.signature = value.signature;
        newAttribute.name_color = value.name_color;
        return newAttribute;
    };
    const getAllAttributeCardLogo = (newAttribute, value) => {
        newAttribute.image_data = value.image_data;
        newAttribute.name_color = value.name_color;
        return newAttribute;
    };
    const getAllAttributeCardClock = (newAttribute, value) => {
        newAttribute.name_color = value.name_color;
        return newAttribute;
    };
    const getAllAttributeMap = (newAttribute, value) => {
        newAttribute.latitude = value.latitude;
        newAttribute.longitude = value.longitude;
        newAttribute.name_color = value.name_color;
        return newAttribute;
    };
    const getAllAttributeChart = (newAttribute, value) => {
        newAttribute.signature = value.signature;
        newAttribute.color_value = value.color_value;
        newAttribute.curve_type = value.curve_type;
        newAttribute.grid_color = value.grid_color;
        newAttribute.background = value.background;
        newAttribute.name_color = value.name_color;
        return newAttribute;
    };
    const getAllAttributeStatistic = (newAttribute, value) => {
        newAttribute.precision = value.precision;
        newAttribute.suffix = value.suffix;
        newAttribute.background = value.background;
        newAttribute.value_color = value.value_color;
        newAttribute.equation = value.equation;
        newAttribute.name_color = value.name_color;
        return newAttribute;
    };
    useEffect(() => {
        const get_name_dashboard_api = `${BASE_URL}/getDashboard/${MainDashboardId}/`;
        api.get(get_name_dashboard_api)
            .then((res) => {
                let data = JSON.parse(res.data);
                setTitleDashboard(data[0].name);
            })
            .catch((err) => console.log(err.response));

        const fetchData = async () => {
            var getApi = `${BASE_URL}/maindashboard/${MainDashboardId}/`;
            api.get(getApi)
                .then((res) => {
                    let newLayout = [];
                    let data = JSON.parse(res.data);
                    let widget = data.widget.length != 0 ? data.widget : [];
                    widget.map((value, index) => {
                        let newAttribute = {};
                        if (value.type.slice(-5) === 'Gauge') {
                            newAttribute = getAllAttributeGauge(newAttribute, value);
                        }
                        if (value.type.slice(-7) === 'Digital') {
                            newAttribute = getAllAttributeDigital(newAttribute, value);
                        }
                        if (value.type.slice(-7) === 'Control') {
                            newAttribute = getAllAttributeControl(newAttribute, value);
                        }
                        if (value.type === 'Logo Card') {
                            newAttribute = getAllAttributeCardLogo(newAttribute, value);
                        }
                        if (value.type === 'Simple Card') {
                            newAttribute = getAllAttributeCard(newAttribute, value);
                        }
                        if (value.type === 'Clock Card') {
                            newAttribute = getAllAttributeCardClock(newAttribute, value);
                        }
                        if (value.type.slice(-8) === 'Location') {
                            newAttribute = getAllAttributeMap(newAttribute, value);
                        }
                        if (value.type.slice(-5) === 'Chart') {
                            newAttribute = getAllAttributeChart(newAttribute, value);
                        }
                        if (value.type.slice(-9) === 'Statistic') {
                            newAttribute = getAllAttributeStatistic(newAttribute, value);
                        }
                        newLayout.push({
                            w: value.w,
                            h: value.h,
                            x: value.x,
                            y: value.y,
                            i: value._id,
                            attribute: newAttribute,
                            feed_values: value.feed_values,
                            type: value.type,
                            name: value.name,
                            dashboard: value.dashboard,
                            feeds: value.feeds,
                        });
                    });
                    var getApi = `${BASE_URL}/feed/${JSON.parse(user)._id}/`;
                    api.get(getApi)
                        .then((res) => {
                            let data = JSON.parse(res.data);
                            newLayout.map((widget, index) => {
                                listWidget[widget.i] = [];
                                data.map((feedGet, index) => {
                                    widget.feeds.map((feedCur, index) => {
                                        // console.log(feedCur == feedGet._id);
                                        if (feedCur == feedGet._id) {
                                            let newEle = {};
                                            newEle.key = feedGet._id;
                                            newEle.name = feedGet.name;
                                            newEle.value = feedGet.value;
                                            newEle.description = feedGet.description;
                                            listWidget[widget.i].push(newEle);
                                            let topic = `/bkiot/${JSON.parse(user).username}/`;
                                            topic += feedGet.name;
                                            childRef.current.handleSubscribe(topic, 0);
                                        }
                                    });
                                });
                            });
                            const dataFeed = data.map((value, index) => {
                                return {
                                    key: value._id,
                                    name: value.name,
                                    value: value.value,
                                    description: value.description,
                                    createTime: <Moment format="DD/MM/YYYY">{value.created_at}</Moment>,
                                    updateTime: <Moment format="DD/MM/YYYY">{value.updated_at}</Moment>,
                                };
                            });

                            setAllDataFeed(dataFeed);
                        })
                        .catch((err) => console.log(err.response));
                    setOptionWaitApi(true);
                    setLayouts(() => ({
                        lg: [...newLayout],
                    }));
                })
                .catch((err) => console.log(err.response));
        };
        fetchData();
    }, []);

    const onLayoutChange = (_, allLayouts) => {
        for (let i = 0; i < allLayouts.lg.length; i++) {
            allLayouts.lg[i].type = layouts.lg[i].type;
            allLayouts.lg[i].name = layouts.lg[i].name;
            allLayouts.lg[i].dashboard = layouts.lg[i].dashboard;
            allLayouts.lg[i].feeds = layouts.lg[i].feeds;
            allLayouts.lg[i].attribute = layouts.lg[i].attribute;
            allLayouts.lg[i].feed_values = layouts.lg[i].feed_values;
        }
        setLayouts(allLayouts);
    };
    const childRef = useRef();
    var [dataWidget, setDataWidget] = useState();
    const handleSubscribeCreate = (topic, qos) => {
        childRef.current.handleSubscribe(topic, qos);
    };
    const handleSubscribe = (feeds, qos, widgetId, newTitle, allAttribute) => {
        let listFeedOfWidget = [];
        feeds.map((feed, index) => {
            // let topic = `/bkiot/${JSON.parse(user).username}/`;
            // topic += feed.name;
            listFeedOfWidget.push(feed.key);
            // childRef.current.handleSubscribe(topic, qos);
            return 0;
        });
        listWidget[widgetId] = feeds;
        let updatedLayouts = { lg: [] };
        for (let i = 0; i < layouts.lg.length; i++) {
            // push data of new Widget
            updatedLayouts.lg.push(layouts.lg[i]);
            if (layouts.lg[i].i == widgetId) {
                updatedLayouts.lg[i].name = newTitle;
                updatedLayouts.lg[i].feeds = listFeedOfWidget;
                updatedLayouts.lg[i].attribute = allAttribute;
            }
        }
        setLayouts(updatedLayouts);
    };
    const handlePublish = (pubRecord) => {
        childRef.current.handlePublish(pubRecord);
    };
    const getDataFeedToBroker = (data) => {
        setDataWidget(data);
    };
    if (dataFeedOfNewWidget) {
        dataFeedOfNewWidget.forEach((ele) => {
            let flagCheck = true;
            topicConnected.forEach((topic) => {
                if (topic === ele.name) {
                    flagCheck = false;
                }
            });
            if (flagCheck) {
                // handleSubscribeCreate(`/bkiot/${JSON.parse(user).username}/` + ele.name, 0);
                topicConnected.push(ele.name);
            }
            if (listWidget[newWidgetId] && listWidget[newWidgetId].indexOf(ele) === -1)
                listWidget[newWidgetId].push(ele);
        });
        setDataFeedOfNewWidget();
    }
    return (
        <>
            <ServeMqtt ref={childRef} getDataFeed={getDataFeedToBroker}></ServeMqtt>
            {!option && <Menu getDataWidget={getDataWidget} getDataFeed={getDataFeed} allDataFeed={allDataFeed}></Menu>}
            {option && <Layout className="p-4"></Layout>}
            <Title level={4} code={true}>
                {titleDashboard}
            </Title>
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                isDraggable={optionEditFeed ? !option : optionEditFeed}
                isResizable={optionEditFeed ? !option : optionEditFeed}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={60}
                width={1250}
                height={800}
                onLayoutChange={onLayoutChange}
                compactType={compactType}
                preventCollision={!compactType}
            >
                {layouts.lg.map((element) => (
                    <div key={element.i} className="widget" data-grid={layouts.lg.find((x) => x.i === element.i)}>
                        <Widget
                            dataWidget={dataWidget}
                            id={element.i}
                            widgetNames={element.name}
                            widgetType={element.type}
                            onRemoveItem={onRemoveItem}
                            setOptionEditFeed={setOptionEditFeedF}
                            optionEditFeed={optionEditFeed}
                            option={option}
                            component={componentList[element.type]}
                            w={layouts.lg.find((x) => x.i === element.i).w}
                            h={layouts.lg.find((x) => x.i === element.i).h}
                            attribute={layouts.lg.find((x) => x.i === element.i).attribute}
                            feedValues={layouts.lg.find((x) => x.i === element.i).feed_values}
                            handleSubscribe={handleSubscribe}
                            handlePublish={handlePublish}
                            handleUnsub={handleUnsub}
                            dataListFeed={listWidget ? listWidget[element.i] : []}
                            allDataFeed={allDataFeed}
                            nameCanTurnOnFeedForm={nameCanTurnOnFeedForm}
                        />
                    </div>
                ))}
            </ResponsiveGridLayout>
            {!option && (
                <FloatButton
                    icon={<SaveOutlined />}
                    aria-label="save"
                    onClick={onLayoutSave}
                    className={styles.bottom2}
                />
            )}
            {option && optionWaitApi && (
                <FloatButton
                    aria-label="edit"
                    onClick={onLayoutEdit}
                    icon={<EditOutlined />}
                    className={styles.bottom1}
                />
            )}
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
}));
function MainDashboard() {
    const classes = useStyles();
    const theme = createTheme({
        pallete: {
            primary: {
                contrastDefaultColor: 'light',
            },
        },
    });
    return (
        <div>
            <GridLayout />
        </div>
    );
}

export default MainDashboard;
