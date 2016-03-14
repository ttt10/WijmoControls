import {Component, View, EventEmitter } from 'angular2/core';
import { ElementRef, ViewContainerRef, TemplateRef, Directive } from 'angular2/core';
import { Input, Output, Injectable, Inject, OnInit, Optional, Query, ContentChildren, QueryList, ViewChild, ViewChildren,
Injector, AppViewManager, forwardRef, resolveForwardRef, Renderer } from 'angular2/core';
import * as ngCore from 'angular2/core';
import { wjNg2Base, WjComponent, WjDirectiveBehavior } from './wijmo.angular2.directiveBase';


export module wj.angular2 {


    // FlexGrid
    @WjComponent({
        selector: 'wj-flex-grid',
    })
    @View({
            //template: `<ng-content select="wj2-flex-grid-column"></ng-content>
            // we need a div here to supply instantiated templates with a root in shadow DOM
            template: `<div><ng-content></ng-content></div>`,
    })
    export class WjFlexGrid extends wijmo.grid.FlexGrid {
        constructor( @Inject(ElementRef) elRef: ElementRef, @Inject(Injector) injector: Injector) {
            super(WjDirectiveBehavior.getHostElement(this, elRef));
            new DirectiveCellFactory(this);
            WjDirectiveBehavior.attach(this, elRef, injector);
        }
    }

    // Column
    @WjComponent({
        selector: 'wj-flex-grid-column',
        wjParentDirectives: [WjFlexGrid]
    })
    @View({
            // we need a div here to supply instantiated templates with a root in shadow DOM
            template: `<div><ng-content></ng-content></div>`,
    })
    export class WjFlexGridColumn extends wijmo.grid.Column {
        constructor( @Inject(ElementRef) elRef: ElementRef,
            @Inject(Injector) injector: Injector,
            @Inject(WjFlexGrid) gridCmp: WjFlexGrid,
            @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef,
            @Inject(TemplateRef) @Optional() templateRef: TemplateRef) {
            super();

            if (gridCmp.autoGenerateColumns) {
                gridCmp.autoGenerateColumns = false;
                gridCmp.columns.clear();
            }

            WjDirectiveBehavior.attach(this, elRef, injector);
        }

    }

    /**
    * Defines the type of cell to which to apply the template. This value is specified in the <b>cell-type</b> attribute 
    * of the @see:WjFlexGridCellTemplate directive.
    */
    export enum CellTemplateType {
        /** Defines a regular (data) cell. */
        Cell,
        /** Defines a cell in edit mode. */
        CellEdit,
        /** Defines a column header cell. */
        ColumnHeader,
        /** Defines a row header cell. */
        RowHeader,
        /** Defines a row header cell in edit mode. */
        RowHeaderEdit,
        /** Defines a top left cell. */
        TopLeft,
        /** Defines a group header cell in a group row. */
        GroupHeader,
        /** Defines a regular cell in a group row. */
        Group,
        /** Defines a cell in a new row template. */
        NewCellTemplate
    }


    @Directive({
        selector: '[wjFlexGridCellTemplate]',
        inputs: ['wjFlexGridCellTemplate', 'cellTypeStr: cellType', 'cellOverflow']
    })
    export class WjFlexGridCellTemplate implements ngCore.OnInit, ngCore.OnDestroy {
        wjFlexGridCellTemplate: any;
        cellTypeStr: string;
        cellOverflow: string;
        cellType: CellTemplateType;
        // column or grid
        ownerControl: any;

        constructor( @Inject(ViewContainerRef) public viewContainerRef: ViewContainerRef,
            @Inject(TemplateRef) @Optional() public templateRef: TemplateRef,
            @Inject(ElementRef) public elRef: ElementRef,
            @Inject(Renderer) private domRenderer: Renderer,
            @Inject(WjFlexGrid) private grid: WjFlexGrid,
            @Inject(WjFlexGridColumn) @Optional() private column: WjFlexGridColumn) {

        }

        // returns the name of the property on control instance that stores info for the specified cell template type.
        static _getTemplContextProp(templateType: CellTemplateType) {
            return '$__cellTempl' + CellTemplateType[templateType];
        }

        ngOnInit() {
            this.ownerControl = this.column && this.column.grid === this.grid ? this.column : this.grid;
            this._attachToControl();
        }

        ngOnDestroy() {
            if (this.cellTypeStr) {
                this.viewContainerRef.clear();
                this.ownerControl[WjFlexGridCellTemplate._getTemplContextProp(this.cellType)] = null;
                this.grid.invalidate();
            }
        }

