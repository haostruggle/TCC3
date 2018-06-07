# -*- coding: utf-8 -*-
import os
from socket import *
import threading
from QueueTeam import QueueClass


#定义包所需字段
class DefinePackFormat:
    def __init__(self):
        self.dataPath="" #日志文件路径
        self.dataStr="" #日志内容

#收集日志类
class CollectionLog:
    def __init__(self,workPath):
        self.workPath=workPath
        self.readThread=None
        self.readFileQue=QueueClass()   #获得队列类

    #读目录下的文件
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

    #找到日志文件
    def findFile(self):
        try:
            fileList=[]
            for filePath in self.readMkdir():
                if filePath.find(".log")!=-1:
                    fileList.append(filePath)
            return fileList
        except:
            print("the dir have no .log files")

    #起线程读文件
    def fileThread(self):
        try:
            self.readThread=threading.Thread(target=self.readFile,args=())
            self.readThread.start()
        except:
            print("start readfile thread faild")

    #读文件线程函数
    def readFile(self):
        try:
            #1、存一个map [文件名(logPath), pos(file.tell())]
            dictInfo={}
            while True:
                for logPath in self.findFile():
                    fileOpen=open(logPath)
                    #2、查上面的map得到 pos
                    #3、file.seek  设置文件指针
                    if dictInfo.has_key(logPath):
                        fileOpen.seek(dictInfo[logPath],0)
                    #4、读出未读的行
                    for lineLog in fileOpen:
                        if (lineLog.find("[ERROR]")!=-1) | (lineLog.find("[WARNING]")!=-1):
                            dataStruct=DefinePackFormat()
                            dataStruct.dataPath=logPath+'***'   #'***'解包的标识符，可更改
                            dataStruct.dataStr=lineLog.strip()
                            self.readFileQue.setQueueData(dataStruct)
                    #5、通过file.tell()得到并存此次所读到的位置、关闭文件
                    dictInfo[logPath] = fileOpen.tell()
                    fileOpen.close()
        except:
            print("read the log file is fail")

    #清理线程函数
    def clearThread(self):
        self.readThread.join()
        self.readThread=None

