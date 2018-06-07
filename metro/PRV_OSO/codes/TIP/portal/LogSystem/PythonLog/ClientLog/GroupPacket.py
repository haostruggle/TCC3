# -*- coding: utf-8 -*-
import struct

#构造包类
class GroupPacket:
    def __init__(self,dataPath,dataStr):
        self.dataPath=dataPath
        self.dataStr=dataStr

    #打包函数
    def Serialize(self):
        longStr=self.dataPath+self.dataStr
        longStrLen=self.GetPacketLen()
        format='i%ds' %len(longStr)
        buf=struct.pack(format,longStrLen,longStr)
        return buf
    # buf = int len*content   buf = longStrLen + len个char
    #得到包总长度函数
    def GetPacketLen(self):
        strLen=4+len(self.dataPath)+len(self.dataStr)
        return strLen


