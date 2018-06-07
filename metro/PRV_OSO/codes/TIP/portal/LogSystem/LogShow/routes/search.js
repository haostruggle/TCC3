const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');
const db = monk('localhost:27017/test');

/* GET home page. */

//将search的数据传至网页
router.get('/',function(req, res){
    const collection = db.get('logTable');
    collection.find({},{sort: {'_id': -1}},function(e,docs){
        let list = funlist(req.query.searchContent, req.query.dateContent1, req.query.dateContent2, docs);
        res.render('search', {
            name : list
        });
    });
});
//获取search数据
function funlist(req1,req2,req3, data){
    let response1 = req1;
    let response2 = req2;
    let response3 = req3;
    //转换为json字符串
    let str = JSON.stringify(data);
    //转换为js对象
    let obj = eval('(' + str + ')');
    let list = [];
    if(response2 == response3 && response2 == '')//时间为空的情况，取所有的满足条件1的数据
    {
        for(let i=0;i<obj.length;++i)
        {
            if(obj[i].logContent.indexOf(response1) != -1)
            {
                // socket.emit('keywordMsg',obj[i]);
                //obj.shift();
                let dbLableList = '<li>';
                //obj.shift();
                dbLableList += obj[i].logPath + "***" + obj[i].logContent ;
                dbLableList += '</li>';
                list.push(dbLableList);

            }
        }
    }
    else if(response2 != "" && response3 >= response2){//正常情况
        for(let i = 0; i < obj.length; ++i)
        {
            let tmpdate = obj[i].logContent.substr(0,19);
            if(obj[i].logContent.indexOf(response1) != -1 && (tmpdate >= response2 && tmpdate <= response3))
            {
                // socket.emit('keywordMsg',obj[i]);
                //obj.shift();
                let dbLableList = '<li>';
                //obj.shift();
                dbLableList += obj[i].logPath + "***" + obj[i].logContent ;
                dbLableList += '</li>';
                list.push(dbLableList);

            }
        }
    }
    else if(response2 == "" && response3 != ""){//时间2为空，时间3不为空，取小于时间3的数据
        for(let i = 0; i < obj.length; ++i)
        {
            let tmpdate = obj[i].logContent.substr(0,19);
            if(obj[i].logContent.indexOf(response1) != -1 && (tmpdate <= response3))
            {
                // socket.emit('keywordMsg',obj[i]);
                //obj.shift();
                let dbLableList = '<li>';
                //obj.shift();
                dbLableList += obj[i].logPath + "***" + obj[i].logContent ;
                dbLableList += '</li>';
                list.push(dbLableList);

            }
        }
    }
    else if(response2 != "" && response3 == ""){//时间2不为空，时间3为空。取大于时间2的数据
        for(let i = 0; i < obj.length; ++i)
        {
            let tmpdate = obj[i].logContent.substr(0,19);
            if(obj[i].logContent.indexOf(response1) != -1 && (tmpdate >= response2))
            {
                // socket.emit('keywordMsg',obj[i]);
                //obj.shift();
                let dbLableList = '<li>';
                //obj.shift();
                dbLableList += obj[i].logPath + "***" + obj[i].logContent ;
                dbLableList += '</li>';
                list.push(dbLableList);

            }
        }
    }
    return list;
}

module.exports = router;
