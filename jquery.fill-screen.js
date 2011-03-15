// jQuery fill-screen
//
// You-d better use a CSS-only solution,
// such as the one implemented by Ryan Fait
//
// http://ryanfait.com/resources/footer-stick-to-bottom-of-page/
//
// If you cannot, just resort to this hacky JS.
//
//  - vjt  Tue Mar 15 11:38:12 CET 2011
//
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
      content: content
    }, options);

    fill (options);

    $(window).resize (function () {
      fill (options);
    });
  };

  /**
   * Dynamically adjusts the height of the #content container
   * to the available maximum, after subtracting the siblings
   * heights.
   *
   * You can pass the content dimensions via the .inner and
   * .outer options.
   *
   * If the calculated dimensions are *less* than the actual
   * ones, nothing is performed.
   */
  var fill = function (options) {
    var inner   = options.inner;
    var outer   = options.outer;
    var changed = $(window).height () - inner - outer;

    options.content.siblings.each (function () {
      changed -= $(this).outerHeight ();
    });

    if (inner < changed)
      options.content.height (changed);
  };

}) (jQuery);
