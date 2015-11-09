'use strict';

/**
 * App
 */

angular.module('noteApp', [
    'ngRoute',
    'noteApp.inNote',
    
    'noteApp.controllers',
    'noteApp.services'
])
.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'partials/home',
        controller: 'HomeCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
        
    $locationProvider.html5Mode(true);
});