/*
 * Copyright (c) HiMinds.com
 *
 * Author:  Suru Dissanaike
 *
* MIT License
*
* Copyright (c) 2019
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

load('api_config.js');
load('api_gpio.js');
load('api_sys.js');
load('api_timer.js');

let ESP32_THING_BUTTON = 0;
let ESP32_THING_LED = 5;
let GPIO_PIN_INPUT_SIGNAL = 2;
let GPIO_PIN_OUTPUT_SIGNAL = 18;

GPIO.set_mode(ESP32_THING_LED, GPIO.MODE_OUTPUT);
GPIO.set_mode(GPIO_PIN_INPUT_SIGNAL, GPIO.MODE_INPUT);
GPIO.set_mode(GPIO_PIN_OUTPUT_SIGNAL, GPIO.MODE_OUTPUT);

 print('js-code');


let getInfo = function () {
    return JSON.stringify({
        data: {
            total_ram: Sys.total_ram(),
            free_ram: Sys.free_ram()
        }
    });
};

// Create timer to blink ESP32 Thing LED every 5 seconds and print system info.
Timer.set(5000, true, function () {
let ESP32_THING_LED = 5;
    GPIO.toggle(ESP32_THING_LED);
    print('uptime:', Sys.uptime(), getInfo());
}, null);

// Toogle LED
GPIO.set_button_handler(ESP32_THING_BUTTON, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 20, function () {
    let state = GPIO.toggle(ESP32_THING_LED);
    print("Toggled LED, state is: ", state
        ? 'on'
        : 'off');

}, null);

GPIO.set_int_handler(GPIO_PIN_INPUT_SIGNAL, GPIO.INT_EDGE_ANY, function (pin) {
    //print('Pin', GPIO_PIN_INPUT_SIGNAL, 'got interrupt');
    GPIO.toggle(GPIO_PIN_OUTPUT_SIGNAL);
    //Sys.wdt_feed();
}, null);
GPIO.enable_int(GPIO_PIN_INPUT_SIGNAL);