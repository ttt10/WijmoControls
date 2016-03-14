import { Component, View, EventEmitter } from 'angular2/core';
import { ElementRef, Injector, Directive, ViewContainerRef, TemplateRef, Optional, forwardRef, Renderer, AppViewManager } from 'angular2/core';
import { Input, Output, Injectable, Inject, OnInit } from 'angular2/core';
import { ChangeDetectionStrategy, Type, ViewEncapsulation, ComponentMetadata, ComponentFactory, TypeDecorator } from 'angular2/core';
import * as ngCore from 'angular2/core';
import { wj as wjNg2BaseRoot, WjComponent, WjDirectiveBehavior } from './wijmo.angular2.directiveBase';
//import { wjNg2Meta } from './wijmo.angular2.MetaFactory';
var wjNg2Base = wjNg2BaseRoot.angular2;

export module wj.angular2 {
    'use strict';

    // WjComboBox
    @WjComponent({
        selector: 'wj-combo-box',
    })
    @View({
        template: ``,
    })
    export class WjComboBox extends wijmo.input.ComboBox {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjAutoComplete
    @WjComponent({
        selector: 'wj-auto-complete',
    })
    @View({
        template: ``,
    })
    export class WjAutoComplete extends wijmo.input.AutoComplete {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjCalendar
    @WjComponent({
        selector: 'wj-calendar',
    })
    @View({
        template: ``,
    })
    export class WjCalendar extends wijmo.input.Calendar {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjColorPicker
    @WjComponent({
        selector: 'wj-color-picker',
    })
    @View({
        template: ``,
    })
    export class WjColorPicker extends wijmo.input.ColorPicker {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjInputMask
    @WjComponent({
        selector: 'wj-input-mask',
    })
    @View({
        template: ``,
    })
    export class WjInputMask extends wijmo.input.InputMask {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjInputColor
    @WjComponent({
        selector: 'wj-input-color',
    })
    @View({
        template: ``,
    })
    export class WjInputColor extends wijmo.input.InputColor {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjMultiSelect
    @WjComponent({
        selector: 'wj-multi-select',
    })
    @View({
        template: ``,
    })
    export class WjMultiSelect extends wijmo.input.MultiSelect {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }


   
    // InputNumber
    @WjComponent({
        selector: 'wj-input-number', 
    })
    @View({
        template: ``,
    })
    // Component controller
    export class WjInputNumber extends wijmo.input.InputNumber {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));

            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }


    // InputDate
    @WjComponent({
        selector: 'wj-input-date',
    })
    @View({
        template: ``,
    })
    export class WjInputDate extends wijmo.input.InputDate {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // InputTime
    @WjComponent({
        selector: 'wj-input-time',
    })
    @View({
        template: ``,
    })
    // Component controller
    export class WjInputTime extends wijmo.input.InputTime {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));

            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // ListBox
    @WjComponent({
        selector: 'wj-list-box',
    })
    @View({
            // we need a div here to supply instantiated templates with a root in shadow DOM
            template: `<div><ng-content></ng-content></div>`,
    })
    export class WjListBox extends wijmo.input.ListBox {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // Menu
    @WjComponent({
        selector: 'wj-menu',
        changeDetection: ChangeDetectionStrategy.OnPush
    })
    @View({
        // we need a div here to supply instantiated templates with a root in shadow DOM
            template: `<div><ng-content></ng-content></div>`,
            directives: [forwardRef(() => WjMenuItem)]
    })
    export class WjMenu extends wijmo.input.Menu implements ngCore.OnInit, ngCore.OnDestroy, ngCore.OnChanges,
            ngCore.AfterContentInit {
        private _value: any;
        private _definedHeader;
        private _appRef: ngCore.ApplicationRef;
        private _cdRef: ngCore.ChangeDetectorRef;

        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector,
            @Inject(ngCore.ApplicationRef) appRef: ngCore.ApplicationRef,
            @Inject(ngCore.ChangeDetectorRef) cdRef: ngCore.ChangeDetectorRef) {
            this._appRef = appRef;
            this._cdRef = cdRef;
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);

