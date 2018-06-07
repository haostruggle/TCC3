
module.exports.MongRead = function(val) {

    var mongodb = require('mongodb');
    var MongoClient = require('mongodb').MongoClient;
    var DB_CONN_STR = 'mongodb://localhost:27017/test';

    var selectData = function(db, callback) {
        var collection = db.collection('user_profile');
        var whereStr = {"nick_name":val};
        collection.find(whereStr).toArray(function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    };

    MongoClient.connect(DB_CONN_STR, function(err, db) {
        console.log("连接成功！");
        selectData(db, function(result) {
            db.close();
            return result;
        });
    });
};