        public _instantiateTemplate(parent: HTMLElement): { viewRef: ngCore.EmbeddedViewRef, rootElement: Element } {
            return WjDirectiveBehavior.instantiateTemplate(parent, this.viewContainerRef, this.templateRef,
                this.domRenderer);
        }


        private _attachToControl(): void {
            if (!this.cellTypeStr) {
                return;
            }

            this.cellType = <CellTemplateType>wijmo.asEnum(<any>this.cellTypeStr, CellTemplateType);
            this.ownerControl[WjFlexGridCellTemplate._getTemplContextProp(this.cellType)] = this;
            this.grid.invalidate();
        }

    }

    interface _ICellTemplateCache {
        column?: wijmo.grid.Column;
        viewRef: ngCore.EmbeddedViewRef;
        rootElement: Element;
    }


    class DirectiveCellFactory extends wijmo.grid.CellFactory {
        // Array of string members of the CellTemplateType enum.
        private static _templateTypes: string[];

        public grid: wijmo.grid.FlexGrid;

        //private _baseCfGet: () => wijmo.grid.CellFactory;
        private _baseCf: wijmo.grid.CellFactory;

        private _closingApplyTimeOut;
        private _lastApplyTimeStamp = 0;
        private _noApplyLag = false;
        private _editChar;
        private _startingEditing = false;
        private _evtInput: any;
        private _evtBlur: any;

        constructor(grid: wijmo.grid.FlexGrid) {
            super();
            this.grid = grid;

            // init _templateTypes
            if (!DirectiveCellFactory._templateTypes) {
                DirectiveCellFactory._templateTypes = [];
                for (var templateType in CellTemplateType) {
                    if (isNaN(templateType)) {
                        DirectiveCellFactory._templateTypes.push(templateType);
                    }
                }
            }

            var self = this;
            this._baseCf = grid.cellFactory;
            grid.cellFactory = this;

            // initialize input event dispatcher
            this._evtInput = document.createEvent('HTMLEvents');
            this._evtInput.initEvent('input', true, false);
            // initialize blur event dispatcher
            this._evtBlur = document.createEvent('HTMLEvents');
            this._evtBlur.initEvent('blur', false, false);

            // no $apply() lag while editing
            grid.prepareCellForEdit.addHandler(function (s, e) {
                self._noApplyLag = true;
            });
            grid.cellEditEnded.addHandler(function (s, e) {
                setTimeout(function () {
                    self._noApplyLag = false;
                }, 300);
            });
            grid.beginningEdit.addHandler(function (s, e) {
                self._startingEditing = true;
            });

            grid.hostElement.addEventListener('keydown', function (e) {
                self._startingEditing = false;
            }, true);

            grid.hostElement.addEventListener('keypress', function (e) {
                var char = e.charCode > 32 ? String.fromCharCode(e.charCode) : null;
                if (char) {
                    // Grid's _KeyboardHandler may receive 'keypress' before or after this handler (observed at least in IE,
                    // not clear why this happens). So both grid.activeEditor and _startingEditing (the latter is initialized in
                    // beginningEdit and cleared in 'keydown') participate in detecting whether this char has initialized a cell
                    // editing.
                    if (!grid.activeEditor || self._startingEditing) {
                        self._editChar = char;
                    } else if (self._editChar) {
                        self._editChar += char;
                    }
                }
            }, true);
        }

