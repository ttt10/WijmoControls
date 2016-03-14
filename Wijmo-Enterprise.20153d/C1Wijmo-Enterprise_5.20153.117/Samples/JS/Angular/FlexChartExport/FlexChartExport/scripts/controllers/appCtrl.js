(function () {
    'use strict';

    angular
        .module('app')
        .controller('appCtrl', function ($scope) {
            // populate data
            var data = [],
                names = ['Oranges', 'Apples', 'Pears', 'Bananas', 'Pineapples'];
            for (var i = 0; i < names.length; i++) {
                data.push({
                    name: names[i],
                    mar: Math.random() * 3,
                    apr: Math.random() * 10,
                    may: Math.random() * 5
                });
            }

            // store some data related to the FlexChart
            $scope.ctx = {
                chart: null,
                cv: new wijmo.collections.CollectionView(data),
                chartType: 'Column'
            };

            // Wijmo Menu's itemClicked event handler
            $scope.itemClicked = function (menu) {
                exportImage(menu.selectedItem.value);
            };

            // helper function to export the FlexChart to an image
            var exportImage = function (extension) {
                if ($scope.ctx.chart) {
                    var chart = $scope.ctx.chart,
                        canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'),
                        svg = chart.hostElement.querySelector('svg'),
                        size = svg.getBoundingClientRect(),
                        xml;

                    // inline <text> styles
                    textInliner(chart.hostElement);

                    // set canvas height/width
                    canvas.height = size.height;
                    canvas.width = size.width;

                    // handle rectangle fill - otherwise transparent
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, size.width, size.height);

                    /* Perform other preprocessing if needed */

                    // serialize SVG to XML
                    xml = new XMLSerializer().serializeToString(svg);

                    // call canvg extension method
                    ctx.drawSvg(xml, 0, 0, size.width, size.height);
                    canvas.toBlob(function (blob) {
                        // use FileSaver.js to save the image
                        saveAs(blob, 'chart.' + extension);
                    });
                }
            };

            // external CSS is not detected when exporting
            // so one must inline some/all of these styles
            function textInliner(chartHost) {
                var textEls = [].slice.call(chartHost.querySelectorAll('text')),
                    style;

                textEls.forEach(function (current, index, array) {
                    style = window.getComputedStyle(current);
                    current.style.fontSize = style.getPropertyValue('font-size');
                    current.style.fontFamily = style.getPropertyValue('font-family');
                    current.style.fill = style.getPropertyValue('fill');
                });
            }

        });
})();