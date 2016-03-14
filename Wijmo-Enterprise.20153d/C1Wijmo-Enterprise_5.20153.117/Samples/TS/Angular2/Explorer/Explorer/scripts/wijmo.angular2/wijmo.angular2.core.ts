import { Component, View, ElementRef, Injector, Optional, forwardRef, Inject, Input } from 'angular2/core';
import * as ngCore from 'angular2/core';
import { wj as wjNg2BaseRoot, WjComponent, WjDirectiveBehavior } from './wijmo.angular2.directiveBase';

export module wj.angular2 {
    'use strict';

    @WjComponent({
        wjIsDirective: true,
        wjMetadataId: wijmo.Tooltip,
        selector: '[wjTooltip]',
    })
    export class WjTooltip implements ngCore.OnDestroy {
        private static _toolTip: wijmo.Tooltip;

        private _toolTipText: string;

        constructor( @Inject(ElementRef) private elRef: ElementRef, @Inject(Injector) injector: Injector) {
            WjDirectiveBehavior.attach(this, elRef, injector);
            if (!WjTooltip._toolTip) {
                WjTooltip._toolTip = new wijmo.Tooltip();
            }
        }

        @Input()
        get wjTooltip(): string {
            return this._toolTipText;
        }
        set wjTooltip(value: string) {
            if (this._toolTipText != value) {
                this._toolTipText != value;
                WjTooltip._toolTip.setTooltip(this.elRef.nativeElement, value);
            }
        }

        ngOnDestroy() {
            this.wjTooltip = null;
        }
    }
}

export var wjNg2Core = wj.angular2;
