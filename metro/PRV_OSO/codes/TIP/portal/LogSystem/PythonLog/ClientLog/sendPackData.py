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
            #向服务端发数据线程
            self.packThread=threading.Thread(target=self.sendData,args=())
            self.packThread.start()
        except Exception,e:
            print 'Error: ',e

    #发送数据线程函数
    def sendData(self):
        try:
            while True:
                packData=self.sendPack.getPackData()
                #向服务器发包
                self.tcpCliSock.sendall(packData)
            self.tcpCliSock.close()
        except:
            print("sendData is fail")

    #清理线程函数
    def clearThread(self):
        self.packThread.join()
        self.packThread=None


