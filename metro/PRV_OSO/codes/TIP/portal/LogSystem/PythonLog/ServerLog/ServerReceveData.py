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
        self.acceptThread=None #���տͻ����߳�
        self.dataThread=None  #���������߳�
        self.packetStr=ProcessPacket()

    #���߳̽�������
    def recvData(self):
        try:
            self.tcpSerSock = socket(AF_INET, SOCK_STREAM)
            self.tcpSerSock.bind((self.hostIp,self.hostPort))
            self.tcpSerSock.listen(5)

            #�����̴߳���ͻ�������:
            self.acceptThread=threading.Thread(target=self.acceptClient,args=())
            self.acceptThread.start()
        except Exception,e:
            print 'Error: ',e

    #���տͻ��������̺߳���
    def acceptClient(self):
        try:
            while True:
                tcpCliSock, addr = self.tcpSerSock.accept()
                #�������߳�������TCP����
                self.dataThread=threading.Thread(target=self.tcpLink,args=(tcpCliSock,addr))
                self.dataThread.start()
            self.tcpSerSock.close()
        except:
            print("accept client fail")

    #���������̴߳�����
    def tcpLink(self,tcpCliSock,addr):
        try:
            bufSize=1024
            print u'Connected client from : ', addr     #��ӡ���ĸ��ͻ�����������             ������
            #��ʱ����
            tempStr="";
            while True:
                #���տͻ�������
                dataStr = tcpCliSock.recv(bufSize)
                tempStr+=dataStr
                #���һ�η���������߰��������
                while True:
                    if len(tempStr)<4:
                        break
                    dataLenStr=tempStr[0:4]   #��
                    tupleData=struct.unpack('i',dataLenStr)
                    if len(tempStr) < tupleData[0]:
                        break
                    dataPacketStr = tempStr[0:tupleData[0]]
                    #�������İ�����������
                    self.packetStr.setUnPacketData(dataPacketStr)
                    tempStr = tempStr[tupleData[0]:]
            tcpCliSock.close()
        except:
            print("receve data faild")

    #����߳�
    def clearThread(self):
        self.acceptThread.join()
        self.acceptThread=None
        self.dataThread.join()
        self.dataThread=None