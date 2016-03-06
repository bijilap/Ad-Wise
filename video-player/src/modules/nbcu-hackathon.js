(function () {
    'use strict';

    var app = angular.module('watchwith');
    app.requires.push('watchwith.promo');
    app.requires.push('watchwith.message');

    // Add all modules that need to be included in the framework code here.
    // example: app.requires.push('watchwith.YOUR_DIRECTIVE');

})();
