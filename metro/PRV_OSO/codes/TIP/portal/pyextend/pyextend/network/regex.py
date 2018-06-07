# coding: utf-8
"""
    pyextend.network.regex
    ~~~~~~~~~~~~~~~~~~~~
    pyextend network regex

    :copyright: (c) 2016 by Vito.
    :license: GNU, see LICENSE for more details.
"""

__all__ = ['email_match', 'email_pattern']

import re

# ���ʽ,���ƥ��ɹ� �ⷵ��Match����,���򷵻�None
# bill.gates@microsoft.com
# ��ƥ��ɹ�ʱ,�ڵ�1,3���зֱ�����
# Email������ �� bill.gates,
# Email������ �� microsoft.com
email_pattern = r'(\w+([-.]\w+)*)@(\w+([-.]\w+)*\.\w+([-.]\w+)*)'


def email_match(string):
    """�����ַƥ��. ƥ��ɹ�����(email_name, email_server), ���򷵻�None"""
    m = re.match(email_pattern, string)
    if m:
        # print('Match success: %s' % m.string)
        return m.groups()[0], m.groups()[2]
    else:
        # print('Match failed: %s' % string)
        return None

if __name__ == '__main__':
    from pyextend.core import log

    L = ['someone@gmail.com',
         'bill.gates@microsoft.com',
         'bill.ga.tes@microsoft.com',
         'bill.gates@micro.soft.com',
         'bill.gates@micro..soft.com',
         'bill..gates@microsoft.com',
         ]
    for email in L:
        res = email_match(email)
        if res:
            log.debug('Match success: %s' % email)
            log.info('EmailName: %s, EmailServer: %s' % (res[0], res[1]))
        else:
            log.error('Match failed: %s' % email)
    log.info('Done.')
