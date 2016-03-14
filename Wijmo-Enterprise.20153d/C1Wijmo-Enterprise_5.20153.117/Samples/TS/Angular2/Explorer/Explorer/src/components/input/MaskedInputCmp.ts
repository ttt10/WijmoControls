'use strict';

import { Component, View, EventEmitter, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { InputBaseCmp } from './InputBaseCmp';
import { DataSvc } from '../../services/DataSvc';
import { wjNg2Input } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

// MaskedInput sample component.
@Component({
    selector: 'masked-input-cmp',
})
@View({
        templateUrl: 'src/components/input/maskedInputCmp.html',
        directives: [wjNg2Input.WjInputMask, wjNg2Input.WjInputDate, wjNg2Input.WjInputTime, CORE_DIRECTIVES],

})
export class MaskedInputCmp extends InputBaseCmp {
    mask = '>LL-AA-0000';
    departureDate = new Date();

    constructor( @Inject(DataSvc) dataSvc: DataSvc) {
        super(dataSvc);
    }
}
