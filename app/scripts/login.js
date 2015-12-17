'use strict';
angular.module('ntsApp').config(function ($stateProvider){
    $stateProvider.state('login', {
        url: '/',
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
    });
});
