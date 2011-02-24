// jQuery Behaviours - (C) 2009-2010 vjt@openssl.it
//
// This plugin implements the HTML5 "placeholder" attribute
// on browsers that do not support it. If native support is
// detected, the plugin does nothing.
//
// TODO: handle elements loaded via AJAX.
//
(function ($) {

  $(function () {
    if ($('<input/>')[0].placeholder !== undefined)
      return; // Browser supports placeholder attribute

    $('input[placeholder]').each (function () {
      var input  = $(this);
      var defval = input.attr ('placeholder');
      var form   = input.closest ('form');

      var revert = function () {
        input.val (defval).css ({color: '#999'});
      };

      var clear = function () {
        input.val ('').css ({color: ''});
      }

      input.bind ({
        focus:  function () { if (input.val () == defval) clear ()  },
        blur:   function () { if (input.val () == '')     revert () },
        revert: function () { revert () }
      })

      if (input.val () == '') revert ();

      if (form.length)
        form.submit (function () {
          if (input.val () == defval) clear ();
        });
    });
  });

}) (jQuery);