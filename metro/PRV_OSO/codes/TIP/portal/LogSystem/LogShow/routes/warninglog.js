const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');
const db = monk('localhost:27017/test');

/* GET home page. */

//���ݷ���
router.get('/',function(req, res){
    const collection = db.get('logTable');
    collection.find({},{sort: {'_id': -1}},function(e,docs){ //��ʱ������
        let list = funlist(docs);
        res.render('warninglog', {
            name : list
        });
    });
});

//�澯��־�ռ�
function funlist(data){
    let str=JSON.stringify(data);
    //ת��Ϊjs����
    let obj=eval('(' + str + ')');
    //���ul��ǩ
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
