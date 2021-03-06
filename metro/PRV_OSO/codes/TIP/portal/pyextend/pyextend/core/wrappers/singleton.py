# coding: utf-8
"""
    pyextend.core.wrappers.singleton
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    pyextend core wrappers singleton wrapper

    :copyright: (c) 2016 by Vito.
    :license: GNU, see LICENSE for more details.
"""


def singleton(cls, *args, **kwargs):
    """�൥��װ����"""
    instance = {}

    def _singleton():
        if cls not in instance:
            instance[cls] = cls(*args, **kwargs)
        return instance[cls]
    return _singleton


if __name__ == '__main__':
    import unittest

    class MyTestCase(unittest.TestCase):
        def test_singleton(self):

            @singleton
            class SObj(object):
                pass

            a = SObj()
            b = SObj()
            self.assertEqual(id(a), id(b))
            self.assertEqual(a, b)
            a.A = 1
            self.assertEqual(b.A, 1)

    unittest.main()
