'use strict';

/**
 * Controllers
 */

angular.module('noteApp.controllers', [])
.controller('HomeCtrl', function($scope, inNoteFactory, socketFactory) {

    var HomeCtrl = this;

    $scope.testValues = '';

    HomeCtrl.notification = new inNoteFactory({
        layout: 'growl',
        effect: 'jelly',
        ttl: 3000,
    });

    //Register for notifications
    HomeCtrl.notification.registerForMessage('noticeMessage', 'notice');
    HomeCtrl.notification.registerForMessage('warningMessage', 'warning');
    HomeCtrl.notification.registerForMessage('errorMessage', 'error');

    HomeCtrl.notification.registerForMessage('successMessage', 'success');

    $scope.sendNotice = function() {

        HomeCtrl.notification.sendMessageToAllClients($scope.testInput, 'noticeMessage');

    };

    $scope.sendWarning = function() {

        HomeCtrl.notification.sendMessageToAllClients($scope.testInput, 'warningMessage');

    };

    $scope.sendError = function() {

        HomeCtrl.notification.sendMessageToAllClients($scope.testInput, 'errorMessage');

    };

    $scope.sendSuccess = function() {
        HomeCtrl.notification.sendMessageToAllClients($scope.testInput, 'successMessage');

    };
});