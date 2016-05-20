'use strict';

/**
 * @ngdoc overview
 * @name bidmotionTestApp
 * @description
 * # bidmotionTestApp
 *
 * Main module of the application.
 */
angular
  .module('bidmotionTestApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'highcharts-ng'
  ])
  .constant('_', window._)
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
