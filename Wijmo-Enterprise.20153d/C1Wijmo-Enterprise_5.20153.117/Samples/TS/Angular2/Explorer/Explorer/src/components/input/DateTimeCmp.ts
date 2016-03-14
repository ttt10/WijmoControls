'use strict';

import { Component, View, EventEmitter, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { InputBaseCmp } from './InputBaseCmp';
import { DataSvc } from '../../services/DataSvc';
import { wjNg2Input } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';
import { GlbzPipe, ToDatePipe } from '../../pipes/appPipes';

// DateTime sample component.
@Component({
    selector: 'date-time-cmp',
})
@View({
        templateUrl: 'src/components/input/dateTimeCmp.html',
        directives: [wjNg2Input.WjInputDate, wjNg2Input.WjInputTime, wjNg2Input.WjCalendar,
            wjNg2Input.WjMenu, wjNg2Input.WjMenuItem, wjNg2Input.WjMenuSeparator, CORE_DIRECTIVES],
        pipes: [GlbzPipe, ToDatePipe]

})
export class DateTimeCmp extends InputBaseCmp {
    departureDate = new Date();
    
    constructor( @Inject(DataSvc) dataSvc: DataSvc) {
        super(dataSvc);
    }
}


