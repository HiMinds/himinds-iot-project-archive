# himinds-iot-project-embedded-pc-nodejs-mqtt-adc-simulator

Simulates an ADC and posts value on MQTT.
The ADC value is a sine wave and you can control the frequency, offset and amplitude.
Part of Home Energy Monitor project.

Inspired by:

* https://teropa.info/blog/2016/08/04/sine-waves.html
* https://www.dummies.com/education/math/trigonometry/understanding-how-a-sine-function-works/

Change the MQTT_HOST, MQTT_USER, MQTT_PASSWORD, DEVICE and MQTT topic to suite your needs.


## Installation

```
npm install
```

## Running
Configure the paramters described above.

```
node main.js
```
