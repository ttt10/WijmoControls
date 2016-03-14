'use strict';

import { Component, Inject } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { InputBaseCmp } from './InputBaseCmp';
import { DataSvc } from '../../services/DataSvc';
import { wjNg2Input } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';
import { FrmCreateAccountCmp } from '../includes/FrmCreateAccountCmp';
import { FrmEditAccountCmp } from '../includes/FrmEditAccountCmp';
import { FrmLogInCmp } from '../includes/FrmLogInCmp';

@Component({
    selector: 'popup-cmp',
    templateUrl: 'src/components/input/popupCmp.html',
    directives: [wjNg2Input.WjPopup, CORE_DIRECTIVES, FORM_DIRECTIVES,
        FrmCreateAccountCmp, FrmEditAccountCmp, FrmLogInCmp],
})
export class PopupCmp extends InputBaseCmp {
    modal = true;

    constructor( @Inject(DataSvc) dataSvc: DataSvc) {
        super(dataSvc);
    }

    showDialog(dlg: wijmo.input.Popup) {
        if (dlg) {
            var inputs = <NodeListOf<HTMLInputElement>>dlg.hostElement.querySelectorAll('input');
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].type != 'checkbox') {
                    inputs[i].value = '';
                }
            }
            dlg.modal = this.modal;
            dlg.hideTrigger = dlg.modal ? wijmo.input.PopupTrigger.None : wijmo.input.PopupTrigger.Blur;
            dlg.show();
        }
    };

}


