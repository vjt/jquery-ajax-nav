jQuery AJAX Navigation framework
================================

(C) 2009-2010 [Mind2Mind s.r.l.](http://mind2mind.is)
(C) 2009-2011 [Marcello Barnaba](http://sindro.me)

Ruby License.

Previously used on [panmind.org][panmind.org].

Tutorial documentation is a work in progress. In the meantime, have a
look at the reference documentation in source files.

Small demo
----------

To launch the demo app, from your favorite terminal application,
enter the "demo" directory and issue:

    rackup -p 8080

Then point your browser to http://localhost:8080/ and click around.
Source files are in the `demo/` directory. Please note that the Rack
backend is necessary to navigate the demo without errors: the forms
work only when there's a backend answering to POST requests and the
demo home page must be handled differently whether the client request
comes from XHR or not.

Core sources
------------

  * [jquery.ajax-nav.js][]         - AJAX navigation framework
  * [jquery.history.js][]          - AJAX history management
  * [jquery.location.js][]         - Document location/anchors management

Extras
------

  * [jquery.ajax-validate.js][]    - AJAX validation plugin
  * [jquery.behaviours.js][]       - Generic behaviours library
  * [jquery.dim-opaque.js][]       - Helpers to disable parts of the UI
  * [jquery.poller.js][]           - A poller that uses `{set,clear}Interval`
  * [jquery.queue.js][]            - A queue, `FIFO` or `LIFO`
  * [jquery.diffhtml.js][]         - An HTML diff routine based on `DOMParser`
  * [jquery.utilities.js][]        - Small `$.log` and `$.clone` helpers
  * [jquery.checkBoxMirrorer.js][] - Ever wanted to mirror checkboxes? :)

Support libraries
-----------------

  * [vendor/jsdifflib.js][]        - Javascript Diff Library
  * [jQuery 1.5.1][jquery]         - Please see [vendor/jquery-IE-xhr-abort.patch][jquery-patch]

TODO - check whether the IE abort patch it is still needed with jQuery 1.5

Authors
-------

  * Marcello Barnaba  ([@vjt](http://twitter.com/vjt))       <marcello.barnaba@gmail.com>
  * Ferdinando de Meo ([@burzuk](http://twitter.com/burzuk)) <ferdinando.demeo@gmail.com>
  * Paolo Zaccagnini  ([@paozac](http://twitter.com/paozac)) <paozac@gmail.com>
  * Exelab Karma      ([@exelab](http://twitter.com/exelab)) <exelab@exelab.eu>

  `- vjt  Wed Mar 23 12:31:14 CET 2011`

[jquery.ajax-nav.js]:         http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.ajax-nav.js
[jquery.history.js]:          http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.history.js
[jquery.location.js]:         http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.location.js
[jquery.ajax-validate.js]:    http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.ajax-validate.js
[jquery.behaviours.js]:       http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.behaviours.js
[jquery.dim-opaque.js]:       http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.dim-opaque.js
[jquery.poller.js]:           http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.poller.js
[jquery.queue.js]:            http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.queue.js
[jquery.diffhtml.js]:         http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.diffhtml.js
[jquery.utilities.js]:        http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.utilities.js
[jquery.checkBoxMirrorer.js]: http://github.com/vjt/jquery-ajax-nav/blob/master/jquery.checkBoxMirrorer.js

[vendor/jsdifflib.js]:        http://github.com/vjt/jquery-ajax-nav/blob/master/vendor/jsdifflib.js
[jquery-patch]:               http://github.com/vjt/jquery-ajax-nav/blob/master/vendor/jquery-IE-xhr-abort.patch
[jquery]:                     http://jquery.com
