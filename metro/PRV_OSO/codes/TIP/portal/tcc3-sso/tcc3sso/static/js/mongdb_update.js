/**
 * Created by Administrator on 2018/1/17.
 */
module.exports.MongRead = function(role) {

    var MongoClient = require("mongodb").MongoClient;
    var DB_URL = "mongodb://localhost:27017/test";

    var updateData = function(db, callback) {
                //连接到表
        var collection = db.collection('user_profile');
                //更新数据
        var whereStr = {"nick_name":role.nick_name};
        var updateStr = {$set: { "role_id" : role.role_id }};
        collection.update(whereStr,updateStr, function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    };

    MongoClient.connect(DB_URL, function(err, db) {
        console.log("连接成功！");
        updateData(db, function(result) {
            console.log(result);
            db.close();
        });
    });
};