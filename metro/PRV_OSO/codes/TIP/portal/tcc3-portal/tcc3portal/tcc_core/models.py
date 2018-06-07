# coding:utf-8

"""
    tcc3portal.models
    ~~~~~~~~~~~~~~~~~

    tcc3portal db models.
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""
import sys
import datetime
from flask import abort
from flask_login import UserMixin, AnonymousUserMixin, current_user
from flask_mongoengine import MongoEngine
from functools import wraps

db = MongoEngine()

if sys.version >= '3':
    unicode = str

__all__ = ['UserProfile', 'AnonymousUser', 'db', 'GENDER_LIST']

GENDER_LIST = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('U', 'Unknown')
]

PERMISSION = [
    'LEVEL1',#游客
    'LEVEL2',#一般
    'LEVEL3',#日志管理
    'LEVEL4',#进程控制
    'LEVEL5'#管理
]


def permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args,**kwargs):
            role_id = PERMISSION.index(permission)
            if not current_user.is_real(role_id):
                abort(403)
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def comment_required(f):
    return permission_required(PERMISSION[1])(f)


def admin_required(f):
    return permission_required(PERMISSION[4])(f)


class UserProfile(db.Document, UserMixin):
    """User profile information."""
    meta = {'collection': 'user_profile'}

    nick_name = db.StringField(required=True, max_length=24)
    email = db.EmailField(required=True)

    real_name = db.StringField(max_length=24)
    # phones = db.ListField(db.ReferenceField(UserPhone, reverse_delete_rule=NULLIFY))
    birth = db.DateTimeField(default=datetime.datetime.now())
    gender = db.StringField(max_length=3, choices=GENDER_LIST, default=GENDER_LIST[2])
    brief_description = db.StringField(max_length=140)
    role_id = db.StringField(max_length=20, choices=PERMISSION, default=PERMISSION[1])

    # is_active = db.BooleanField(required=True, default=True)
    # is_authenticated = db.BooleanField(required=True, default=True)

    def __str__(self):
        return unicode(self.nick_name)

    def get_id(self):
        return unicode(self.id)

    def is_real(self, permissions):
        level_a = PERMISSION.index(self.role_id)
        level_b = permissions

        if level_a >= level_b:
            return True
        else:
            return False

    @property
    def is_comment(self):
        return self.is_real(1)

    @property
    def is_mod_comment(self):
        return self.is_real(2)

    @property
    def is_mod_comment(self):
        return self.is_real(3)

    @property
    def is_administrator(self):
        return self.is_real(4)


class AnonymousUser(AnonymousUserMixin):

    nick_name = 'AnonymousUser'
    role_id = PERMISSION[0]

    def __str__(self):
        return unicode(self.nick_name)

    def get_id(self):
        return None

    def is_real(self, permissions):
    #这个方法用来传入一个权限来核实用户是否有这个权限,返回bool值
        return False
