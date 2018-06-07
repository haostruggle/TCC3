# coding:utf-8
"""
    tcc3portal.tcc_core.sso
    ~~~~~~~~~~~~~~~~~~~~~~~~~

    tcc3portal tcc_core sso module, used for single-sign-on login/logout/register
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""
import urllib.parse
import urllib.request
import json

from flask import Flask, Blueprint, request, flash, redirect, g, url_for
from flask_login import current_user, login_user, LoginManager, logout_user

from .helpers import get_referrer_name, \
    get_sso_center_url, \
    get_sso_center_logout_url, \
    get_sso_center_profile_url, \
    get_sso_center_register_url, \
    get_sso_center_api_ticket_check_url
from .models import UserProfile, AnonymousUser
from .babel import _, lazy_gettext

__all__ = ['make_referrer_query', 'init_sso_login_url', 'init_sso_logout_url', 'init_sso_profile_url','init_sso_register_url',
           'sso_login_ticket_check', 'SSOClient'
           ]


def make_referrer_query(referrer=None):
    name = get_referrer_name()
    url = request.referrer if referrer is None or len(referrer.strip()) == 0 else referrer
    dic = {name: url}
    return name, url, dic


def init_sso_login_url(referrer=None):
    """:type query_string: str"""
    sso_center_url = get_sso_center_url()
    dic = make_referrer_query(referrer)[2]
    redirect_url = '{}?{}'.format(sso_center_url, urllib.parse.urlencode(dic))
    return redirect_url


def init_sso_profile_url():
    """:type query_string: str"""
    sso_center_profile_url = get_sso_center_profile_url()
    dic = make_referrer_query()[2]
    redirect_url = '{}?{}'.format(sso_center_profile_url, urllib.parse.urlencode(dic))
    print('redirect_url',redirect_url)
    return redirect_url


def init_sso_register_url():
    sso_center_url = get_sso_center_register_url()
    dic = make_referrer_query()[2]
    redirect_url = '{}?{}'.format(sso_center_url, urllib.parse.urlencode(dic))
    return redirect_url


def init_sso_logout_url():
    logout_url = get_sso_center_logout_url()
    dic = make_referrer_query()[2]
    redirect_url = '{}?{}'.format(logout_url, urllib.parse.urlencode(dic))
    return redirect_url


def sso_login_ticket_check(ticket):
    url = get_sso_center_api_ticket_check_url()
    print(url)
    resp = urllib.request.urlopen(url)    #存在问题，间断性卡
    with resp as f:
        if f.status == 200:
            resp_data = f.read().decode('utf-8')
            resp_data = json.loads(resp_data)
            print('sso_login_ticket_check:', resp_data)
            if resp_data:
                endpoint_url = resp_data['api']
                check_url = urllib.parse.urljoin(get_sso_center_url(), endpoint_url)
                return _sso_login_ticket_check_imp(check_url, ticket)
        return False


def _sso_login_ticket_check_imp(api_url, ticket):

    finurl = urllib.parse.urljoin(api_url,ticket)
    with urllib.request.urlopen(finurl) as f:
        if f.status == 200:
            resp_data = f.read().decode('utf-8')
            resp_data = json.loads(resp_data)
            print('sso-center-ticket-check result:', resp_data)
            return resp_data
        return False

user_ticket = [{'ticket': ""}, {'new_ticket': ""}]


class SSOClient(object):
    def __init__(self, app=None, lm=None):
        self.bp = Blueprint('sso', __name__, url_prefix='/sso')

        if app is not None and lm is not None:
            self.init_app(app, lm)

    def init_app(self, app, lm):
        """
        :type app: Flask
        :type lm: LoginManager
        """
        self.bp.add_url_rule('/register', endpoint='register', view_func=_register, methods=['GET'])
        self.bp.add_url_rule('/login', endpoint='login', view_func=_login, methods=['GET'])
        self.bp.add_url_rule('/logout', endpoint='logout', view_func=_logout, methods=['GET'])
        self.bp.add_url_rule('/profile', endpoint='profile', view_func=_profile, methods=['GET'])

        app.register_blueprint(self.bp)

        # lm.login_view = 'sso.login2'  # 'http://192.168.1.125:9001'
        lm.anonymous_user = AnonymousUser
        lm.login_message = _('Please login to access this page.')

        @lm.unauthorized_handler
        def unauthorized():
            if request.method == 'GET':
                flash(_('Please login to access this page.'))
                # return redirect(login_url('sso.login', request.url, 'url'))
                return redirect(url_for('sso.login', **make_referrer_query(request.url)[2]))
            else:
                return dict(error=True, message=_("Please login for access.")), 403

        @lm.user_loader
        def load_user(user_id):
            user = UserProfile.objects.get(id=user_id)
            return user

        # @lm.request_loader
        # def request_loader(req):
        #     pass
        #
        # @lm.token_loader()
        # def token_loader(req):
        #     pass

        @app.before_request
        def before_request():
            print('current user:', current_user)
            g.user = current_user
            ticket = request.args.get('ticket', None)
            if ticket is not None:
                if ticket == user_ticket[0]['ticket']:
                    ticket = user_ticket[1]['new_ticket']
                else:
                    if user_ticket[0]['ticket'] != "" and current_user != 'AnonymousUser':
                        ticket = user_ticket[1]['new_ticket']
                print('before_request ticket:', ticket)
                result = sso_login_ticket_check(ticket)
                if result and result['valid']:
                    user = UserProfile.objects(nick_name=result['user']).first()
                    if isinstance(user, UserProfile):
                        login_user(user)
                        user_ticket[0]['ticket'] = ticket
                        user_ticket[1]['new_ticket'] = result['ticket']
                        print('login user:', user)
                else:
                    logout_user()
                    print('logout user.')
           # else:
               #  print('before_request ticket: None.')


def _login():
    # print('login refer:', request.url)
    if current_user is not None and current_user.is_authenticated:
        return redirect(request.referrer)

    # if redirect from '@lm.unauthorized_handler', request url can get 'url=xxx'
    redirect_url = init_sso_login_url(request.args.get(get_referrer_name()))
    print(redirect_url)
    return redirect(redirect_url)


def _profile():
    # if redirect from '@lm.unauthorized_handler', request url can get 'url=xxx'
    redirect_url = init_sso_profile_url()
    print("redirect_url", redirect_url)
    user_ticket[0]['ticket'] = ""
    user_ticket[1]['new_ticket'] = ""
    return redirect(redirect_url)


def _register():
    redirect_url = init_sso_register_url()
    print(redirect_url)
    return redirect(redirect_url)


def _logout():
    redirect_url = init_sso_logout_url()
    logout_user()
    user_ticket[0]['ticket'] = ""
    user_ticket[1]['new_ticket'] = ""
    print(redirect_url)
    return redirect(redirect_url)


# def sso_login_required(func):
#     @wraps(func)
#     def decorated_view(*args, **kwargs):
#         ticket = request.args.get('ticket', None)
#         if ticket is not None:
#             print('ticket:', ticket)
#             sso_login_ticket_check()
#         else:
#             print('ticket: None.')
#
#         if current_app.login_manager._login_disabled:
#             return func(*args, **kwargs)
#         elif not current_user.is_authenticated:
#             return current_app.login_manager.unauthorized()
#         return func(*args, **kwargs)
#     return decorated_view
