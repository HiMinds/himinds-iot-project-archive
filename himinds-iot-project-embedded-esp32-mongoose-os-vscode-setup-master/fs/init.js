/*
 * Copyright (c) HiMinds.com
 *
 * Author:  Suru Dissanaike
 *
 * All rights reserved
 *
 * Licensed under the Apache License, Version 2.0 (the ""License"");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an ""AS IS"" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

load('api_config.js');
load('api_gpio.js');
load('api_sys.js');
load('api_timer.js');

let ADC1_CHANNEL_4 = 32;
let ESP32_THING_BUTTON = 0;

let PCADC = {
    pc_adc_configuration: ffi('int pc_adc_configuration(void)')
};

let esp32ThingLED = Cfg.get('pins.led');

GPIO.set_mode(esp32ThingLED, GPIO.MODE_OUTPUT);

if (PCADC.pc_adc_configuration() === 0) 
    print("ADC configured");

let getInfo = function () {
    return JSON.stringify({
        data: {
            total_ram: Sys.total_ram(),
            free_ram: Sys.free_ram()
        }
    });
};

// Create timer to blink ESP32 Thing LED every 3 seconds and print system info.
Timer.set(3000, true, function () {
    GPIO.toggle(esp32ThingLED);
    print('uptime:', Sys.uptime(), getInfo());
}, null);

// Toogle LED
GPIO.set_button_handler(ESP32_THING_BUTTON, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 20, function () {
    let state = GPIO.toggle(esp32ThingLED);
    print("Toggled LED, state is: " ,state ? 'on' : 'off');
}, null);
