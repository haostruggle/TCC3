const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');
const db = monk('localhost:27017/test');

/* GET home page. */

//数据发送
router.get('/',function(req, res){
    const collection = db.get('logTable');
    collection.find({},{sort: {'_id': -1}},function(e,docs){ //按时间排序
        let list = funlist(docs);
        res.render('warninglog', {
            name : list
        });
    });
});

//告警日志收集
function funlist(data){
    let str=JSON.stringify(data);
    //转换为js对象
    let obj=eval('(' + str + ')');
    //添加ul标签
    let warLableList=[];
    for(let i=0;i<obj.length;++i)
    {
        if(obj[i].logContent.indexOf("[WARNING]")!=-1)
        {
            let warLable = '<li>';
            //obj.shift();
            warLable += obj[i].logPath + "***" + obj[i].logContent ;
            warLable += '</li>';
            warLableList.push(warLable);
        }
    }

    return warLableList;
}

module.exports = router;
