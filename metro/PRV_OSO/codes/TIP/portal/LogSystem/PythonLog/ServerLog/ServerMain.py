# -*- coding: utf-8 -*-
from ServerReceveData import ServerReceveData
from ServerUnpack import ServerUnpack
from ServerConMonDb import ProcessDataStr



if __name__=='__main__':
    #接包线程
    servrTest=ServerReceveData('127.0.0.1',21567)
    servrTest.recvData()

    #解包线程
    unPacketTest=ServerUnpack()
    unPacketTest.receveUnPacket()

    #塞数据线程
    dataStrTest=ProcessDataStr('127.0.0.1',27017,'test','logTable')
    dataStrTest.threadData()

    servrTest.clearThread()
    unPacketTest.cleanThread()
    dataStrTest.cleanThread()

