'use strict';

import { Component, View, EventEmitter, Inject } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { GridBaseCmp } from './GridBaseCmp';
import { DataSvc } from '../../services/DataSvc';
import { wjNg2Input, wjNg2Grid } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';
import { CellRangePipe } from '../../pipes/appPipes';

// FlexGrid Introduction sample component.
@Component({
    selector: 'test1-cmp'
})
@View({
        templateUrl: 'src/components/grid/test1Cmp.html',
        directives: [wjNg2Grid.WjFlexGrid, wjNg2Grid.WjFlexGridColumn, wjNg2Input.WjCollectionViewNavigator,
            wjNg2Input.WjMenu, wjNg2Input.WjMenuItem, wjNg2Input.WjMenuSeparator, CORE_DIRECTIVES, FORM_DIRECTIVES],
        pipes: [CellRangePipe]
})
export class Test1Cmp {

    constructor() {

    }
}


