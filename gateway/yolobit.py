from yolobit import *
button_a.on_pressed = None
button_b.on_pressed = None
button_a.on_pressed_ab = button_b.on_pressed_ab = -1
from mqtt import *
from event_manager import *
import time
from machine import Pin, SoftI2C
from aiot_dht20 import DHT20
from aiot_lcd1602 import LCD1602
from aiot_ir_receiver import *
import json

event_manager.reset()

aiot_dht20 = DHT20(SoftI2C(scl=Pin(22), sda=Pin(21)))

aiot_lcd1602 = LCD1602()

def on_event_timer_callback_Q_S_w_l_W():
  global t_C3_ADn_hi_E1_BB_87u, FAN_value
  # mqtt.publish('/bkiot/nct/BBC_TEMP', (aiot_dht20.dht20_temperature()))
  # mqtt.publish('/bkiot/nct/BBC_HUMI', (aiot_dht20.dht20_humidity()))
  # mqtt.publish('/bkiot/nct/BBC_LIGHT', (round(translate((pin0.read_analog()), 0, 4095, 0, 100))))
  mqtt.publish('/bkiot/thanh.nguyen231101@hcmut.edu.vn/BBC_TEMP', json.dumps({"value": aiot_dht20.dht20_temperature()}))
  mqtt.publish('/bkiot/thanh.nguyen231101@hcmut.edu.vn/BBC_HUMI', json.dumps({"value": aiot_dht20.dht20_humidity()}))
  mqtt.publish('/bkiot/thanh.nguyen231101@hcmut.edu.vn/BBC_LIGHT', json.dumps({"value": round(translate((pin0.read_analog()), 0, 4095, 0, 100))}))
  aiot_lcd1602.clear()
  aiot_dht20.read_dht20()
  aiot_lcd1602.move_to(0, 0)
  aiot_lcd1602.putstr('HUM:')
  aiot_lcd1602.move_to(4, 0)
  aiot_lcd1602.putstr((str(aiot_dht20.dht20_humidity()) + '%'))
  aiot_lcd1602.move_to(0, 1)
  aiot_lcd1602.putstr('TEM:')
  aiot_lcd1602.move_to(4, 1)
  aiot_lcd1602.putstr((str(aiot_dht20.dht20_temperature()) + '*C'))
  aiot_lcd1602.move_to(10, 0)
  aiot_lcd1602.putstr('LIGHT:')
  aiot_lcd1602.move_to(11, 1)
  aiot_lcd1602.putstr((str(round(translate((pin0.read_analog()), 0, 4095, 0, 100))) + '%'))

event_manager.add_timer_event(2000, on_event_timer_callback_Q_S_w_l_W)

def on_mqtt_message_receive_callback___bkiot_nct_BBC_FAN_(FAN_value):
  global t_C3_ADn_hi_E1_BB_87u
  # display.scroll(FAN_value)
  # if FAN_value == 1:
  #   pin2.write_analog(round(translate(70, 0, 100, 0, 1023)))
  # if FAN_value == 0:
  #   pin2.write_analog(round(translate(0, 0, 100, 0, 1023)))
  value_dict = json.loads(FAN_value)
  display.scroll(value_dict['value'])
  if value_dict['value'] == 1:
    pin2.write_analog(round(translate(70, 0, 100, 0, 1023)))
  if value_dict['value'] == 0:
    pin2.write_analog(round(translate(0, 0, 100, 0, 1023)))

# Mô tả hàm này...
def Subsrice_data_from_dashboard():
  global t_C3_ADn_hi_E1_BB_87u, FAN_value, aiot_ir_rx, aiot_dht20, aiot_lcd1602
  mqtt.on_receive_message('/bkiot/thanh.nguyen231101@hcmut.edu.vn/BBC_FAN', on_mqtt_message_receive_callback___bkiot_nct_BBC_FAN_)
aiot_ir_rx = IR_RX(Pin(pin1.pin, Pin.IN)); aiot_ir_rx.start();

def on_ir_receive_callback(t_C3_ADn_hi_E1_BB_87u, addr, ext):
  global FAN_value
  if aiot_ir_rx.get_code() == IR_REMOTE_1:
    # mqtt.publish('/bkiot/nct/BBC_FAN', 1)
    mqtt.publish('/bkiot/thanh.nguyen231101@hcmut.edu.vn/BBC_FAN', json.dumps({"value": 1}))
  if aiot_ir_rx.get_code() == IR_REMOTE_0:
    # mqtt.publish('/bkiot/nct/BBC_FAN', 0)
    mqtt.publish('/bkiot/thanh.nguyen231101@hcmut.edu.vn/BBC_FAN', json.dumps({"value": 0}))
  aiot_ir_rx.clear_code()

aiot_ir_rx.on_received(on_ir_receive_callback)

if True:
  display.scroll('IoT')
  mqtt.connect_wifi('MANG DAY KTX H1-417', '44445555')
  mqtt.connect_broker(server='broker1.hcmut.org', port=1883, username='vatserver', password='vatserver123')
  display.scroll('OK')
  Subsrice_data_from_dashboard()
  FAN_value = 0

while True:
  mqtt.check_message()
  event_manager.run()
  time.sleep_ms(1000)
