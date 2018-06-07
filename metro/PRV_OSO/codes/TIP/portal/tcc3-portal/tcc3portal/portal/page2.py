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
from ..tcc_core.models import comment_required
bp = Blueprint('page2', __name__, url_prefix='/page2')


@bp.route('/')
@login_required
@comment_required
def index():
    return render_template('page2.html')

