// Panmind Alexandrian - (C) 2009 Mind2Mind S.r.L.
//
// This plugin allows a text input field to have a default value that is
// removed onfocus and restored onblur, if the user has not input anything.
//
//   - vjt  Fri Oct  2 18:09:23 CEST 2009
//
$.fn.hasDefaultValue = function () {
  return this.each (function () {
    var input = $(this)
    var defaultValue = input.val ();
    var form = input.parents ('form');

    input.focus (function () {
      if (input.val() == defaultValue)
        input.val ('');

    }).blur (function () {
      if (input.val () == '')
        input.val (defaultValue);
    });

    input.bind ('revert', function () {
      input.val (defaultValue);
    });

    if (form) {
      form.submit(function() {
        if (input.val() == defaultValue)
          input.val('');
      });
    }
  });
};

