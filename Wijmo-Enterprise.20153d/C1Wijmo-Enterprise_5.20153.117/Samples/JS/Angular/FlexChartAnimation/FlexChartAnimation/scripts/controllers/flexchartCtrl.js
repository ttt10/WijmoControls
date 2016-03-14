﻿'use strict';

var app = angular.module('app');

app.controller('flexchartCtrl', function ($scope) {

    // generate some random data
    function getData(numCount) {
        var data = new wijmo.collections.ObservableArray();
        //var data = [];

        for (var i = 0; i < numCount; i++) {
            data.push(getRandomData('random' + getRandomValue(1000)));
        }
        return data;
    }

    function getRandomData(idx) {
        return {
            //x: getRandomValue(100),
            x: idx,
            y: getRandomValue(200),
            y1: getRandomValue(400),
            y2: getRandomValue(600),
            y3: getRandomValue(800),
            y4: getRandomValue(1000)
        };
    }

    function getRandomValue(max) {
        return Math.round(Math.random() * max);
    }
    
    var chartAnimation,
        flexChartPoints = 10;

    $scope.data = getData(flexChartPoints);

    $scope.ctx = {
        flexChart: null,
        duration: 400,
        chartType: 'Line',
        easing: 'Swing',
        animationMode: 'All'
    };

    $scope.resetChartData = function () {
        $scope.data = getData(flexChartPoints);
    };

    $scope.itemAdd = function (args) {
        var idx = args.selectedIndex;
        if (idx > -1) {
            func('add', idx);
        }
    };
    $scope.itemRemove = function (args) {
        var idx = args.selectedIndex;
        if (idx > -1) {
            func('remove', idx);
        }
    };

    function func(oper, idx) {
        var str = '', funcName;
        if (idx === 1) {
            str = 'FirstPoint';
        } else if (idx === 2) {
            str = 'LastPoint';
        }
        funcName = oper + 'ChartSeries' + str;
        $scope[funcName]();
    }

    $scope.addChartSeriesFirstPoint = function () {
        $scope.data.insert(0, getRandomData('added' + getRandomValue(1000)));
    };

    $scope.addChartSeriesLastPoint = function () {
        $scope.data.push(getRandomData('added' + getRandomValue(1000)));
    };

    $scope.removeChartSeriesFirstPoint = function () {
        if ($scope.data.length) {
            $scope.data.removeAt(0);
        }
    };

    $scope.removeChartSeriesLastPoint = function () {
        if ($scope.data.length) {
            $scope.data.pop();
        }
    };

    $scope.addChartSeries = function () {
        var chart = $scope.ctx.flexChart,
            len = chart.series.length;

        if (len >= 5) {
            return;
        }
        var series = new wijmo.chart.Series();
        series.binding = len ? 'y' + len : 'y';
        chart.series.push(series);
    };

    $scope.removeChartSeries = function () {
        var chart = $scope.ctx.flexChart;

        if (chart.series.length <= 0) {
            return;
        }
        chart.series.pop();
    };

    $scope.$watch('ctx.flexChart', function () {
        var flexChart = $scope.ctx.flexChart;
        if (!flexChart) {
            return;
        }
        chartAnimation = new wijmo.chart.animation.ChartAnimation(flexChart);
        chartAnimation.duration = $scope.ctx.duration || 400;
        updateChart();
    });

    $scope.$watch('ctx.animationMode', function () {
        var flexChart = $scope.ctx.flexChart,
            animationMode = $scope.ctx.animationMode;

        if (!animationMode || animationMode === '') {
            return;
        }
        animationMode = wijmo.chart.animation.AnimationMode[animationMode]

        if (flexChart && chartAnimation) {
            chartAnimation.animationMode = animationMode;
            updateChart();
        }
    });

    $scope.$watch('ctx.easing', function () {
        var flexChart = $scope.ctx.flexChart,
            easing = $scope.ctx.easing;

        if (!easing || easing === '') {
            return;
        }
        easing = wijmo.chart.animation.Easing[easing];

        if (flexChart && chartAnimation) {
            chartAnimation.easing = easing;
        }
    });

    $scope.$watch('ctx.duration', function () {
        var flexChart = $scope.ctx.flexChart,
            duration = $scope.ctx.duration;

        if (flexChart && chartAnimation) {
            chartAnimation.duration = duration;
        }
    });

    function updateChart() {
        var flexChart = $scope.ctx.flexChart;

        if (flexChart) {
            flexChart.refresh(true);
        }
    }
});
