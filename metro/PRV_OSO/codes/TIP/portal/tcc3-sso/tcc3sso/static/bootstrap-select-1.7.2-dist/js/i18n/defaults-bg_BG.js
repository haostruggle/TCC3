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
    noneSelectedText: '妖我投抉 我戒忌把忘扶抉',
    noneResultsText: '妖攸技忘 把快戒批抖找忘找 戒忘 {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? "{0} 我戒忌把忘扶 快抖快技快扶找" : "{0} 我戒忌把忘扶我 快抖快技快扶找忘";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? '妣我技我找忘 快 忱抉扼找我忍扶忘找 ({n} 快抖快技快扶找 技忘抗扼我技批技)' : '妣我技我找忘 快 忱抉扼找我忍扶忘找 ({n} 快抖快技快扶找忘 技忘抗扼我技批技)',
        (numGroup == 1) ? '坐把批扭抉志我攸 抖我技我找 快 忱抉扼找我忍扶忘找 ({n} 快抖快技快扶找 技忘抗扼我技批技)' : '坐把批扭抉志我攸 抖我技我找 快 忱抉扼找我忍扶忘找 ({n} 快抖快技快扶找忘 技忘抗扼我技批技)'
      ];
    },
    selectAllText: '妒戒忌快把我 志扼我折抗我',
    deselectAllText: '妓忘戒技忘把抗我把忘抄 志扼我折抗我',
    multipleSeparator: ', '
  };
})(jQuery);


}));
