# -*- coding: utf-8 -*-
import struct

#�������
class GroupPacket:
    def __init__(self,dataPath,dataStr):
        self.dataPath=dataPath
        self.dataStr=dataStr

    #�������
    def Serialize(self):
        longStr=self.dataPath+self.dataStr
        longStrLen=self.GetPacketLen()
        format='i%ds' %len(longStr)
        buf=struct.pack(format,longStrLen,longStr)
        return buf
    # buf = int len*content   buf = longStrLen + len��char
    #�õ����ܳ��Ⱥ���
    def GetPacketLen(self):
        strLen=4+len(self.dataPath)+len(self.dataStr)
        return strLen


