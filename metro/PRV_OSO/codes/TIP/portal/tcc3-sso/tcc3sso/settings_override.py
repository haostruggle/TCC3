# coding:utf-8
"""
    tcc3sso.settings_override
    ~~~~~~~~~~~~~~~~~~~~~~~~~

    tcc3sso settings config.
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""

CSRF_ENABLED = True
SECRET_KEY = 'this-is-a-secret'

MONGODB_SETTINGS = {
    'db': 'local',
    'host': 'localhost',
    'port': 27017
}

CURRENT_API = {
    'end_point': 'api_1_0',
    'version': 'v1.0',
}


REFERRER_NAME = 'url'
