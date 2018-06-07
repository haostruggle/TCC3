# coding:utf-8
"""
    tcc3sso.views
    ~~~~~~~~~~~~~~~~~~~~

    tcc3sso views module.
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""
import urllib.parse

from flask import Blueprint, abort, render_template, url_for, make_response, redirect, flash, request, jsonify
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
from .sso.middle import *

from .forms import LoginForm, SignupForm, PersonForm, PwdChangeForm, PerChangeForm
from .helpers import get_referrer_url, get_referrer_name
from .settings import CURRENT_API
from .sso import UserProfile, LocalAuth, SSOToken, Cookie, SSOApi

bp_main = Blueprint('main', __name__)
bp_sso = Blueprint('sso', __name__, url_prefix='/sso')
bp_api = Blueprint('api', __name__, url_prefix='/api')
bp_api_1_0 = Blueprint('api_1_0', __name__, url_prefix='/api/v1.0')


def get_referrer_dict():
    referrer_name = get_referrer_name()
    referrer_url = get_referrer_url()
    vals = {referrer_name: referrer_url}
    return referrer_name, referrer_url, vals


PERMISSION = [
    'LEVEL1',
    'LEVEL2',
    'LEVEL3',
    'LEVEL4',
    'LEVEL5'
]


def check_date(user_name, email):

    db_table_use = get_user_table()
    date = ""
    user = ""
    for result in db_table_use.find({"nick_name": user_name}):
        date = result['email']
        user = result['nick_name']

    if date == email and user == user_name:
        return True
    elif date == "" and user == user_name:
        return True
    else:
        return False
        #ValidationError('email is already an account')


# When accessing a web root directory,
# if there is a referrer parameters,
# then redirected to the login page
@bp_main.route('/')
def root():
    _, referrer_url, referrer_dict = get_referrer_dict()

    if referrer_url:
        redirect_url = url_for('sso.sso', **referrer_dict)
    else:

        redirect_url = url_for('main.index', **referrer_dict)
    print('main root redirect_url:', redirect_url)
    return redirect(redirect_url)



@bp_main.route('/index')
def index():
    _, _, referrer_dict = get_referrer_dict()
    return render_template('index.html', referrer_dict=referrer_dict)


@bp_sso.route('/')
def sso():
    try:
        referrer_url = Cookie.check()
        print('Cookie.check url: {}'.format(referrer_url))
        return redirect(referrer_url)
    except ValueError:
        abort(404)


@bp_sso.route('/login', methods=['POST', 'GET'])
def login():
    _, referrer_url, referrer_dict = get_referrer_dict()
    form = LoginForm()
    try:
        if form.validate_on_submit():
            user = LocalAuth.try_login(form.account.data, form.pwd.data)
            """:type user: UserProfile"""
            if user is None:
                raise ValueError('The account or the password is incorrect.')

            #login_user(user)

            token = SSOToken(user.nick_name)

            if referrer_url.find('?') >= 0:
                split_chr = '&'
            else:
                split_chr = '?'

            SSOToken.add_token(token)
            ticket = token.add_new_ticket()
            if not isinstance(ticket, str):
                raise TypeError('Incorrect data type for ticket.')

            dic = {'ticket': ticket}

            referrer_url = referrer_url + split_chr + urllib.parse.urlencode(dic)
            cookie_value = Cookie(token.id).cookie_value

            print('login POST referrer_url: {}'.format(referrer_url))
            if not referrer_url.strip():
                # referrer_url = '/error'
                return redirect(url_for('main.index'))

            resp = make_response(redirect(referrer_url))
            resp.set_cookie(Cookie.form_auth_cookie_name, cookie_value)
            print('login POST resp: {}'.format(resp))
            return resp

    except ValueError:
        flash("The account or the password is incorrect.")

    return render_template('login.html', form=form, referrer_dict=referrer_dict)


@bp_sso.route('/profile', methods=['GET', 'GET'])
def profile():
    token_id = Cookie.check_login()

    item = SSOToken.find(token_id)
    user_name = item.user_name

    _, referrer_url, referrer_dict = get_referrer_dict()
    print(" dologin use_dict:{}".format(referrer_url))

    port = get_sso_port()
    form = PersonForm()

    ticket = item.get_ticket()
    home_url = port + "/?ticket=" + ticket

    referrer_dict['url'] = referrer_url

    db_table_use = get_user_table()
    referrer_dict['name']=user_name
    print("referrer_url:", home_url)
    for result in db_table_use.find({"nick_name": user_name}):
        referrer_dict['email'] = result['email']
        referrer_dict['gender'] = result['gender']
        referrer_dict['birthday'] = str(result['birth'])[0:10]
        referrer_dict['description'] = result['brief_description']
        referrer_dict['_id'] = result['_id']

    if form.is_submitted():  #提交表单
        if check_date(user_name, referrer_dict['email']):
            db_table_use.update({'nick_name': user_name}, {'$set': {'nick_name': user_name, 'email': form.email.data, 'birth': form.birth.data, 'gender': form.gender.data, 'brief_description': form.brief_description.data}})

    current_user = UserProfile.objects.get(id=referrer_dict['_id'])
    return render_template('profile.html', form=form, current_user=current_user, referrer_dict=referrer_dict, home_url=home_url)


@bp_sso.route('/edit/<string:user_name>', methods=['POST', 'GET'])
def edit(user_name):
    token_id = Cookie.check_login()
    print('token_id', token_id)

    item = SSOToken.find(token_id)
    user_name = item.user_name

    _, referrer_url, referrer_dict = get_referrer_dict()
    print(" edit use_dict:{}".format(referrer_url))

    referrer_dict['url']= token_id
    form = PwdChangeForm()

    db_table_use = get_user_table()
    referrer_dict['name']=user_name
    for result in db_table_use.find({"nick_name": user_name}):
        referrer_dict['_id'] = result['_id']

    db_table_pwd = get_user_auth()
    for result in db_table_pwd.find({"user": referrer_dict['_id']}):
        referrer_dict['pwd'] = result['password']

    if form.validate_on_submit():

        if check_password_hash(referrer_dict['pwd'], form.oldpwd.data):
            if form.newpwd.data != form.cfmpwd.data:
                flash('the new password is wronging.')
            else:
                db_table_pwd.update({'user': referrer_dict['_id']}, {'user': referrer_dict['_id'], 'password': generate_password_hash(form.newpwd.data)})
                flash("Change password success! please login again.")
                return redirect(url_for('sso.profile', referrer_dict=referrer_dict, referrer_url=referrer_url))
        else:
            raise TypeError('the old password is wronging.')

    return render_template('edit.html', form=form, referrer_dict=referrer_dict)


@bp_sso.route('/permission/<string:user_name>', methods=['POST', 'GET'])
def permission(user_name):

    token_id = Cookie.check_login()
    print('token_id', token_id)

    item = SSOToken.find(token_id)
    user_name = item.user_name

    form = PerChangeForm()
    _, referrer_url, referrer_dict = get_referrer_dict()
    print(" edit use_dict:{}".format(referrer_url))

    referrer_dict['token_id']= token_id
    referrer_dict['url'] = referrer_url

    db_table_use = get_user_table()
    referrer_dict['name'] = user_name
    for result in db_table_use.find({"nick_name": user_name}):
        referrer_dict['nick_name'] = result['nick_name'] + "/ " + result['email']
        referrer_dict['role_id'] = result['role_id']
        referrer_dict['_id'] = result['_id']

    if form.is_submitted():
        user_name = form.nick_name.data
        level_id = form.role_id.data
        db_table_use.update({'nick_name': user_name}, {'$set': {'role_id': level_id}})
        flash("Change role_id success!")
        return redirect(url_for('sso.profile', referrer_dict=referrer_dict))
    return render_template('permission.html', PERMISSION=PERMISSION, form=form, referrer_dict=referrer_dict)


@bp_sso.route('/register', methods=['POST', 'GET'])
def register():
    _, _, referrer_dict = get_referrer_dict()
    print('sso.register:', referrer_dict)
    form = SignupForm()
    if form.validate_on_submit():
        # if LoginUser.register_user(form.nick_name.data, form.pwd.data, form.email.data, description='User'):
        if LocalAuth.try_register(form.nick_name.data, form.email.data, form.pwd.data,
                                  birth=form.birth.data,
                                  gender=form.gender.data,
                                  brief_description=form.brief_description.data,
                                  role_id=PERMISSION[1]):
            flash('Sign up success,Please Login.')
            return redirect(url_for('sso.login', **referrer_dict))
    return render_template('sign_up.html', form=form, referrer_dict=referrer_dict)


# @bp_sso.route('/logout/<string:user_name>', methods=['GET'])
# def logout(user_name):
#     try:
#         token = SSOToken.find_by_user_name(user_name)
#         if token:
#             if SSOToken.remove_token(token):
#                 resp = make_response(redirect(request.referrer))
#                 resp.delete_cookie(Cookie.form_auth_cookie_name)
#                 return resp
#     except ValueError:
#         abort(401)


@bp_sso.route('/logout', methods=['GET'])
def logout():
    token_id = Cookie.check_login()
    print('token_id', token_id)
    try:
        token = SSOToken.validate_token_id(token_id)
        if token:
            if SSOToken.remove_token(token):
                #resp = make_response(redirect(request.referrer))
                #resp.delete_cookie(Cookie.form_auth_cookie_name)
                return redirect(get_sso_port())
    except ValueError:
        abort(401)


@bp_api.route('/ping', methods=['GET'])
def ping():
    token = request.args.get('token', '')
    return SSOApi.ping(token)


@bp_api.route('/validation', methods=['GET'])
def validation():
    if CURRENT_API and CURRENT_API['end_point'] is not None:
        ret_dict = {
            'api': url_for('{}.validate_ticket'.format(CURRENT_API['end_point']), ticket_id=''),
            'version': CURRENT_API['version']
        }
        return make_response(jsonify(ret_dict))
    else:
        ret_dict = {
            'error': 'No valid api version'
        }
        return make_response(jsonify(ret_dict), 400)


@bp_api_1_0.route('/validation/<ticket_id>', methods=['GET'])
def validate_ticket(ticket_id):
    return SSOApi.validate_ticket(ticket_id)



