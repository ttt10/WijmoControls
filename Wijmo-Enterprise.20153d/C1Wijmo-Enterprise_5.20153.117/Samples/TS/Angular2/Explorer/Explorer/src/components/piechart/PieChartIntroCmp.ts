'use strict';

import { Component, View, EventEmitter, Inject, ViewChild } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { wjNg2Input, wjNg2Chart } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

// PieChart Introduction sample component.
@Component({
    selector: 'pie-chart-intro-cmp'
})
@View({
        templateUrl: 'src/components/piechart/pieChartIntroCmp.html',
        directives: [wjNg2Chart.WjFlexPie, wjNg2Input.WjMenu, wjNg2Input.WjMenuItem, CORE_DIRECTIVES]
})
export class PieChartIntroCmp {
    pal = 0;
    palettes = ['standard', 'cocoa', 'coral', 'dark', 'highcontrast', 'light', 'midnight', 'minimal', 'modern', 'organic', 'slate'];
    itemsSource: any[];
    labels = 0;
    lblBorder = false;
    // references FlexPie named 'chart' in the view
    @ViewChild('chart') chart: wijmo.chart.FlexPie;

    constructor() {
        // populate itemsSource
        var names = ['Oranges', 'Apples', 'Pears', 'Bananas', 'Pineapples'];
        this.itemsSource = [];
        for (var i = 0; i < names.length; i++) {
            this.itemsSource.push({
                name: names[i],
                value: Math.round(Math.random() * 100)
            });
        }

    }

    getPalette(palIdx: number): string[] {
        return wijmo.chart.Palettes[this.palettes[palIdx]];
    }

    hasLabels() {
        var chart = this.chart;
        return chart && chart.dataLabel.position != 0;
    };
}