        public updateCell(panel: wijmo.grid.GridPanel, rowIndex: number, colIndex: number, cell: HTMLElement, rng?: wijmo.grid.CellRange) {

            // restore overflow for any cell
            if (cell.style.overflow) {
                cell.style.overflow = '';
            }

            var self = this,
                grid = <wijmo.grid.FlexGrid>panel.grid,
                editRange = grid.editRange,
                templateType: CellTemplateType,
                row = <wijmo.grid.Row>panel.rows[rowIndex],
                dataItem = row.dataItem,
                isGridCtx = false,
                needCellValue = false,
                isEdit = false,
                isCvGroup = false;

            // determine template type
            switch (panel.cellType) {
                case wijmo.grid.CellType.Cell:
                    if (row instanceof wijmo.grid.GroupRow) {
                        isCvGroup = dataItem instanceof wijmo.collections.CollectionViewGroup;
                        var isHierNonGroup = !(isCvGroup || (<wijmo.grid.GroupRow>row).hasChildren);
                        if (colIndex == panel.columns.firstVisibleIndex) {
                            templateType = isHierNonGroup ? CellTemplateType.Cell : CellTemplateType.GroupHeader;
                        } else {
                            templateType = isHierNonGroup ? CellTemplateType.Cell : CellTemplateType.Group;
                            needCellValue = true;
                        }
                    } else if (row instanceof wijmo.grid._NewRowTemplate) {
                        templateType = CellTemplateType.NewCellTemplate;
                    } else if (editRange && editRange.row === rowIndex && editRange.col === colIndex) {
                        templateType = CellTemplateType.CellEdit;
                        needCellValue = isEdit = true;
                    } else if (!(wijmo.grid['detail'] && wijmo.grid['detail'].DetailRow &&
                        (row instanceof wijmo.grid['detail'].DetailRow))) {
                        templateType = CellTemplateType.Cell;
                    }
                    break;
                case wijmo.grid.CellType.ColumnHeader:
                    templateType = CellTemplateType.ColumnHeader;
                    break;
                case wijmo.grid.CellType.RowHeader:
                    templateType = grid.collectionView &&
                        (<wijmo.collections.IEditableCollectionView>grid.collectionView).currentEditItem === dataItem
                        ? CellTemplateType.RowHeaderEdit
                        : CellTemplateType.RowHeader;
                    isGridCtx = true;
                    break;
                case wijmo.grid.CellType.TopLeft:
                    templateType = CellTemplateType.TopLeft;
                    isGridCtx = true;
                    break;
            }

            var isUpdated = false;

            if (templateType != null) {

                var col = <wijmo.grid.Column>(isCvGroup && templateType == CellTemplateType.GroupHeader ?
                    grid.columns.getColumn(dataItem.groupDescription['propertyName']) :
                    (colIndex >= 0 && colIndex < panel.columns.length ? panel.columns[colIndex] : null));

                if (col) {
                    var templContextProp = WjFlexGridCellTemplate._getTemplContextProp(templateType),
                        templContext = <WjFlexGridCellTemplate>(isGridCtx ? <any>grid : <any>col)[templContextProp];

                    // maintain template inheritance
                    if (!templContext) {
                        if (templateType === CellTemplateType.RowHeaderEdit) {
                            templateType = CellTemplateType.RowHeader;
                            templContextProp = WjFlexGridCellTemplate._getTemplContextProp(templateType);
                            templContext = grid[templContextProp];
                        } else if (templateType === CellTemplateType.Group || templateType === CellTemplateType.GroupHeader) {
                            if (!isCvGroup) {
                                templateType = CellTemplateType.Cell;
                                templContextProp = WjFlexGridCellTemplate._getTemplContextProp(templateType);
                                templContext = col[templContextProp];
                            }
                        }
                    }

                    if (templContext) {
                        // apply directive template and style
                        var isTpl = true,
                            cellValue;
                        if (needCellValue) {
                            cellValue = panel.getCellData(rowIndex, colIndex, false);
                        }

                        // apply cell template
                        if (isTpl) {

                            isUpdated = true;
                            if (isEdit) {
                                this._baseCf.updateCell(panel, rowIndex, colIndex, cell, rng, true);
                            }

                            // if this is false then we can't reuse previously cached scope and linked tree.
                            var cellContext = <_ICellTemplateCache>(cell[templContextProp] || {}),
                                isForeignCell = cellContext.column !== col || !cellContext.viewRef;

                            if (isForeignCell) {
                                if (isEdit) {
                                    var rootEl = cell.firstElementChild;
                                    if (rootEl) {
                                        // set focus to cell, because hiding a focused element may move focus to a page body
                                        // that will force Grid to finish editing.
                                        cell.focus();
                                        (<HTMLElement>rootEl).style.display = 'none';
                                    }
                                } else {
                                    cell.textContent = '';
                                }

                                let templInstance = templContext._instantiateTemplate(cell);
                                cellContext.column = col;
                                cellContext.viewRef = templInstance.viewRef;
                                cellContext.rootElement = templInstance.rootElement;
                                cell[templContextProp] = cellContext;
                            }
                            this._setViewRefVars(cellContext.viewRef, row, col, dataItem, cellValue);

                            if (templContext.cellOverflow) {
                                cell.style.overflow = templContext.cellOverflow;
                            }


                            // increase row height if cell doesn't fit in the current row height.
                            setTimeout(function () {
                                var cellHeight = cell.scrollHeight,
                                    panelRows = panel.rows;
                                if (rowIndex < panelRows.length && panelRows[rowIndex].renderHeight < cellHeight) {
                                    panelRows.defaultSize = cellHeight;
                                    if (isEdit) {
                                        grid.refresh();
                                        //grid.refreshCells(false, true, false);
                                        grid.startEditing();
                                        return;
                                    }
                                } else if (isEdit && !wijmo.contains(cellContext.rootElement, document.activeElement)) {
                                    // Find first visible input element and focus it. Make it only if editing
                                    // was not interrupted by row height change performed above, because it may finally
                                    // results in calling setSelectionRange on detached input, which causes crash in IE.
                                    var inputs = cellContext.rootElement.querySelectorAll('input');
                                    if (inputs) {
                                        for (var i = 0; i < inputs.length; i++) {
                                            var input = <HTMLInputElement>inputs[i],
                                                inpSt = window.getComputedStyle(input);
                                            if (inpSt.display !== 'none' && inpSt.visibility === 'visible') {
                                                var inpFocusEh = function () {
                                                    input.removeEventListener('focus', inpFocusEh);
                                                    setTimeout(function () {
                                                        if (self._editChar) {
                                                            input.value = self._editChar;
                                                            self._editChar = null;
                                                            wijmo.setSelectionRange(input, input.value.length);
                                                            input.dispatchEvent(self._evtInput);
                                                        }
                                                    }, 0);
                                                };

                                                input.addEventListener('focus', inpFocusEh);
                                                input.focus();

                                                break;
                                            }
                                        }
                                    }
                                }
                            }, 0);

                            if (isEdit) {

                                var editEndingEH = function (s, e) {
                                    grid.cellEditEnding.removeHandler(editEndingEH);
                                    // Move focus out of the current input element, in order to let it to save
                                    // its value (necessary for controls like InputDate that can't update value immediately
                                    // as user typing).
                                    // We do it via event emulation, instead of moving focus to another element,
                                    // because in IE an element doesn't fit in time to receive the 'blur' event.
                                    if (document.activeElement) {
                                        document.activeElement.dispatchEvent(self._evtBlur);
                                    }
                                    // We need to move focus nevertheless, because without this grid may lose focus at all in IE.
                                    cell.focus();
                                    if (!e.cancel) {
                                        e.cancel = true;
                                        //TBD: how to retrieve variable value from viewRef?
                                        //panel.grid.setCellData(rowIndex, colIndex, cellContext.viewRef.);
                                    }

                                    // close all open dropdowns 
                                    var dropDowns = cell.querySelectorAll('.wj-dropdown');
                                    [].forEach.call(dropDowns, function (el) {
                                        var ctrl = wijmo.Control.getControl(el);
                                        if (ctrl && ctrl instanceof wijmo.input.DropDown) {
                                            (<wijmo.input.DropDown>ctrl).isDroppedDown = false;
                                        }
                                    });
                                };

                                // subscribe the handler to the cellEditEnding event
                                grid.cellEditEnding.addHandler(editEndingEH);
                            } else {
                                this._baseCf.updateCell(panel, rowIndex, colIndex, cell, rng, false);
                            }

                        }
                    }
                }
            }

            if (!isUpdated) {
                this._baseCf.updateCell(panel, rowIndex, colIndex, cell, rng);
            }

        }

