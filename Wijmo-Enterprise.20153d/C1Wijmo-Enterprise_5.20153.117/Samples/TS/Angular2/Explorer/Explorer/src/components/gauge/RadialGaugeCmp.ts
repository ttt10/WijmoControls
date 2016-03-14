'use strict';

import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { GaugeBaseCmp } from './GaugeBaseCmp';
import { wjNg2Gauge } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

// Radial gauge sample component.
@Component({
    selector: 'radial-gauge-cmp'
})
@View({
        templateUrl: 'src/components/gauge/radialGaugeCmp.html',
        directives: [wjNg2Gauge.WjRadialGauge, wjNg2Gauge.WjRange, CORE_DIRECTIVES],
})
export class RadialGaugeCmp extends GaugeBaseCmp {

    constructor() {
        super();
    }
}


