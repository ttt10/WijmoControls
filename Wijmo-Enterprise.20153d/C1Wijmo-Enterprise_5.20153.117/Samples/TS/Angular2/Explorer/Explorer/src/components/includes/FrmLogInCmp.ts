﻿'use strict';

import { Component, Inject, Optional, Output, EventEmitter } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { FrmBaseCmp } from './FrmBaseCmp';
import { wjNg2Input } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

@Component({
    selector: 'frm-log-in-cmp',
    templateUrl: 'src/components/includes/frmLogInCmp.html',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
})
export class FrmLogInCmp extends FrmBaseCmp {
    @Output() createAccount = new EventEmitter();

    constructor( @Inject(wijmo.input.Popup) @Optional() private popup: wijmo.input.Popup) {
        super();
    }

    hide(message: string) {
        if (this.popup) {
            this.popup.hide();
        }
        if (message) {
            alert(message);
        }
    }

    onCreateAccount() {
        this.createAccount.next(null);
    }

}


