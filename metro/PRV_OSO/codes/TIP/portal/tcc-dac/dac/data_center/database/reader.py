# coding:utf-8
"""
    tcc-dac.data_center.database.reader
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    tcc-dac data_center database reader module.
    Loads from mongodb, than generate horizontal collection table, like:
    trip,type,direction,stop|ƻ��԰|0103|0|1|A|1,stop|ƻ��԰|0103|0|1|D|1,stop|�ų�·|0104|40|1|A|2,stop|�ų�·|0104|40|1|D|2,stop|�˽�����԰|0105|80|1|A|3,stop|�˽�����԰|0105|80|1|D|3,stop|�˱�ɽ|0106|120|1|A|4,stop|�˱�ɽ|0106|120|1|D|4,stop|��Ȫ·|0107|160|1|A|5,stop|��Ȫ·|0107|160|1|D|5,stop|�����|0108|200|1|A|6,stop|�����|0108|200|1|D|6,stop|����·|0109|240|1|A|7,stop|����·|0109|240|1|D|7,stop|�����أ�1���ߣ�|0110|280|1|A|8,stop|�����أ�1���ߣ�|0110|280|1|D|8,stop|���²���ݣ�1���ߣ�|0111|320|1|A|9,stop|���²���ݣ�1���ߣ�|0111|320|1|D|9,stop|ľ�ص�|0112|360|1|A|10,stop|ľ�ص�|0112|360|1|D|10,stop|����ʿ·|0113|400|1|A|11,stop|����ʿ·|0113|400|1|D|11,stop|�����ţ�1���ߣ�|0114|440|1|A|12,stop|�����ţ�1���ߣ�|0114|440|1|D|12,stop|������1���ߣ�|0115|480|1|A|13,stop|������1���ߣ�|0115|480|1|D|13,stop|�찲����|0116|520|1|A|14,stop|�찲����|0116|520|1|D|14,stop|�찲�Ŷ�|0117|560|1|A|15,stop|�찲�Ŷ�|0117|560|1|D|15,stop|������|0118|600|1|A|16,stop|������|0118|600|1|D|16,stop|������1���ߣ�|0119|640|1|A|17,stop|������1���ߣ�|0119|640|1|D|17,stop|�����ţ�1���ߣ�|0120|680|1|A|18,stop|�����ţ�1���ߣ�|0120|680|1|D|18,stop|������|0121|720|1|A|19,stop|������|0121|720|1|D|19,stop|��ó��1���ߣ�|0122|760|1|A|20,stop|��ó��1���ߣ�|0122|760|1|D|20,stop|����·|0123|800|1|A|21,stop|����·|0123|800|1|D|21,stop|�Ļݣ�1���ߣ�|0124|840|1|A|22,stop|�Ļݣ�1���ߣ�|0124|840|1|D|22,stop|�Ļݶ���1���ߣ�|0125|880|1|A|23,stop|�Ļݶ���1���ߣ�|0125|880|1|D|23
    1007,B,1,20140702054056,20140702053956,20140702053616,20140702053446,20140702053216,20140702053146,20140702052916,20140702052846,20140702052646,20140702052616,20140702052356,20140702052321,20140702052111,20140702052036,20140702051846,20140702051806,20140702051626,20140702051536,20140702051356,20140702051326,20140702051126,20140702051100,20140702051000,20140702050830,20140702050630,20140702050630,20140702050500,20140702050500,20140702050330,20140702050330,20140702050200,20140702050200,20140702050040,20140702050040,20140702045850,20140702045850,20140702045650,20140702045650,20140702045540,20140702045540,20140702045340,20140702045340,20140702045110,20140702045110,-,-
    ...
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""
import os
import time
import pandas as pd
from abc import ABCMeta, abstractmethod
# from multiprocessing.dummy import Pool as ThreadPool
from multiprocessing import Pool
from .import db
from dac.data_center.cache.redis_cache import RedisCache, ScheduleCache
from dac.common.exceptions import NoDataError
from dac.config import LINE_DATA_UPLOADS_DEFAULT_URL


class MongodbReader(object, metaclass=ABCMeta):
    def __init__(self):
        self.data_frame = None

    def __load_frame__(self, collection, *args, **kwargs):
        """Load data frame, if no data Raise NoDataError"""
        _collection = db[collection]
        ret = list(_collection.find(*args, **kwargs))
        if ret is None or len(ret) == 0:
            raise NoDataError(collection, *args, **kwargs)

        self.data_frame = pd.DataFrame(ret, dtype=object)
        try:
            del self.data_frame['_id']
        except KeyError:
            pass

    @staticmethod
    def __exists__(collection, *args, **kwargs):
        _collection = db[collection]
        result = _collection.count(*args, **kwargs)
        return result > 0

    @abstractmethod
    def load_frame(self, *args, **kwargs): pass


class LineConfigMongodbReader(MongodbReader):
    __collection__ = 'line_conf'

    def __init__(self):
        super(LineConfigMongodbReader, self).__init__()

    def load_frame(self, line_no=None):
        """Load data frame, if no data Raise NoDataError"""
        if line_no:
            self.__load_frame__(self.__collection__, {'line_no': line_no})
        else:
            self.__load_frame__(self.__collection__)

        try:
            self.data_frame = self.data_frame.sort_values(['line_no', 'seq'], ascending=[1, 1])  # ascending=True
        except KeyError:
            pass

    def get_header_list(self):
        header_header = 'trip,type,direction,'
        header_item = 'stop|%s|%s|%s|%s|%s|%s'	 # stop|station name|station id|distance|area|A or D|index
        header = header_header
        for index, row in self.data_frame.iterrows():
            header_item1 = header_item % (row['stn_name'], row['stn_id'], row['distance'], row['area'], 'A', index+1)
            header_item2 = header_item % (row['stn_name'], row['stn_id'], row['distance'], row['area'], 'D', index+1)

            header = header + header_item1 + ','
            header = header + header_item2 + ','

        header = header[0:header.rfind(',')]
        header_list = header.split(',')
        return header_list

    def get_ascending_stations(self):
        """Returns [(seq,stn_id), ...]"""
        # data_frame is ordered, ascending
        return self.data_frame.loc[:, ['seq', 'stn_id']].to_records(index=False)

    @staticmethod
    def exists(line_no):
        return MongodbReader.__exists__(LineConfigMongodbReader.__collection__, {'line_no': line_no})

    # def get_raw_data(self):
    #     data = self.data_frame.to_dict(orient='records')
    #     return data

    def get_raw_data(self):
        line_groups = self.data_frame.groupby('line_no')
        # pool = Pool(2)
        # results = pool.map(self._gen_config_by_line, line_groups)
        # pool.close()
        # pool.join()
        results = map(self._gen_config_by_line, line_groups)
        raw_data_dict = dict()

        for ln, d in results:
            raw_data_dict[ln] = d

        return raw_data_dict

    @staticmethod
    def _gen_config_by_line(*args):
        line_no, config_frame = args[0]
        data = config_frame.to_dict(orient='records')
        return line_no, data


class ScheduleMongodbReader(MongodbReader):
    # __collection_plan_schedule__ = 'plan_schedule'
    # __collection_real_schedule__ = 'real_schedule'
    # __type_plan__ = 'PLAN'
    # __type_real__ = 'REAL'
    __collections__ = {
        'PLAN': 'plan_schedule',
        'REAL': 'real_schedule',
    }

    def __init__(self):
        self._line_no = None
        self._date = None
        self._type = None  # real or plan
        self._data_list_result = None
        self._data_frame_result = None
        self._header_reader = LineConfigMongodbReader()
        self.header = []
        self.ordered_stn = []
        super(ScheduleMongodbReader, self).__init__()

    def load_frame(self, line_no, date, plan_or_real):
        """Load data frame, if no data Raise NoDataError
            :type plan_or_real: must single 'PLAN' or 'REAL', not 'PLAN&REAL'
        """
        self._line_no = line_no
        self._date = date
        self._type = plan_or_real.upper()
        if self._type not in self.__collections__.keys():
            raise ValueError('Invalid param of {}'.format(plan_or_real))

        self.__load_frame__(self.__collections__[self._type], {'$and': [
            {'line_no': line_no},
            {'date': date}
        ]})
        self._load_header(line_no)
        self._get_data()

    @property
    def data_frame_result(self):
        return self._data_frame_result

    @property
    def data_list_result(self):
        return self._data_list_result

    def to_redis(self):
        dfr = self.data_frame_result
        """:type dfr: pd.DataFrame"""
        data = dfr.to_json(orient='index')
        RedisCache.set_redis_data(ScheduleCache.get_keys(self._line_no, self._date, self._type)[0], data)

    def to_csv(self):
        file_path = os.path.join(LINE_DATA_UPLOADS_DEFAULT_URL,
                                 'LINE{}_{}_{}.csv'.format(self._line_no, self._type, self._date))
        self.data_frame_result.to_csv(file_path, index=False)

    def _load_header(self, line_no):
        self._header_reader.load_frame(line_no)
        self.header = self._header_reader.get_header_list()
        self.ordered_stn = self._header_reader.get_ascending_stations()

    def _get_data(self):
        # pool = ThreadPool(10)
        pool = Pool(4)

        line_trains_records = list()

        trip_groups = self.data_frame.groupby('trip')

        # for trip, train_frame in trip_groups:
        #     record_list = self._gen_row(trip, train_frame)
        #     line_trains_records.append(record_list)

        results = pool.map_async(self._gen_row, trip_groups).get(1020)
        pool.close()
        pool.join()
        line_trains_records.extend(results)

        self._data_list_result = line_trains_records
        # self._data_list_result.append(self.header)
        self._data_frame_result = pd.DataFrame(line_trains_records)  # , columns=self.header
        self._data_frame_result.columns = self.header
        dfr = self._data_frame_result
        """:type dfr:pd.DataFrame"""
        dfr.index = dfr['trip']

    def _gen_row(self, *args):
        trip, train_frame = args[0]
        print('{} - PPID: {}-PID: {} - TRIP: {}'.format(time.time(), os.getppid(), os.getpid(), trip))
        # train_frame.iloc(0)[0]['direction']:  get first row's direction column value

        # changed the 'B' to self._type . NBL
        record_list = [trip, self._type, train_frame.iloc(0)[0]['direction']]

        time_list = self._gen_train_times(train_frame, self.ordered_stn)
        record_list.extend(time_list)
        return record_list

    @staticmethod
    def _gen_train_times(train_frame, ordered_stn):
        """:type train_frame: pd.DataFrame
            :type ordered_stn: list
        """
        time_list = []
        stn_col = train_frame['stn_id']

        for _, stn in ordered_stn:
            # find row in train_frame where stn_id == stn
            found_row = train_frame[stn_col == stn]
            if len(found_row) == 1:
                # for index, row in train_frame.iterrows():
                #     if row['stn_id'] == stn:
                #         if row['direction'] == '1':
                #             time_list.extend([row['dep_time'], row['arr_time']])
                #         else:
                #             time_list.extend([row['arr_time'], row['dep_time']])
                found_row = found_row.iloc(0)[0]

                if found_row['direction'] == '1':
                    time_list.extend([found_row['dep_time'], found_row['arr_time']])
                else:
                    time_list.extend([found_row['arr_time'], found_row['dep_time']])
            else:
                time_list.append('-')
                time_list.append('-')

        return time_list
