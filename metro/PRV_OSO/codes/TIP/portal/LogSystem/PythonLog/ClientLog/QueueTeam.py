# -*- coding: utf-8 -*-

import Queue
import threading

#������
class Singleton(object):
    def __new__(cls, *args, **kw):
        if not hasattr(cls, '_instance'):
            orig = super(Singleton, cls)
            cls._instance = orig.__new__(cls, *args, **kw)
        return cls._instance

#������
class SynchronousQueue:

    def __init__(self, capacity=-1):
        self.capacity = capacity          #��ʼ�����д�С
        self.mutex = threading.Lock()     #��ʼ��������
        self.cond  = threading.Condition(self.mutex)    #��ʼ����������
        self.queue = Queue.Queue(capacity)        #��ʼ������

    def get(self):
        if  self.cond.acquire():          #��ȡ������������������python��threading��������Ĭ�ϰ��������������ֻ��Ҫ��ȡ������������
            while self.queue.empty():
                self.cond.wait()          #���������ȴ�
            elem = self.queue.get()
            self.cond.notify()
            self.cond.release()
        return elem

    def put(self,elem):
        if self.cond.acquire():
            self.queue.put(elem)
            self.cond.notify()
            self.cond.release()

    def clear(self):
        if self.cond.acquire():
            self.queue.queue.clear()
            self.cond.release()
            self.cond.notifyAll()

    def empty(self):
        is_empty = False;
        if self.mutex.acquire():            #ֻ��Ҫ��ȡ������
            is_empty = self.queue.empty()
            self.mutex.release()
        return is_empty

    def size(self):
        size = 0
        if self.mutex.acquire():
            size = self.queue.qsize()
            self.mutex.release()
        return size

    def resize(self,capacity=-1):
        self.capacity = capacity



#���е���ʵ������           �����־���ݶ���
class QueueClass(Singleton):
    def __init__(self):
        self.queueData=SynchronousQueue(-1)    #-1

    #���ö������ӿ�
    def setQueueData(self,strData):
        self.queueData.put(strData)

    #�Ӷ��������ӿ�
    def getQueueData(self):
        return self.queueData.get()


#���е���ʵ������       ���������ݶ���
class PackQueueClass(Singleton):
    def __init__(self):
        self.queueData=SynchronousQueue(-1)

    #���ö������ӿ�
    def setPackData(self,strData):
        self.queueData.put(strData)

    #�Ӷ��������ӿ�
    def getPackData(self):
        return self.queueData.get()
