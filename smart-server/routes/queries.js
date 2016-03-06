var express = require('express');
var Forecast = require('forecast');
var reco_obj = require('../mock/recommendation.json');
var weather_obj = require('../mock/weather_data.json');
var router = express.Router();

reco = {}
for(i=0;i<reco_obj.length;i++){
    reco[reco_obj[i]['item']] = reco_obj[i]['listings'];
}

avg_temp = 0;
for(i=0; i< weather_obj.daily.data.length; i++){
    temp = weather_obj.daily.data[i].temperatureMin;
    avg_temp = avg_temp + temp;
}
avg_temp = avg_temp / weather_obj.daily.data.length;

console.log('avg_temp: ' + avg_temp);
router.get('/', function(req, res){
    qp = req.query.q;
    queries = qp.split(';');
    result = [];
    for(i=0; i<queries.length; i++){
        q = queries[i];
        if(q in reco){
            if(['hoodie-men', 'sweater-women', 'sweater-men'].indexOf(q) > -1) {
                recommend_or_not = false;
                if(global.temp_index <= 0){
                    console.log('recommending cuz no prev data');
                    recommend_or_not = true;
                } else {
                    final_temp = global.temp_arr[global.temp_index - 1];
                    if(final_temp > avg_temp) {
                        console.log('recommending cuz room temp has been more than outside temp');
                        console.log('final_temp: ' + final_temp);
                        console.log('avg_temp:' + avg_temp);
                        recommend_or_not = true;
                    } else {
                        console.log('Not recommending cuz room temp has been less than outside temp');
                        recommend_or_not = false;
                    }
                }
                temp_res = []
                if(recommend_or_not){
                    console.log('results added');
                    temp_res = reco[q];
                }
            } else {
                temp_res = reco[q];
                console.log('recommending anyway');
            }
            result = result.concat(temp_res);
        }
    }
    res.send(result);
});


/*var read_from_weather_from_file = function(){
    data = jsonfile.readFile('../weather_data.json');
    var promise = new Promise(function(resolve, reject){
        console.log('read_weather_from_file called');
        if(!('last_cache_time' in data) || ((new Date) - data['last_cache_time'] > (12*60*60*1000))){
            current_data = null;
        }else{
            current_data = data;
        }
        resolve({"weather_data": current_data });
    });
    return promise;
};

var fetch_weather_data_if_needed = function(weather_access_data){
    var promise = new Promise(function(resolve, reject){
        console.log('fetch_weather_data_if_needed called');
        avg_temp_next_week = 0;
        result = {};
        if(weather_access_data.weather_data == null){
            // access weather data from forecast
        } else {
            // avg the temp from data available
        }
        if(avg_temp_next_week - temp_arr[temp_length-1] > 0){
            result['do_recommend'] = false;
        } else {
            result['do_recomment'] = true;
        }
        resolve(result);
    });
    return promise;
};

var recommend_
*/
module.exports = router;
