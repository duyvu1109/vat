import random
from paho.mqtt import client as mqtt_client

BROKER = 'broker1.hcmut.org'
PORT = 1883
# generate client ID with pub prefix randomly
CLIENT_ID = f'python-mqtt-{random.randint(0, 100)}'
USERNAME = 'vatserver'
PASSWORD = 'vatserver123'


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(CLIENT_ID)
    client.username_pw_set(USERNAME, PASSWORD)
    client.on_connect = on_connect
    client.connect(BROKER, PORT)
    return client
