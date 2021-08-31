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

#include <stdio.h>
#include "mgos.h"
#include "mgos_gpio.h"

#define GPIO_PIN_INPUT 2
#define GPIO_PIN_OUTPUT 18

static void interupt_handler_gpio()
{
  bool current_level = mgos_gpio_toggle(GPIO_PIN_OUTPUT);
}

enum mgos_app_init_result mgos_app_init(void)
{
  LOG(LL_INFO, ("c-code"));

  mgos_gpio_set_mode(GPIO_PIN_INPUT, MGOS_GPIO_MODE_INPUT);
  mgos_gpio_set_mode(GPIO_PIN_OUTPUT, MGOS_GPIO_MODE_OUTPUT);

  mgos_gpio_set_int_handler(GPIO_PIN_INPUT, MGOS_GPIO_INT_EDGE_ANY, interupt_handler_gpio, NULL);
  bool interrupt = mgos_gpio_enable_int(GPIO_PIN_INPUT);
  if (interrupt)
    LOG(LL_INFO, ("Interrupt attached"));
  else
    LOG(LL_ERROR, ("failed to attach interrupt"));

  return MGOS_APP_INIT_SUCCESS;
}