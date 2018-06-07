/*!
 * Bootstrap-select v1.7.2 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2015 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(this, function () {

(function ($) {
  $.fn.selectpicker.defaults = {
    noneSelectedText: '���ڧ�֧ԧ� �ߧ� �ӧ�ҧ�ѧߧ�',
    noneResultsText: '����ӧ�ѧէ֧ߧڧ� �ߧ� �ߧѧۧէ֧ߧ� {0}',
    countSelectedText: '����ҧ�ѧߧ� {0} �ڧ� {1}',
    maxOptionsText: ['������ڧԧߧ�� ���֧է֧� ({n} {var} �ާѧܧ�ڧާ��)', '������ڧԧߧ�� ���֧է֧� �� �ԧ����� ({n} {var} �ާѧܧ�ڧާ��)', ['items', 'item']],
    doneButtonText: '���ѧܧ����',
    multipleSeparator: ', '
  };
})(jQuery);


}));
