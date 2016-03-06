(function() {

    function DfpLoader() {

        var googletag,
            eventHandlers = {},
            avails,
            slots = {},
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
        window._watchwithLoaders.DFP = api;

        return api;

        /** Public **/

        /**
         * @name   init
         * @desc   Adds the googletag SDK to the window and registers all avails
         * @param  {Object[]}  data  Array of avails to register
         */
        function init(data) {
            var initScript = document.createElement('script');
            initScript.setAttribute('type', 'text/javascript');
            initScript.setAttribute('id', 'watchwithInitDfp');

            initScript.text = [
                'window.googletag = window.googletag || {};',
                'window.googletag.cmd = window.googletag.cmd || [];',
                '(function() {',
                    'var gads = document.createElement("script");',
                    'gads.async = true;',
                    'gads.type = "text/javascript";',
                    'gads.src = ("https:" === document.location.protocol ? "https:" : "http:") + ',
                        '"//www.googletagservices.com/tag/js/gpt.js;";',
                    'var node = document.getElementsByTagName("script")[0];',
                    'node.parentNode.insertBefore(gads, node);',
                '})();'
            ].join(' ');

            document.getElementsByTagName('head')[0].appendChild(initScript);
            initGoogleTags(data);
        }

        /**
         * @name   show
         * @desc   Tells googletag to display the specified avail
         * @param  {Object}      avail The avail to display
         */
        function show(avail) {
            googletag.cmd.push(function() {
                fireEvent(EVENTS.AVAIL_LOADING, avail);
                if (slots[avail.domPlacementId]) {
                    googletag.pubads().refresh([slots[avail.domPlacementId]]);
                } else {
                    defineSlot(avail);
                    googletag.display(avail.domPlacementId);
                }
            });
        }

        /**
         * @name   remove
         * @desc   Tells googletag to remove the specified event
         * @param  {Object}  avail  The avail to remove
         */
        function remove(avail) {
            googletag.cmd.push(function() {
                googletag.pubads().clear([slots[avail.domPlacementId]]);
                fireEvent(EVENTS.AVAIL_OUT, avail);
            });
        }

        /**
         * @name   fireEvent
         * @desc   Tells the specified eventHandlers about an analytics event
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

        function initGoogleTags(data) {
            avails = data;
            googletag = window.googletag;
            if (!(googletag && googletag.apiReady)) {
                // api isn't ready yet, try again in 500ms
                return window.setTimeout(function () { initGoogleTags(data); }, 500);
            }

            if (!avails.length) {
                return; // TODO - Is this an error? Should analytics fire?
            }

            fireEvent(EVENTS.LOADER_LOADED);

            googletag.cmd.push(function() {
                // Set page level targeting info. All avails carry the same info here.
                setPageTargeting(avails[0]);
                registerRenderEvent();
                googletag.enableServices();
            });
        }

        function setPageTargeting(avail) {
            var targeting = avail.targeting.page;
            for (var key in targeting) {
                if (targeting.hasOwnProperty(key)) {
                    googletag.pubads().setTargeting(key, targeting[key]);
                }
            }
        }

        // listen for slot to finish registering
        function registerRenderEvent() {
            googletag.pubads().addEventListener('slotRenderEnded', function(event) {
                // name starts in format /unique_id/ad_unit_code (ex: /25685148/EV4511144)
                var eventId = event.slot.getName().split('/');

                if (eventId.length < 3 || !slots[eventId[2]]) {
                    // Name not formed correctly or we don't have the slot registered
                    // Either way, this event doesn't belong in this loader.
                    return;
                }

                eventId = eventId[2];

                var avail = getAvailFromId(eventId);
                if (!avail) {
                    fireEvent(EVENTS.AVAIL_FAILED_TO_LOAD, avail);
                } else if (event.isEmpty) {
                    fireEvent(EVENTS.AVAIL_LOADED_IS_EMPTY, avail);
                } else {
                    fireEvent(EVENTS.AVAIL_IN, avail);
                }
            });
        }

        function getAvailFromId(id) {
            for (var i = 0; i < avails.length; i++) {
                if (avails[i].domPlacementId === id) {
                    return avails[i];
                }
            }
            return false;
        }

        function defineSlot(avail) {
            var slot = googletag.defineSlot(
                '/' + avail.orgUniqueId + '/' + avail.adUnitCode,
                [avail.xDimension, avail.yDimension],
                avail.domPlacementId);

            var targeting = avail.targeting.slot;
            for (var key in targeting) {
                if (targeting.hasOwnProperty(key)) {
                    slot.setTargeting(key, targeting[key]);
                }
            }

            slot.addService(googletag.pubads());
            slots[avail.domPlacementId] = slot;
        }
    }
    return new DfpLoader();
})();
