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
#include "mgos_system.h"
#include "mgos_timers.h"
#include "freertos/task.h"

#define GPIO_PIN_INPUT 0
#define GPIO_PIN_OUTPUT 5

TaskHandle_t xTaskOtherCore = NULL;
TaskHandle_t xTaskLED = NULL;


IRAM void interupt_handler_gpio(int pin, void *arg)
{
  LOG(LL_INFO, ("core: %d", xPortGetCoreID()));
  LOG(LL_INFO, ("INTERRUPT"));
  mgos_gpio_toggle(GPIO_PIN_OUTPUT);
}


static void timer_cb(void *arg)
{
  static bool s_tick_tock = false;
  char tasklist[350];

  vTaskList(tasklist);
  LOG(LL_INFO,
      ("%s uptime: %.2lf, RAM: %lu, %lu free", (s_tick_tock ? "Tick" : "Tock"),
       mgos_uptime(), (unsigned long)mgos_get_heap_size(),
       (unsigned long)mgos_get_free_heap_size()));
  LOG(LL_INFO,

      ("Timer: Running on core:%02x\n%s\n", xPortGetCoreID(), tasklist));
  s_tick_tock = !s_tick_tock;

  (void)arg;
}

void task_other_core(void *pvParameters)
{
  for (;;)
  {
    LOG(LL_INFO, ("core: %d", xPortGetCoreID()));
    mgos_msleep(5000);
  }
  vTaskDelete(NULL);
}

void task_toggle_led(void *pvParameters)
{

  for (;;)
  {
    LOG(LL_INFO, ("core: %d", xPortGetCoreID()));
    mgos_gpio_toggle(GPIO_PIN_OUTPUT);
    mgos_msleep(10000);
  }
  vTaskDelete(NULL);
}

void createTask()
{
  mgos_msleep(2000);

  xTaskCreatePinnedToCore(
      task_other_core,
      "TaskOtherCore0",
      3000,
      NULL,
      5,
      xTaskOtherCore,
      0);

  xTaskCreatePinnedToCore(
      task_toggle_led,
      "task_toggle_led",
      3000,
      NULL,
      5,
      xTaskLED,
      1);
}

enum mgos_app_init_result mgos_app_init(void)
{
  LOG(LL_INFO, ("c-code dual core ver 0.1"));

  mgos_gpio_set_mode(GPIO_PIN_INPUT, MGOS_GPIO_MODE_INPUT);
  mgos_gpio_set_mode(GPIO_PIN_OUTPUT, MGOS_GPIO_MODE_OUTPUT);

  mgos_gpio_set_button_handler(GPIO_PIN_INPUT, MGOS_GPIO_PULL_UP, MGOS_GPIO_INT_EDGE_NEG, 50, interupt_handler_gpio, NULL);

  bool interrupt = mgos_gpio_enable_int(GPIO_PIN_INPUT);
  if (interrupt)
    LOG(LL_INFO, ("Interrupt attached"));
  else
    LOG(LL_ERROR, ("failed to attach interrupt"));

  /* Simple repeating timer */
  mgos_set_timer(10000, MGOS_TIMER_REPEAT, timer_cb, NULL);

  createTask();

  LOG(LL_INFO, ("app_init done"));

  return MGOS_APP_INIT_SUCCESS;
}