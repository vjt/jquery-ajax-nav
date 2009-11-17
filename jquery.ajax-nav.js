// Panmind Wenlock - (C) 2009 Mind2Mind S.r.L.
//

/**
 * jQuery AJAX loading framework. History support is implemented via
 * the jquery.history.js plugin, located in public/javascripts/.
 *
 * The public API are the .navLink () and .navForm () methods, that
 * attach to the matched jQuery elements the AJAX loading behaviour.
 *
 * When the content is loaded, a custom "pm:contentLoaded" event is
 * triggered on the whole document: this equals to jQuery's .ready ()
 * event.
 *
 * To optimize loading, listeners that can be bound using .live ()
 * SHOULD be initialized into a
 *
 *   $(document).one ('pm:contentLoaded', function () { ... });
 *
 * listeners that instead must be bound without .live () (e.g. for
 * the mouseenter/mouseleave events) MUST be initialized into a
 *
 *   $(document).bind ('pm:contentLoaded', function () { ... });
 *
 * navLink ()/navForm () are bound using .live () by default.
 *
 * The big picture
 * ===============
 *
 * Markup
 * ------
 *
 *   <a href="/base/resource/id" class="nav">navLink</a>
 *
 *   <form id="foo" action="/base/resource/id" method="post">
 *     ...
 *   </form>
 *
 * Common code
 * -----------
 *
 *   $.navDefaultOptions = {
 *     container: '#container',
 *     base     : '/base'
 *   };
 *
 * Specialized code
 * ----------------
 *
 *   $(document).one ('pm:contentLoaded', function () {
 *     $('a.nav').navLink ();
 *     $('#foo').navForm ();
 *   });
 *
 * Different options can be passed to a navLink (), documented below.
 *
 * Code flow
 * =========
 *
 * .navLink () adds a .click () behaviour to the link, that loads
 * the server response into the #container and updates the document
 * location adding an anchor containing the link href minus the /base.
 *
 * .navForm () behaves similarly, but adds a .submit () behaviour, and
 * behaves differently depending on the form method: see .navForm ()
 * documentation below.
 *
 * Available options
 * =================
 *
 *  - container: String or jQuery (required)
 *               the target container of the AJAX load. It MUST
 *               be a single element, or an exception will be thrown
 *
 *  - base:      String or RegExp (required)
 *               the base path of the links, such as "/example/" or
 *               "/\/project\/\d\/?/"
 *
 *  - root:      String (optional)
 *               the default URL path to load upon initialization,
 *               if no anchor is requested by the user.
 *               If it is undefined, no automatic loading occurs.
 *
 *  - live:      Boolean (optional, default: true)
 *               if true, the behaviour is attached using jQuery's
 *               .live (), so that new elements that appear on the
 *               page inherit the AJAX load behaviour
 *
 *  - loading:   Function (optional)
 *               a callback fired when loading starts.
 *               Inside the callback, "this" is set to the HTML
 *               element that triggered the AJAX load.
 *
 *  - success:   Function (optional)
 *               a callback fired when data load is complete
 *               with a "success" status (in the 200-299 range).
 *               Inside the callback, "this" is set to the HTML
 *               element that triggered the AJAX load.
 *
 *  - error:     Function (optional)
 *               a callback fired when there is an error.
 *               Inside the callback, "this" is set to the HTML
 *               element that triggered the AJAX load.
 *
 *  - method:    String (optional)
 *               the HTTP method to use when loading. Can be
 *               'get', 'post', 'put' or 'delete'.
 *
 *  - href:      String (optional)
 *               the URL path to load into the .container. If it's not
 *               set, it'll be extracted from the link href attribute or
 *               the form action attribute.
 *
 * Known issues
 * ============
 *
 * TODO: proper error handling, the foundation is implemented but still lacks.
 * FIXME: currently AJAX uploads aren't supported
 * IDEA: how about making the "/base" optional?
 *
 *   - vjt  Wed Nov 11 14:33:49 CET 2009
 */