            this.itemsSource = new wijmo.collections.ObservableArray();
            this.selectedIndex = 0;
            this.itemClicked.addHandler(() => {
                this.value = this.selectedValue;
            });
        }

        get value(): any {
            return this._value;
        }
        set value(value: any) {
            //if (this._value != value) {
                this._value = value;
                if (value != null) {
                    this.selectedValue = value;
                    this._updateHeader();
                }
                //this._cdRef.markForCheck();
                //this._appRef.tick();
            //}
        }

        ngOnInit() {
            this._attachToControl();
            this._updateHeader();
        }

        ngOnDestroy() {
            this.listBox.formatItem.removeHandler(this._fmtItem, this);
            this.listBox.loadingItems.removeHandler(this._loadingItems, this);
        }

        ngOnChanges(changes: { [key: string]: ngCore.SimpleChange }) {
            var headerChange = changes['header'];
            if (headerChange) {
                this._definedHeader = headerChange.currentValue;
                this._updateHeader();
            }
        }

        ngAfterContentInit() {
            // to force correct selectedValue and header update
            this.value = this.value;
            //this._updateHeader();
        }

        refresh(fullUpdate = true) {
            super.refresh(fullUpdate);
            this._updateHeader();
        }

        private _attachToControl(): void {
            this.listBox.formatItem.addHandler(this._fmtItem, this);
            this.listBox.loadingItems.addHandler(this._loadingItems, this);

            //if (this.parent._isInitialized) {
            //    ownerControl.invalidate();
            this.invalidate();
        }

        private _loadingItems(s: wijmo.Control) {
            //TBD: will this destroy Wijmo directives in templates?
            //this.viewContainerRef.clear();
        }

        private _fmtItem(s: wijmo.Control, e: wijmo.input.FormatItemEventArgs) {
            if (!(e.data instanceof WjMenuItem)) {
                return;
            }
            var itemEl = e.item;
            itemEl.textContent = '';
            var contentRoot = (<WjMenuItem>e.data).contentRoot;
            if (contentRoot) {
                itemEl.appendChild(contentRoot);
            }
            //var viewRef = this._instantiateTemplate(itemEl);
            ////itemEl[WjItemTemplate._itemScopeProp] = itemScope;
            //viewRef.setLocal('control', s);
            //viewRef.setLocal('item', e.data);
            //viewRef.setLocal('itemIndex', e.index);
        }

        // if the scope has a value, show it in the header
        private _updateHeader() {
            this.header = this._definedHeader || '';
            var selItem = this.selectedItem;
            if (this.value != null && selItem && this.displayMemberPath) {
                let currentValue = null;
                if (selItem instanceof WjMenuItem) {
                    let contentRoot = (<WjMenuItem>selItem).contentRoot;
                    if (contentRoot) {
                        currentValue = contentRoot.innerHTML;
                    } else {
                        currentValue = selItem[this.displayMemberPath];
                    }
                }
                if (currentValue != null) {
                    this.header += ': <b>' + currentValue + '</b>';
                }
            }
        }

    }

    @WjComponent({
        //wjIsDirective: true,
        wjMetadataId: 'MenuItem',
        wjParentDirectives: [WjMenu],
        wjSiblingDirectiveId: 'menuItemDir',
        selector: 'wj-menu-item',
        //inputs: ['wjMenuItem']
    })
    @View({
            //template: '<div><ng-content></ng-content></div>',
            template: `<template [wjMenuItemTemplateDir]><ng-content></ng-content></template>`,
            directives: [forwardRef(() => WjMenuItemTemplateDir)]
    })
    export class WjMenuItem implements ngCore.OnInit, ngCore.AfterContentInit {
        value: string;
        cmd: string;
        cmdParam: string;
        header: string;
        _ownerMenu: wijmo.input.Menu;
        templateDir: WjMenuItemTemplateDir;
        contentRoot: HTMLElement;

        constructor(
            //@Inject(ViewContainerRef) public viewContainerRef: ViewContainerRef,
            //@Inject(TemplateRef) @Optional() public templateRef: TemplateRef,
            @Inject(ElementRef) public elRef: ElementRef,
            @Inject(Injector) injector: Injector,
            @Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
            @Inject(AppViewManager) private appViewManager: AppViewManager,
            @Inject(Renderer) private domRenderer: Renderer) {

            var behavior = WjDirectiveBehavior.attach(this, elRef, injector);
            this._ownerMenu = <wijmo.input.Menu>behavior.parentBehavior.directive;
        }

