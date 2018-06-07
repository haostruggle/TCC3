# -*- coding: utf-8 -*-
from socket import *
import struct
import threading
from QueueTeam import ProcessPacket

class ServerReceveData:
    def __init__(self,hostIp,hostPort):
        self.hostIp=hostIp
        self.hostPort=hostPort
        self.tcpSerSock=""
        self.acceptThread=None #接收客户端线程
        self.dataThread=None  #接收数据线程
        self.packetStr=ProcessPacket()

    #起线程接收数据
    def recvData(self):
        try:
            self.tcpSerSock = socket(AF_INET, SOCK_STREAM)
            self.tcpSerSock.bind((self.hostIp,self.hostPort))
            self.tcpSerSock.listen(5)

            #创建线程处理客户端连接:
            self.acceptThread=threading.Thread(target=self.acceptClient,args=())
            self.acceptThread.start()
        except Exception,e:
            print 'Error: ',e

    #接收客户端连接线程函数
    def acceptClient(self):
        try:
            while True:
                tcpCliSock, addr = self.tcpSerSock.accept()
                #创建新线程来处理TCP连接
                self.dataThread=threading.Thread(target=self.tcpLink,args=(tcpCliSock,addr))
                self.dataThread.start()
            self.tcpSerSock.close()
        except:
            print("accept client fail")

    #接收数据线程处理函数
    def tcpLink(self,tcpCliSock,addr):
        try:
            bufSize=1024
            print u'Connected client from : ', addr     #打印是哪个客户端连过来的             ？？？
            #临时变量
            tempStr="";
            while True:
                #接收客户端数据
                dataStr = tcpCliSock.recv(bufSize)
                tempStr+=dataStr
                #解决一次发多个包或者半包的问题
                while True:
                    if len(tempStr)<4:
                        break
                    dataLenStr=tempStr[0:4]   #？
                    tupleData=struct.unpack('i',dataLenStr)
                    if len(tempStr) < tupleData[0]:
                        break
                    dataPacketStr = tempStr[0:tupleData[0]]
                    #把正常的包塞到队列里
                    self.packetStr.setUnPacketData(dataPacketStr)
                    tempStr = tempStr[tupleData[0]:]
            tcpCliSock.close()
        except:
            print("receve data faild")

    #清除线程
    def clearThread(self):
        self.acceptThread.join()
        self.acceptThread=None
        self.dataThread.join()
        self.dataThread=None