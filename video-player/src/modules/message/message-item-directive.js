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
    wwMessageItem.$inject = [];

    /* @ngInject */
    function wwMessageItem () {

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
        }


    }

    wwMessageController.$inject = ['wwPlayer'];
    /* @ngInject */
    function wwMessageController (wwPlayer) {
        var vm = this;
        vm.togglePlayback = togglePlayback;
        vm.seek = seek;

        function seek(milliseconds) {
            wwPlayer.seekTo(milliseconds);
        }

        function togglePlayback() {

            console.log("toggle playback, ", vm.event);

            wwPlayer.togglePlayback();
        }

    }
})();
