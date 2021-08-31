/*
 * Copyright (c) 2014-2018 Cesanta Software Limited
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

/*
 * Copyright (c) huke 
 * 
 * Author:  huke
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

#include <stdio.h>

#include "esp32/esp32_adc.h"
#include "esp_adc_cal.h"
#include "mgos.h"
#include "mgos_adc.h"
#include "mgos_system.h"
#include "mjs.h"
#include "mgos_onewire.h"

// Helper for allocating new things
#define new(what) (what *)malloc(sizeof(what))

// Helper for allocating strings
#define new_string(len) (char *)malloc(len * sizeof(char))

// Converts a uint8_t rom address to a MAC address string
#define to_mac(r, str) sprintf(str, "%02x:%02x:%02x:%02x:%02x:%02x:%02x:%02x", r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7])

typedef struct ds18b20_result {
    uint8_t rom[8];
    char mac[24];
    float temp;
}ds18b20_result;

 static ds18b20_result ds_dev;


void ds18b20_read_all(int pin) {
    uint8_t rom[8], data[9];
    int16_t raw;
    int us, cfg;
    struct mgos_onewire *ow;
    memset(&ds_dev,0,sizeof(ds18b20_result));
    // Step 1: Determine config
    cfg=0x1F;  us=93750;  
    // Step 2: Find all the sensors
    ow = mgos_onewire_create(pin);                  // Create one-wire
    mgos_onewire_search_clean(ow);                  // Reset search
    if ( mgos_onewire_next(ow, rom, 1) ) {       // Loop over all devices
        memcpy(ds_dev.rom, rom, 8);                  // Copy the ROM code into the result
        to_mac(rom, ds_dev.mac);                     // Convert the rom to a MAC address string
    }

    // Step 3: Write the configuration
    mgos_onewire_reset(ow);                         // Reset
    mgos_onewire_write(ow, 0xCC);                   // Skip Rom
    mgos_onewire_write(ow, 0x4E);                   // Write to scratchpad
    mgos_onewire_write(ow, 0x00);                   // Th or User Byte 1
    mgos_onewire_write(ow, 0x00);                   // Tl or User Byte 2
    mgos_onewire_write(ow, cfg);                    // Configuration register
    mgos_onewire_write(ow, 0x48);                   // Copy scratchpad
    
    // Step 4: Start temperature conversion
    mgos_onewire_reset(ow);                         // Reset
    mgos_onewire_write(ow, 0xCC);                   // Skip Rom
    mgos_onewire_write(ow, 0x44);                   // Start conversion
    mgos_usleep(us);                                // Wait for conversion

    // Step 5: Read the temperatures
    do{                        // Loop over all devices
        mgos_onewire_reset(ow);                     // Reset
        mgos_onewire_select(ow, ds_dev.rom);         // Select the device
        mgos_onewire_write(ow, 0xBE);               // Issue read command
        mgos_onewire_read_bytes(ow, data, 9);       // Read the 9 data bytes
        raw = (data[1] << 8) | data[0];             // Get the raw temperature
        cfg = (data[4] & 0x60);                     // Read the config (just in case)
        if (cfg == 0x00)      raw = raw & ~7;       // 9-bit raw adjustment
        else if (cfg == 0x20) raw = raw & ~3;       // 10-bit raw adjustment
        else if (cfg == 0x40) raw = raw & ~1;       // 11-bit raw adjustment
        ds_dev.temp = (float) raw / 16.0;            // Convert to celsius and store the temp
    }while(0);

    mgos_onewire_close(ow);                         // Close one wire
    
}


float sensor_read_temp(void) 
{
    int pin=18;
    ds18b20_read_all(pin);
    return ds_dev.temp;
}

enum mgos_app_init_result mgos_app_init(void)
{

  LOG(LL_INFO, ("----------- Ver 0.01 ------------ "));
  printf("temp is :%0.2f\n",sensor_read_temp());

  return MGOS_APP_INIT_SUCCESS;
}
