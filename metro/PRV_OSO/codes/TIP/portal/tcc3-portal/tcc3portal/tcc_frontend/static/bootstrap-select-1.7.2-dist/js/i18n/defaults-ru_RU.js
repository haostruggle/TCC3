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
    noneSelectedText: '§¯§Ú§é§Ö§Ô§à §ß§Ö §Ó§í§Ò§â§Ñ§ß§à',
    noneResultsText: '§³§à§Ó§á§Ñ§Õ§Ö§ß§Ú§Û §ß§Ö §ß§Ñ§Û§Õ§Ö§ß§à {0}',
    countSelectedText: '§£§í§Ò§â§Ñ§ß§à {0} §Ú§Ù {1}',
    maxOptionsText: ['§¥§à§ã§ä§Ú§Ô§ß§å§ä §á§â§Ö§Õ§Ö§Ý ({n} {var} §Þ§Ñ§Ü§ã§Ú§Þ§å§Þ)', '§¥§à§ã§ä§Ú§Ô§ß§å§ä §á§â§Ö§Õ§Ö§Ý §Ó §Ô§â§å§á§á§Ö ({n} {var} §Þ§Ñ§Ü§ã§Ú§Þ§å§Þ)', ['items', 'item']],
    doneButtonText: '§©§Ñ§Ü§â§í§ä§î',
    multipleSeparator: ', '
  };
})(jQuery);


}));
