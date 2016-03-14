'use strict';

import { Component, View, EventEmitter, Inject, Input, Output } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { InputBaseCmp } from './InputBaseCmp';
import { DataSvc } from '../../services/DataSvc';
import { wjNg2Input, wjNg2Grid } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

// ComboBox sample component.
@Component({
    selector: 'combo-box-cmp'
})
@View({
    templateUrl: 'src/components/input/comboBoxCmp.html',
    directives: [wjNg2Input.WjComboBox, wjNg2Grid.WjFlexGrid, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class ComboBoxCmp extends InputBaseCmp {
    country1 = '';
    country2 = 'Algeria';
    country3 = '';
    item1 = '';
    item2 = '';

    constructor( @Inject(DataSvc) dataSvc: DataSvc) {
        super(dataSvc);
    }

}


