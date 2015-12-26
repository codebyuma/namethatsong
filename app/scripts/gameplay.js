'use strict';
angular.module('ntsApp').config(function ($stateProvider){
    $stateProvider.state('play', {
        url: '/:access_token',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    });
});
