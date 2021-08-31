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

#include <stdio.h>

#include "esp32/esp32_adc.h"
#include "esp_adc_cal.h"
#include "mgos.h"
#include "mgos_adc.h"
#include "mgos_system.h"



#include "mjs.h"


/* Custom configuration of the ADC */

int pc_adc_configuration(void)
{
   static int s_vref = 1100;

  // Using PIN32
  /*
    {.pin = 36, .ch = ADC1_CHANNEL_0},
    {.pin = 37, .ch = ADC1_CHANNEL_1},
    {.pin = 38, .ch = ADC1_CHANNEL_2},
    {.pin = 39, .ch = ADC1_CHANNEL_3},
    {.pin = 32, .ch = ADC1_CHANNEL_4},
    {.pin = 33, .ch = ADC1_CHANNEL_5},
    {.pin = 34, .ch = ADC1_CHANNEL_6},
    {.pin = 35, .ch = ADC1_CHANNEL_7},
  */

  if (adc1_config_width(ADC_WIDTH_12Bit) != ESP_OK || adc1_config_channel_atten(ADC1_CHANNEL_4, ADC_ATTEN_6db) != ESP_OK)
  {
    LOG(LL_INFO, ("fail ADC config"));
    return -1;
  }

  esp_adc_cal_characteristics_t *adc_chars = calloc(1, sizeof(esp_adc_cal_characteristics_t));
  esp_adc_cal_characterize(ADC_UNIT_1, ADC_ATTEN_6db, ADC_WIDTH_12Bit, s_vref, adc_chars);

  return 0;
}

enum mgos_app_init_result mgos_app_init(void)
{

  LOG(LL_INFO, ("----------- Ver 0.01 ------------"));

  return MGOS_APP_INIT_SUCCESS;
}