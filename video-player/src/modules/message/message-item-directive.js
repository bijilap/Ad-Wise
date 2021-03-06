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

    var query_url_base = "http://localhost:3000/query?q=";

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

            var url = query_url_base + scope.vm.event.card.object.message + '&callback=JSON_CALLBACK';
            console.log("GIDEONB", url);

            $http.get(url).
              success(function(data, status, headers, config) {
                //$scope.posts = data;
                console.log(data);
                if(data.length==0){
                  console.log("end of func");
                  return;
                }
                try{
                var record = data[0];
                console.log(record);
                scope.vm.event.card.object.title=record.text;
                console.log(scope.vm.event.card.object.title);
                scope.vm.event.card.object.message = record.seller;
                console.log(record.img);
                scope.vm.event.card.object.image = record.img;
                scope.vm.event.card.object.url = record.url;

                if(data.length>1){
                  var record = data[1];
                  console.log(record);
                  scope.vm.event.card.object.titleB=record.text;
                  console.log(scope.vm.event.card.object.titleB);
                  scope.vm.event.card.object.messageB = record.seller;
                  console.log(record.img);
                  scope.vm.event.card.object.imageB = record.img;
                  scope.vm.event.card.object.urlB = record.url;
                }

                scope.vm.showAd=true;
              }
              catch(e){
                console.log(e);
              }
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
        vm.showFullAd = false;

        function seek(milliseconds) {
            console.log("toggle-playback", "seeking");
            wwPlayer.seekTo(milliseconds);
        }

        function togglePlayback() {

            console.log("toggle-playback", vm.event);

            wwPlayer.togglePlayback();
            vm.showAd = !vm.showAd;
            vm.showFullAd = !vm.showFullAd;
        }

    }
})();
