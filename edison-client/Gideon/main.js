/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
//Type Node.js Here :)


var mraa = require('mraa'); //require mraa
console.log(' Hello! This Gideon Starting up... My MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

//Libraries needed by the Sensors
var groveSensor = require('jsupm_grove');
var sensorModule = require('jsupm_ttp223');

// Create the temperature sensor object using AIO pin 0
// Create the touch sensor object using GPIO pin 2
// Create the light sensor object using AIO pin 3
var temp = new groveSensor.GroveTemp(0);
var touch = new sensorModule.TTP223(2);
var light = new groveSensor.GroveLight(3);

console.log(temp.name());
console.log(touch.name());
console.log(light.name());

// Read the temperature ten times, printing both the Celsius and
// equivalent Fahrenheit temperature, waiting one second between readings
function readTempSensorValue() {
    var celsius = temp.value();
    var fahrenheit = celsius * 9.0/5.0 + 32.0;
    console.log(celsius + " degrees Celsius, or " +
                Math.round(fahrenheit) + " degrees Fahrenheit");
}

// Read the input and print both the raw value and a rough lux value,
// waiting one second between readings
function readLightSensorValue() {
    console.log(light.name() + " raw value is " + light.raw_value() +
            ", which is roughly " + light.value() + " lux");
}

// Check whether or not a finger is near the touch sensor and
// print accordingly, waiting one second between readings

function readSensorValue() {
    console.log(touch.isPressed());
  if ( touch.isPressed() ) {
      console.log(touch.name() + " is pressed");
    } else {
        console.log(touch.name() + " is not pressed");
    }
}

setInterval(readSensorValue, 1000);
setInterval(readLightSensorValue, 1000);
setInterval(readTempSensorValue, 1000);