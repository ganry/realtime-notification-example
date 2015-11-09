'use strict';

/**
 * Controllers
 */

angular.module('noteApp.controllers', [])
.controller('HomeCtrl', function($scope, inNoteFactory, socketFactory) {

    var HomeCtrl = this;

    $scope.testValues = '';

    HomeCtrl.notification = new inNoteFactory();

    //Register for notification with type errorMessage
    HomeCtrl.notification.registerForMessage('errorMessage');


    $scope.sendNotification = function() {

        HomeCtrl.notification.sendMessageToAllClients($scope.testInput, 'errorMessage');

    };
});