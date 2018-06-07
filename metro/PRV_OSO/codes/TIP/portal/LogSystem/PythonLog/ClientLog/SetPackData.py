# -*- coding: utf-8 -*-
import threading
from QueueTeam import QueueClass
from QueueTeam import PackQueueClass
from GroupPacket import GroupPacket


#����ֵ��
class SetPackData:
    def __init__(self):
        self.dataThread=None
        self.dataQueue=QueueClass()  #�����ݶ���
        self.packQueue=PackQueueClass()  #���������

    #���߳�����
    def takeDataThread(self):
        try:
            self.dataThread=threading.Thread(target=self.processData,args=())
            self.dataThread.start()
        except:
            print("takeData start thread fail")

    #�����̺߳���
    def clearThread(self):
        self.dataThread.join()
        self.dataThread=None

    #�����̺߳���
    def processData(self):
        try:
            while True:
                #�����������
                strData=self.dataQueue.getQueueData()
                #����ֵ
                packet = GroupPacket(strData.dataPath,strData.dataStr)
                bufPack = packet.Serialize()   #���л����
                self.packQueue.setPackData(bufPack)
        except:
            print("processData func is error")
