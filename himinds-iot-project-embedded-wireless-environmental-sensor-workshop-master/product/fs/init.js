load('api_timer.js');
load('api_arduino_bme280.js');
load('api_mqtt.js');
load('api_gpio.js');
load('api_sys.js');
load('api_config.js');

let topic =  "himinds/workshop/" +Cfg.get('device.id') +"/wireless";

// Default sensors address for BME280
let sens_addr = 0x76;

// Initialize Adafruit_BME280 library using the I2C interface
let bme = Adafruit_BME280.createI2C(sens_addr);

// Exit application
if (bme === undefined) {
  print('Cant find a sensor giving up');
  die('Cant find a BME280 sensor');
}
let getSystemInfo = function() {
  return JSON.stringify( {system_info:{ total_ram: Sys.total_ram(), free_ram: Sys.free_ram() }});
};

let getSensorInfo = function() {
  let temperature = bme.readTemperature();
  let humidity = bme.readHumidity();
  let pressure = bme.readPressure();
 
  print('Temperature:', temperature, '*C');
  print('Humidity:', humidity, '%RH');
  print('Pressure:', pressure, 'hPa');

  return JSON.stringify({data:{ temperature_value: temperature, humidity_value: humidity, pressure_value: pressure}});
};

function timerCallback()
{
  print("mqtt publish");
  let message = getSystemInfo();
  let ok = MQTT.pub(topic+"/system/", message, 1);
  print('Published:', ok ? 'yes' : 'no', 'message:', message);

  let message = getSensorInfo();
  let ok = MQTT.pub(topic+"/sensor/", message, 1);
  print('Published:', ok ? 'yes' : 'no', 'message:', message);
}


MQTT.setEventHandler(function (conn, ev, edata) {
  // Wait for MQTT.EV_CONNACK to ensure the mqtt connection is established
  if (MQTT.EV_CONNACK === ev) {
      print('=== MQTT event handler: got MQTT.EV_CONNACK');

      Timer.set(5000, Timer.REPEAT, timerCallback, null);
  }
}, null);
