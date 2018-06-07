# -*- coding: utf-8 -*-

import Queue
import threading

#单例类
class Singleton(object):
    def __new__(cls, *args, **kw):
        if not hasattr(cls, '_instance'):
            orig = super(Singleton, cls)
            cls._instance = orig.__new__(cls, *args, **kw)
        return cls._instance

#队列类
class SynchronousQueue:

    def __init__(self, capacity=-1):
        self.capacity = capacity          #初始化队列大小
        self.mutex = threading.Lock()     #初始化互斥量
        self.cond  = threading.Condition(self.mutex)    #初始化条件变量
        self.queue = Queue.Queue(capacity)        #初始化队列

    def get(self):
        if  self.cond.acquire():          #获取互斥锁和条件变量，python中threading条件变量默认包含互斥量，因此只需要获取条件变量即可
            while self.queue.empty():
                self.cond.wait()          #条件变量等待
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
        if self.mutex.acquire():            #只需要获取互斥量
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



#队列单例实例化类           存放日志数据队列
class QueueClass(Singleton):
    def __init__(self):
        self.queueData=SynchronousQueue(-1)    #-1

    #设置队列数接口
    def setQueueData(self,strData):
        self.queueData.put(strData)

    #从队列拿数接口
    def getQueueData(self):
        return self.queueData.get()


#队列单例实例化类       存放组包数据队列
class PackQueueClass(Singleton):
    def __init__(self):
        self.queueData=SynchronousQueue(-1)

    #设置队列数接口
    def setPackData(self,strData):
        self.queueData.put(strData)

    #从队列拿数接口
    def getPackData(self):
        return self.queueData.get()
