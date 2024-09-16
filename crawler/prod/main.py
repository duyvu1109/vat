from pymongo import MongoClient
from datetime import datetime
import json

cluster = MongoClient(
    "mongodb+srv://bkiot:bkiot123@vat-0423.ooa4ngs.mongodb.net/?retryWrites=true&w=majority"
)
# go to database
db = cluster["main-1704"]
feedData = db['vat_backend_feedvalue']

def insert(topic, message):
    newValue = {
        "value": message,
        "time_stamp": datetime.now(),
        "topic": topic
    }
    feedData.insert_one(newValue)

import paho.mqtt.client as mqtt

BROKER = 'broker1.hcmut.org'
PORT = 1883
USERNAME = 'vatserver'
PASSWORD = 'vatserver123'

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # subscribe to all topics
    client.subscribe("#")

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    # print(msg.payload.decode('utf8'))
    # print(type(msg.topic))
    insert(msg.topic, msg.payload.decode('utf8'))

def run():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.username_pw_set(USERNAME, PASSWORD)
    client.connect(BROKER, PORT)

    client.loop_forever()

run()