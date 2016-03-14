'use strict';

import {Component, View, EventEmitter, Inject, Input, Output} from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

// Base class for all form components.
@Component({
    selector: '',
    templateUrl: ''
})
export abstract class FrmBaseCmp {
    @Output() submit = new EventEmitter();

    // Triggers the 'submit' event and shows the specified message.
    onSubmit(message: string) {
        this.submit.next(null);
        if (message) {
            alert(message);
        }
    }
}


