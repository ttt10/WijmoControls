'use strict';

import { Component, View, EventEmitter, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { GridBaseCmp } from './GridBaseCmp';
import { DataSvc } from '../../services/DataSvc';
import { wjNg2Input, wjNg2Grid } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

// FlexGrid Templates sample component.
@Component({
    selector: 'grid-templates-cmp'
})
@View({
        templateUrl: 'src/components/grid/gridTemplatesCmp.html',
        directives: [wjNg2Grid.WjFlexGrid, wjNg2Grid.WjFlexGridColumn, wjNg2Grid.WjFlexGridCellTemplate, CORE_DIRECTIVES,
        wjNg2Input.WjInputNumber],
})
export class GridTemplatesCmp extends GridBaseCmp {

    constructor( @Inject(DataSvc) dataSvc: DataSvc) {
        super(dataSvc);

    }
}


