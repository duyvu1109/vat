FROM python:alpine

WORKDIR /usr/src/app

RUN pip install --upgrade pip 
RUN pip install pymongo paho.mqtt

COPY . /usr/src/app
CMD [ "python", "main.py" ]
