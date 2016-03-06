var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log('/upload GET hit')
    res.status(202).send();
});

router.post('/', function(req, res) {
    console.log('/upload POST hit')
    if (!req.body) return res.sendStatus(500);
    global.temp_arr[global.temp_index] = req.body.temperature;
    global.temp_index = global.temp_index + 1;
    global.light_arr[global.light_index] = req.body.light;
    global.light_index = global.light_index + 1;
    if (req.body.touch == 'yes'){
        global.touch_or_not = true;
    }else{
        global.touch_or_not = false;
    }
    res.status(202).send();
});

module.exports = router;
