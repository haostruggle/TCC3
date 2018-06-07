# -*- coding: utf-8 -*-
import threading
from socket import *
from QueueTeam import PackQueueClass


class SendPackData:
    def __init__(self,hostIp,hostPort):
        self.hostIp=hostIp
        self.hostPort=hostPort
        self.tcpCliSock=""
        self.packThread=None
        self.sendPack=PackQueueClass()

    def connectHost(self):
        try:
            self.tcpCliSock=socket(AF_INET,SOCK_STREAM)
            self.tcpCliSock.connect((self.hostIp,self.hostPort))
            #�����˷������߳�
            self.packThread=threading.Thread(target=self.sendData,args=())
            self.packThread.start()
        except Exception,e:
            print 'Error: ',e

    #���������̺߳���
    def sendData(self):
        try:
            while True:
                packData=self.sendPack.getPackData()
                #�����������
                self.tcpCliSock.sendall(packData)
            self.tcpCliSock.close()
        except:
            print("sendData is fail")

    #�����̺߳���
    def clearThread(self):
        self.packThread.join()
        self.packThread=None


