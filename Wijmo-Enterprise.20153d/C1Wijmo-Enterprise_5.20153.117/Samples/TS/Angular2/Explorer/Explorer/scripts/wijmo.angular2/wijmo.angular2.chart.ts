import { Component, View, Inject, OnInit } from 'angular2/core';
import { ElementRef, Injector, Directive, ViewContainerRef, TemplateRef, Optional, forwardRef } from 'angular2/core';
import * as ng2 from 'angular2/core';
import { wj as wjNg2BaseRoot, WjComponent, WjDirectiveBehavior } from './wijmo.angular2.directiveBase';

export module wj.angular2 {
    'use strict';

    // WjFlexChart
    @WjComponent({
        selector: 'wj-flex-chart',
    })
    @View({
        template: ``,
    })
    export class WjFlexChart extends wijmo.chart.FlexChart {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }

        get tooltipContent(): any{
            return this.tooltip.content;
        }
        set tooltipContent(value: any) {
            this.tooltip.content = value;
        }

        get labelContent(): any {
            return this.dataLabel.content;
        }
        set labelContent(value: any) {
            this.dataLabel.content = value;
        }
    }

    // WjFlexPie
    @WjComponent({
        selector: 'wj-flex-pie',
    })
    @View({
        template: ``,
    })
    export class WjFlexPie extends wijmo.chart.FlexPie {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }

        get tooltipContent(): any {
            return this.tooltip.content;
        }
        set tooltipContent(value: any) {
            this.tooltip.content = value;
        }

        get labelContent(): any {
            return this.dataLabel.content;
        }
        set labelContent(value: any) {
            this.dataLabel.content = value;
        }
    }



    // WjFlexChartAxis
    @WjComponent({
        selector: 'wj-flex-chart-axis',
        wjParentDirectives: [
            WjFlexChart,
            forwardRef(() => WjFlexChartSeries),
            //TBD:
            //forwardRef(() => WjFinancialChartSeries),
            //forwardRef(() => WjFinancialChart)
        ]
    })
    @View({
        template: ``,
    })
    export class WjFlexChartAxis extends wijmo.chart.Axis {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super();
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjFlexChartLegend
    @WjComponent({
        selector: 'wj-flex-chart-legend',
        wjParentDirectives: [
            WjFlexChart,
            WjFlexPie,
            //TBD
            //forwardRef(() => WjFinancialChart),
        ]
    })
    @View({
        template: ``,
    })
    export class WjFlexChartLegend extends wijmo.chart.Legend {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(null);
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjFlexChartDataLabel
    @WjComponent({
        selector: 'wj-flex-chart-data-label',
        wjParentDirectives: [ WjFlexChart ]
    })
    @View({
        template: ``,
    })
    export class WjFlexChartDataLabel extends wijmo.chart.DataLabel {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super();
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjFlexPieDataLabel
    @WjComponent({
        selector: 'wj-flex-pie-data-label',
        wjParentDirectives: [WjFlexChart]
    })
    @View({
        template: ``,
    })
    export class WjFlexPieDataLabel extends wijmo.chart.PieDataLabel {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super();
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjFlexChartSeries
    @WjComponent({
        selector: 'wj-flex-chart-series',
        wjParentDirectives: [
            WjFlexChart,
            //TBD
            //forwardRef(() => WjFinancialChart)
        ]
    })
    @View({
        template: ``,
    })
    export class WjFlexChartSeries extends wijmo.chart.Series {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super();
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjFlexChartLineMarker
    @WjComponent({
        selector: 'wj-flex-line-marker',
        wjParentDirectives: [
            WjFlexChart,
            //TBD
            //forwardRef(() => WjFinancialChart)
        ]
    })
    @View({
        template: ``,
    })
    export class WjFlexChartLineMarker extends wijmo.chart.LineMarker {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            var behavior = WjDirectiveBehavior.attach(this, elRef, injector);
            super(<wijmo.chart.FlexChartCore>behavior.parentBehavior.directive);
            
        }
    }


}

export var wjNg2Chart = wj.angular2;
