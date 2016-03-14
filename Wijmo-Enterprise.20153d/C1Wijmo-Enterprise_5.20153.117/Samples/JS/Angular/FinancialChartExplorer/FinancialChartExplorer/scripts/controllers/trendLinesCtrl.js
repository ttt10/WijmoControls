(function() {
    'use strict';

    angular
        .module('app')
        .controller('trendLinesCtrl', function ($scope, DataSvc, tooltipFn) {
            $scope.title = 'Trend Lines';
            $scope.data = [];
            $scope.dataList = DataSvc.getDataList();
            $scope.selectedSymbol = $scope.dataList[0].symbol;
            $scope.ctx = {
                chart: null,
                properties: {
                    fitType: 'Linear',
                    order: 2,
                    sampleCount: 150
                }
            };

            // get data
            DataSvc.getData($scope.selectedSymbol)
                .success(function (data) {
                    $scope.data = data;
                })
                .error(function (error) {
                    console.log(error);
                });

            // FinancialChart.rendered event handler
            $scope.chartRendered = function (sender, args) {
                if ($scope.ctx.chart) {
                    $scope.ctx.chart.tooltip.content = tooltipFn;
                }
            };
        });
})();