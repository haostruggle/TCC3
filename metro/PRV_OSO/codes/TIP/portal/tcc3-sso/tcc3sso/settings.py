# coding:utf-8
"""
    tcc3sso.settings
    ~~~~~~~~~~~~~~~~~~~~

    tcc3sso settings config.
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""

CSRF_ENABLED = True
SECRET_KEY = 'this-is-a-secret'

MONGODB_HOST = '127.0.0.1'
MONGODB_PORT = 27017
MONGODB_DB = 'local'

CURRENT_API = {
    'end_point': 'api_1_0',
    'version': 'v1.0',
}

SSO_IP = 'localhost'
SSO_PORT = 'http://' + SSO_IP + ':9000'

REFERRER_NAME = 'url'
