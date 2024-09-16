import time, json, random

def publish(client):
    while True:
        time.sleep(6)
        data0 = {"value": random.randint(0,100)}
        result = client.publish('/bkiot/thanh.nguyen231101@hcmut.edu.vn/BBC_HUMI', json.dumps(data0))
        data1 = {"value": random.randint(0,50)}
        result = client.publish('/bkiot/thanh.nguyen231101@hcmut.edu.vn/BBC_TEMP', json.dumps(data1))
        # data2 = {"value": random.randint(0,1)}
        # result = client.publish('/bkiot/thanh.nguyen231101@hcmut.edu.vn/BBC_BUTTON', json.dumps(data2))
        # result: [0, 1]
        status = result[0]
        if status == 0:
            print(data0, 'HUMI')
            print(data1, 'TEMP')
            # print(data2, 'BUTTON')
        else:
            print("KO")
