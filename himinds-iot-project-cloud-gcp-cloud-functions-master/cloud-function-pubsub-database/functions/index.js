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
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const {BigQuery} = require('@google-cloud/bigquery');

const projectId = 'hm-iot-project-esp32-demo';
const datasetId = "iot_data";
const tableId = "esp32_raw_data";

admin.initializeApp();

const googleBigquery = new BigQuery({projectId: projectId});
const firebaseRealtimeDatabase = admin.database();
const cloudFirestoreDatabase = admin.firestore();

/**
 * Receive data from pubsub, then parse are store data in three different Google database solutions
 */
exports.receiveIoTData = functions
  .pubsub
  .topic('iot-topic')
  .onPublish((event, context) => {

    console.log("----------version beta2 -----------");
    console.log("----------event-----------");
    console.log(event);
    console.log("----------context-----------");
    console.log(context);

    let payload = JSON.parse(Buffer.from(event.data, 'base64').toString());

    const deviceId = event.attributes.deviceId;

    console.log("context.timestamp: " + context.timestamp + " deviceID: " + deviceId);

    const data = {
      uptime: payload.uptime,
      temp: payload.temp,
      freeRam: payload.free_ram,
      deviceId: deviceId,
      timestamp: context.timestamp
    };

    console.log(data);
    return Promise.all([insertIntoBigquery(data), updateFirebaseRealtimeDatabase(data),updateCloudFirestore(data)]);
  });

/**
 * Store all the data in Firebase Realtime Database
 */
function updateFirebaseRealtimeDatabase(data) {
  return firebaseRealtimeDatabase
    .ref(`/devices/${data.deviceId}`)
    .set({data}) .then(() => {
      console.log(`Inserted into Firebase Realtime Database`);
      return true;
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

/**
 * Store all the data in Cloud Firestore
 */
function updateCloudFirestore(data) {
  return cloudFirestoreDatabase
    .collection('devices').doc(data.deviceId).set({data}).then(() => {
      console.log(`Inserted into Cloud Firestore`);
      return true;
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}
/**
 * Store all the raw data in Google BigQuery
 */
function insertIntoBigquery(data) {
  return googleBigquery
    .dataset(datasetId)
    .table(tableId)
    .insert(data)
    .then(() => {
      console.log(`Inserted data Google BigQuery`);
      return true;
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}