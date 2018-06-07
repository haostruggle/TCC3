const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');
const db = monk('localhost:27017/test');

/* GET home page. */

//��error���ݴ���ҳ��
router.get('/',function(req, res){
    const collection = db.get('logTable');
    collection.find({},{sort: {'_id': -1}},function(e,docs){
        let list = funlist(docs);
        res.render('errorlog', {
            name : list
        });
    });
});
//��ȡerror����
function funlist(data){
    let str=JSON.stringify(data);
        //ת��Ϊjs����
    let obj=eval('(' + str + ')');
        //���ul��ǩ
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
