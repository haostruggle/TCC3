# -*- coding: utf-8 -*-
import threading
import pymongo as pm
import json
from QueueTeam import SetDataToDb


#把数据塞到MongoDb中
class ProcessDataStr:
    def __init__(self,host, port, dbName, defaultCollection):
        self.receveDataThread=None
        self.getStrInfo=SetDataToDb()
        self.dbTest=ServerConMonDb(host, port, dbName, defaultCollection)

    #起线程从队列里拿数据
    def threadData(self):
        try:
            self.receveDataThread=threading.Thread(target=self.dataStr,args=())
            self.receveDataThread.start()
        except:
            print "ServerConMonDb threadData is fail"

    #线程函数
    def dataStr(self):
        try:
            while True:
                itemList={}
                strInfo=self.getStrInfo.getDataStr()
                itemList['logPath']=strInfo[0]
                itemList['logContent']=strInfo[1]
                self.dbTest.insert(itemList)
        except:
            print "ServerConMonDb dataStr func fail"

    #清除线程
    def cleanThread(self):
        self.receveDataThread.join()
        self.receveDataThread=None



#封装MongoDB函数操作
class ServerConMonDb:
    def __init__(self, host, port, dbName, defaultCollection):
        #建立数据库连接
        self.client = pm.MongoClient(host=host, port=port)
        #选择相应的数据库名称
        self.db = self.client.get_database(dbName)
        #设置默认的集合
        self.collection = self.db.get_collection(defaultCollection)

    #封装MongoDb的操作
    #向集合中添加元素
    def insert(self, item, collection_name =None):
        #需要访问哪个集合  item:需要插入的数据
        if collection_name != None:
            collection = self.db.get_collection(self.db)
            collection.insert(item)
        else:
            self.collection.insert(item)

    #在集合中找元素
    def find(self, expression =None, collection_name=None):
        #expression: 查询条件   collection_name: 集合名称
        if collection_name != None:
            collection = self.db.get_collection(self.db)
            if expression == None:
                return collection.find()
            else:
                return collection.find(expression)
        else:
            if expression == None:
                return self.collection.find()
            else:
                return self.collection.find(expression)

    #得到集合封装
    def get_collection(self, collection_name=None):
        if collection_name == None:
            return self.collection
        else:
            return self.get_collection(collection_name)

    #删除数据封装
    def delData(self,item,collection_name=None):
        if collection_name!=None:
            collection=self.db.get_collection(self.db)
            collection.remove(item)
        else:
            self.collection.remove(item)



