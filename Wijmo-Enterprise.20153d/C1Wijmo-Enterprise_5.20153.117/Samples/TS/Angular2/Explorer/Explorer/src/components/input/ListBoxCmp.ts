'use strict';

import { Component, View, EventEmitter, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { InputBaseCmp } from './InputBaseCmp';
import { DataSvc } from '../../services/DataSvc';
import { wjNg2Input } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

// ListBox sample component.
@Component({
    selector: 'list-box-cmp',
    templateUrl: 'src/components/input/listBoxCmp.html',
    directives: [wjNg2Input.WjListBox, wjNg2Input.WjItemTemplate, CORE_DIRECTIVES]
})
export class ListBoxCmp extends InputBaseCmp {

    constructor( @Inject(DataSvc) dataSvc: DataSvc) {
        super(dataSvc);
    }
}


