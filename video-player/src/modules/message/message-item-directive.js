(function() {
    'use strict';

    angular
        .module('watchwith.message')
        .directive('wwMessageItem', wwMessageItem);


    /**
     * @name     wwMessageItem
     * @desc     Message Directive
     * @ngtype   directive
     * @restrict E
     */
    wwMessageItem.$inject = ["$http"];

    /* @ngInject */
    function wwMessageItem ($http) {

        var directive = {
            bindToController: true,
            controller: wwMessageController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                event: "="
            },
            templateUrl: 'message/message-item-template.html',
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            scope.vm.el = element;
            console.log("GIDEON", element);
            console.log("GIDEONB", scope.vm.event.card.object.title);

            var query = scope.vm.event.card.object.title;

            $http.get('http://api.watchwith.com/v3/ping').
              success(function(data, status, headers, config) {
                //$scope.posts = data;
                console.log(data);
                scope.vm.showAd=true;
              })
            //document.getElementById("demo").innerHTML = xhttp.responseText;

        }


    }

    wwMessageController.$inject = ['wwPlayer'];
    /* @ngInject */
    function wwMessageController (wwPlayer) {
        var vm = this;
        vm.togglePlayback = togglePlayback;
        vm.seek = seek;
        vm.showAd = false;

        function seek(milliseconds) {
            wwPlayer.seekTo(milliseconds);
        }

        function togglePlayback() {

            console.log("toggle playback, ", vm.event);

            wwPlayer.togglePlayback();
        }

    }
})();
