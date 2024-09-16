import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Card } from 'antd';
import SettingCard from '../SettingCard';
import { SettingOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Widget.module.scss';
const cx = classNames.bind(styles);
const { Title } = Typography;
const useStyles = makeStyles({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem',
        position: 'relative',
        zIndex: 1,
    },
    spacer: {
        flexGrow: 1,
    },
    body: {
        padding: '0.5rem',
        flexGrow: 1,
        position: 'relative',
    },
    setting: {
        position: 'absolute',
        padding: '0.5rem',
        flexGrow: 0,
        top: '20px',
        right: '20px',
        zIndex: 10,
    },
});

const functionSubscribe = (feeds, handleSubscribe, widgetId, newTitle, allAttribute) => {
    handleSubscribe(feeds, 0, widgetId, newTitle, allAttribute);
};
const functionUnSub = (feeds, handleSubscribe) => {
    // feeds.forEach((feed, index) => {
    //     /* Logging the feed to the console. */
    //     // console.log(feed)
    // });
};
var arrMessage = [];
export default function Widget(props) {
    // Attribute config color for simple card
    const classes = useStyles();
    const [disableSettingCard, setDisabled] = useState(false);
    const [titleColor, setTitleColor] = useState('#000000');
    const [cardBackgroundColor, setCardBackgroundColor] = useState('#FF3300');
    let dataFeedSub1 = props.dataListFeed ? props.dataListFeed : [];
    const user = localStorage.getItem('current_user');
    let topicPub = user ? `${JSON.parse(user).username}/` : `${props.user}/`;
    const getDataFeed = (dataFeed, newTitle, allAttribute) => {
        // functionUnSub(dataFeedSub, props.handleUnsub);
        functionSubscribe(dataFeed, props.handleSubscribe, props.id, newTitle, allAttribute);
    };
    var dataSubFeed;

    if (props.dataWidget) {
        let data = JSON.parse(props.dataWidget.message);
        let topic = props.dataWidget.topic.slice(7, props.dataWidget.topic.length);
        if (dataFeedSub1.length > 1) {
            dataSubFeed = [];
            dataFeedSub1.map((feed) => {
                if (feed.name === topic) {
                    dataSubFeed.push(data.value);
                }
                return 0;
            });
        } else {
            if (dataFeedSub1[0] && topicPub + dataFeedSub1[0].name === topic) {
                dataSubFeed = data.value;
                let flagCheck = false;
                arrMessage.forEach((widget) => {
                    if (widget.id === props.id) {
                        flagCheck = true;
                        widget.lastMessage = props.dataWidget;
                    }
                });
                if (!flagCheck) {
                    arrMessage.push({ id: props.id, lastMessage: props.dataWidget });
                }
            } else {
                if (props.widgetType !== 'Switch Control' && props.widgetType !== 'Toggle Control') {
                    arrMessage.forEach((widget) => {
                        if (widget.id === props.id) {
                            let topicCheck = widget.lastMessage.topic.slice(7, widget.lastMessage.topic.length);
                            let dataCheck = JSON.parse(widget.lastMessage.message);
                            if (dataFeedSub1[0] && topicPub + dataFeedSub1[0].name === topicCheck) {
                                dataSubFeed = dataCheck.value;
                            }
                        }
                    });
                }
            }
        }
    }
    const renderTitleWidget = () => {
        if (props.widgetType === 'Radial Gauge' || props.widgetType === 'Compass Gauge') {
            return <></>;
        } else {
            return (
                <Title className={cx('title-widget')} style={{ color: titleColor }} level={3}>
                    {props.widgetNames}
                </Title>
            );
        }
    };
    useEffect(() => {
        if (props.attribute) {
            setTitleColor(props.attribute.name_color);
        }
        if ('background_color' in props.attribute) {
            setCardBackgroundColor(props.attribute.background_color);
        }
    }, [props.attribute]);
    const onClickSetting = () => {
        setDisabled(!disableSettingCard);
    };
    const SettingButtonWidget = (props) => {
        if (props.option) {
            setDisabled(false);
        }
        return (
            <>
                {!props.option && disableSettingCard && (
                    <SettingCard
                        id={props.id}
                        onRemoveItem={props.onRemoveItem}
                        onCloseCard={onClickSetting}
                        getDataFeed={getDataFeed}
                        setDisabled={setDisabled}
                        setOptionEditFeed={props.setOptionEditFeed}
                        optionEditFeed={props.optionEditFeed}
                        name={props.name}
                        attribute={props.attribute}
                        widgetType={props.widgetType}
                        dataListFeed={props.dataListFeed}
                        allDataFeed={props.allDataFeed}
                        nameCanTurnOnFeedForm={props.nameCanTurnOnFeedForm}
                    />
                )}
                {!props.option && !disableSettingCard && (
                    <SettingOutlined aria-label="setting" onClick={onClickSetting}></SettingOutlined>
                )}
            </>
        );
    };
    if (props.widgetType === 'Simple Card' || props.widgetType === 'QR Code Card') {
        let backgroundCard = '#FFFFFF';
        let colorSetting = 'black';
        if (props.widgetType === 'Simple Card') {
            backgroundCard = cardBackgroundColor;
            colorSetting = 'white';
        }
        return (
            <Card bodyStyle={{ background: backgroundCard, color: colorSetting }}>
                <div className={classes.body}>
                    <div className={classes.setting}>
                        <SettingButtonWidget
                            id={props.id}
                            onRemoveItem={props.onRemoveItem}
                            onCloseCard={onClickSetting}
                            option={props.option}
                            setOptionEditFeed={props.setOptionEditFeed}
                            optionEditFeed={props.optionEditFeed}
                            name={props.widgetNames}
                            attribute={props.attribute}
                            widgetType={props.widgetType}
                            dataListFeed={props.dataListFeed}
                            allDataFeed={props.allDataFeed}
                            nameCanTurnOnFeedForm={props.nameCanTurnOnFeedForm}
                        />
                    </div>
                    <props.component
                        w={props.w}
                        h={props.h}
                        dataSubFeed={dataSubFeed}
                        name={props.widgetNames}
                        attribute={props.attribute}
                        feedValues={props.feedValues}
                        user={props.user}
                    />
                </div>
            </Card>
        );
    } else {
        return (
            <div className={cx('div-widget')}>
                {renderTitleWidget()}
                <div className={classes.setting}>
                    <div className={classes.spacer} />
                    <SettingButtonWidget
                        id={props.id}
                        onRemoveItem={props.onRemoveItem}
                        onCloseCard={onClickSetting}
                        option={props.option}
                        setOptionEditFeed={props.setOptionEditFeed}
                        optionEditFeed={props.optionEditFeed}
                        name={props.widgetNames}
                        widgetType={props.widgetType}
                        attribute={props.attribute}
                        dataListFeed={props.dataListFeed}
                        allDataFeed={props.allDataFeed}
                        nameCanTurnOnFeedForm={props.nameCanTurnOnFeedForm}
                    />
                </div>
                <props.component
                    w={props.w}
                    h={props.h}
                    attribute={props.attribute}
                    feedValues={props.feedValues}
                    dataSubFeed={dataSubFeed}
                    callBackPublicData={props.handlePublish}
                    dataListFeed={props.dataListFeed}
                    user={props.user}
                    name={props.widgetNames}
                />
            </div>
        );
    }
}
