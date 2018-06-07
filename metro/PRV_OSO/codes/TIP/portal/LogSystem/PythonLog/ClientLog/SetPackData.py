# -*- coding: utf-8 -*-
import threading
from QueueTeam import QueueClass
from QueueTeam import PackQueueClass
from GroupPacket import GroupPacket


#包赋值类
class SetPackData:
    def __init__(self):
        self.dataThread=None
        self.dataQueue=QueueClass()  #放数据队列
        self.packQueue=PackQueueClass()  #放组包队列

    #起线程拿数
    def takeDataThread(self):
        try:
            self.dataThread=threading.Thread(target=self.processData,args=())
            self.dataThread.start()
        except:
            print("takeData start thread fail")

    #清理线程函数
    def clearThread(self):
        self.dataThread.join()
        self.dataThread=None

    #处理线程函数
    def processData(self):
        try:
            while True:
                #向队列拿数据
                strData=self.dataQueue.getQueueData()
                #包赋值
                packet = GroupPacket(strData.dataPath,strData.dataStr)
                bufPack = packet.Serialize()   #序列化组包
                self.packQueue.setPackData(bufPack)
        except:
            print("processData func is error")
