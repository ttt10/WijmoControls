﻿'use strict';

import { Component, View, EventEmitter, Inject, ViewChild } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { wjNg2Input, wjNg2Chart } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

// Chart Intro sample component
@Component({
    selector: 'chart-intro-cmp'
})
@View({
        templateUrl: 'src/components/chart/chartIntroCmp.html',
        directives: [wjNg2Chart.WjFlexChart, wjNg2Chart.WjFlexChartSeries,
            wjNg2Input.WjMenu, wjNg2Input.WjMenuItem, CORE_DIRECTIVES]
})
export class ChartIntroCmp {
    private _groupWidth = '70%';

    pal = 0;
    palettes = ['standard', 'cocoa', 'coral', 'dark', 'highcontrast', 'light', 'midnight', 'minimal', 'modern', 'organic', 'slate'];
    itemsSource: any[];
    // references FlexChart named 'chart' in the view
    @ViewChild('chart') chart: wijmo.chart.FlexChart;

    constructor() {
        var names = ['Oranges', 'Apples', 'Pears', 'Bananas', 'Pineapples'],
            data = [];
        this.itemsSource = [];
        for (var i = 0; i < names.length; i++) {
            this.itemsSource.push({
                name: names[i],
                mar: Math.random() * 3,
                apr: Math.random() * 10,
                may: Math.random() * 5
            });
        }

    }

    get groupWidth(): any {
        return this._groupWidth;
    }
    set groupWidth(value: any) {
        if (this._groupWidth != value) {
            this._groupWidth = value;
            if (this.chart) {
                this.chart.options = { groupWidth: value };
            }
        }
    }

    getPalette(palIdx: number): string[] {
        return wijmo.chart.Palettes[this.palettes[palIdx]];
    }

    isColumnOrBar = function (chart: wijmo.chart.FlexChart) {
        return chart && (chart.chartType == wijmo.chart.ChartType.Column || chart.chartType == wijmo.chart.ChartType.Bar);
    };

}
