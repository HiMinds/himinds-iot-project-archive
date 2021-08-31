load('api_timer.js');
load('api_mqtt.js');
load('api_gpio.js');
load('api_sys.js');
load('api_config.js');

let topic =  "himinds/workshop/" +Cfg.get('device.id') +"/mqtt";

let getInfo = function() {
  return JSON.stringify({data:{ total_ram: Sys.total_ram(), free_ram: Sys.free_ram() }});
};

let getInfoSimple = function() {
  return JSON.stringify(Sys.free_ram());
};

function timerCallback()
{
  print("mqtt publish");
  let message = getInfoSimple();
  let ok = MQTT.pub(topic, message, 1);
  print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
}


MQTT.setEventHandler(function (conn, ev, edata) {
  // Wait for MQTT.EV_CONNACK to ensure the mqtt connection is established
  if (MQTT.EV_CONNACK === ev) {
      print('=== MQTT event handler: got MQTT.EV_CONNACK');

      MQTT.sub(topic+'/#', function(conn, topic, msg) {
        print('Topic:', topic, 'message:', msg);
      }, null);

      Timer.set(5000, Timer.REPEAT, timerCallback, null);
  }
}, null);

