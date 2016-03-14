'use strict';

import { Component, View, EventEmitter, Inject } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { InputBaseCmp } from './InputBaseCmp';
import { DataSvc } from '../../services/DataSvc';
import { wjNg2Input } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';
import { GlbzPipe } from '../../pipes/appPipes';

// Numbers sample component.
@Component({
    selector: 'numbers-cmp'
})
@View({
        templateUrl: 'src/components/input/numbersCmp.html',
        directives: [wjNg2Input.WjInputNumber, wjNg2Input.WjMenu, wjNg2Input.WjMenuItem, CORE_DIRECTIVES, FORM_DIRECTIVES],
        pipes: [GlbzPipe]
})
export class NumbersCmp extends InputBaseCmp {
    passengers = 1;
    price = 0;
    tax = .085;

    constructor( @Inject(DataSvc) dataSvc: DataSvc) {
        super(dataSvc);
    }
}


