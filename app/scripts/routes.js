'use strict';
/**
 * @ngdoc overview
 * @name ntsApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 */
angular.module('ntsApp').config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
      })
      .when('/:access_token', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })

  }]);
