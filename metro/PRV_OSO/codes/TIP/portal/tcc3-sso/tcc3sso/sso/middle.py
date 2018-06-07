import pymongo
from flask import current_app


def get_db_table():
    ip = get_db_ip()
    port = get_db_port()
    db_name = get_db_db()
    client = pymongo.MongoClient(ip, port)
    db = client[db_name]
    return db


def get_user_table():
    db = get_db_table()
    db_table_use = db['user_profile']
    return db_table_use


def get_user_auth():
    db = get_db_table()
    db_table_use = db['local_auth']
    return db_table_use


def get_sso_ip():
    return current_app.config['SSO_IP']


def get_sso_port():
    return current_app.config['SSO_PORT']


def get_db_ip():
    return current_app.config['MONGODB_HOST']


def get_db_port():
    return current_app.config['MONGODB_PORT']


def get_db_db():
    return current_app.config['MONGODB_DB']