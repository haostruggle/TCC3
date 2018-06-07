# -*- coding: utf-8 -*-
import threading
import pymongo as pm
import json
from QueueTeam import SetDataToDb


#����������MongoDb��
class ProcessDataStr:
    def __init__(self,host, port, dbName, defaultCollection):
        self.receveDataThread=None
        self.getStrInfo=SetDataToDb()
        self.dbTest=ServerConMonDb(host, port, dbName, defaultCollection)

    #���̴߳Ӷ�����������
    def threadData(self):
        try:
            self.receveDataThread=threading.Thread(target=self.dataStr,args=())
            self.receveDataThread.start()
        except:
            print "ServerConMonDb threadData is fail"

    #�̺߳���
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

    #����߳�
    def cleanThread(self):
        self.receveDataThread.join()
        self.receveDataThread=None



#��װMongoDB��������
class ServerConMonDb:
    def __init__(self, host, port, dbName, defaultCollection):
        #�������ݿ�����
        self.client = pm.MongoClient(host=host, port=port)
        #ѡ����Ӧ�����ݿ�����
        self.db = self.client.get_database(dbName)
        #����Ĭ�ϵļ���
        self.collection = self.db.get_collection(defaultCollection)

    #��װMongoDb�Ĳ���
    #�򼯺������Ԫ��
    def insert(self, item, collection_name =None):
        #��Ҫ�����ĸ�����  item:��Ҫ���������
        if collection_name != None:
            collection = self.db.get_collection(self.db)
            collection.insert(item)
        else:
            self.collection.insert(item)

    #�ڼ�������Ԫ��
    def find(self, expression =None, collection_name=None):
        #expression: ��ѯ����   collection_name: ��������
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

    #�õ����Ϸ�װ
    def get_collection(self, collection_name=None):
        if collection_name == None:
            return self.collection
        else:
            return self.get_collection(collection_name)

    #ɾ�����ݷ�װ
    def delData(self,item,collection_name=None):
        if collection_name!=None:
            collection=self.db.get_collection(self.db)
            collection.remove(item)
        else:
            self.collection.remove(item)



