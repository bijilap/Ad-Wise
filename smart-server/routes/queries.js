var express = require('express');
var reco_obj = require('../mock/recommendation.json');
var router = express.Router();

reco = {}
for(i=0;i<reco_obj.length;i++){
    reco[reco_obj[i]['item']] = reco_obj[i]['listings'];
}

router.get('/', function(req, res){
    qp = req.query.q;
    queries = qp.split(';');
    result = [];
    for(i=0; i<queries.length; i++){
        q = queries[i];
        console.log(q);
        if(q in reco){
            result = result.concat(reco[q]);
        }
    }
    res.send(result);
});


module.exports = router;
