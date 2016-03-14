'use strict';

var app = angular.module('app');

app.controller('functionseriesCtrl', function ($scope) {
    //yfunc
    $scope.$watch('yfuncchart', function () {
        var sender = $scope.yfuncchart,
            series;
        if (sender && sender.hostElement) {
            sender.beginUpdate();

            series = new wijmo.chart.analytics.YFunctionSeries();
            series.name = 'YFunctionSeries';
            series.min = -10;
            series.max = 10;
            series.sampleCount = 300;
            series.func = function (value) {
                return Math.sin(4 * value) * Math.cos(3 * value);
            };
            sender.series.push(series);

            sender.endUpdate();
        }
    });

    //paramfunc
    $scope.$watch('pfuncchart', function () {
        var sender = $scope.pfuncchart,
            xParam = 5,
            yParam = 7,
            series;
        if (sender && sender.hostElement) {
            sender.beginUpdate();

            series = new wijmo.chart.analytics.ParametricFunctionSeries();
            series.name = 'ParametricFunctionSeries';
            series.max = 2 * Math.PI;
            series.sampleCount = 1000;
            series.xFunc = function (value) {
                return Math.cos(value * xParam);
            };
            series.yFunc = function (value) {
                return Math.sin(value * yParam);
            };
            sender.series.push(series);

            sender.endUpdate();
        }
    });
});
