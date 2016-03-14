// get application
var app = angular.module('app');

// add controller
app.controller('appCtrl', function appCtrl($scope) {

    // show that edit events fire also for custom editors
    $scope.editEnding = function (s, e) {
        console.log(wijmo.format('Edit ending for cell {row}, {col}', e));
    }
    $scope.editEnded = function (s, e) {
        console.log(wijmo.format('Edit ended for cell {row}, {col}', e));
    }

    // expose some data
    $scope.countries = 'US,Germany,UK,Japan,Italy,Greece'.split(',');
    $scope.products = 'Widget,Gadget,Doohickey'.split(',');
    $scope.data = new wijmo.collections.CollectionView(getData(50));
    $scope.data.pageSize = 10;

    // some random data
    function getData(count) {
        var data = [],
            countries = $scope.countries,
            products = $scope.products,
            colors = $scope.colors,
            dt = new Date();
        for (var i = 0; i < count; i++) {
            data.push({
                id: i,
                date: new Date(dt.getFullYear(), i % 12, 25, i % 24, i % 60, i % 60),
                time: new Date(dt.getFullYear(), i % 12, 25, i % 24, i % 60, i % 60),
                country: countries[Math.floor(Math.random() * countries.length)],
                product: products[Math.floor(Math.random() * products.length)],
                amount: Math.random() * 10000 - 5000,
                discount: Math.random() / 4
            });
        }
        return data;
    }
});