(function ($) {

/**
 * Default options for every AJAX load
 */
$.navDefaultOptions = {};

/**
 * Low-level interface to AJAX loading. Does not validate the
 * options passed to it. This method implements all the heavy
 * lifting needed of the AJAX load.
 *
 * In the following description, each word enclosed by backticks
 * (`) refers to an option passed to the .navLink/.navForm.
 *
 *  - Dims the `container`
 *  - Fires the `loading` callback
 *  - Logs the details of the request to the Firebug console
 *  - Calls $.ajax with the given options
 *  - Iff the request `method` is 'get', updates the location
 *    anchor using $.location.setAnchor () and removing the
 *    `base` from the `href`
 *  - Iff the response code is *202* (accepted), this method
 *    assumes that the response is be a String that contains
 *    a path to redirect to: `params` is nullified, `method`
 *    is set to "get" and eventually the returned String is
 *    loaded, without updating the location anchor.
 *    The associated Rails' helper that implements the 202
 *    code response is named "render_path_or_redirect_to",
 *    defined inside the ProjectsBaseController.
 *  - If an error occurs, an alert () is shown (temporarily),
 *    and the `error` callback is fired if defined. If not,
 *    the container is updated with the bare "Error XXX" string.
 *    THIS IS TEMPORARY! :-)
 *    defined
 *  - Triggers the 'pm:contentLoaded' event on the whole document
 *  - Opaques the `container`
 *
 * @param loader jQuery:  The trigger of this AJAX load
 *
 * @param options Object: options for this load, with the following
 *                        differences from what is documented above
 *
 *   - href:     String (required)
 *               the URL to be loaded.
 *
 *   - params:   Object (optional)
 *               additional query string / post data parameters
 */
$.navLoadContent = function (loader, options) {
  var method = (options.method || 'get').toLowerCase ();
  var response = null, error = null;

  // Let's begin the party...
  //
  $.ajax ({
    type   : method,
    url    : options.href,
    data   : options.params,

    // Dim the container, trigger the `loading` and log debug details
    // to the console
    beforeSend: function (xhr) {
      options.container.dim ();

      __invoke ('loading', options, loader);

      if (typeof (options.toSource) == 'function')
        $.log ('loading ' + options.href + '(' + options.toSource () + ')');
    },

    // YAY! Save the response for further processing
    //
    success: function (data, textStatus) {
      response = data;
    },

    // Oh noes! Save the error for further processing
    //
    error: function (xhr, textStatus, thrownError) {
      // XXX replace this with proper error handling
      //   - vjt  Mon Nov 16 13:50:49 CET 2009
      //
      error = textStatus;

      $.log ('Oh, noes!');

      if (thrownError)
        $.log ("thrownError with message '" + thrownError.message +
               "' in '" + thrownError.fileName + "'");
    },

    // Let's end the party...
    //
    complete: function (xhr, textStatus) {
      $.log ("received a " + xhr.status);

      if (xhr.status == 202) {
        // OK, not quite yet: this is a redirect that'll start
        // another AJAX-party...
        //
        $.log ("202-redirecting to '" + response + "'");

        options.href   = response;
        options.method = 'get';
        options.params = null;

        $.navLoadContent (loader, options);

      } else if (response) {
        // OK, everything right: update the container, update the
        // location and the history (to avoid double loads), trigger
        // the `success` and the contentLoaded event.
        // Eventually, opaque () the container back.
        //
        options.container.html (response);

        if (method == 'get') {
          var anchor = options.href.replace (options.base, '');
          // $.log ("Updating anchor to " + anchor);
          __historyCurrent = anchor;
          $.location.setAnchor ('/' + anchor);
        }

        __invoke ('success', options, loader)

        // $.log ('triggering pm:contentLoaded');
        $(document).trigger ('pm:contentLoaded');

        options.container.opaque ();
      } else if (error) {
        // Something went wrong, notify the user and opaque () the
        // container back.
        //
        // XXX replace this with proper error presentation to the user
        //   - vjt  Mon Nov 16 14:56:51 CET 2009
        //
        alert ("Something went wrong: an " + error + " occurred :-(");

        __invoke ('error', options, loader);

        options.container.html ('<p class="error">Error ' + xhr.status + '</p>');
        options.container.opaque ();
      }
    }

  });
};

/**
 * Public API for AJAX-loaded links, implemented as a jQuery extension
 * function.
 *
 * @param options Object: for reference, see "Available options" above
 *
 */
$.fn.navLink = function (options) {
  options = __validateOptions (options);

  var listener = function () {
    var link = $(this);
    var args = $.clone (options);

    if (!args.href)
      args.href = link.attr ('href');

    $.navLoadContent (link, args);

    return false;
  };

  if (options.live)
    $(this).live ('click', listener);
  else
    $(this).click (listener);

  return this;
};

/**
 * Public API for AJAX-loaded forms, implemented as a jQuery extension
 * function.
 *
 * @param options Object: for reference, see "Available options" above
 *
 * A form instrumented with this method can behave in two ways:
 *
 *  - If the request method is 'get', it behaves much like a navLink,
 *    as it serializes the form values, appends them to the `href` and
 *    calls $.navLoadContent ().
 *
 *  - If the request method is 'post', 'put' or 'delete', the serialized
 *    form values are passed as `params` to $.navLoadContent () that'll
 *    POST them.
 */
$.fn.navForm = function (options) {
  options = __validateOptions (options);

  var listener = function () {
    var form = $(this);
    var args = $.clone (options);
    var data = form.serialize ();

    if (!args.method) {
      args.method = (form.attr ('method') || 'post').toLowerCase ();
    }

    args.href = form.attr ('action');

    if (args.method == 'get') {
      // Add the data to the query string
      args.href += '?' + data;
    } else {
      // Add the data to the POST params
      args.params = data;
    }

    $.navLoadContent (form, args);

    return false;
  };

  if (options.live)
    $(this).live ('submit', listener);
  else
    $(this).submit (listener);

  return this;
};

/**
 * Initialize AJAX navigation.
 *
 * TODO: Documentation
 */
$.navInit = function () {
  // Initialize the base path
  //
  var base = $.location.getPath () + '/';

  if (!$.navDefaultOptions.base.test (base))
    throw (
      'BUG: the given base "' + base + 
      '" does not match the configured one "' +
      $.navDefaultOptions.base + "'"
    );

  $.navDefaultOptions.base = base;
  $.log ('AJAX nav init: set base to "' + base + "'");

  // Initialize the jquery.history plugin
  //
  $.historyInit (__historyChange);
  $.log ('AJAX nav init: history initialized');

  // Initialize the default target container
  //
  var container = $.navDefaultOptions.container;
  $.navDefaultOptions.container = $(container);

  if (!$.navDefaultOptions.container)
    throw ('BUG: container "' + container + '" not found in the DOM');

  $.log ('AJAX nav init: found the "' + container + '" container');

  // Load the anchor currently in the URL bar
  //
  var anchor = $.location.getAnchors ();
  $.log ('AJAX nav init: navigating to "' + anchor + '"');
  $.navHistoryLoad (anchor);

  $.log ('AJAX navigation initialized and ready to roll');
};

/**
 * This function checks whether the current URL path should
 * be handled via AJAX, and does a page load by replacing the
 * path with an AJAX anchor. e.g., the user navigates to
 *
 *   http://example.com/projects/1/writeboards/42
 *
 * This function redirects to
 *
 *   http://example.com/projects/1#writeboards/42
 *
 * It MUST be called before the `ready` event is fired.
 *
 * Returns boolean, indicating wheter hijack happened or not, that
 * is useful to skip the $.navInit () in your .ready () event. I
 * tried to implement it using .unbind () but I hadn't success:
 * better safe than sorry.o
 *
 */
$.navHijack = function () {
  if ($.location.get ())
    throw ('BUG: $.navHijack () MUST be called before the `ready` event occurs');

  $.location.__save ();

  var request = $.location.getPath ();    // /projects/1/writeboards/42
  var base    = $.navDefaultOptions.base; // /\/projects\/\d+/

  // Are we interested to this request?
  //
  if (!base.test (request))
    return false;

  var root  = request.match (base)[0];                         // /projects/1
  var route = request.replace (base, '').replace (/^\//, '#'); // #writeboards/42

  // Is this a request for the base path?
  //
  if (request == root)
    return false;

  // Concurrently, jQuery could be evaluating its .support object,
  // that requires document.body. If it isn't defined, an unhandled
  // exception would be thrown, so this corner case is handled here.
  if (!document.body)
    document.write ('<body/>');

  $.location.set (root + route);

  return true;
};

/**
 * This function simply calls the private __historyLoad function
 */
$.navHistoryLoad = function (anchor) {
  __historyLoad (anchor);
};

/**
 * *Private*: This function gets called when history changes,
 * and it gets passed the currently active anchor name. If it
 * is different from the one currently loaded, the __historyLoad
 * function gets called.
 */
var __historyCurrent = undefined;
var __historyChange = function (anchor) {
  var requested = encodeURI (anchor);

  // $.log ('AJAX history - requested: "' + requested + '"');
  // $.log ('AJAX history - currently: "' + __historyCurrent + '"');

  if (__historyCurrent && requested != __historyCurrent)
    __historyLoad (anchor);
};

/**
 * *Private*: This function gets called from the __historyChange
 * callback when there is data to load due to a history back or
 * forward.
 */
var __historyLoad = function (anchor) {
  if (!anchor)
    anchor = $.navDefaultOptions.root;

  if (!anchor)
    return;

  var path    = $.location.getAnchorPath (anchor);
  var params  = $.location.getAnchorParams (anchor);

  $.log (
    'AJAX history: loading #' + anchor +
    ' path['+path+'] params['+params+']'
  );

  $.navLoadContent (window, {
    base     : $.navDefaultOptions.base,
    container: $.navDefaultOptions.container,
    href     : $.navDefaultOptions.base + path + params
  });
};

/**
 * *Private*: Validates the options passed to .navLink () and
 * .navForm (), extending them with the defaults.
 *
 * @param options Object: the options to be validated.
 *
 */
var __validateOptions = function (options) {
  var defaults = $.clone ($.navDefaultOptions);

  options = $.extend (defaults, options);

  // Sanity checks
  //
  if (typeof (options) == 'undefined')
    throw ('BUG: no option passed to a navigation link');

  if (!options.container)
    throw ('BUG: navigation links MUST refer to a target container');

  if (!options.base)
    throw ('BUG: navigation links MUST have a configured base path');

  if (typeof (options.container) == 'string')
    options.container = $(options.container);

  if (options.container.size () > 1)
    throw ('BUG: the container MUST be an unique element');

  // Set the "live" option to "true" if it's undefined
  //
  if (typeof (options.live) == 'undefined')
    options.live = true;

  return options;
};

/**
 * *Private*: Invokes the given specialized callback name, stored
 * into the given options object, if it is defined. If a default
 * callback is defined as well, and it's not the same function as
 * the specialized one, it gets invoked, too.
 *
 * Returns a boolean that indicates wheter a specialized
 * callback was defined or not.
 */
var __invoke = function (name, options, loader) {
  var defaultFn     = $.navDefaultOptions[name];
  var specializedFn = options[name];
  var ret           = false;

  if ( (typeof (specializedFn) == 'function') &&
        specializedFn != defaultFn) {
    // $.log ("invoking specialized " + name + " callback");
    specializedFn.apply (loader, [options]);
    ret = true;
  }

  if ( (typeof (defaultFn) == 'function')) {
    // $.log ("invoking default " + name + " callback");
    defaultFn.apply (loader, [options]);
  }

  return ret;
}

})(jQuery);