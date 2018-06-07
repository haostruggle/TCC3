const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const monk = require('monk');
const db = monk('localhost:27017/test');

/* GET home page. */

//��search�����ݴ�����ҳ
router.get('/',function(req, res){
    const collection = db.get('logTable');
    collection.find({},{sort: {'_id': -1}},function(e,docs){
        let list = funlist(req.query.searchContent, req.query.dateContent1, req.query.dateContent2, docs);
        res.render('search', {
            name : list
        });
    });
});
//��ȡsearch����
function funlist(req1,req2,req3, data){
    let response1 = req1;
    let response2 = req2;
    let response3 = req3;
    //ת��Ϊjson�ַ���
    let str = JSON.stringify(data);
    //ת��Ϊjs����
    let obj = eval('(' + str + ')');
    let list = [];
    if(response2 == response3 && response2 == '')//ʱ��Ϊ�յ������ȡ���е���������1������
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
    else if(response2 != "" && response3 >= response2){//�������
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
    else if(response2 == "" && response3 != ""){//ʱ��2Ϊ�գ�ʱ��3��Ϊ�գ�ȡС��ʱ��3������
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
    else if(response2 != "" && response3 == ""){//ʱ��2��Ϊ�գ�ʱ��3Ϊ�ա�ȡ����ʱ��2������
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
