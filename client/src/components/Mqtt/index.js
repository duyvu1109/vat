import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt/dist/mqtt';
import { forwardRef, useImperativeHandle } from 'react';
const ServeMqtt = (props, ref) => {
    const [session, setSession] = useState({
        client: null,
        connectStatus: 'Connect',
        isSubed: false,
        messages: [],
    });
    const handleConnect = (host, mqttOptions) => {
        setSession({ ...session, connectStatus: 'Connecting' });
        session.client = mqtt.connect(host, mqttOptions);
        // console.log(session.client);
        if (session.client) {
            session.client.on('connect', () => {
                setSession({ ...session, connectStatus: 'Connected' });
            });
            session.client.on('error', (err) => {
                console.error('Connection error: ', err);
                session.client.end();
            });
            session.client.on('reconnect', () => {
                setSession({ ...session, connectStatus: 'Reconnecting' });
            });
            session.client.on('message', (topic, message) => {
                const payload = { topic, message: message.toString() };
                props.getDataFeed(payload);
                const messages = session.messages;
                if (payload.topic) {
                    const changedMessages = messages.concat([payload.message]);
                    setSession({ ...session, messages: changedMessages });
                }
            });
        }
    };
    const handleSubscribe = (topic, qos) => {
        if (session.client) {
            session.client.subscribe(topic, { qos }, (error) => {
                if (error) {
                    console.log('Subscribe to topics error', error);
                    return;
                }
                setSession({ ...session, isSubed: true });
            });
        }
    };
    const handleUnsub = (topic) => {
        if (session.client) {
            session.client.unsubscribe(topic, (error) => {
                if (error) {
                    console.log('Unsubscribe error', error);
                    return;
                }
                setSession({ ...session, isSubed: false });
            });
        }
    };
    const handlePublish = (pubRecord) => {
        if (session.client) {
            const { topic, qos, payload } = pubRecord;
            session.client.publish(topic, payload, { qos }, (error) => {
                if (error) {
                    console.log('Publish error: ', error);
                }
            });
        }
    };
    useImperativeHandle(ref, () => ({
        handleSubscribe(topic, qos) {
            handleSubscribe(topic, qos);
        },
        handlePublish(pubRecord) {
            handlePublish(pubRecord);
        },
        handleUnsub(topic) {
            handleUnsub(topic);
        },
    }));
    useEffect(() => {
        const host = 'wss://broker.hcmut.org:9001/mqtt';
        const options = {
            keepalive: 30,
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            will: {
                topic: 'WillMsg',
                payload: 'Connection Closed abnormally..!',
                qos: 0,
                retain: false,
            },
            rejectUnauthorized: false,
            clientId: `vat${Math.random().toString(16).substr(2, 8)}`,
            username: 'vatserver',
            password: 'vatserver123',
        };
        handleConnect(host, options);
    }, []);

    return <></>;
};
export default forwardRef(ServeMqtt);
