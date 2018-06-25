# coding:utf-8
"""
    run
    ~~~~~~~~~~~~~~~~~~~~

    tcc3sso run
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""

from tcc3sso import create_app

application = create_app()


if __name__ == '__main__':
    application.run("127.0.0.1", 9001, debug=True)