'use strict';

// get reference to the app
var app = angular.module('app');

// define the app's single controller
app.controller('appCtrl', function appCtrl($scope, $http) {

    var chartZoom;

    //create chart
    $scope.ctx = {
        zoomChart: null,
        chartType: 3,
        itemsSource: []
    };

    $scope.mouseAction = wijmo.chart.interaction.MouseAction.Zoom;
    $scope.interactiveAxes = wijmo.chart.interaction.InteractiveAxes.X;

    if (navigator.userAgent.match(/iPad/i) != null ||
        /Android/i.test(navigator.userAgent)) {
        document.querySelector('#mouseAction').style.display = 'none';
    }

    // add data array to scope
    $http.get('data/fb.json')
          .success(function (data) {
              var dateStr;
              for (var i = 0; i < data.length; i++) {
                  dateStr = data[i].date;
                  dateStr = dateStr.split('/');
                  data[i].date = new Date(dateStr[2], dateStr[0] - 1, dateStr[1]);
              }
              $scope.ctx.itemsSource = data;
          }).error(function (error) {
              console.log(error);
          });

    $scope.$watch('ctx.zoomChart', function () {
        if (!$scope.ctx.zoomChart) {
            return;
        }
        var chart = $scope.ctx.zoomChart;
        chart.plotMargin = 'NaN NaN NaN 80';
        if (!chartZoom) {
            chartZoom = new wijmo.chart.interaction.ChartGestures(chart);
            chartZoom.rangeChanged.addHandler(function () {
                document.querySelector('#reset').disabled = undefined;
            });
        }
        window.setTimeout(function () {
            chart.axisX.min = new Date(2013, 4, 1);
            chart.axisY.min = 24;
        }, 200);
    });

    $scope.$watch('mouseAction', function () {
        if (chartZoom) {
            chartZoom.mouseAction = $scope.mouseAction;
        }
    });

    $scope.$watch('interactiveAxes', function () {
        if (chartZoom) {
            chartZoom.interactiveAxes = $scope.interactiveAxes;
        }
    });

    $scope.resetAxes = function () {
        if (chartZoom) {
            chartZoom.reset();
            if ($scope.ctx.zoomChart) {
                $scope.ctx.zoomChart.axisX.min = new Date(2013, 4, 1);
                $scope.ctx.zoomChart.axisY.min = 24;
            }
        }
        document.querySelector('#reset').disabled = 'disabled';
    }
});

