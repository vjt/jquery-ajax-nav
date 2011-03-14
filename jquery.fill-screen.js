// jQuery fill-screen
//
//  - vjt  Mon Mar 14 18:04:04 CET 2011

(function ($) {

  /**
   * Repeatedly calls the fill () method when the window is
   * resized. Evaluates the content height *once*.
   */
  $.fn.fillScreen = function () {
    var options = arguments[0] || {};
    var content = $(this);
    var options = $.extend ({
      inner  : content.height (),
      outer  : content.outerHeight (),

      header : '#header',
      footer : '#footer',
      content: content
    }, options);

    fill (options);

    $(window).resize (function () {
      fill (options);
    });
  };

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
  var fill = function () {
    var options = arguments[0] || {};

    var header  = $(options.header );
    var content = $(options.content);
    var footer  = $(options.footer );

    var inner   = options.inner;
    var outer   = options.outer;
    var changed = $(window).height () - header.outerHeight () - footer.outerHeight ();

    changed -= outer - inner;

    if (inner < changed)
      content.height (changed);
  };

}) (jQuery);
