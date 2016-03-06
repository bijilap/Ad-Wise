/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
//Type Node.js Here :)


var mraa = require('mraa'); //require mraa
var async = require('async');
var http = require("http");
console.log(' Hello! This is Gideon Starting up... My MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

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

// Read temperature values from sensors
function readTempSensorValue() { 
    var celsius = temp.value();
    return celsius;
}

// Read light values from sensors
function readLightSensorValue() {
    return light.raw_value();
}

// Read touch values from sensors
function readTouchSensorValue() {
   var touch_value=0;
   if ( touch.isPressed() ) {
       
       touch_value = 1;
   }
   return touch_value;    
         
}

function main(){
    var touch_global_val = "no";
    var light_array = [];
    var temp_array =[];
    setInterval(function() {
        var touch_value = readTouchSensorValue();
        var light_value = readLightSensorValue();
        var temp_value = readTempSensorValue();
        //console.log("Touch Sensor" + touch_value.toString());
        //console.log("Light Sensor" + light_value.toString());
       //console.log("Temp Sensor" + temp_value.toString());
        
        if (temp_array.length == 10 || light_array.length == 10){
           //console.log("The list is full");
           async.waterfall([
                function(callback) {
                    callback(null, temp_array, light_array, touch_global_val);
                },
                 function(temp_array, light_array, touch_val, callback) {
                    var temp_sum = temp_array.reduce(function(a, b) { return a + b; });
                    var temp_avg = temp_sum / temp_array.length;
                    var light_sum = light_array.reduce(function(a, b) { return a + b; });
                    var light_avg = light_sum / light_array.length;
                    callback(null, temp_avg,light_avg, touch_val);
                },
                function(temp_sum, light_sum, touch_val, callback){
                  callback(null, '{"temperature": ' + temp_sum +', "light": ' + light_sum +', "touch": "'+ touch_val.toString() + '"}');  
                }
           ],
            function(error, result) {
               console.log(result);
               var options = {
                    hostname: 'gideon-smart-server.mybluemix.net',
                    port: 80,
                    path: '/upload',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
               };
               var req = http.request(options, function(res) {
               console.log('Status: ' + res.statusCode);
               console.log('Headers: ' + JSON.stringify(res.headers));
               res.setEncoding('utf8');
               res.on('data', function (body) {
                    console.log('Body: ' + body);
                });
            });
            req.on('error', function(e) {
                console.log('problem with request: ' + e.message);
            });
            req.write(result);
            req.end();
           });
           light_array = [];
           temp_array = [];
           touch_global_val = "no";
        } else {
            temp_array.push(temp_value);
            light_array.push(light_value);
            if (touch_value == 1)
                touch_global_val = "yes";
            //console.log(temp_array);
            //console.log(light_array);
        }
    }, 1000);
}

main();