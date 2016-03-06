(function() {

    function MpsLoader() {

        var eventHandlers = {},
            avails,
            isReady = false,
            adUnitsShown = {},
            api = {
                init: init,
                show: show,
                remove: remove,
                fireEvent: fireEvent,
                addEventHandler: addEventHandler,
                removeEventHandler: removeEventHandler
            },
            EVENTS = {
                LOADER_LOADED: 'LOADER_LOADED',
                LOADER_FAILED_TO_LOAD: 'LOADER_FAILED_TO_LOAD',
                AVAIL_IN: 'AVAIL_IN',
                AVAIL_OUT: 'AVAIL_OUT',
                AVAIL_FAILED_TO_LOAD: 'AVAIL_FAILED_TO_LOAD',
                AVAIL_LOADED_IS_EMPTY: 'AVAIL_LOADED_IS_EMPTY',
                AVAIL_LOADING: 'AVAIL_LOADING'
            };

        window._watchwithLoaders = window._watchwithLoaders || {};
        window._watchwithLoaders.MPS = api;

        return api;

        /** Public **/

        /**
         * @name   init
         * @desc   Adds the correct SDK to the window and registers all avails
         * @param  {Object[]}  data  Array of avails to register
         */
        function init(data) {
            avails = data;

            if (!avails || !avails.length) {
                return;
            }

            var avail = avails[0];

            // This needs to be on window scope for MPS to work correctly.
            var mpscall = {
                'site': avail.mpsSite,
                'path': avail.mpsPath,
                'cat' : avail.mpsCat
            };

            var mpsopts = {
                'host': avail.mpsUri
            };

            // This needs to be on window scope for MPS to work correctly.
            window.mps = window.mps || {};
            window.mpscall = mpscall;

            var head = document.head || document.getElementsByTagName('head')[0],
                mpsload = document.createElement('script');

            mpsload.src = '//' + mpsopts.host + '/fetch/ext/load-' +
                mpscall.site + '.js?nowrite=jq';
            mpsload.id = 'mps-load';
            mpsload.async = false;
            head.insertBefore(mpsload, head.firstChild);

            window.mps.initCallback = function() {
                window.mps._ready(function () {
                    isReady = true;
                    fireEvent(EVENTS.LOADER_LOADED);
                });
            };

            window.mps.adloadCallback = function(eventObj) {
                var avail = adUnitsShown[eventObj._mps._slot];

                if (!avail) {
                    return;
                } else if (eventObj.isEmpty) {
                    fireEvent(EVENTS.AVAIL_LOADED_IS_EMPTY, avail);
                } else {
                    fireEvent(EVENTS.AVAIL_IN, avail);
                }
            };
        }

        /**
         * @name   show
         * @desc   Tells mps to display the specified avail
         * @param  {Object}      avail The avail to display
         */
        function show(avail) {
            if (isReady) {
                if (adUnitsShown[avail.mpsAdUnit]) {
                    // We're refreshing this ad because otherwise the ad will only
                    // show once per mpsAdUnit per page.
                    window.mps.refreshAds(avail.mpsAdUnit);
                }

                adUnitsShown[avail.mpsAdUnit] = avail;

                fireEvent(EVENTS.AVAIL_LOADING, avail);
                var ad = window.mps._select('#' + avail.domPlacementId);
                window.mps.insertAd(ad, avail.mpsAdUnit, 1);
            }
        }

        /**
         * @name   remove
         * @desc   Tells mps to remove the specified event
         * @param  {Object}  avail  The avail to remove
         */
        function remove(avail) {
            if (isReady) {
                var ad = window.mps.selectAd(avail.mpsAdUnit);
                if (ad) {
                    window.mps._remove(ad);
                }
                // TODO - if we delete this, we can't reload an adUnit. Are there any
                // negative implications to not deleting this???
                // delete(window.gpt[window.mps.advars[avail.mpsAdUnit]]);
                fireEvent(EVENTS.AVAIL_OUT, avail);
            }
        }

        /**
         * @name   fireEvent
         * @desc   Tells all of the eventHandlers about an analytics event
         * @param  {String}      name   Event name
         * @param  {Object}      avail  The avail responsible for the event
         */
        function fireEvent(name, avail) {
            for (var prop in eventHandlers) {
                if (eventHandlers.hasOwnProperty(prop)) {
                    if (avail) {
                        eventHandlers[prop](name, avail);
                    } else {
                        eventHandlers[prop](name);
                    }
                }
            }
        }

        /**
         * @name  addEventHandler
         * @desc  Adds a handler to be called when an event occurs.
         * @param {String}    name     name of the handler
         * @param {Function}  handler  Callback to be called when event occurs - should accept
         *        an event name and optionally the avail related to the event
         */
        function addEventHandler(name, handler) {
            eventHandlers[name] = handler;
        }

        /**
         * @name   removeEventHandler
         * @desc   removes the event handler with the given name
         * @param  {String}      name  name of handler to remove
         */
        function removeEventHandler(name) {
            delete eventHandlers[name];
        }

        /** Private **/

    }
    var loader = new MpsLoader();

    return loader;
})();
