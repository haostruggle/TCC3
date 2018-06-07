# coding:utf-8
"""
    tcc3sso.forms
    ~~~~~~~~~~~~~~~~~~~~

    tcc3sso forms module.
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""
from flask_wtf import Form
from wtforms import StringField, BooleanField, PasswordField, ValidationError, DateField, SelectField
from wtforms.validators import DataRequired, Email, EqualTo, Length
from .sso.entities import GENDER_LIST, PERMISSION


def pwd_length_check(form, field):
    if len(field.data) > 16:
        raise ValidationError('Filed must be less than 16 characters.')

    if not field.data.isalnum():
        raise ValidationError('Password should only contains alphabets or digits')

    if field.data.isalpha() or field.data.isdigit():
        raise ValidationError('Password should contains both alphabets and digits')


def name_input_check(form, field):
    if len(field.data) > 24:
        raise ValidationError('Filed must be less than 24 characters.')

    if not field.data.isalnum():
        raise ValidationError('Username should only contains alphabets or digits')

    import pymongo
    client = pymongo.MongoClient('127.0.0.1', 27017)
    db_name = 'local'
    db = client[db_name]
    db_table_use = db['user_profile']
    date = ""

    for result in db_table_use.find({"nick_name": field.data}):
        date = result['nick_name']
    if date != "":
        raise ValidationError('Username is already an account')


def email_input_check(form, field):
    import pymongo
    client = pymongo.MongoClient('127.0.0.1', 27017)
    db_name = 'local'
    db = client[db_name]
    db_table_use = db['user_profile']
    date = ""

    for result in db_table_use.find({"email": field.data}):
        date = result['email']
        user = result['nick_name']

    if date != "":
        raise ValidationError('email is already an account')


class LoginForm(Form):
    account = StringField('account', validators=[DataRequired()])  # , name_input_check
    pwd = PasswordField('pwd', validators=[DataRequired(), pwd_length_check])


class SignupForm(Form):
    nick_name = StringField('nick name', validators=[DataRequired(), name_input_check])
    pwd = PasswordField('pwd', validators=[DataRequired(),
                                           Length(4, 16, message='password must be between 4 and 16 characters.')])
    cfm_pwd = PasswordField('cfm pwd', validators=[DataRequired(), EqualTo('pwd')])
    email = StringField('email', validators=[DataRequired(), Email(), email_input_check])
    cfm_email = StringField('cfm email', validators=[DataRequired(), EqualTo('email'), ])

    real_name = StringField('real name', validators=[name_input_check])
    # phones = StringField('phones', validators=[DataRequired(), name_input_check])
    birth = StringField('birth day', validators=[])
    gender = SelectField('gender', choices=GENDER_LIST)
    brief_description = \
        StringField('brief desc', validators=[
            Length(max=140, message='brief description must be less than 140 characters.')
        ])


class PersonForm(Form):#表格验证
    nick_name = StringField('nick name', validators=[DataRequired()])
    email = StringField('email', validators=[DataRequired(), Email()])
    birth = StringField('birth day', validators=[])#生日
    #性别
    gender = SelectField('gender', choices=GENDER_LIST)
    #描述
    brief_description = \
        StringField('brief desc', validators=[
            Length(max=140, message='brief description must be less than 140 characters.')
        ])

class PwdChangeForm(Form):#表格验证
    oldpwd = PasswordField('old pwd', validators=[DataRequired(),pwd_length_check])
    newpwd = PasswordField('new pwd', validators=[DataRequired(),pwd_length_check])
    cfmpwd = PasswordField('cfm pwd', validators=[DataRequired(),pwd_length_check])


NAMELIST = []


def all_name():
    import pymongo
    client = pymongo.MongoClient('127.0.0.1', 27017)
    db_name = 'local'
    db = client[db_name]
    db_table_use = db['user_profile']
    num = 0
    for i in db_table_use.find():
        NAMELIST.append((i['nick_name'], i['nick_name'] + "/ " + i['email']))
        num += 1

    return NAMELIST


class PerChangeForm(Form):#表格验证
    nick_name = SelectField('nick name', validators=[DataRequired(), all_name()], choices=NAMELIST)
    role_id = SelectField('role id', validators=[DataRequired()], choices=[(PERMISSION[0], PERMISSION[0]), (PERMISSION[1], PERMISSION[1]), (PERMISSION[2], PERMISSION[2]), (PERMISSION[3], PERMISSION[3]), (PERMISSION[4], PERMISSION[4])])

