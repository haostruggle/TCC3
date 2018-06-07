const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');
const db = monk('localhost:27017/test');

/* GET home page. */

//将error数据传至页面
router.get('/',function(req, res){
    const collection = db.get('logTable');
    collection.find({},{sort: {'_id': -1}},function(e,docs){
        let list = funlist(docs);
        res.render('errorlog', {
            name : list
        });
    });
});
//获取error数据
function funlist(data){
    let str=JSON.stringify(data);
        //转换为js对象
    let obj=eval('(' + str + ')');
        //添加ul标签
    let errorLableList= [];
    for(let i=0;i<obj.length;++i)
    {
        if(obj[i].logContent.indexOf("[ERROR]")!=-1)
        {
            let errorLable = '<li>';
            //obj.shift();
            errorLable += obj[i].logPath + "***" + obj[i].logContent ;
            errorLable += '</li>';
            errorLableList.push(errorLable);
        }
    }

    return errorLableList;
}

module.exports = router;
