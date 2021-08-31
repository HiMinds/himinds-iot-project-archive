load('api_config.js');
load('api_mqtt.js');
load('api_gpio.js');
load('api_sys.js');
load('api_timer.js');
load('api_net.js');
load('api_esp32.js');
let appName = 'init.js';

let tempsensor = {
    read_temp: ffi('float sensor_read_temp(void)')
};

let deviceName = Cfg.get('device.id');
let topic = '/devices/' + deviceName + '/events';
print('Topic: ', topic);

function getInfo() {
    return JSON.stringify({
        temp: tempsensor.read_temp()
    });
};

function publishData() {
    if (MQTT.pub(topic, getInfo())) {
        print(appName, 'Published');
    } else {
        print(appName, 'Not connected');
    }
}

Timer
    .set(60000, true, function () {
        //print("read temp push data to server",tempsensor.read_temp());
       publishData();
    },null);



