/*
 * Copyright (c) HiMinds.com
 *
 * Author:  Suru Dissanaike
 *
* MIT License
*
* Copyright (c) 2018
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');
const timestamp = require('time-stamp');
const noble = require('noble');

// List of allowed devices
const devices = ["cb:bf:8a:d6:87:93"];

// last advertising data received
var lastAdvertising = {};

const projectId = "hm-iot-project-puckjs-demo";
const registryId = "puckjs-registry";
const deviceId = "puckjs-cbbf8ad68793";
const privateKeyFile = "puckjs.pem";
const algorithm = "RS256";
const cloudRegion = "us-central1";
const mqttBridgeHostname = "mqtt.googleapis.com";
const mqttBridgePort = 8883;

const mqttTopic = `/devices/${deviceId}/state`;
const mqttClientId = `projects/${projectId}/locations/${cloudRegion}/registries/${registryId}/devices/${deviceId}`;

console.log(' Smart BLE button to MQTT gateway, GCP IoT Core ');

console.log(mqttTopic);
console.log(mqttClientId);

function onDeviceChanged(addr, data) {

   let buttonCounterValue = data.readUIntLE(0, 1);

   console.log("Device ", addr, "changed data", buttonCounterValue);
   let payload = `{
      "buttonCounter": ${buttonCounterValue},
      "timestamp": ${getTimestamp()},
      }`;

   client.publish(mqttTopic, payload, {
      qos: 1
   }, function (err) {
      //console.log(err);
   });
}

function onDiscovery(peripheral) {
   // do we know this device?
   if (devices.indexOf(peripheral.address) < 0) 
      return;

   // does it have manufacturer data with Espruino/Puck.js's UUID
   if (!peripheral.advertisement.manufacturerData || peripheral.advertisement.manufacturerData[0] != 0x90 || peripheral.advertisement.manufacturerData[1] != 0x05) 
      return;

   // get just our data
   var data = peripheral
      .advertisement
      .manufacturerData
      .slice(2);
   // check for changed services
   if (lastAdvertising[peripheral.address] != data.toString()) 
      onDeviceChanged(peripheral.address, data);
   lastAdvertising[peripheral.address] = data;
}

function createJwt(projectId, privateKeyFile, algorithm) {
   const token = {
      'iat': parseInt(Date.now() / 1000),
      'exp': parseInt(Date.now() / 1000) + 20 * 60, // 20 minutes
      'aud': projectId
   };
   const privateKey = fs.readFileSync(privateKeyFile);
   return jwt.sign(token, privateKey, {algorithm: algorithm});
}

let connectionArgs = {
   host: mqttBridgeHostname,
   port: mqttBridgePort,
   clientId: mqttClientId,
   username: 'unused',
   password: createJwt(projectId, privateKeyFile, algorithm),
   protocol: 'mqtts',
   secureProtocol: 'TLSv1_2_method'
};

console.log(connectionArgs);

let client = null;
// Create a client, and connect to the Google MQTT bridge.
let iatTime = parseInt(Date.now() / 1000);
try {
   client = mqtt.connect(connectionArgs);
} catch (e) {
   console.log("Error");
   console.log(e);
}

try {
   client.on('connect', (success) => {
      console.log("Connect to MQTT broker");

      if (!success) {
         console.log('Client not connected...');
      } else {
         console.log('connected');
         noble.on('stateChange', function (state) {
            if (state != "poweredOn") 
               return;
            console.log("Starting scan...");
            noble.startScanning([], true);
         });
         noble.on('discover', onDiscovery);
         noble.on('scanStart', function () {
            console.log("Scanning started.");
         });
         noble.on('scanStop', function () {
            console.log("Scanning stopped.");
         });
      }
   });
} catch (e) {
   console.log("Error");
   console.log(e);
}

client.on('close', () => {
   console.log('close');
});

client.on('error', (err) => {
   console.log('error', err);
});

client.on('message', (topic, message, packet) => {
   console.log('packet received: ', packet);
   console.log('message received: ', message.toString());
});

client.on('packetsend', () => {
   // Note: logging packet send is very verbose
});

function getTimestamp() {
   return timestamp.utc('YYYY/MM/DD HH:mm:ss');
}
