# -*- coding: utf-8 -*-
import struct
import threading
from QueueTeam import ProcessPacket
from QueueTeam import SetDataToDb


class ServerUnpack:
    def __init__(self):
        self.unPacketThread=None
        self.unPacketStr=ProcessPacket()
        self.dataStr=SetDataToDb()

    #���߳̽��հ�
    def receveUnPacket(self):
        try:
            self.unPacketThread=threading.Thread(target=self.dealUnPacket,args=())
            self.unPacketThread.start()
        except:
            print "receveUnPacket is unscess"

    #�Ӱ��̺߳���
    def dealUnPacket(self):
        try:
            while True:
                newPacket=self.unPacketStr.getUnPacketData()
                format='i%ds' % (len(newPacket)-4)
                a,b=struct.unpack(format,newPacket)
                tuple=(a,b)
                tupleStr=tuple[1]
                listStr=tupleStr.split('***')
                self.dataStr.setDataStr(listStr)
        except:
            print "dealUnPacket is fail"

    #����߳�
    def cleanThread(self):
        self.unPacketThread.join()
        self.unPacketThread=None



