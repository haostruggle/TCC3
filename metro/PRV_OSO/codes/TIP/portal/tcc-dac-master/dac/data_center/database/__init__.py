# coding:utf-8
"""
    tcc-dac.data_center.database
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    tcc-dac data_center database package.
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""
# from functools import wraps
from abc import ABCMeta, abstractmethod
from pymongo import MongoClient
import pandas as pd
from dac.config import MONGODB_HOST, MONGODB_PORT, MONGODB_DB
from dac.common.exceptions import NoDataError


def _connect_mongo(host, port, username=None, password=None, database=None):#链接mongodb
    """ A util for making a connection to mongodb """
    database = database or 'local'
    if username and password:
        mongo_uri = 'mongodb://%s:%s@%s:%s/%s' % (username, password, host, port, database)
        conn = MongoClient(mongo_uri) #mongodb内置接口
    else:
        conn = MongoClient(host, port)

    return conn, conn[database]  #返回链接句柄和链接的db库


class Mongodb(object):
    def __init__(self, app=None):
        self.db_host = MONGODB_HOST
        self.db_port = MONGODB_PORT
        self.db_name = MONGODB_DB
        self._conn = None
        self._db = None
        if app is not None:
            self.init_app(app)
        else:
            self._conn, self._db = _connect_mongo(self.db_host, self.db_port, database=self.db_name)

    def init_app(self, app):
        if "MONGODB_HOST" in app.config:
            self.db_host = app.config["MONGODB_HOST"]

        if "MONGODB_PORT" in app.config:
            self.db_port = app.config["MONGODB_PORT"]

        if "MONGODB_DB" in app.config:
            self.db_name = app.config["MONGODB_DB"]

        self._conn, self._db = _connect_mongo(self.db_host, self.db_port, database=self.db_name)

    @property
    def db(self):
        return self._db

    @property
    def conn(self):
        return self._conn

    def close(self):
        try:
            _conn = self._conn
           #""":type _conn: MongoClient"""
            _conn.close()
        except Exception as e:
            print("MONGODB ERROR", e)

    def __getitem__(self, item):
        return self.db[item]

    def __getattr__(self, item):
        try:
            return object.__getattribute__(item)
        except:
            return getattr(self.db, item)


class MongodbReader(object, metaclass=ABCMeta):
    def __init__(self):
        # self.data_frame = None
        self._db = db

    def init_db(self, database):
        self._db = database

    def __load_frame__(self, collection, *args, **kwargs):
        """Load data frame, if no data Raise NoDataError"""
        _collection = self._db[collection]
        print('_collection: ', _collection)
        ret = list(_collection.find(*args, **kwargs))
        print('ret: ', ret)
        if ret is None or len(ret) == 0:
            raise NoDataError(collection, *args, **kwargs)

        data_frame = pd.DataFrame(ret, dtype=object)
        try:
            del data_frame['_id']
        except KeyError:
            pass
        return data_frame#获取表内结构

    def __exists__(self, collection, *args, **kwargs):#获取表内数量
        _collection = self._db[collection]
        result = _collection.count(*args, **kwargs)
        return result > 0

    @abstractmethod
    def load_frame(self, *args, **kwargs): pass


db = Mongodb()

# def close_db(*dbs):
#     if dbs is None or len(dbs) == 0:
#         dbs = ['db']
#
#     def _deco(func):
#         @wraps(func)
#         def _call(*args, **kwargs):
#             result = func(*args, **kwargs)
#             for db in dbs:
#                 try:
#                     func.func_globals[db].connection.disconnect()
#                     print('{} disconnected'.format(db))
#                 except KeyError:
#                     pass
#             return result
#         return _call
#     return _deco
#
#
# class Mongodb(object):
#     def __init__(self, host='localhost', port=27017, database='test', max_pool_size=10, timeout=10):
#         self.host = host
#         self.port = port
#         self.database = database
#         self.max_pool_size = max_pool_size
#         self.timeout = timeout
#
#     @staticmethod
#     def init_mongodb():
#         return Mongodb(host=mongo_host, port=mongo_port, database=mongo_db)
#
#     @property
#     def connect(self):
#         return MongoClient(self.host, self.port, maxPoolSize=self.max_pool_size,
#                            connectTimeoutMS=60 * 60 * self.timeout)
#
#     def __getitem__(self, collection):
#         return self.__getattr__(collection)
#
#     def __getattr__(self, collection_or_func):
#         l_db = self.connect[self.database]
#         if collection_or_func in Database.__dict__:
#             # if collection_or_func is Database 's func
#             return getattr(l_db, collection_or_func)
#         # else called Collection
#         return Collection(l_db, collection_or_func)
#
#
# class Collection(object):
#     def __init__(self, db, collection):
#         self.collection = getattr(db, collection)
#
#     @close_db
#     def __getattr__(self, operation):
#         # control_type = ['disconnect', 'insert', 'update', 'find', 'find_one']
#         # if operation in control_type:
#         #     return getattr(self.collection, operation)
#         # raise AttributeError(operation)
#         return getattr(self.collection, operation)

