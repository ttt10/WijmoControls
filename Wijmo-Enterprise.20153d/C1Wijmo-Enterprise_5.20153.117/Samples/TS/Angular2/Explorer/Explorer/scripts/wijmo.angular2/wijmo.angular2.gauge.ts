import { Component, View, ElementRef, Injector, Optional, forwardRef, Inject } from 'angular2/core';
import * as ng2 from 'angular2/core';
import { wj as wjNg2BaseRoot, WjComponent, WjDirectiveBehavior } from './wijmo.angular2.directiveBase';


export module wj.angular2 {
    'use strict';

    @WjComponent({
        selector: 'wj-linear-gauge',
    })
    @View({
            template: `<div><ng-content></ng-content></div>`,
    })
    export class WjLinearGauge extends wijmo.gauge.LinearGauge {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    @WjComponent({
        selector: 'wj-bullet-graph',
    })
    @View({
            template: `<div><ng-content></ng-content></div>`,
    })
    export class WjBulletGraph extends wijmo.gauge.BulletGraph {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    @WjComponent({
        selector: 'wj-radial-gauge',
    })
    @View({
        template: `<div><ng-content></ng-content></div>`,
    })
    export class WjRadialGauge extends wijmo.gauge.RadialGauge {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    @WjComponent({
        selector: 'wj-range',
        wjParentDirectives: [WjLinearGauge, WjBulletGraph, WjRadialGauge]
    })
    @View({
        template: ``,
    })
    export class WjRange extends wijmo.gauge.Range {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(null);
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

}

export var wjNg2Gauge = wj.angular2;