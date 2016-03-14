'use strict';

var app = angular.module('app');

app.controller('movingaverageCtrl', function ($scope) {
    // generate some random data
    function getData(count) {
        var data = new wijmo.collections.ObservableArray();

        for (var i = 1; i <= count; i++) {
            data.push({
                x: i,
                y: Math.floor(Math.random() * 100)
            });
        }
        return data;
    }

    //moving average
    var movingAverage;

    $scope.itemsSource = new wijmo.collections.CollectionView(getData(30));
    $scope.period = 2;
    $scope.type = 'Simple';

    $scope.$watch('period', function () {
        updateMovingAverage();
    });

    $scope.$watch('type', function () {
        updateMovingAverage();
    });

    $scope.$watch('machart', function () {
        var sender = $scope.machart;
        if (sender && sender.hostElement) {
            if (movingAverage != null) {
                return;
            }
            movingAverage = new wijmo.chart.analytics.MovingAverage();
            movingAverage.binding = 'y';
            movingAverage.bindingX = 'x';
            sender.series.push(movingAverage);
            updateMovingAverage();
        }
    });

    function updateMovingAverage() {
        if (movingAverage == null || !$scope.type || $scope.period == null) {
            return;
        }
        var sender = $scope.machart;
        sender.beginUpdate();

        movingAverage.type = wijmo.chart.analytics.MovingAverageType[$scope.type];
        movingAverage.name = $scope.type[0] + 'MA';
        movingAverage.period = $scope.period;

        sender.endUpdate();
    }
});
