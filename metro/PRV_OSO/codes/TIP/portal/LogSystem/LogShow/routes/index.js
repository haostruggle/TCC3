const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');
const db = monk('localhost:27017/test');

/* GET home page. */
let period = 5000;

router.get('/', function (req, res, next) {
    //res.render('index', { title: 'Express' });
   const collection = db.get('logTable');
   collection.find({},{sort: {'_id': -1}},function(err,docs) {
       res.render('index', {
           "userlist": docs
       });
   });
});


module.exports = router;
