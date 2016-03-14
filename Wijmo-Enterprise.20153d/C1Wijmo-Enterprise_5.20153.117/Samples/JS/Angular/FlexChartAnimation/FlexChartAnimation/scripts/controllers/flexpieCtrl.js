'use strict';

var app = angular.module('app');

app.controller('flexpieCtrl', function ($scope, menuSvc) {

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
            x: idx,
            y: getRandomValue(200)
        };
    }

    function getRandomValue(max) {
        return Math.round(Math.random() * max);
    }

    var pieAnimation;

    $scope.piedata = getData(5);
    $scope.ctx = {
        pieChart: null,
        duration: 400,
        innerRadius: 0,
        easing: 'Swing',
        animationMode: 'All'
    };

    //selection-mode="Point"
    var insertPieIdx = 1;

    $scope.resetPieData = function () {
        $scope.piedata = getData(5);
        insertPieIdx = 1;
    };

    $scope.addSlice = function () {
        $scope.piedata.push(getRandomData('added' + insertPieIdx));
        insertPieIdx++;
    };

    $scope.removeSlice = function () {
        if ($scope.piedata.length) {
            $scope.piedata.pop();
            insertPieIdx <= 1 ? 1 : insertPieIdx--;
        }
    };

    $scope.$watch('ctx.pieChart', function () {
        var pieChart = $scope.ctx.pieChart;
        if (!pieChart) {
            return;
        }
        pieAnimation = new wijmo.chart.animation.ChartAnimation(pieChart);
        pieAnimation.duration = $scope.ctx.duration || 400;
        updatePieChart();
    });

    $scope.$watch('ctx.animationMode', function () {
        var pieChart = $scope.ctx.pieChart,
            animationMode = $scope.ctx.animationMode;

        if (!animationMode || animationMode === '') {
            return;
        }
        animationMode = wijmo.chart.animation.AnimationMode[animationMode]

        if (pieChart && pieAnimation) {
            pieAnimation.animationMode = animationMode;
            updatePieChart();
        }
    });

    $scope.$watch('ctx.easing', function () {
        var pieChart = $scope.ctx.pieChart,
            easing = $scope.ctx.easing;

        if (!easing || easing === '') {
            return;
        }
        easing = wijmo.chart.animation.Easing[easing];

        if (pieChart && pieAnimation) {
            pieAnimation.easing = easing;
        }
    });

    $scope.$watch('ctx.duration', function () {
        var pieChart = $scope.ctx.pieChart,
            duration = $scope.ctx.duration;

        if (pieChart && pieAnimation) {
            pieAnimation.duration = duration;
        }
    });

    function updatePieChart() {
        var pieChart = $scope.ctx.pieChart;

        if (pieChart) {
            pieChart.refresh(true);
        }
    }
});
