# -*- coding: utf-8 -*-
from SetPackData import SetPackData
from CollectionLog import CollectionLog
from sendPackData import SendPackData

if __name__=='__main__':
    #�ռ���־
    collTest=CollectionLog('D:/log/td1')
    collTest.fileThread()
    #���
    takeTest=SetPackData()
    takeTest.takeDataThread()
    #����
    sendTest=SendPackData('127.0.0.1',21567)
    sendTest.connectHost()

    collTest.clearThread()
    takeTest.clearThread()
    sendTest.clearThread()

