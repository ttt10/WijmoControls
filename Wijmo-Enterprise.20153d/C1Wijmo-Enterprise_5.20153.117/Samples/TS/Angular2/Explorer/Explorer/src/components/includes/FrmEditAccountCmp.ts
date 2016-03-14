﻿'use strict';

import { Component, Inject } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { FrmBaseCmp } from './FrmBaseCmp';
import { wjNg2Input } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

@Component({
    selector: 'frm-edit-account-cmp',
    templateUrl: 'src/components/includes/frmEditAccountCmp.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
})
export class FrmEditAccountCmp extends FrmBaseCmp {
    constructor() {
        super();
    }
}


