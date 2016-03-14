(function () {
    'use strict';

    angular
        .module('app')
        .controller('movingAvgCtrl', function ($scope, DataSvc, tooltipFn) {
            $scope.title = 'Moving Averages';
            $scope.data = [];
            $scope.selectedSymbol = 'fb';
            $scope.ctx = {
                chart: null,
                shortProps: {
                    period: 50,
                    type: 'Simple',
                    name: ' Day MA'
                },
                longProps: {
                    period: 200,
                    type: 'Simple',
                    name: ' Day MA'
                }
            };

            DataSvc.getData($scope.selectedSymbol)
                .success(function (data) {
                    $scope.data = data;
                })
                .error(function (error) {
                    console.log(error);
                });

            $scope.chartRendered = function (sender, args) {
                if ($scope.ctx.chart) {
                    $scope.ctx.chart.tooltip.content = tooltipFn;
                }
            };
        });
})();