(function() {
    'use strict';

    angular
        .module('watchwith.promo')
        .directive('wwPromoItem', wwPromoItem);


    /**
     * @name     wwPromoItem
     * @desc     Promo Directive
     * @ngtype   directive
     * @restrict E
     */
    wwPromoItem.$inject = [];

    /* @ngInject */
    function wwPromoItem () {

        var directive = {
            bindToController: true,
            controller: wwPromoController,
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                event: "="
            },
            templateUrl: 'promo/promo-item-template.html',
            link: link
        };

        return directive;

        function link(scope, element, attrs) {
            scope.vm.el = element;
        }


    }

    wwPromoController.$inject = ['wwPlayer'];
    /* @ngInject */
    function wwPromoController (wwPlayer) {
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