        // patch, don't remove
        ngOnInit() {
        }

        wjAfterParentInit() {
            var ownerMenu = this._ownerMenu;
            if (ownerMenu.itemsSource.length == 1 && ownerMenu.selectedIndex < 0) {
                ownerMenu.selectedIndex = 0;
            }
            if (!ownerMenu.displayMemberPath) {
                ownerMenu.displayMemberPath = 'header';
            }
            if (!ownerMenu.selectedValuePath) {
                ownerMenu.selectedValuePath = 'value';
            }
            if (!ownerMenu.commandPath) {
                ownerMenu.commandPath = 'cmd';
            }
            if (!ownerMenu.commandParameterPath) {
                ownerMenu.commandParameterPath = 'cmdParam';
            }

            //ownerMenu.invalidate();
        }

        ngAfterContentInit() {
        }
    }

    @WjComponent({
        //wjIsDirective: true,
        wjMetadataId: 'MenuSeparator',
        wjParentDirectives: [WjMenu],
        wjSiblingDirectiveId: 'menuItemDir',
        selector: 'wj-menu-separator',
    })
    @View({
            //template: `<div><div class="wj-state-disabled" style="width:100%;height:1px;background-color:lightgray"></div></div>`,
            template: `<template [wjMenuItemTemplateDir]><div class="wj-state-disabled" style="width:100%;height:1px;background-color:lightgray"></div></template>`,
            directives: [forwardRef(() => WjMenuItemTemplateDir)]

    })
    export class WjMenuSeparator extends WjMenuItem implements ngCore.OnInit {

        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector,
            @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
            @Inject(AppViewManager) appViewManager: AppViewManager,
            @Inject(Renderer) domRenderer: Renderer) {

            super(elRef, injector, viewContainerRef, appViewManager, domRenderer);
        }

        // patch, don't remove
        ngOnInit() {
        }
    }

    @Directive({
        selector: '[wjMenuItemTemplateDir]',
        inputs: ['wjMenuItemTemplateDir']
    })
    export class WjMenuItemTemplateDir implements ngCore.OnInit, ngCore.AfterContentInit {
        wjMenuItemTemplateDir: any;
        ownerItem: WjMenuItem;
        contentRoot: HTMLElement;

        constructor( @Inject(ViewContainerRef) public viewContainerRef: ViewContainerRef,
            @Inject(TemplateRef) @Optional() public templateRef: TemplateRef,
            @Inject(ElementRef) public elRef: ElementRef,
            @Inject(Injector) injector: Injector,
            @Inject(Renderer) private domRenderer: Renderer,
            @Inject(WjMenuItem) @Optional() menuItem: WjMenuItem,
            @Inject(WjMenuSeparator) @Optional() menuSeparator: WjMenuSeparator) {

            this.ownerItem = menuItem || menuSeparator;
            this.ownerItem.templateDir = this;
        }

        ngOnInit() {
        }

        ngAfterContentInit() {
            var self = this;
            //Without timeout, we get "LifeCycle.tick is called recursively" exception.
            setTimeout(() => {
                var rootEl = WjDirectiveBehavior.instantiateTemplate(null, self.viewContainerRef, self.templateRef,
                    self.domRenderer).rootElement;
                self.contentRoot = <HTMLElement>rootEl;
                self.ownerItem.contentRoot = <HTMLElement>rootEl;
                self.ownerItem._ownerMenu.listBox.invalidate();
                self.ownerItem._ownerMenu.invalidate();
            }, 0);
        }
    }


    //@Directive({
    @WjComponent({
        wjIsDirective: true,
        wjMetadataId: 'ItemTemplate',
        wjParentDirectives: [WjListBox, WjMenu],
        selector: '[wjItemTemplate]',
        inputs: ['wjItemTemplate']
    })
    export class WjItemTemplate implements ngCore.OnInit, ngCore.OnDestroy {
        wjItemTemplate: any;
        ownerControl: wijmo.Control;
        listBox: wijmo.input.ListBox;

