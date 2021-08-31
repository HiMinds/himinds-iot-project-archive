load('api_timer.js');
load('api_arduino_bme280.js');

// Default sensors address for BME280
let sens_addr = 0x76;

// Initialize Adafruit_BME280 library using the I2C interface
let bme = Adafruit_BME280.createI2C(sens_addr);

if (bme === undefined) {
  print('Cant find a sensor');
} else {

  // This function reads data from the BME280 sensor every 2 seconds
  Timer.set(2000 /* milliseconds */ , true /* repeat */ , function () {

    let temperature = bme.readTemperature();
    let humidity = bme.readHumidity();
    let pressure = bme.readPressure();
   
    print('Temperature:', temperature, '*C');
    print('Humidity:', humidity, '%RH');
    print('Pressure:', pressure, 'hPa');
  }, null);
}