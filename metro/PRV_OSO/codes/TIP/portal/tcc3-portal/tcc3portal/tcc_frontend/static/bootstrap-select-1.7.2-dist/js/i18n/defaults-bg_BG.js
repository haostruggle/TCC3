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
    noneSelectedText: '���ڧ�� �ڧ٧ҧ�ѧߧ�',
    noneResultsText: '����ާ� ��֧٧�ݧ�ѧ� �٧� {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? "{0} �ڧ٧ҧ�ѧ� �֧ݧ֧ާ֧ߧ�" : "{0} �ڧ٧ҧ�ѧߧ� �֧ݧ֧ާ֧ߧ��";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? '���ڧާڧ�� �� �է���ڧԧߧѧ� ({n} �֧ݧ֧ާ֧ߧ� �ާѧܧ�ڧާ��)' : '���ڧާڧ�� �� �է���ڧԧߧѧ� ({n} �֧ݧ֧ާ֧ߧ�� �ާѧܧ�ڧާ��)',
        (numGroup == 1) ? '�������ӧڧ� �ݧڧާڧ� �� �է���ڧԧߧѧ� ({n} �֧ݧ֧ާ֧ߧ� �ާѧܧ�ڧާ��)' : '�������ӧڧ� �ݧڧާڧ� �� �է���ڧԧߧѧ� ({n} �֧ݧ֧ާ֧ߧ�� �ާѧܧ�ڧާ��)'
      ];
    },
    selectAllText: '���٧ҧ֧�� �ӧ�ڧ�ܧ�',
    deselectAllText: '���ѧ٧ާѧ�ܧڧ�ѧ� �ӧ�ڧ�ܧ�',
    multipleSeparator: ', '
  };
})(jQuery);


}));