        constructor( @Inject(ViewContainerRef) public viewContainerRef: ViewContainerRef,
            @Inject(TemplateRef) @Optional() public templateRef: TemplateRef,
            @Inject(ElementRef) public elRef: ElementRef,
            @Inject(Injector) injector: Injector,
            @Inject(Renderer) private domRenderer: Renderer) {

            var behavior = WjDirectiveBehavior.attach(this, elRef, injector);
            this.ownerControl = <wijmo.Control>behavior.parentBehavior.directive;
            this.listBox = WjItemTemplate._getListBox(this.ownerControl);

        }

        ngOnInit() {
            this._attachToControl();
        }

        ngOnDestroy() {
            var ownerControl = this.ownerControl,
                listBox = this.listBox;
            if (listBox) {
                listBox.formatItem.removeHandler(this._fmtItem, this);
                listBox.loadingItems.removeHandler(this._loadingItems, this);
            }
            if (ownerControl) {
                ownerControl.invalidate();
            }
        }

        private _attachToControl(): void {
            this.listBox.formatItem.addHandler(this._fmtItem, this);
            this.listBox.loadingItems.addHandler(this._loadingItems, this);

            //if (this.parent._isInitialized) {
            //    ownerControl.invalidate();
            this.ownerControl.invalidate();
        }

        private _loadingItems(s: wijmo.Control) {
            //TBD: will this destroy Wijmo directives in templates?
            this.viewContainerRef.clear();
        }

        private _fmtItem(s: wijmo.Control, e: wijmo.input.FormatItemEventArgs) {
            var itemEl = e.item;
            itemEl.textContent = '';
            var viewRef = this._instantiateTemplate(itemEl);
            viewRef.setLocal('control', s);
            viewRef.setLocal('item', e.data);
            viewRef.setLocal('itemIndex', e.index);
        }

        private _instantiateTemplate(parent: HTMLElement): ngCore.EmbeddedViewRef {
            return WjDirectiveBehavior.instantiateTemplate(parent, this.viewContainerRef, this.templateRef,
                this.domRenderer).viewRef;
        }

        // Gets a ListBox control whose items are templated, it maybe the control itself or internal ListBox used by controls like
        // ComboBox.
        private static _getListBox(ownerControl: any): wijmo.input.ListBox {
            if (ownerControl) {
                return ownerControl instanceof wijmo.input.ListBox ? ownerControl : ownerControl.listBox;
            }
            return null;
        }
    }

    //function wjPopupInit() {
    //    var metaData = wjNg2Meta.MetaFactory.getMetaData(wijmo.input.Popup);
    //    wjNg2Meta.MetaFactory.findProp('owner', metaData.props).propertyType = wijmo.interop.PropertyType.Any;
    //}

    // WjPopup
    @WjComponent({
        selector: 'wj-popup',
        //wjInit: wjPopupInit
    })
    @View({
            template: `<div><ng-content></ng-content></div>`,
    })
    export class WjPopup extends wijmo.input.Popup implements ngCore.OnChanges {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            WjDirectiveBehavior.attach(this, elRef, injector);
        }

        ngOnChanges(changes: { [key: string]: ngCore.SimpleChange }) {
            var ownerChange = changes['owner'];
            if (ownerChange) {
                if (this.modal == null) {
                    this.modal = this.owner ? false : true;
                }
            }
        }
    }

    // WjContextMenu
    @Directive({
        selector: '[wjContextMenu]',
        inputs: ['wjContextMenu'],
        host: { '(contextmenu)': 'onContextMenu($event)' }
    })
    export class WjContextMenu {
        wjContextMenu: wijmo.input.Menu;

        constructor( @Inject(ElementRef) private elRef: ElementRef) {
        }

        onContextMenu(e: MouseEvent) {
            var menu = this.wjContextMenu,
                dropDown = menu.dropDown;
            if (menu && dropDown && !wijmo.closest(e.target, '[disabled]')) {
                e.preventDefault();
                menu.owner = this.elRef.nativeElement;
                menu.selectedIndex = -1;
                if (menu.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                    wijmo.showPopup(dropDown, e);
                    menu.onIsDroppedDownChanged();
                    dropDown.focus();
                }
            }
        }
    }

