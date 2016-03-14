﻿'use strict';

// get reference to app module
var app = angular.module('app');

// controller
app.controller('appCtrl', function ($scope, $http) {

    // today's date
    $scope.today = new Date();
    $scope.theDate = new Date();
    $scope.theTime = new Date();

    // submit when data is valid
    $scope.submit = function () {
        alert('The form has been submitted!');
    }

});
