(function() {
    'use strict';

    // get reference to app module
    var app = angular.module('app');

    // Getting Started & Theming
    app.controller('simpleCtrl', function($scope, dataSvc) {
        $scope.itemsSource = dataSvc.getData();
    });

    // Legends & Titles
    app.controller('legendTitlesCtrl', function ($scope, dataSvc) {
        $scope.itemsSource = dataSvc.getData();
        $scope.header = 'Fruit By Value';
        $scope.footer = '2014 GrapeCity, inc.';
        $scope.legendPosition = 'Right';
    });

    // Basic Features
    app.controller('basicCtrl', function ($scope, dataSvc) {
        $scope.itemsSource = dataSvc.getData();
        $scope.chart = null;
        $scope.innerRadius = 0;
        $scope.offset = 0;
        $scope.startAngle = 0;
        $scope.reversed = false;
        $scope.palette = 'standard';
        $scope.palettes = ['standard', 'cocoa', 'coral', 'dark', 'highcontrast', 'light', 'midnight', 'minimal', 'modern', 'organic', 'slate'];

        $scope.paletteChanged = function (sender) {
            var p = $scope.palettes[sender.selectedIndex];
            $scope.palette = p;
            $scope.chart.palette = wijmo.chart.Palettes[p];
        };
    });

    // Selection
    app.controller('selectionCtrl', function ($scope, dataSvc) {
        $scope.itemsSource = dataSvc.getData();
        $scope.selectedPosition = 'Top';
        $scope.selectedOffset = 0;
        $scope.isAnimated = true;
    });
})();