var wijmo;
(function (wijmo) {
    // prevent double loading
    //if (wijmo && wijmo.interop) {
    //    return;
    //}
    var interop;
    (function (interop) {
        /*
        Represents a shared metadata (control properties/events descriptions) storage used by interop services like
        Angular directives and Knockout custom bindings.
        Control metadata is retrieved using the getMetaData method by passing the control's metaDataId (see the
        method description for details).
        Descriptor objects are created using the CreateProp, CreateEvent and CreateComplexProp static methods.
        The specific interop service should create a class derived from ControlMetaFactory and override these methods to
        create descriptors of the platform specific types (see the wijmo.angular.MetaFactory class as an example).
        To initialize platform specific properties of the descriptors an interop services can use the findProp, findEvent and
        findComplexProp methods to find a necessary descriptor object by name.
        */
        var ControlMetaFactory = (function () {
            function ControlMetaFactory() {
            }
            // Creates a property descriptor object. A specific interop service should override this method in the derived
            // metadata factory class to create platrorm specific descriptor object.
            ControlMetaFactory.CreateProp = function (propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority) {
                return new PropDescBase(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);
            };
            // Creates an event descriptor object. A specific interop service should override this method in the derived
            // metadata factory class to create platrorm specific descriptor object.
            ControlMetaFactory.CreateEvent = function (eventName, isPropChanged) {
                return new EventDescBase(eventName, isPropChanged);
            };
            // Creates a complex property descriptor object. A specific interop service should override this method in the derived
            // metadata factory class to create platrorm specific descriptor object.
            ControlMetaFactory.CreateComplexProp = function (propertyName, isArray, ownsObject) {
                return new ComplexPropDescBase(propertyName, isArray, ownsObject);
            };
            // Finds a property descriptor by the property name in the specified array.
            ControlMetaFactory.findProp = function (propName, props) {
                return this.findInArr(props, 'propertyName', propName);
            };
            // Finds an event descriptor by the event name in the specified array.
            ControlMetaFactory.findEvent = function (eventName, events) {
                return this.findInArr(events, 'eventName', eventName);
            };
            // Finds a complex property descriptor by the property name in the specified array.
            ControlMetaFactory.findComplexProp = function (propName, props) {
                return this.findInArr(props, 'propertyName', propName);
            };
            /*
            Returns metadata for the control by its metadata ID.In the most cases the control type (constructor function)
            is used as metadata ID. In cases where this is not applicable an arbitrary object can be used as an ID, e.g.
            'MenuItem' string is used as the ID for Menu Item.

            The sets of descriptors returned for the specific metadata ID take into account the controls inheritance chain
            and include metadata defined for the control's base classes.
            In case of a control that has no a base class metadata you create its metadata object with a constructor:
            return new MetaDataBase(... descriptor arrays ...);

            If the control has the base control metadata then you create its metadata object by a recursive call to
            the getMetaData method with the base control's metadata ID passed, and add the controls own metadata to
            the returned object using the 'add' method. E.g. for the ComboBox derived from the DropDown this looks like:
            return this.getMetaData(wijmo.input.DropDown).add(... descriptor arrays ...);

            The specific platforms provide the following implementations of the metadata ID support:
            Angular
            =======
            The WjDirective._getMetaDataId method returns a metadata ID. By default it returns a value of the
            WjDirective._controlConstructor property. Because of this approach it's reasonable to override the
            _controlConstructor property even in the abstract classes like WjDropDown, in this case it's not necessary
            to override the _getMetaDataId method itself.
            ----------------
            WARNING: if you overridden the _getMetaDataId method, don't forget to override it in the derived classes!
            ----------------
            You usually need to override the _getMetaDataId method only for classes like WjMenuItem and WjCollectionViewNavigator
            for which the _controlConstructor as an ID approach doesn't work.

            Knockout
            ========
            TBD
            */
            ControlMetaFactory.getMetaData = function (metaDataId) {
                switch (metaDataId) {
                    // wijmo.Control *************************************************************
                    case wijmo.Control:
                        return new MetaDataBase([], [
                            this.CreateEvent('gotFocus'),
                            this.CreateEvent('lostFocus')
                        ]);
                    // wijmo.input *************************************************************
                    case wijmo.input && wijmo.input.DropDown:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('isDroppedDown', PropertyType.Boolean, 'isDroppedDownChanged'),
                            this.CreateProp('showDropDownButton', PropertyType.Boolean),
                            this.CreateProp('autoExpandSelection', PropertyType.Boolean),
                            this.CreateProp('placeholder', PropertyType.String),
                            this.CreateProp('text', PropertyType.String, 'textChanged', null, true, 1000) // textChanged
                        ], [
                            this.CreateEvent('isDroppedDownChanging'),
                            this.CreateEvent('isDroppedDownChanged', true),
                            this.CreateEvent('textChanged', true)
                        ]);
                    case wijmo.input && wijmo.input.ComboBox:
                        return this.getMetaData(wijmo.input.DropDown).add([
                            this.CreateProp('displayMemberPath', PropertyType.String),
                            this.CreateProp('selectedValuePath', PropertyType.String),
                            this.CreateProp('headerPath', PropertyType.String),
                            this.CreateProp('isContentHtml', PropertyType.Boolean),
                            this.CreateProp('isEditable', PropertyType.Boolean),
                            this.CreateProp('required', PropertyType.Boolean),
                            this.CreateProp('maxDropDownHeight', PropertyType.Number),
                            this.CreateProp('maxDropDownWidth', PropertyType.Number),
                            this.CreateProp('itemFormatter', PropertyType.Function),
                            this.CreateProp('itemsSource', PropertyType.Any, '', null, true, 900),
                            this.CreateProp('selectedIndex', PropertyType.Number, 'selectedIndexChanged', null, true, 1000),
                            this.CreateProp('selectedItem', PropertyType.Any, 'selectedIndexChanged', null, true, 1000),
                            this.CreateProp('selectedValue', PropertyType.Any, 'selectedIndexChanged', null, true, 1000),
                        ], [
                            this.CreateEvent('selectedIndexChanged', true)
                        ])
                            .addOptions({ ngModelProperty: 'selectedValue' });
                    case wijmo.input && wijmo.input.AutoComplete:
                        return this.getMetaData(wijmo.input.ComboBox).add([
                            this.CreateProp('delay', PropertyType.Number),
                            this.CreateProp('maxItems', PropertyType.Number),
                            this.CreateProp('minLength', PropertyType.Number),
                            this.CreateProp('cssMatch', PropertyType.String),
                            this.CreateProp('itemsSourceFunction', PropertyType.Function)
                        ]);
                    case wijmo.input && wijmo.input.Calendar:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('monthView', PropertyType.Boolean),
                            this.CreateProp('showHeader', PropertyType.Boolean),
                            this.CreateProp('itemFormatter', PropertyType.Function),
                            this.CreateProp('itemValidator', PropertyType.Function),
                            this.CreateProp('displayMonth', PropertyType.Date, 'displayMonthChanged'),
                            this.CreateProp('firstDayOfWeek', PropertyType.Number),
                            this.CreateProp('max', PropertyType.Date),
                            this.CreateProp('min', PropertyType.Date),
                            this.CreateProp('value', PropertyType.Date, 'valueChanged'),
                        ], [
                            this.CreateEvent('valueChanged', true),
                            this.CreateEvent('displayMonthChanged', true),
                            this.CreateEvent('formatItem', false)
                        ])
                            .addOptions({ ngModelProperty: 'value' });
                    case wijmo.input && wijmo.input.ColorPicker:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('showAlphaChannel', PropertyType.Boolean),
                            this.CreateProp('showColorString', PropertyType.Boolean),
                            this.CreateProp('palette', PropertyType.Any),
                            this.CreateProp('value', PropertyType.String, 'valueChanged')
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ])
                            .addOptions({ ngModelProperty: 'value' });
                    case wijmo.input && wijmo.input.ListBox:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('isContentHtml', PropertyType.Boolean),
                            this.CreateProp('maxHeight', PropertyType.Number),
                            this.CreateProp('selectedValuePath', PropertyType.String),
                            this.CreateProp('itemFormatter', PropertyType.Function),
                            this.CreateProp('displayMemberPath', PropertyType.String),
                            this.CreateProp('checkedMemberPath', PropertyType.String),
                            this.CreateProp('itemsSource', PropertyType.Any),
                            this.CreateProp('selectedIndex', PropertyType.Number, 'selectedIndexChanged'),
                            this.CreateProp('selectedItem', PropertyType.Any, 'selectedIndexChanged'),
                            this.CreateProp('selectedValue', PropertyType.Any, 'selectedIndexChanged'),
                        ], [
                            this.CreateEvent('formatItem', false),
                            this.CreateEvent('itemsChanged', true),
                            //AlexI: isPropChanged must be true, in order to run a digest and update bound expressions
                            this.CreateEvent('itemChecked', true),
                            this.CreateEvent('selectedIndexChanged', true)
                        ])
                            .addOptions({ ngModelProperty: 'selectedValue' });
                    case 'ItemTemplate':
                        return new MetaDataBase([], [], [], undefined, undefined, undefined, 'owner');
                    case wijmo.input && wijmo.input.Menu:
                        return this.getMetaData(wijmo.input.ComboBox).add([
                            this.CreateProp('header', PropertyType.String),
                            this.CreateProp('commandParameterPath', PropertyType.String),
                            this.CreateProp('commandPath', PropertyType.String),
                            this.CreateProp('isButton', PropertyType.Boolean),
                            this.CreateProp('value', PropertyType.Any, 'selectedIndexChanged', null, false, 1000)
                        ], [
                            this.CreateEvent('itemClicked')
                        ]);
                    case 'MenuItem':
                        return new MetaDataBase([
                            //TBD: check whether they should be two-way
                            //this.CreateProp('value', PropertyType.String, BindingMode.TwoWay),
                            //this.CreateProp('cmd', PropertyType.String, BindingMode.TwoWay),
                            //this.CreateProp('cmdParam', PropertyType.String, BindingMode.TwoWay)
                            this.CreateProp('value', PropertyType.Any, ''),
                            this.CreateProp('cmd', PropertyType.Any, ''),
                            this.CreateProp('cmdParam', PropertyType.Any, '')
                        ], [], [], 'itemsSource', true);
                    case 'MenuSeparator':
                        return new MetaDataBase([], [], [], 'itemsSource', true);
                    case wijmo.input && wijmo.input.InputDate:
                        return this.getMetaData(wijmo.input.DropDown).add([
                            this.CreateProp('required', PropertyType.Boolean),
                            this.CreateProp('format', PropertyType.String),
                            this.CreateProp('mask', PropertyType.String),
                            this.CreateProp('max', PropertyType.Date),
                            this.CreateProp('min', PropertyType.Date),
                            this.CreateProp('inputType', PropertyType.String),
                            this.CreateProp('value', PropertyType.Date, 'valueChanged', null, true, 1000),
                            this.CreateProp('itemValidator', PropertyType.Function),
                            this.CreateProp('itemFormatter', PropertyType.Function)
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ])
                            .addOptions({ ngModelProperty: 'value' });
                    case wijmo.input && wijmo.input.InputNumber:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('showSpinner', PropertyType.Boolean),
                            this.CreateProp('max', PropertyType.Number),
                            this.CreateProp('min', PropertyType.Number),
                            this.CreateProp('step', PropertyType.Number),
                            this.CreateProp('required', PropertyType.Boolean),
                            this.CreateProp('placeholder', PropertyType.String),
                            this.CreateProp('inputType', PropertyType.String),
                            this.CreateProp('value', PropertyType.Number, 'valueChanged'),
                            this.CreateProp('text', PropertyType.String, 'textChanged'),
                            this.CreateProp('format', PropertyType.String)
                        ], [
                            this.CreateEvent('valueChanged', true),
                            this.CreateEvent('textChanged', true)
                        ])
                            .addOptions({ ngModelProperty: 'value' });
                    case wijmo.input && wijmo.input.InputMask:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('mask', PropertyType.String),
                            this.CreateProp('promptChar', PropertyType.String),
                            this.CreateProp('placeholder', PropertyType.String),
                            this.CreateProp('rawValue', PropertyType.String, 'valueChanged'),
                            this.CreateProp('value', PropertyType.String, 'valueChanged')
                        ], [
                            this.CreateEvent('valueChanged', true),
                        ])
                            .addOptions({ ngModelProperty: 'value' });
                    case wijmo.input && wijmo.input.InputTime:
                        return this.getMetaData(wijmo.input.ComboBox).add([
                            this.CreateProp('max', PropertyType.Date),
                            this.CreateProp('min', PropertyType.Date),
                            this.CreateProp('step', PropertyType.Number),
                            this.CreateProp('format', PropertyType.String),
                            this.CreateProp('mask', PropertyType.String),
                            this.CreateProp('inputType', PropertyType.String),
                            this.CreateProp('value', PropertyType.Date, 'valueChanged', null, true, 1000),
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ])
                            .addOptions({ ngModelProperty: 'value' });
                    case wijmo.input && wijmo.input.InputColor:
                        return this.getMetaData(wijmo.input.DropDown).add([
                            this.CreateProp('required', PropertyType.Boolean),
                            this.CreateProp('showAlphaChannel', PropertyType.Boolean),
                            this.CreateProp('value', PropertyType.String, 'valueChanged')
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ])
                            .addOptions({ ngModelProperty: 'value' });
                    case wijmo.input && wijmo.input.Popup:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('owner', PropertyType.String),
                            this.CreateProp('showTrigger', PropertyType.Enum, '', wijmo.input.PopupTrigger),
                            this.CreateProp('hideTrigger', PropertyType.Enum, '', wijmo.input.PopupTrigger),
                            this.CreateProp('fadeIn', PropertyType.Boolean),
                            this.CreateProp('fadeOut', PropertyType.Boolean),
                            this.CreateProp('modal', PropertyType.Boolean),
                        ], [
                            this.CreateEvent('showing'),
                            this.CreateEvent('shown'),
                            this.CreateEvent('hiding'),
                            this.CreateEvent('hidden'),
                        ]);
                    case wijmo.input && wijmo.input.MultiSelect:
                        return this.getMetaData(wijmo.input.ComboBox).add([
                            this.CreateProp('checkedMemberPath', PropertyType.String),
                            this.CreateProp('maxHeaderItems', PropertyType.Number),
                            this.CreateProp('headerFormat', PropertyType.String),
                            this.CreateProp('headerFormatter', PropertyType.Function),
                        ], [
                            this.CreateEvent('checkedItemsChanged', true)
                        ]);
                    case 'CollectionViewNavigator':
                        return new MetaDataBase([
                            this.CreateProp('cv', PropertyType.Any)
                        ]);
                    case 'CollectionViewPager':
                        return new MetaDataBase([
                            this.CreateProp('cv', PropertyType.Any)
                        ]);
                    // wijmo.grid *************************************************************
                    case wijmo.grid && wijmo.grid.FlexGrid:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('allowAddNew', PropertyType.Boolean),
                            this.CreateProp('allowDelete', PropertyType.Boolean),
                            this.CreateProp('allowDragging', PropertyType.Enum, '', wijmo.grid.AllowDragging),
                            this.CreateProp('allowMerging', PropertyType.Enum, '', wijmo.grid.AllowMerging),
                            this.CreateProp('allowResizing', PropertyType.Enum, '', wijmo.grid.AllowResizing),
                            this.CreateProp('allowSorting', PropertyType.Boolean),
                            this.CreateProp('autoSizeMode', PropertyType.Enum, '', wijmo.grid.AutoSizeMode),
                            this.CreateProp('autoGenerateColumns', PropertyType.Boolean),
                            this.CreateProp('childItemsPath', PropertyType.Any),
                            this.CreateProp('groupHeaderFormat', PropertyType.String),
                            this.CreateProp('headersVisibility', PropertyType.Enum, '', wijmo.grid.HeadersVisibility),
                            this.CreateProp('showSelectedHeaders', PropertyType.Enum, '', wijmo.grid.HeadersVisibility),
                            this.CreateProp('showMarquee', PropertyType.Boolean),
                            this.CreateProp('itemFormatter', PropertyType.Function),
                            this.CreateProp('isReadOnly', PropertyType.Boolean),
                            this.CreateProp('mergeManager', PropertyType.Any),
                            // REVIEW: This breaks the grid too, see TFS 82636
                            //this.CreateProp('scrollPosition', PropertyType.Any, '='),
                            // REVIEW: this screws up the grid when selectionMode == ListBox.
                            // When the directive applies a selection to the grid and selectionMode == ListBox,
                            // the grid clears the row[x].isSelected properties of rows that are not in the selection.
                            // I think a possible fix would be for the directive to not set the grid's selection if it
                            // is the same range as the current selection property. I cannot do that in the grid because
                            // when the user does it, this side-effect is expected.
                            //this.CreateProp('selection', PropertyType.Any, '='),
                            this.CreateProp('selectionMode', PropertyType.Enum, '', wijmo.grid.SelectionMode),
                            this.CreateProp('showGroups', PropertyType.Boolean),
                            this.CreateProp('showSort', PropertyType.Boolean),
                            this.CreateProp('showAlternatingRows', PropertyType.Boolean),
                            this.CreateProp('treeIndent', PropertyType.Number),
                            this.CreateProp('itemsSource', PropertyType.Any),
                            this.CreateProp('autoClipboard', PropertyType.Boolean),
                            this.CreateProp('frozenRows', PropertyType.Number),
                            this.CreateProp('frozenColumns', PropertyType.Number),
                            this.CreateProp('deferResizing', PropertyType.Boolean),
                            this.CreateProp('sortRowIndex', PropertyType.Number),
                            this.CreateProp('stickyHeaders', PropertyType.Boolean)
                        ], [
                            // Cell events
                            this.CreateEvent('beginningEdit'),
                            this.CreateEvent('cellEditEnded'),
                            this.CreateEvent('cellEditEnding'),
                            this.CreateEvent('prepareCellForEdit'),
                            this.CreateEvent('formatItem'),
                            // Column events
                            this.CreateEvent('resizingColumn'),
                            this.CreateEvent('resizedColumn'),
                            this.CreateEvent('autoSizingColumn'),
                            this.CreateEvent('autoSizedColumn'),
                            this.CreateEvent('draggingColumn'),
                            this.CreateEvent('draggedColumn'),
                            this.CreateEvent('sortingColumn'),
                            this.CreateEvent('sortedColumn'),
                            // Row Events
                            this.CreateEvent('resizingRow'),
                            this.CreateEvent('resizedRow'),
                            this.CreateEvent('autoSizingRow'),
                            this.CreateEvent('autoSizedRow'),
                            this.CreateEvent('draggingRow'),
                            this.CreateEvent('draggedRow'),
                            this.CreateEvent('deletingRow'),
                            this.CreateEvent('loadingRows'),
                            this.CreateEvent('loadedRows'),
                            this.CreateEvent('rowEditEnded'),
                            this.CreateEvent('rowEditEnding'),
                            this.CreateEvent('rowAdded'),
                            this.CreateEvent('groupCollapsedChanged'),
                            this.CreateEvent('groupCollapsedChanging'),
                            this.CreateEvent('itemsSourceChanged', true),
                            this.CreateEvent('selectionChanging'),
                            this.CreateEvent('selectionChanged', true),
                            this.CreateEvent('scrollPositionChanged', false),
                            this.CreateEvent('updatedView'),
                            // Clipboard events
                            this.CreateEvent('pasting'),
                            this.CreateEvent('pasted'),
                            this.CreateEvent('copying'),
                            this.CreateEvent('copied')
                        ]);
                    case wijmo.grid && wijmo.grid.Column:
                        return new MetaDataBase([
                            this.CreateProp('name', PropertyType.String),
                            this.CreateProp('dataMap', PropertyType.Any),
                            this.CreateProp('dataType', PropertyType.Enum, '', wijmo.DataType),
                            this.CreateProp('binding', PropertyType.String),
                            this.CreateProp('sortMemberPath', PropertyType.String),
                            this.CreateProp('format', PropertyType.String),
                            this.CreateProp('header', PropertyType.String),
                            this.CreateProp('width', PropertyType.Number),
                            this.CreateProp('minWidth', PropertyType.Number),
                            this.CreateProp('maxWidth', PropertyType.Number),
                            this.CreateProp('align', PropertyType.String),
                            this.CreateProp('allowDragging', PropertyType.Boolean),
                            this.CreateProp('allowSorting', PropertyType.Boolean),
                            this.CreateProp('allowResizing', PropertyType.Boolean),
                            this.CreateProp('allowMerging', PropertyType.Boolean),
                            this.CreateProp('aggregate', PropertyType.Enum, '', wijmo.Aggregate),
                            this.CreateProp('isReadOnly', PropertyType.Boolean),
                            this.CreateProp('cssClass', PropertyType.String),
                            this.CreateProp('isContentHtml', PropertyType.Boolean),
                            this.CreateProp('isSelected', PropertyType.Boolean, 'grid.selectionChanged'),
                            this.CreateProp('visible', PropertyType.Boolean),
                            this.CreateProp('wordWrap', PropertyType.Boolean),
                            this.CreateProp('mask', PropertyType.String),
                            this.CreateProp('inputType', PropertyType.String),
                            this.CreateProp('required', PropertyType.Boolean),
                            this.CreateProp('showDropDown', PropertyType.Boolean)
                        ], [], [], 'columns', true);
                    case 'FlexGridCellTemplate':
                        return new MetaDataBase([
                            this.CreateProp('cellType', PropertyType.String, '', null, false),
                            this.CreateProp('cellOverflow', PropertyType.String, ''),
                        ], [], [], undefined, undefined, undefined, 'owner');
                    case wijmo.grid && wijmo.grid.filter && wijmo.grid.filter.FlexGridFilter:
                        return new MetaDataBase([
                            this.CreateProp('showFilterIcons', PropertyType.Boolean),
                            this.CreateProp('showSortButtons', PropertyType.Boolean),
                            this.CreateProp('defaultFilterType', PropertyType.Enum, '', wijmo.grid.filter.FilterType),
                            this.CreateProp('filterColumns', PropertyType.Any),
                        ], [
                            this.CreateEvent('filterChanging'),
                            this.CreateEvent('filterChanged'),
                            this.CreateEvent('filterApplied')
                        ], [], undefined, undefined, undefined, '');
                    case wijmo.grid && wijmo.grid.grouppanel && wijmo.grid.grouppanel.GroupPanel:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('hideGroupedColumns', PropertyType.Boolean),
                            this.CreateProp('maxGroups', PropertyType.Number),
                            this.CreateProp('placeholder', PropertyType.String),
                            this.CreateProp('grid', PropertyType.Any),
                        ]);
                    case wijmo.grid && wijmo.grid.detail && wijmo.grid.detail.FlexGridDetailProvider:
                        return new MetaDataBase([
                            this.CreateProp('maxHeight', PropertyType.Number),
                            this.CreateProp('detailVisibilityMode', PropertyType.Enum, '', wijmo.grid.detail.DetailVisibilityMode),
                            this.CreateProp('rowHasDetail', PropertyType.Function),
                        ], [], [], undefined, undefined, undefined, '');
                    case wijmo.grid && wijmo.grid.sheet && wijmo.grid.sheet.FlexSheet:
                        return this.getMetaData(wijmo.grid.FlexGrid).add([
                            this.CreateProp('isTabHolderVisible', wijmo.interop.PropertyType.Boolean),
                            this.CreateProp('selectedSheetIndex', wijmo.interop.PropertyType.Number, 'selectedSheetChanged'),
                        ], [
                            this.CreateEvent('selectedSheetChanged', true),
                            this.CreateEvent('draggingRowColumn'),
                            this.CreateEvent('droppingRowColumn'),
                        ]);
                    case wijmo.grid && wijmo.grid.sheet && wijmo.grid.sheet.Sheet:
                        return new wijmo.interop.MetaDataBase([
                            this.CreateProp('name', wijmo.interop.PropertyType.String),
                            this.CreateProp('itemsSource', wijmo.interop.PropertyType.Any, '', null, false),
                            this.CreateProp('visible', wijmo.interop.PropertyType.Boolean),
                            this.CreateProp('rowCount', wijmo.interop.PropertyType.Number, '', null, false),
                            this.CreateProp('columnCount', wijmo.interop.PropertyType.Number, '', null, false)
                        ], [
                            this.CreateEvent('nameChanged'),
                        ])
                            .addOptions({ parentReferenceProperty: '' });
                    // Chart *************************************************************
                    case wijmo.chart && wijmo.chart.FlexChartBase:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('binding', PropertyType.String),
                            this.CreateProp('footer', PropertyType.String),
                            this.CreateProp('header', PropertyType.String),
                            this.CreateProp('selectionMode', PropertyType.Enum, '', wijmo.chart.SelectionMode),
                            this.CreateProp('palette', PropertyType.Any),
                            this.CreateProp('plotMargin', PropertyType.Any),
                            this.CreateProp('footerStyle', PropertyType.Any),
                            this.CreateProp('headerStyle', PropertyType.Any),
                            this.CreateProp('tooltipContent', PropertyType.String, '', null, false),
                            this.CreateProp('itemsSource', PropertyType.Any)
                        ], [
                            this.CreateEvent('rendering'),
                            this.CreateEvent('rendered'),
                        ]);
                    case wijmo.chart && wijmo.chart.FlexChartCore:
                        return this.getMetaData(wijmo.chart.FlexChartBase).add([
                            this.CreateProp('bindingX', PropertyType.String),
                            // this.CreateProp('chartType', PropertyType.Enum, '', wijmo.chart.ChartType),
                            this.CreateProp('interpolateNulls', PropertyType.Boolean),
                            this.CreateProp('legendToggle', PropertyType.Boolean),
                            this.CreateProp('symbolSize', PropertyType.Number),
                            this.CreateProp('options', PropertyType.Any),
                            this.CreateProp('selection', PropertyType.Any, 'selectionChanged'),
                            this.CreateProp('itemFormatter', PropertyType.Function),
                            this.CreateProp('labelContent', PropertyType.String, '', null, false),
                        ], [
                            this.CreateEvent('seriesVisibilityChanged'),
                            this.CreateEvent('selectionChanged', true),
                        ], [
                            this.CreateComplexProp('axisX', false, false),
                            this.CreateComplexProp('axisY', false, false),
                            this.CreateComplexProp('axes', true),
                            this.CreateComplexProp('plotAreas', true)
                        ]);
                    case wijmo.chart && wijmo.chart.FlexChart:
                        return this.getMetaData(wijmo.chart.FlexChartCore).add([
                            this.CreateProp('chartType', PropertyType.Enum, '', wijmo.chart.ChartType),
                            this.CreateProp('rotated', PropertyType.Boolean),
                            this.CreateProp('stacking', PropertyType.Enum, '', wijmo.chart.Stacking),
                        ]);
                    case wijmo.chart && wijmo.chart.FlexPie:
                        return this.getMetaData(wijmo.chart.FlexChartBase).add([
                            this.CreateProp('bindingName', PropertyType.String),
                            this.CreateProp('innerRadius', PropertyType.Number),
                            this.CreateProp('isAnimated', PropertyType.Boolean),
                            this.CreateProp('offset', PropertyType.Number),
                            this.CreateProp('reversed', PropertyType.Boolean),
                            this.CreateProp('startAngle', PropertyType.Number),
                            this.CreateProp('selectedItemPosition', PropertyType.Enum, '', wijmo.chart.Position),
                            this.CreateProp('selectedItemOffset', PropertyType.Number),
                            this.CreateProp('itemFormatter', PropertyType.Function),
                            this.CreateProp('labelContent', PropertyType.String, '', null, false),
                        ]);
                    case wijmo.chart && wijmo.chart.Axis:
                        return new MetaDataBase([
                            this.CreateProp('axisLine', PropertyType.Boolean),
                            this.CreateProp('format', PropertyType.String),
                            this.CreateProp('labels', PropertyType.Boolean),
                            this.CreateProp('majorGrid', PropertyType.Boolean),
                            this.CreateProp('majorTickMarks', PropertyType.Enum, '', wijmo.chart.TickMark),
                            this.CreateProp('majorUnit', PropertyType.Number),
                            this.CreateProp('max', PropertyType.Number),
                            this.CreateProp('min', PropertyType.Number),
                            this.CreateProp('position', PropertyType.Enum, '', wijmo.chart.Position),
                            this.CreateProp('reversed', PropertyType.Boolean),
                            this.CreateProp('title', PropertyType.String),
                            this.CreateProp('labelAngle', PropertyType.Number),
                            this.CreateProp('minorGrid', PropertyType.Boolean),
                            this.CreateProp('minorTickMarks', PropertyType.Enum, '', wijmo.chart.TickMark),
                            this.CreateProp('minorUnit', PropertyType.Number),
                            this.CreateProp('origin', PropertyType.Number),
                            this.CreateProp('logBase', PropertyType.Number),
                            this.CreateProp('plotArea', PropertyType.Any),
                            this.CreateProp('labelAlign', PropertyType.String),
                            this.CreateProp('name', PropertyType.String),
                            this.CreateProp('overlappingLabels', PropertyType.Enum, '', wijmo.chart.OverlappingLabels),
                        ], [], [], 'axes', true); //use wj-property attribute on directive to define axisX or axisY
                    case wijmo.chart && wijmo.chart.Legend:
                        return new MetaDataBase([
                            this.CreateProp('position', PropertyType.Enum, '', wijmo.chart.Position)
                        ], [], [], 'legend', false, false);
                    case wijmo.chart && wijmo.chart.DataLabelBase:
                        return new MetaDataBase([
                            this.CreateProp('content', PropertyType.Any, ''),
                            this.CreateProp('border', PropertyType.Boolean),
                        ], [], [], 'dataLabel', false, false);
                    case wijmo.chart && wijmo.chart.DataLabel:
                        return this.getMetaData(wijmo.chart.DataLabelBase).add([
                            this.CreateProp('position', PropertyType.Enum, '', wijmo.chart.LabelPosition),
                        ]);
                    case wijmo.chart && wijmo.chart.PieDataLabel:
                        return this.getMetaData(wijmo.chart.DataLabelBase).add([
                            this.CreateProp('position', PropertyType.Enum, '', wijmo.chart.PieLabelPosition),
                        ]);
                    case wijmo.chart && wijmo.chart.SeriesBase:
                        return new MetaDataBase([
                            this.CreateProp('axisX', PropertyType.Any),
                            this.CreateProp('axisY', PropertyType.Any),
                            this.CreateProp('binding', PropertyType.String),
                            this.CreateProp('bindingX', PropertyType.String),
                            this.CreateProp('cssClass', PropertyType.String),
                            this.CreateProp('name', PropertyType.String),
                            this.CreateProp('style', PropertyType.Any),
                            this.CreateProp('altStyle', PropertyType.Any),
                            this.CreateProp('symbolMarker', PropertyType.Enum, '', wijmo.chart.Marker),
                            this.CreateProp('symbolSize', PropertyType.Number),
                            this.CreateProp('symbolStyle', PropertyType.Any),
                            this.CreateProp('visibility', PropertyType.Enum, 'chart.seriesVisibilityChanged', wijmo.chart.SeriesVisibility),
                            this.CreateProp('itemsSource', PropertyType.Any),
                        ], [], [
                            this.CreateComplexProp('axisX', false, true),
                            this.CreateComplexProp('axisY', false, true),
                        ], 'series', true);
                    case wijmo.chart && wijmo.chart.Series:
                        return this.getMetaData(wijmo.chart.SeriesBase).add([
                            this.CreateProp('chartType', PropertyType.Enum, '', wijmo.chart.ChartType)
                        ]);
                    case wijmo.chart && wijmo.chart.LineMarker:
                        return new MetaDataBase([
                            this.CreateProp('isVisible', PropertyType.Boolean),
                            this.CreateProp('seriesIndex', PropertyType.Number),
                            this.CreateProp('horizontalPosition', PropertyType.Number),
                            this.CreateProp('content', PropertyType.Function),
                            this.CreateProp('verticalPosition', PropertyType.Number),
                            this.CreateProp('alignment', PropertyType.Enum, '', wijmo.chart.LineMarkerAlignment),
                            this.CreateProp('lines', PropertyType.Enum, '', wijmo.chart.LineMarkerLines),
                            this.CreateProp('interaction', PropertyType.Enum, '', wijmo.chart.LineMarkerInteraction),
                            this.CreateProp('dragLines', PropertyType.Boolean),
                            this.CreateProp('dragThreshold', PropertyType.Number),
                            this.CreateProp('dragContent', PropertyType.Boolean),
                        ], [
                            this.CreateEvent('positionChanged'),
                        ], [], undefined, undefined, undefined, '');
                    case wijmo.chart && wijmo.chart.DataPoint:
                        return new MetaDataBase([
                            this.CreateProp('x', PropertyType.AnyPrimitive),
                            this.CreateProp('y', PropertyType.AnyPrimitive)
                        ], [], [], '');
                    case wijmo.chart && wijmo.chart.annotation && wijmo.chart.annotation.AnnotationLayer:
                        return new MetaDataBase([], [], [], undefined, undefined, undefined, '');
                    case 'FlexChartAnnotation':
                        return new MetaDataBase([
                            this.CreateProp('type', PropertyType.String, '', null, false),
                            this.CreateProp('attachment', PropertyType.Enum, '', wijmo.chart.annotation.AnnotationAttachment),
                            this.CreateProp('position', PropertyType.Enum, '', wijmo.chart.annotation.AnnotationPosition),
                            this.CreateProp('point', PropertyType.Any),
                            this.CreateProp('seriesIndex', PropertyType.Number),
                            this.CreateProp('pointIndex', PropertyType.Number),
                            this.CreateProp('offset', PropertyType.Any),
                            this.CreateProp('style', PropertyType.Any),
                            this.CreateProp('isVisible', PropertyType.Boolean),
                            this.CreateProp('tooltip', PropertyType.String),
                            this.CreateProp('text', PropertyType.String),
                            this.CreateProp('content', PropertyType.String),
                            this.CreateProp('name', PropertyType.String),
                            this.CreateProp('width', PropertyType.Number),
                            this.CreateProp('height', PropertyType.Number),
                            this.CreateProp('start', PropertyType.Any),
                            this.CreateProp('end', PropertyType.Any),
                            this.CreateProp('radius', PropertyType.Number),
                            this.CreateProp('length', PropertyType.Number),
                            this.CreateProp('href', PropertyType.String)
                        ], [], [
                            this.CreateComplexProp('point', false, true),
                            this.CreateComplexProp('start', false, true),
                            this.CreateComplexProp('end', false, true),
                            this.CreateComplexProp('points', true),
                        ], 'items', true);
                    case wijmo.chart && wijmo.chart.interaction && wijmo.chart.interaction.RangeSelector:
                        return new MetaDataBase([
                            this.CreateProp('isVisible', PropertyType.Boolean),
                            this.CreateProp('min', PropertyType.Number),
                            this.CreateProp('max', PropertyType.Number),
                            this.CreateProp('orientation', PropertyType.Enum, '', wijmo.chart.interaction.Orientation),
                            this.CreateProp('seamless', PropertyType.Boolean),
                            this.CreateProp('minScale', PropertyType.Number),
                            this.CreateProp('maxScale', PropertyType.Number),
                        ], [
                            this.CreateEvent('rangeChanged'),
                        ], [], undefined, undefined, undefined, '');
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.FinancialChart:
                        return this.getMetaData(wijmo.chart.FlexChartCore).add([
                            this.CreateProp('chartType', PropertyType.Enum, '', wijmo.chart.finance.FinancialChartType),
                        ]);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.FinancialSeries:
                        return this.getMetaData(wijmo.chart.SeriesBase).add([
                            this.CreateProp('chartType', PropertyType.Enum, '', wijmo.chart.finance.FinancialChartType)
                        ]);
                    case wijmo.chart && wijmo.chart.analytics && wijmo.chart.analytics.TrendLineBase:
                        return this.getMetaData(wijmo.chart.SeriesBase).add([
                            this.CreateProp('sampleCount', PropertyType.Number)
                        ]);
                    case wijmo.chart && wijmo.chart.analytics && wijmo.chart.analytics.TrendLine:
                        return this.getMetaData(wijmo.chart.analytics.TrendLineBase).add([
                            this.CreateProp('order', PropertyType.Number),
                            this.CreateProp('fitType', PropertyType.Enum, '', wijmo.chart.analytics.TrendLineFitType)
                        ]);
                    case wijmo.chart && wijmo.chart.analytics && wijmo.chart.analytics.MovingAverage:
                        return this.getMetaData(wijmo.chart.analytics.TrendLineBase).add([
                            this.CreateProp('period', PropertyType.Number),
                            this.CreateProp('type', PropertyType.Enum, '', wijmo.chart.analytics.MovingAverageType)
                        ]);
                    case wijmo.chart && wijmo.chart.PlotArea:
                        return new MetaDataBase([
                            this.CreateProp('column', PropertyType.Number),
                            this.CreateProp('height', PropertyType.String),
                            this.CreateProp('name', PropertyType.String),
                            this.CreateProp('row', PropertyType.Number),
                            this.CreateProp('style', PropertyType.Any),
                            this.CreateProp('width', PropertyType.String),
                        ], [], [], 'plotAreas', true);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.Fibonacci:
                        return this.getMetaData(wijmo.chart.SeriesBase).add([
                            this.CreateProp('high', PropertyType.Number),
                            this.CreateProp('low', PropertyType.Number),
                            this.CreateProp('labelPosition', PropertyType.Enum, '', wijmo.chart.LabelPosition),
                            this.CreateProp('levels', PropertyType.Any),
                            this.CreateProp('minX', PropertyType.AnyPrimitive),
                            this.CreateProp('maxX', PropertyType.AnyPrimitive),
                            this.CreateProp('uptrend', PropertyType.Boolean)
                        ]);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.FibonacciTimeZones:
                        return this.getMetaData(wijmo.chart.SeriesBase).add([
                            this.CreateProp('startX', PropertyType.Any),
                            this.CreateProp('endX', PropertyType.Any),
                            this.CreateProp('labelPosition', PropertyType.Enum, '', wijmo.chart.LabelPosition),
                            this.CreateProp('levels', PropertyType.Any)
                        ]);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.FibonacciArcs:
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.FibonacciFans:
                        return this.getMetaData(wijmo.chart.SeriesBase).add([
                            this.CreateProp('start', PropertyType.Any),
                            this.CreateProp('end', PropertyType.Any),
                            this.CreateProp('labelPosition', PropertyType.Enum, '', wijmo.chart.LabelPosition),
                            this.CreateProp('levels', PropertyType.Any)
                        ]);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.OverlayIndicatorBase:
                        return this.getMetaData(wijmo.chart.SeriesBase);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.SingleOverlayIndicatorBase:
                        return this.getMetaData(wijmo.chart.finance.analytics.OverlayIndicatorBase).add([
                            this.CreateProp('period', PropertyType.Number)
                        ]);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.MacdBase:
                        return this.getMetaData(wijmo.chart.finance.analytics.OverlayIndicatorBase).add([
                            this.CreateProp('fastPeriod', PropertyType.Number),
                            this.CreateProp('slowPeriod', PropertyType.Number),
                            this.CreateProp('smoothingPeriod', PropertyType.Number)
                        ]);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.Macd:
                        return this.getMetaData(wijmo.chart.finance.analytics.MacdBase).add([
                            this.CreateProp('styles', PropertyType.Any)
                        ]);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.MacdHistogram:
                        return this.getMetaData(wijmo.chart.finance.analytics.MacdBase);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.ATR:
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.RSI:
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.WilliamsR:
                        return this.getMetaData(wijmo.chart.finance.analytics.SingleOverlayIndicatorBase);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.CCI:
                        return this.getMetaData(wijmo.chart.finance.analytics.SingleOverlayIndicatorBase).add([
                            this.CreateProp('constant', PropertyType.Number)
                        ]);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.Stochastic:
                        return this.getMetaData(wijmo.chart.finance.analytics.OverlayIndicatorBase).add([
                            this.CreateProp('dPeriod', PropertyType.Number),
                            this.CreateProp('kPeriod', PropertyType.Number),
                            this.CreateProp('smoothingPeriod', PropertyType.Number),
                            this.CreateProp('styles', PropertyType.Any)
                        ]);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.Envelopes:
                        return this.getMetaData(wijmo.chart.finance.analytics.OverlayIndicatorBase).add([
                            this.CreateProp('period', PropertyType.Number),
                            this.CreateProp('size', PropertyType.Number),
                            this.CreateProp('type', PropertyType.Enum, '', wijmo.chart.finance.analytics.MovingAverageType)
                        ]);
                    case wijmo.chart && wijmo.chart.finance && wijmo.chart.finance.analytics && wijmo.chart.finance.analytics.BollingerBands:
                        return this.getMetaData(wijmo.chart.finance.analytics.OverlayIndicatorBase).add([
                            this.CreateProp('period', PropertyType.Number),
                            this.CreateProp('multiplier', PropertyType.Number)
                        ]);
                    // *************************** Gauge *************************************************************
                    //case 'Gauge':
                    case wijmo.gauge && wijmo.gauge.Gauge:
                        return this.getMetaData(wijmo.Control).add([
                            this.CreateProp('value', PropertyType.Number, 'valueChanged'),
                            this.CreateProp('min', PropertyType.Number),
                            this.CreateProp('max', PropertyType.Number),
                            this.CreateProp('origin', PropertyType.Number),
                            this.CreateProp('isReadOnly', PropertyType.Boolean),
                            this.CreateProp('step', PropertyType.Number),
                            this.CreateProp('format', PropertyType.String),
                            this.CreateProp('thickness', PropertyType.Number),
                            this.CreateProp('hasShadow', PropertyType.Boolean),
                            this.CreateProp('isAnimated', PropertyType.Boolean),
                            this.CreateProp('showText', PropertyType.Enum, '', wijmo.gauge.ShowText),
                            this.CreateProp('showRanges', PropertyType.Boolean),
                            this.CreateProp('thumbSize', PropertyType.Number)
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ], [
                            this.CreateComplexProp('ranges', true),
                            this.CreateComplexProp('pointer', false, false),
                            this.CreateComplexProp('face', false, false)
                        ])
                            .addOptions({ ngModelProperty: 'value' });
                    //case 'LinearGauge':
                    case wijmo.gauge && wijmo.gauge.LinearGauge:
                        return this.getMetaData(wijmo.gauge.Gauge).add([
                            this.CreateProp('direction', PropertyType.Enum, '', wijmo.gauge.GaugeDirection)
                        ]);
                    case wijmo.gauge && wijmo.gauge.BulletGraph:
                        return this.getMetaData(wijmo.gauge.LinearGauge).add([
                            this.CreateProp('target', PropertyType.Number),
                            this.CreateProp('good', PropertyType.Number),
                            this.CreateProp('bad', PropertyType.Number)
                        ]);
                    case wijmo.gauge && wijmo.gauge.RadialGauge:
                        return this.getMetaData(wijmo.gauge.Gauge).add([
                            this.CreateProp('autoScale', PropertyType.Boolean),
                            this.CreateProp('startAngle', PropertyType.Number),
                            this.CreateProp('sweepAngle', PropertyType.Number)
                        ]);
                    case wijmo.gauge && wijmo.gauge.Range:
                        return new MetaDataBase([
                            this.CreateProp('color', PropertyType.String),
                            this.CreateProp('min', PropertyType.Number),
                            this.CreateProp('max', PropertyType.Number),
                            this.CreateProp('name', PropertyType.String),
                            this.CreateProp('thickness', PropertyType.Number)
                        ], [], [], 'ranges', true);
                }
                return new MetaDataBase([]);
            };
            // For the specified class reference returns its name as a string, e.g.
            // getClassName(wijmo.input.ComboBox) returns 'ComboBox'.
            ControlMetaFactory.getClassName = function (classRef) {
                return (classRef.toString().match(/function (.+?)\(/) || [, ''])[1];
            };
            // Returns a camel case representation of the dash delimited name.
            ControlMetaFactory.toCamelCase = function (s) {
                return s.toLowerCase().replace(/-(.)/g, function (match, group1) {
                    return group1.toUpperCase();
                });
            };
            ControlMetaFactory.findInArr = function (arr, propName, value) {
                for (var i in arr) {
                    if (arr[i][propName] === value) {
                        return arr[i];
                    }
                }
                return null;
            };
            return ControlMetaFactory;
        })();
        interop.ControlMetaFactory = ControlMetaFactory;
        // Describes a scope property: name, type, binding mode.
        // Also defines enum type and custom watcher function extender
        var PropDescBase = (function () {
            // Initializes a new instance of a PropDesc
            function PropDescBase(propertyName, propertyType, /*bindingMode: BindingMode = BindingMode.OneWay*/ changeEvent, enumType, isNativeControlProperty, priority) {
                if (isNativeControlProperty === void 0) { isNativeControlProperty = true; }
                if (priority === void 0) { priority = 0; }
                this._priority = 0;
                this._propertyName = propertyName;
                this._propertyType = propertyType;
                //this._bindingMode = bindingMode;
                this._changeEvent = changeEvent;
                this._enumType = enumType;
                this._isNativeControlProperty = isNativeControlProperty;
                this._priority = priority;
            }
            Object.defineProperty(PropDescBase.prototype, "propertyName", {
                // Gets the property name
                get: function () {
                    return this._propertyName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDescBase.prototype, "propertyType", {
                // Gets the property type (number, string, boolean, enum, or any)
                get: function () {
                    return this._propertyType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDescBase.prototype, "changeEvent", {
                get: function () {
                    return this._changeEvent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDescBase.prototype, "enumType", {
                // Gets the property enum type
                get: function () { return this._enumType; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDescBase.prototype, "bindingMode", {
                // Gets the property binding mode
                get: function () {
                    //return this._bindingMode;
                    return this.changeEvent ? BindingMode.TwoWay : BindingMode.OneWay;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDescBase.prototype, "isNativeControlProperty", {
                // Gets whether the property belongs to the control is just to the directive
                get: function () {
                    return this._isNativeControlProperty;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDescBase.prototype, "priority", {
                // Gets an initialization priority. Properties with higher priority are assigned to directive's underlying control
                // property later than properties with lower priority. Properties with the same priority are assigned in the order of
                // their index in the _props collection.
                get: function () {
                    return this._priority;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDescBase.prototype, "shouldUpdateSource", {
                // Indicates whether a bound 'controller' property should be updated on this property change (i.e. two-way binding).
                get: function () {
                    return this.bindingMode === BindingMode.TwoWay && this.propertyType != PropertyType.EventHandler;
                },
                enumerable: true,
                configurable: true
            });
            PropDescBase.prototype.initialize = function (options) {
                wijmo.copy(this, options);
            };
            // Casts value to the property type
            PropDescBase.prototype.castValueToType = function (value) {
                if (value == undefined) {
                    return value;
                }
                var type = this.propertyType, pt = wijmo.interop.PropertyType;
                if (type === pt.AnyPrimitive) {
                    if (!wijmo.isString(value)) {
                        return value;
                    }
                    if (value === 'true' || value === 'false') {
                        type = pt.Boolean;
                    }
                    else {
                        castVal = +value;
                        if (!isNaN(castVal)) {
                            return castVal;
                        }
                        var castVal = this._parseDate(value);
                        if (!wijmo.isString(castVal)) {
                            return castVal;
                        }
                        return value;
                    }
                }
                switch (type) {
                    case pt.Number:
                        if (typeof value == 'string') {
                            if (value.indexOf('*') >= 0) {
                                return value;
                            }
                            if (value.trim() === '') {
                                return null;
                            }
                        }
                        return +value; // cast to number
                    case pt.Boolean:
                        if (value === 'true') {
                            return true;
                        }
                        if (value === 'false') {
                            return false;
                        }
                        return !!value; // cast to bool
                    case pt.String:
                        return value + ''; // cast to string
                    case pt.Date:
                        return this._parseDate(value);
                    case pt.Enum:
                        if (typeof value === 'number') {
                            return value;
                        }
                        return this.enumType[value];
                    default:
                        return value;
                }
            };
            // Parsing DateTime values from string
            PropDescBase.prototype._parseDate = function (value) {
                if (value && wijmo.isString(value)) {
                    // For by-val attributes Angular converts a Date object to a
                    // string wrapped in quotation marks, so we strip them.
                    value = value.replace(/["']/g, '');
                    // parse date/time using RFC 3339 pattern
                    var dt = wijmo.changeType(value, wijmo.DataType.Date, 'r');
                    if (wijmo.isDate(dt)) {
                        return dt;
                    }
                }
                return value;
            };
            return PropDescBase;
        })();
        interop.PropDescBase = PropDescBase;
        // Property types as used in the PropDesc class.
        (function (PropertyType) {
            PropertyType[PropertyType["Boolean"] = 0] = "Boolean";
            PropertyType[PropertyType["Number"] = 1] = "Number";
            PropertyType[PropertyType["Date"] = 2] = "Date";
            PropertyType[PropertyType["String"] = 3] = "String";
            // Allows a value of any primitive type above, that can be parsed from string
            PropertyType[PropertyType["AnyPrimitive"] = 4] = "AnyPrimitive";
            PropertyType[PropertyType["Enum"] = 5] = "Enum";
            PropertyType[PropertyType["Function"] = 6] = "Function";
            PropertyType[PropertyType["EventHandler"] = 7] = "EventHandler";
            PropertyType[PropertyType["Any"] = 8] = "Any";
        })(interop.PropertyType || (interop.PropertyType = {}));
        var PropertyType = interop.PropertyType;
        // Gets a value that indicates whether the specified type is simple (true) or complex (false).
        function isSimpleType(type) {
            return type <= PropertyType.Enum;
        }
        interop.isSimpleType = isSimpleType;
        (function (BindingMode) {
            BindingMode[BindingMode["OneWay"] = 0] = "OneWay";
            BindingMode[BindingMode["TwoWay"] = 1] = "TwoWay";
        })(interop.BindingMode || (interop.BindingMode = {}));
        var BindingMode = interop.BindingMode;
        // Describes a scope event
        var EventDescBase = (function () {
            // Initializes a new instance of an EventDesc
            function EventDescBase(eventName, isPropChanged) {
                this._eventName = eventName;
                this._isPropChanged = isPropChanged;
            }
            Object.defineProperty(EventDescBase.prototype, "eventName", {
                // Gets the event name
                get: function () {
                    return this._eventName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EventDescBase.prototype, "isPropChanged", {
                // Gets whether this event is a property change notification
                get: function () {
                    return this._isPropChanged === true;
                },
                enumerable: true,
                configurable: true
            });
            return EventDescBase;
        })();
        interop.EventDescBase = EventDescBase;
        // Describe property info for nested directives.
        var ComplexPropDescBase = (function () {
            function ComplexPropDescBase(propertyName, isArray, ownsObject) {
                if (ownsObject === void 0) { ownsObject = false; }
                this.isArray = false;
                this._ownsObject = false;
                this.propertyName = propertyName;
                this.isArray = isArray;
                this._ownsObject = ownsObject;
            }
            Object.defineProperty(ComplexPropDescBase.prototype, "ownsObject", {
                get: function () {
                    return this.isArray || this._ownsObject;
                },
                enumerable: true,
                configurable: true
            });
            return ComplexPropDescBase;
        })();
        interop.ComplexPropDescBase = ComplexPropDescBase;
        // Stores a control metadata as arrays of property, event and complex property descriptors.
        var MetaDataBase = (function () {
            function MetaDataBase(props, events, complexProps, parentProperty, isParentPropertyArray, ownsObject, parentReferenceProperty, ngModelProperty) {
                this._props = [];
                this._events = [];
                this._complexProps = [];
                this.props = props;
                this.events = events;
                this.complexProps = complexProps;
                this.parentProperty = parentProperty;
                this.isParentPropertyArray = isParentPropertyArray;
                this.ownsObject = ownsObject;
                this.parentReferenceProperty = parentReferenceProperty;
                this.ngModelProperty = ngModelProperty;
            }
            Object.defineProperty(MetaDataBase.prototype, "props", {
                get: function () {
                    return this._props;
                },
                set: function (value) {
                    this._props = value || [];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MetaDataBase.prototype, "events", {
                get: function () {
                    return this._events;
                },
                set: function (value) {
                    this._events = value || [];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MetaDataBase.prototype, "complexProps", {
                get: function () {
                    return this._complexProps;
                },
                set: function (value) {
                    this._complexProps = value || [];
                },
                enumerable: true,
                configurable: true
            });
            // Adds the specified arrays to the end of corresponding arrays of this object, and overwrite the simple properties
            // if specified. Returns 'this'.
            MetaDataBase.prototype.add = function (props, events, complexProps, parentProperty, isParentPropertyArray, ownsObject, parentReferenceProperty, ngModelProperty) {
                return this.addOptions({
                    props: props,
                    events: events,
                    complexProps: complexProps,
                    parentProperty: parentProperty,
                    isParentPropertyArray: isParentPropertyArray,
                    ownsObject: ownsObject,
                    parentReferenceProperty: parentReferenceProperty,
                    ngModelProperty: ngModelProperty
                });
                //this._props = this._props.concat(props || []);
                //this._events = this._events.concat(events || []);
                //this._complexProps = this._complexProps.concat(complexProps || []);
                //if (parentProperty !== undefined) {
                //    this.parentProperty = parentProperty;
                //}
                //if (isParentPropertyArray !== undefined) {
                //    this.isParentPropertyArray = isParentPropertyArray;
                //}
                //if (ownsObject !== undefined) {
                //    this.ownsObject = ownsObject;
                //}
                //if (parentReferenceProperty !== undefined) {
                //    this.parentReferenceProperty = parentReferenceProperty;
                //}
                //if (ngModelProperty !== undefined) {
                //    this.ngModelProperty = ngModelProperty;
                //}
                //return this;
            };
            MetaDataBase.prototype.addOptions = function (options) {
                for (var prop in options) {
                    var thisValue = this[prop], optionsValue = options[prop];
                    if (thisValue instanceof Array) {
                        this[prop] = thisValue.concat(optionsValue || []);
                    }
                    else if (optionsValue !== undefined) {
                        this[prop] = optionsValue;
                    }
                }
                return this;
            };
            // Prepares a raw defined metadata for a usage, for example sorts the props array on priority.
            MetaDataBase.prototype.prepare = function () {
                // stable sort of props on priority
                var baseArr = [].concat(this._props);
                this._props.sort(function (a, b) {
                    var ret = a.priority - b.priority;
                    if (!ret) {
                        ret = baseArr.indexOf(a) - baseArr.indexOf(b);
                    }
                    return ret;
                });
            };
            return MetaDataBase;
        })();
        interop.MetaDataBase = MetaDataBase;
    })(interop = wijmo.interop || (wijmo.interop = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ControlMetaFactory.js.map