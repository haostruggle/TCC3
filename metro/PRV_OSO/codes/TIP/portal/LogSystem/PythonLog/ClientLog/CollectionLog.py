# -*- coding: utf-8 -*-
import os
from socket import *
import threading
from QueueTeam import QueueClass


#����������ֶ�
class DefinePackFormat:
    def __init__(self):
        self.dataPath="" #��־�ļ�·��
        self.dataStr="" #��־����

#�ռ���־��
class CollectionLog:
    def __init__(self,workPath):
        self.workPath=workPath
        self.readThread=None
        self.readFileQue=QueueClass()   #��ö�����

    #��Ŀ¼�µ��ļ�
    def readMkdir(self):
        try:
            dirList=[]
            for root,dirs,files in os.walk(self.workPath):
                for file in files:
                    fileName=os.path.join(root,file)
                    dirList.append(fileName)
            return dirList
        except:
            print("the dir have no files")

    #�ҵ���־�ļ�
    def findFile(self):
        try:
            fileList=[]
            for filePath in self.readMkdir():
                if filePath.find(".log")!=-1:
                    fileList.append(filePath)
            return fileList
        except:
            print("the dir have no .log files")

    #���̶߳��ļ�
    def fileThread(self):
        try:
            self.readThread=threading.Thread(target=self.readFile,args=())
            self.readThread.start()
        except:
            print("start readfile thread faild")

    #���ļ��̺߳���
    def readFile(self):
        try:
            #1����һ��map [�ļ���(logPath), pos(file.tell())]
            dictInfo={}
            while True:
                for logPath in self.findFile():
                    fileOpen=open(logPath)
                    #2���������map�õ� pos
                    #3��file.seek  �����ļ�ָ��
                    if dictInfo.has_key(logPath):
                        fileOpen.seek(dictInfo[logPath],0)
                    #4������δ������
                    for lineLog in fileOpen:
                        if (lineLog.find("[ERROR]")!=-1) | (lineLog.find("[WARNING]")!=-1):
                            dataStruct=DefinePackFormat()
                            dataStruct.dataPath=logPath+'***'   #'***'����ı�ʶ�����ɸ���
                            dataStruct.dataStr=lineLog.strip()
                            self.readFileQue.setQueueData(dataStruct)
                    #5��ͨ��file.tell()�õ�����˴���������λ�á��ر��ļ�
                    dictInfo[logPath] = fileOpen.tell()
                    fileOpen.close()
        except:
            print("read the log file is fail")

    #�����̺߳���
    def clearThread(self):
        self.readThread.join()
        self.readThread=None

