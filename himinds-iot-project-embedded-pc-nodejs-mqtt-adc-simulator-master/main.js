'use strict';
const mqtt = require('mqtt');

const DESIRED_FREQUENCY = 10;  // 10 Hz
const ANGULAR_FREQUENCY = DESIRED_FREQUENCY * 2 * Math.PI; //ω = 2πf, the angular frequency, the rate of change of the function argument in units of radians per second

const SAMPLE_FREQUENCY = 100; // 100 Hz

// ADC is 12-bits, max 4096, we can not handle negative values so we are pushing the whole curve up.
const AMPLITUDE = 2048
const OFFSET = 2048;

const MQTT_HOST = "";
const MQTT_USER = "";
const MQTT_PASSWORD = "";
const DEVICE = "esp32_simulator";

let adcArray = [SAMPLE_FREQUENCY];

function generateSample(sampleNumber) {
   let currentTime = sampleNumber / (SAMPLE_FREQUENCY/2);
   let currentAngle = currentTime * ANGULAR_FREQUENCY;
   return Math.sin(currentAngle); //Math.sin takes a number (given in radians).
 }

for (let sampleNumber = 0 ; sampleNumber < SAMPLE_FREQUENCY ; sampleNumber++) {
   adcArray[sampleNumber] = OFFSET + (((AMPLITUDE) * generateSample(sampleNumber)));
}

const client = mqtt.connect('mqtt://' +MQTT_HOST, {username: MQTT_USER, password: MQTT_PASSWORD});

client.on('connect', () => {
   // Inform controllers that garage is connected
   client.publish('devices/' +DEVICE +'/ready/', 'true');
 })


 var myVar = setInterval(myTimer, 3000);

 function myTimer() {
   client.publish('devices/'+DEVICE +'/ADC/', JSON.stringify(adcArray));
 }
