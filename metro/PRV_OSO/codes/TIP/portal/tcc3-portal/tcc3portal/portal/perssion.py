# coding:utf-8
"""
    tcc3portal.portal.page2
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    tcc3portal portal page2 page.
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""

from flask import Blueprint, render_template
from flask_login import login_required

bp = Blueprint('perssion', __name__, url_prefix='/perssion')


@bp.route('/')
@login_required
def index():
    return render_template('errors/403.html')