# coding:utf-8
"""
    tcc3portal.portal.dashboard
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    tcc3portal portal dashboard page.
    :copyright: (c) 2015 by Vito.
    :license: GNU, see LICENSE for more details.
"""

from flask import Blueprint, render_template
from flask_login import login_required

bp = Blueprint('dashboard', __name__)

@login_required
@bp.route('/')
def index():
    return render_template('dashboard.html')
