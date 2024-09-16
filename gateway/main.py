from connect import *
from pub import *
from sub import *

def run():
    client = connect_mqtt()
    client.loop_start()
    subscribe(client, '/bkiot/thanh.nguyen231101@hcmut.edu.vn/BBC_FAN')
    publish(client)


if __name__ == '__main__':
    run()