        disposeCell(cell: HTMLElement) {
            var ttm = DirectiveCellFactory._templateTypes;
            for (var i = 0; i < ttm.length; i++) {
                var templContextProp = WjFlexGridCellTemplate._getTemplContextProp(CellTemplateType[ttm[i]]),
                    cellContext = <_ICellTemplateCache>(cell[templContextProp]);
                if (cellContext && cellContext.viewRef) {
                    let templateOwner = cellContext.column || this.grid,
                        templateContext = <WjFlexGridCellTemplate>templateOwner[templContextProp];
                    if (templateContext) {
                        let viewIdx = templateContext.viewContainerRef.indexOf(cellContext.viewRef);
                        if (viewIdx > -1) {
                            templateContext.viewContainerRef.remove(viewIdx);
                        }
                    }
                    cellContext.viewRef = null;
                    cellContext.rootElement = null;
                    cell[templContextProp] = null;
                }
            }
        }

        private _setViewRefVars(viewRef: ngCore.EmbeddedViewRef, row: wijmo.grid.Row, col: wijmo.grid.Column, dataItem, cellValue) {
            viewRef.setLocal('row', row);
            viewRef.setLocal('col', col);
            viewRef.setLocal('item', dataItem);
            viewRef.setLocal('value', cellValue);
        }

    }







}

export var wjNg2Grid = wj.angular2;
