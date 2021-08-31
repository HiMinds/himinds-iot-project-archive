load('api_timer.js');
load('api_mqtt.js');
load('api_gpio.js');
load('api_sys.js');

let topic = '/my/topic/';


let getInfo = function() {
  return JSON.stringify({data:{ total_ram: Sys.total_ram(), free_ram: Sys.free_ram() }});
};

function timerCallback()
{
  print("mqtt publish");
  let message = getInfo();
  let ok = MQTT.pub(topic, message, 1);
  print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
}


MQTT.setEventHandler(function (conn, ev, edata) {
  // Wait for MQTT.EV_CONNACK to ensure the mqtt connection is established
  if (MQTT.EV_CONNACK === ev) {
      print('=== MQTT event handler: got MQTT.EV_CONNACK');

      MQTT.sub(topic+'#', function(conn, topic, msg) {
        print('Topic:', topic, 'message:', msg);
      }, null);

      Timer.set(5000, Timer.REPEAT, timerCallback, null);
  }
}, null);

