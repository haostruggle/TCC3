# -*- coding: utf-8 -*-
from ServerReceveData import ServerReceveData
from ServerUnpack import ServerUnpack
from ServerConMonDb import ProcessDataStr



if __name__=='__main__':
    #�Ӱ��߳�
    servrTest=ServerReceveData('127.0.0.1',21567)
    servrTest.recvData()

    #����߳�
    unPacketTest=ServerUnpack()
    unPacketTest.receveUnPacket()

    #�������߳�
    dataStrTest=ProcessDataStr('127.0.0.1',27017,'test','logTable')
    dataStrTest.threadData()

    servrTest.clearThread()
    unPacketTest.cleanThread()
    dataStrTest.cleanThread()