    // WjCollectionViewNavigator
    @WjComponent({
        wjMetadataId: 'CollectionViewNavigator',
        selector: 'wj-collection-view-navigator',
    })
    @View({
            template: `
            <div class="wj-control wj-content wj-pager">
                <div class="wj-input-group">
                    <span class="wj-input-group-btn" >
                        <button class="wj-btn wj-btn-default" type="button"
                           (click)="cv?.moveCurrentToFirst()"
                           [disabled]="!cv || cv?.currentPosition <= 0">
                            <span class="wj-glyph-left" style="margin-right: -4px;"></span>
                            <span class="wj-glyph-left"></span>
                         </button>
                    </span>
                    <span class="wj-input-group-btn" >
                       <button class="wj-btn wj-btn-default" type="button"
                           (click)="cv?.moveCurrentToPrevious()"
                           [disabled]="!cv || cv?.currentPosition <= 0">
                            <span class="wj-glyph-left"></span>
                       </button>
                    </span>
                    <input type="text" class="wj-form-control" value="
                       {{cv?.currentPosition + 1 | number}} / {{cv?.itemCount | number}}
                       " disabled />
                    <span class="wj-input-group-btn" >
                        <button class="wj-btn wj-btn-default" type="button"
                           (click)="cv?.moveCurrentToNext()"
                           [disabled]="!cv || cv?.currentPosition >= cv?.itemCount - 1">
                            <span class="wj-glyph-right"></span>
                        </button>
                    </span>
                    <span class="wj-input-group-btn" >
                        <button class="wj-btn wj-btn-default" type="button"
                           (click)="cv?.moveCurrentToLast()"
                           [disabled]="!cv || cv?.currentPosition >= cv?.itemCount - 1">
                            <span class="wj-glyph-right"></span>
                            <span class="wj-glyph-right" style="margin-left: -4px;"></span>
                        </button>
                    </span>
                </div>
            </div>
`,
    })
    export class WjCollectionViewNavigator {
        cv: wijmo.collections.CollectionView;

        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // WjCollectionViewPager
    @WjComponent({
        wjMetadataId: 'CollectionViewPager',
        selector: 'wj-collection-view-pager',
    })
    @View({
        template: `
            <div class="wj-control wj-content wj-pager" >
                <div class="wj-input-group">
                    <span class="wj-input-group-btn" >
                        <button class="wj-btn wj-btn-default" type="button"
                            (click)="cv?.moveToFirstPage()"
                            [disabled]="!cv || cv?.pageIndex <= 0">
                            <span class="wj-glyph-left" style="margin-right: -4px;"></span>
                            <span class="wj-glyph-left"></span>
                        </button>
                    </span>
                    <span class="wj-input-group-btn" >
                    <button class="wj-btn wj-btn-default" type="button"
                            (click)="cv?.moveToPreviousPage()"
                            [disabled]="!cv || cv?.pageIndex <= 0">
                            <span class="wj-glyph-left"></span>
                        </button>
                    </span>
                    <input type="text" class="wj-form-control" value="
                        {{cv?.pageIndex + 1 | number}} / {{cv?.pageCount | number}}
                    " disabled />
                    <span class="wj-input-group-btn" >
                        <button class="wj-btn wj-btn-default" type="button"
                            (click)="cv?.moveToNextPage()"
                            [disabled]="!cv || cv?.pageIndex >= cv?.pageCount - 1">
                            <span class="wj-glyph-right"></span>
                        </button>
                    </span>
                    <span class="wj-input-group-btn" >
                        <button class="wj-btn wj-btn-default" type="button"
                            (click)="cv?.moveToLastPage()"
                            [disabled]="!cv || cv?.pageIndex >= cv?.pageCount - 1">
                            <span class="wj-glyph-right"></span>
                            <span class="wj-glyph-right" style="margin-left: -4px;"></span>
                        </button>
                    </span>
                </div>
            </div>
`,
    })
    export class WjCollectionViewPager {
        cv: wijmo.collections.CollectionView;

        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }


}

export var wjNg2Input = wj.angular2;
