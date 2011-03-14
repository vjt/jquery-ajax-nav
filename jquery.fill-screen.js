// jQuery fill-screen
//
//  - vjt  Mon Mar 14 18:04:04 CET 2011

/**
 * Dynamically adjusts the height of the #content container
 * to the available maximum,  after subtracting the #header
 * and the #footer heights.
 *
 * You can pass the IDs via options.header, options.content
 * and options.footer and and you can also pass the content
 * dimensions via options.inner and options.outer.
 *
 * If the calculated dimensions are *less* than the actual
 * ones, nothing is performed.
 */
(function ($) {

$.fillScreen = function () {
  var options = arguments[0] || {};

  var header  = $(options.header  || '#header' );
  var content = $(options.content || '#content');
  var footer  = $(options.footer  || '#footer' );

  var inner   = options.inner || $(content).height ();
  var outer   = options.outer || $(content).outerHeight ();
  var changed = $(window).height () - header.outerHeight () - footer.outerHeight ();

  changed -= outer - inner;

  if (inner < changed)
    $(content).height (changed);
};

/**
 * Repeatedly calls the $.fillScreen () method when the window
 * is resized. Evaluates *once* the content height, and passes
 * it to the $.fillScreen () method on every invocation.
 */
$.keepScreenFilled = function () {
  var options = arguments[0] || {};
  var content = $(options.content || '#content');
  var options = $.extend ({
    inner: content.height (),
    outer: content.outerHeight ()
  }, options);

  $.fillScreen (options);
  $(window).resize (function () {
    $.fillScreen (options);
  });
};

/**
 * Reset the fill on the given content, or #content
 */
$.resetFill = function () {
  var options = arguments[0] || {};
  $(options.content || '#content').attr ('style', '');
};

}) (jQuery);
