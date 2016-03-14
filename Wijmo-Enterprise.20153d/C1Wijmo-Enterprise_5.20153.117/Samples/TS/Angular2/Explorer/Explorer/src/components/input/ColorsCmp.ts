'use strict';

import { Component, View, EventEmitter, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { InputBaseCmp } from './InputBaseCmp';
import { DataSvc } from '../../services/DataSvc';
import { wjNg2Input } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

// Colors sample component.
@Component({
    selector: 'colors-cmp',
})
@View({
        templateUrl: 'src/components/input/colorsCmp.html',
        directives: [wjNg2Input.WjColorPicker, wjNg2Input.WjInputColor,
            wjNg2Input.WjComboBox, CORE_DIRECTIVES],

})
export class ColorsCmp extends InputBaseCmp {
    theColor = 'white';

    constructor( @Inject(DataSvc) dataSvc: DataSvc) {
        super(dataSvc);
    }
}
