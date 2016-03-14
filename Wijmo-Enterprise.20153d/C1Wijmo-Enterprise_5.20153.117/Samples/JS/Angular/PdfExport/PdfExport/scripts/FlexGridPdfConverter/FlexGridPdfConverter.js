var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (_grid) {
        'use strict';

        /** Specifies how the grid content should be scaled to fit the page. */
        (function (ScaleMode) {
            /** Render the grid in actual size, breaking pages as needed. */
            ScaleMode[ScaleMode["ActualSize"] = 0] = "ActualSize";

            /** Scale the grid so it fits the page width. */
            ScaleMode[ScaleMode["PageWidth"] = 1] = "PageWidth";

            /** Scale the grid so it fits on a single page. */
            ScaleMode[ScaleMode["SinglePage"] = 2] = "SinglePage";
        })(_grid.ScaleMode || (_grid.ScaleMode = {}));
        var ScaleMode = _grid.ScaleMode;

        /** Specifies which part of the grid should be rendered. */
        (function (ExportMode) {
            /** Exports all the grid data. */
            ExportMode[ExportMode["All"] = 0] = "All";

            /** Exports the current selection only. */
            ExportMode[ExportMode["Selection"] = 1] = "Selection";
        })(_grid.ExportMode || (_grid.ExportMode = {}));
        var ExportMode = _grid.ExportMode;

        

        

        

        /** Provides a functionality to export the @see:FlexGrid to PDF. */
        var FlexGridPdfConverter = (function () {
            function FlexGridPdfConverter() {
            }
            /**
            * Exports the @see:FlexGrid to PDF.
            * @param flex The @see:FlexGrid instance to export.
            * @param fileName Name of the file to export.
            * @param settings The export settings.
            */
            FlexGridPdfConverter.export = function (flex, fileName, settings) {
                wijmo.assert(!!flex, 'The flex argument cannot be null.');
                wijmo.assert(!!fileName, 'The fileName argument cannot be empty.');

                settings = wijmo.pdf.merge({}, settings), wijmo.pdf.merge(settings, this.DefaultSettings);

                var originalEnded = settings.documentOptions.ended;

                settings.documentOptions.ended = function (sender, args) {
                    FlexGridPdfConverter._save(args.blob, fileName);

                    if (originalEnded) {
                        originalEnded.apply(doc, arguments);
                    }
                };

                var doc = new wijmo.pdf.PdfDocument(settings.documentOptions);

                try  {
                    if (settings.recalculateStarWidths) {
                        // Recalculate to get a lesser scale factor.
                        flex.columns._updateStarSizes(wijmo.pdf.PtToPx(doc._clientRect().width));
                    }

                    var range = RowRange.getSelection(flex, settings.exportMode), grid = new GridRenderer(flex, range, false, false, this.BorderWidth, null);

                    if (wijmo.isArray(settings.embeddedFonts)) {
                        settings.embeddedFonts.forEach(function (font) {
                            doc.registerFont(font);
                        });
                    }

                    var scaleFactor = this._getScaleFactor(grid, settings.scaleMode, doc._clientRect()), pages = this._getPages(flex, range, doc._clientRect(), settings, scaleFactor);

                    for (var i = 0; i < pages.length; i++) {
                        if (i > 0) {
                            doc._document.addPage();
                        }

                        doc._document.save().scale(scaleFactor, scaleFactor, {
                            origin: [doc._document.page.margins.left, doc._document.page.margins.top]
                        });

                        var gridPage = new GridRenderer(flex, pages[i], settings.scaleMode === 0 /* ActualSize */, settings.repeatMergedValuesAcrossPages, this.BorderWidth, settings.styles);
                        gridPage.render(doc);

                        doc._document.restore();
                    }

                    doc.end();
                } finally {
                    if (settings.recalculateStarWidths) {
                        flex.invalidate(true); // Rollback changes
                    }
                }
            };

            FlexGridPdfConverter._getScaleFactor = function (grid, scaleMode, pageSize) {
                var factor = 1;

                if (!(scaleMode === 1 /* PageWidth */ || scaleMode === 2 /* SinglePage */)) {
                    return factor;
                }

                var size = grid.renderSize;

                if (scaleMode === 2 /* SinglePage */) {
                    var f = Math.min(pageSize.width / size.width, pageSize.height / size.height);

                    if (f < 1) {
                        factor = f;
                    }
                } else {
                    var f = pageSize.width / size.width;

                    if (f < 1) {
                        factor = f;
                    }
                }

                return factor;
            };

            FlexGridPdfConverter._getPages = function (flex, ranges, pageSize, settings, scaleFactor) {
                var _this = this;
                var rowBreaks = [], colBreaks = [], p2u = wijmo.pdf.PxToPt, showColumnHeader = flex.headersVisibility & 1 /* Column */, showRowHeader = flex.headersVisibility & 2 /* Row */, colHeaderHeight = showColumnHeader ? p2u(flex.columnHeaders.height) : 0, rowHeaderWidth = showRowHeader ? p2u(flex.rowHeaders.width) : 0, breakRows = settings.scaleMode === 0 /* ActualSize */ || settings.scaleMode === 1 /* PageWidth */, breakColumns = settings.scaleMode === 0 /* ActualSize */, pageWidth = pageSize.width * (1 / scaleFactor), pageHeight = pageSize.height * (1 / scaleFactor), totalHeight = colHeaderHeight, totalWidth = rowHeaderWidth;

                if (breakRows) {
                    var visibleRowsCnt = 0;

                    ranges.forEach(flex.cells, function (row, rng, rIdx, sIdx) {
                        if (row.isVisible) {
                            var rowHeight = p2u(row.renderHeight);

                            visibleRowsCnt++;
                            totalHeight += rowHeight;

                            if (showColumnHeader || visibleRowsCnt > 1) {
                                totalHeight -= _this.BorderWidth; // border collapse
                            }

                            if (totalHeight > pageHeight) {
                                if (colHeaderHeight + rowHeight > pageHeight) {
                                    rowBreaks.push(sIdx);
                                    totalHeight = colHeaderHeight;
                                } else {
                                    rowBreaks.push(sIdx - 1);
                                    totalHeight = colHeaderHeight + rowHeight;
                                }

                                if (showColumnHeader) {
                                    totalHeight -= _this.BorderWidth; // border collapse
                                }
                            }
                        }
                    });
                }

                var len = ranges.length() - 1;
                if (!rowBreaks.length || (rowBreaks[rowBreaks.length - 1] !== len)) {
                    rowBreaks.push(len);
                }

                if (breakColumns) {
                    var visibleColumnsCnt = 0;

                    for (var i = ranges.leftCol; i <= ranges.rightCol; i++) {
                        var col = flex.columns[i];

                        if (col.isVisible) {
                            var colWidth = p2u(col.renderWidth);

                            visibleColumnsCnt++;
                            totalWidth += colWidth;

                            if (showRowHeader > 0 || visibleColumnsCnt > 1) {
                                totalWidth -= this.BorderWidth; // border collapse
                            }

                            if (totalWidth > pageWidth) {
                                if (rowHeaderWidth + colWidth > pageWidth) {
                                    colBreaks.push(i);
                                    totalWidth = rowHeaderWidth;
                                } else {
                                    colBreaks.push(i - 1);
                                    totalWidth = rowHeaderWidth + colWidth;
                                }

                                if (showRowHeader) {
                                    totalWidth -= this.BorderWidth; // border collapse
                                }
                            }
                        }
                    }
                }

                if (!colBreaks.length || (colBreaks[colBreaks.length - 1] !== ranges.rightCol)) {
                    colBreaks.push(ranges.rightCol);
                }

                var pages = [], flag = false, pageCount = 1;

                for (var i = 0; i < rowBreaks.length && !flag; i++) {
                    for (var j = 0; j < colBreaks.length && !flag; j++, pageCount++) {
                        if (!(flag = pageCount > settings.maxPages)) {
                            var r = i == 0 ? 0 : rowBreaks[i - 1] + 1, c = j == 0 ? ranges.leftCol : colBreaks[j - 1] + 1;

                            pages.push(ranges.subrange(r, rowBreaks[i] - r + 1, c, colBreaks[j]));
                        }
                    }
                }

                return pages;
            };

            FlexGridPdfConverter._save = function (blob, fileName) {
                if (!blob || !(blob instanceof Blob) || !fileName) {
                    return;
                }

                if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    var link = document.createElement('a'), click = function (element) {
                        var evnt = document.createEvent('MouseEvents');
                        evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        element.dispatchEvent(evnt);
                    }, fr = new FileReader();

                    // Save a blob using data URI scheme
                    fr.onloadend = function (e) {
                        link.download = fileName;
                        link.href = fr.result;
                        click(link);
                        link = null;
                    };

                    fr.readAsDataURL(blob);
                }
            };
            FlexGridPdfConverter.EmptyRange = new _grid.CellRange(-1, -1, -1, -1);
            FlexGridPdfConverter.BorderWidth = 1;
            FlexGridPdfConverter.DefaultSettings = {
                maxPages: Number.MAX_VALUE,
                exportMode: 1 /* Selection */,
                scaleMode: 2 /* SinglePage */,
                recalculateStarWidths: true,
                repeatMergedValuesAcrossPages: true,
                documentOptions: {
                    compress: false,
                    documentInfo: {},
                    header: {
                        height: 36
                    },
                    footer: {
                        height: 36
                    },
                    pageSettings: {
                        margins: {
                            left: 36,
                            right: 36,
                            top: 18,
                            bottom: 18
                        }
                    }
                },
                styles: {
                    cellStyle: {
                        font: new wijmo.pdf.PdfFont('times'),
                        padding: 1.5,
                        verticalAlign: 'middle'
                    },
                    headerCellStyle: {
                        font: new wijmo.pdf.PdfFont(undefined, undefined, undefined, 'bold')
                    }
                }
            };
            return FlexGridPdfConverter;
        })();
        _grid.FlexGridPdfConverter = FlexGridPdfConverter;

        var PanelSection = (function () {
            function PanelSection(panel, range) {
                this._panel = panel;
                this._range = range.clone();
            }
            Object.defineProperty(PanelSection.prototype, "visibleRows", {
                get: function () {
                    var _this = this;
                    if (this._visibleRows == null) {
                        this._visibleRows = 0;

                        this._range.forEach(this._panel, function (row) {
                            if (row.isVisible) {
                                _this._visibleRows++;
                            }
                        });
                    }

                    return this._visibleRows;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PanelSection.prototype, "visibleColumns", {
                get: function () {
                    if (this._visibleColumns == null) {
                        this._visibleColumns = 0;

                        if (this._range.isValid) {
                            for (var i = this._range.leftCol; i <= this._range.rightCol; i++) {
                                if (this._panel.columns[i].isVisible) {
                                    this._visibleColumns++;
                                }
                            }
                        }
                    }

                    return this._visibleColumns;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PanelSection.prototype, "size", {
                // pt units
                get: function () {
                    if (this._size == null) {
                        var sz = this._range.getRenderSize(this._panel);

                        this._size = new wijmo.Size(wijmo.pdf.PxToPt(sz.width), wijmo.pdf.PxToPt(sz.height));
                    }

                    return this._size;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PanelSection.prototype, "range", {
                get: function () {
                    return this._range;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PanelSection.prototype, "panel", {
                get: function () {
                    return this._panel;
                },
                enumerable: true,
                configurable: true
            });
            return PanelSection;
        })();

        var PanelSectionRenderer = (function (_super) {
            __extends(PanelSectionRenderer, _super);
            function PanelSectionRenderer(flex, panel, range, clipCells, repeatMergedValues, borderWidth, styles) {
                _super.call(this, panel, range);
                this._flex = flex;
                this._clipCells = clipCells;
                this._repeatMergedValues = repeatMergedValues;
                this._borderWidth = borderWidth;
                this._styles = styles;
            }
            Object.defineProperty(PanelSectionRenderer.prototype, "renderSize", {
                // pt units
                get: function () {
                    if (this._renderSize == null) {
                        this._renderSize = this.size.clone();

                        if (this.visibleColumns > 1) {
                            this._renderSize.width -= this._borderWidth * (this.visibleColumns - 1);
                        }

                        if (this.visibleRows > 1) {
                            this._renderSize.height -= this._borderWidth * (this.visibleRows - 1);
                        }
                    }

                    return this._renderSize;
                },
                enumerable: true,
                configurable: true
            });

            PanelSectionRenderer.prototype.getRangeWidth = function (leftCol, rightCol) {
                var width = 0, visibleColumns = 0, pnl = this.panel;

                for (var i = leftCol; i <= rightCol; i++) {
                    var col = pnl.columns[i];
                    if (col.isVisible) {
                        visibleColumns++;
                        width += col.renderWidth;
                    }
                }

                width = wijmo.pdf.PxToPt(width);

                if (visibleColumns > 1) {
                    width -= this._borderWidth * (visibleColumns - 1);
                }

                return width;
            };

            PanelSectionRenderer.prototype.getRangeHeight = function (topRow, bottomRow) {
                var height = 0, visibleRows = 0, pnl = this.panel;

                for (var i = topRow; i <= bottomRow; i++) {
                    var row = pnl.rows[i];
                    if (row.isVisible) {
                        visibleRows++;
                        height += row.renderHeight;
                    }
                }

                height = wijmo.pdf.PxToPt(height);

                if (visibleRows > 1) {
                    height = height - this._borderWidth * (visibleRows - 1);
                }

                return height;
            };

            PanelSectionRenderer.prototype.render = function (doc, x, y) {
                var _this = this;
                var ranges = this.range, pnl = this.panel, mngr = new GetMergedRangeProxy(this._flex);

                if (!ranges.isValid) {
                    return;
                }

                var pY = {};

                for (var c = ranges.leftCol; c <= ranges.rightCol; c++) {
                    pY[c] = y;
                }

                ranges.forEach(pnl, function (row, rng, r) {
                    if (!row.isVisible) {
                        return;
                    }

                    var pX = x;

                    for (var c = ranges.leftCol; c <= ranges.rightCol; c++) {
                        var col = pnl.columns[c], cell = undefined, height = undefined, width = undefined, skipC = undefined;

                        if (!col.isVisible) {
                            continue;
                        }

                        var value = _this._getCellValue(c, r), mergedRng;

                        if ((row.allowMerging || col.allowMerging || row instanceof _grid.GroupRow) && (mergedRng = mngr.getMergedRange(pnl, r, c))) {
                            if (mergedRng.topRow !== mergedRng.bottomRow) {
                                if (mergedRng.topRow === r || r === rng.topRow) {
                                    cell = {
                                        value: _this._repeatMergedValues ? value : (mergedRng.topRow === r ? value : ''),
                                        height: height = _this.getRangeHeight(r, Math.min(mergedRng.bottomRow, rng.bottomRow)),
                                        width: width = _this.getRangeWidth(c, c)
                                    };
                                } else {
                                    width = _this.getRangeWidth(c, c); // an absorbed cell
                                }
                            } else {
                                // c === mrg.leftCol means the very first cell of the range, otherwise it is the remains of the range spreaded between multiple pages
                                cell = {
                                    value: _this._repeatMergedValues ? value : (c === mergedRng.leftCol ? value : ''),
                                    height: height = _this.getRangeHeight(r, r),
                                    width: width = _this.getRangeWidth(Math.max(ranges.leftCol, mergedRng.leftCol), Math.min(ranges.rightCol, mergedRng.rightCol))
                                };

                                // skip absorbed cells until the end of the merged range or page (which comes first)
                                skipC = Math.min(ranges.rightCol, mergedRng.rightCol); // to update loop variable later
                                for (var t = c + 1; t <= skipC; t++) {
                                    pY[t] += height - _this._borderWidth; // collapse borders
                                }
                            }
                        } else {
                            cell = {
                                value: value,
                                height: height = _this.getRangeHeight(r, r),
                                width: width = _this.getRangeWidth(c, c)
                            };
                        }

                        if (cell) {
                            _this._renderCell(doc, cell, row, col, r, c, pX, pY[c]);
                        }

                        if (height) {
                            pY[c] += height - _this._borderWidth; // collapse borders
                        }

                        if (width) {
                            pX += width - _this._borderWidth; // collapse borders
                        }

                        if (skipC) {
                            c = skipC;
                        }
                    }
                });
            };

            PanelSectionRenderer.prototype._getCellValue = function (col, row) {
                var pnl = this.panel, value = pnl.getCellData(row, col, true);

                if (!value && value !== 0 && pnl.cellType === 1 /* Cell */) {
                    var flexRow = pnl.rows[row];

                    // seems that FlexGrid doesn't provide an API for getting group header text, so build it manually
                    if (flexRow instanceof _grid.GroupRow && flexRow.dataItem.groupDescription && col === pnl.columns.firstVisibleIndex) {
                        var propName = flexRow.dataItem.groupDescription.propertyName, column = pnl.columns.getColumn(propName);

                        if (column && column.header) {
                            propName = column.header;
                        }

                        value = propName + ': ' + flexRow.dataItem.name + ' (' + flexRow.dataItem.items.length + ' items)';
                    }
                }

                return value;
            };

            PanelSectionRenderer.prototype._isGroupRow = function (row) {
                return row instanceof _grid.GroupRow && row.hasChildren;
            };

            PanelSectionRenderer.prototype._renderCell = function (doc, cell, row, column, rowIndex, columnIndex, x, y) {
                var panel = this.panel;

                // clipping
                if (this._clipCells) {
                    var clientRect = doc._clientRect();
                    cell.height = Math.min(cell.height, clientRect.height);
                    cell.width = Math.min(cell.width, clientRect.width);
                }

                // merge cell styles
                var cellStyle = wijmo.pdf.merge({}, this._styles.cellStyle);

                switch (panel.cellType) {
                    case 1 /* Cell */:
                        if (this._isGroupRow(row)) {
                            wijmo.pdf.merge(cellStyle, this._styles.groupCellStyle, true);
                        } else {
                            if (rowIndex % 2 != 0) {
                                wijmo.pdf.merge(cellStyle, this._styles.altCellStyle, true);
                            }
                        }
                        break;

                    case 2 /* ColumnHeader */:
                    case 3 /* RowHeader */:
                    case 4 /* TopLeft */:
                        wijmo.pdf.merge(cellStyle, this._styles.headerCellStyle, true);
                        break;
                }

                // convert ICellStyle to CssStyleDeclaration
                var cssStyle = cellStyle;
                if (cellStyle.font) {
                    var tmp;

                    if (tmp = cellStyle.font.family) {
                        cssStyle.fontFamily = tmp;
                    }

                    if (tmp = cellStyle.font.size) {
                        cssStyle.fontSize = tmp;
                    }

                    if (tmp = cellStyle.font.style) {
                        cssStyle.fontStyle = tmp;
                    }

                    if (tmp = cellStyle.font.weight) {
                        cssStyle.fontWeight = tmp;
                    }

                    cellStyle.font = undefined;
                }

                // text horizontal alignment
                // TODO: Does the column.align and column.dataType properties correspond to each other? Need to check...
                if (!(row instanceof _grid.GroupRow && !column.aggregate)) {
                    switch (column.dataType) {
                        case 2 /* Number */:
                            cssStyle.textAlign = 'right';
                            break;

                        case 3 /* Boolean */:
                            cssStyle.textAlign = 'center';
                            break;
                    }
                }

                cssStyle.left = x;
                cssStyle.top = y;
                cssStyle.width = cell.width;
                cssStyle.height = cell.height;
                cssStyle.boxSizing = 'no-box';

                // required border styles
                cssStyle.borderWidth = this._borderWidth;
                cssStyle.borderStyle = 'solid';

                // add indent
                var grid = panel.grid;
                if (panel.cellType === 1 /* Cell */ && grid.rows.maxGroupLevel >= 0 && columnIndex === grid.columns.firstVisibleIndex) {
                    var level = (row instanceof _grid.GroupRow) ? Math.max(row.level, 0) : grid.rows.maxGroupLevel + 1;

                    var basePadding = wijmo.pdf.CssUtil.parseSize(cssStyle.paddingLeft || cssStyle.padding) || 0, levelPadding = wijmo.pdf.PxToPt(level * grid.treeIndent);

                    cssStyle.paddingLeft = (basePadding + levelPadding);
                }

                if (column.dataType === 3 /* Boolean */ && panel.cellType === 1 /* Cell */ && !this._isGroupRow(row)) {
                    doc.renderBooleanCell(cell.value, cssStyle);
                } else {
                    doc.renderTextCell(cell.value, cssStyle);
                }
            };
            return PanelSectionRenderer;
        })(PanelSection);

        var GridRenderer = (function () {
            function GridRenderer(flex, range, clipCells, repeatMergedValues, borderWidth, styles) {
                this._flex = flex;
                this._borderWidth = borderWidth;

                this._topLeft = new PanelSectionRenderer(flex, flex.topLeftCells, this._showRowHeader && this._showColumnHeader ? new RowRange(flex, [new _grid.CellRange(0, 0, flex.topLeftCells.rows.length - 1, flex.topLeftCells.columns.length - 1)]) : new RowRange(flex, []), clipCells, repeatMergedValues, borderWidth, styles);

                this._rowHeader = new PanelSectionRenderer(flex, flex.rowHeaders, this._showRowHeader ? range.clone(0, flex.rowHeaders.columns.length - 1) : new RowRange(flex, []), clipCells, repeatMergedValues, borderWidth, styles);

                this._columnHeader = new PanelSectionRenderer(flex, flex.columnHeaders, this._showColumnHeader ? new RowRange(flex, [new _grid.CellRange(0, range.leftCol, flex.columnHeaders.rows.length - 1, range.rightCol)]) : new RowRange(flex, []), clipCells, repeatMergedValues, borderWidth, styles);

                this._cells = new PanelSectionRenderer(flex, flex.cells, range, clipCells, repeatMergedValues, borderWidth, styles);
            }
            GridRenderer.prototype.render = function (doc) {
                var offsetX = Math.max(0, this._rowHeader.renderSize.width - this._borderWidth), offsetY = Math.max(0, this._columnHeader.renderSize.height - this._borderWidth);

                this._topLeft.render(doc, 0, 0);
                this._rowHeader.render(doc, 0, offsetY);
                this._columnHeader.render(doc, offsetX, 0);
                this._cells.render(doc, offsetX, offsetY);
            };

            Object.defineProperty(GridRenderer.prototype, "renderSize", {
                get: function () {
                    var height = this._columnHeader.renderSize.height + this._cells.renderSize.height, width = this._rowHeader.renderSize.width + this._cells.renderSize.width;

                    if (this._columnHeader.visibleRows > 0) {
                        height -= this._borderWidth;
                    }

                    if (this._rowHeader.visibleColumns > 0) {
                        width -= this._borderWidth;
                    }

                    return new wijmo.Size(width, height);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(GridRenderer.prototype, "_showColumnHeader", {
                get: function () {
                    return !!(this._flex.headersVisibility & 1 /* Column */);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(GridRenderer.prototype, "_showRowHeader", {
                get: function () {
                    return !!(this._flex.headersVisibility & 2 /* Row */);
                },
                enumerable: true,
                configurable: true
            });
            return GridRenderer;
        })();

        // A caching proxy for the flex.getMergedRange method, caches last vertical range for each column.
        var GetMergedRangeProxy = (function () {
            function GetMergedRangeProxy(flex) {
                this._columns = {};
                this._flex = flex;
            }
            GetMergedRangeProxy.prototype.getMergedRange = function (panel, r, c) {
                var rng = this._columns[c];

                if (rng && r >= rng.topRow && r <= rng.bottomRow) {
                    return rng;
                } else {
                    return this._columns[c] = this._flex.getMergedRange(panel, r, c, false);
                }
            };
            return GetMergedRangeProxy;
        })();

        var RowRange = (function () {
            function RowRange(flex, ranges) {
                this._flex = flex;
                this._ranges = ranges || [];
            }
            RowRange.getSelection = function (flex, exportMode) {
                var ranges = [];

                if (exportMode === 0 /* All */) {
                    ranges.push(new _grid.CellRange(0, 0, flex.rows.length - 1, flex.columns.length - 1));
                } else {
                    var selection = flex.selection;

                    switch (flex.selectionMode) {
                        case 0 /* None */:
                            break;

                        case 1 /* Cell */:
                        case 2 /* CellRange */:
                            ranges.push(selection);
                            break;

                        case 3 /* Row */:
                            ranges.push(new _grid.CellRange(selection.topRow, 0, selection.topRow, flex.cells.columns.length - 1));
                            break;

                        case 4 /* RowRange */:
                            ranges.push(new _grid.CellRange(selection.topRow, 0, selection.bottomRow, flex.cells.columns.length - 1));
                            break;

                        case 5 /* ListBox */:
                            var top = -1;

                            for (var r = 0; r < flex.rows.length; r++) {
                                var row = flex.rows[r];

                                if (row.isSelected) {
                                    if (top < 0) {
                                        top = r;
                                    }

                                    if (r === flex.rows.length - 1) {
                                        ranges.push(new _grid.CellRange(top, 0, r, flex.cells.columns.length - 1));
                                    }
                                } else {
                                    if (top >= 0) {
                                        ranges.push(new _grid.CellRange(top, 0, r - 1, flex.cells.columns.length - 1));
                                    }

                                    top = -1;
                                }
                            }

                            break;
                    }
                }

                return new RowRange(flex, ranges);
            };

            RowRange.prototype.length = function () {
                var res = 0;

                for (var i = 0; i < this._ranges.length; i++) {
                    var r = this._ranges[i];

                    if (r.isValid) {
                        res += r.bottomRow - r.topRow + 1;
                    }
                }

                return res;
            };

            Object.defineProperty(RowRange.prototype, "isValid", {
                get: function () {
                    return this._ranges.length && this._ranges[0].isValid;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RowRange.prototype, "leftCol", {
                get: function () {
                    if (this._ranges.length) {
                        return this._ranges[0].leftCol;
                    }

                    return -1;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RowRange.prototype, "rightCol", {
                get: function () {
                    if (this._ranges.length) {
                        return this._ranges[0].rightCol;
                    }

                    return -1;
                },
                enumerable: true,
                configurable: true
            });

            RowRange.prototype.clone = function (leftCol, rightCol) {
                var ranges = [];

                for (var i = 0; i < this._ranges.length; i++) {
                    var range = this._ranges[i].clone();

                    if (arguments.length > 0) {
                        range.col = leftCol;
                    }

                    if (arguments.length > 1) {
                        range.col2 = rightCol;
                    }

                    ranges.push(range);
                }

                return new RowRange(this._flex, ranges);
            };

            RowRange.prototype.getRenderSize = function (panel) {
                var res = new wijmo.Size(0, 0);

                for (var i = 0; i < this._ranges.length; i++) {
                    var size = this._ranges[i].getRenderSize(panel);

                    res.width = Math.max(res.width, size.width);
                    res.height += size.height;
                }

                return res;
            };

            RowRange.prototype.forEach = function (panel, fn) {
                var idx = 0;

                for (var i = 0; i < this._ranges.length; i++) {
                    var range = this._ranges[i];

                    if (range.isValid) {
                        for (var j = range.topRow; j <= range.bottomRow; j++) {
                            fn(panel.rows[j], range, j, idx++);
                        }
                    }
                }
            };

            RowRange.prototype.subrange = function (from, count, leftCol, rightCol) {
                var ranges = [];

                if (from >= 0 && count > 0) {
                    var start = 0, end = 0;

                    for (var i = 0; i < this._ranges.length && count > 0; i++, start = end + 1) {
                        var r = this._ranges[i];

                        end = start + (r.bottomRow - r.topRow);

                        if (from > end) {
                            continue;
                        }

                        var r1 = (from > start) ? r.topRow + (from - start) : r.topRow, r2 = Math.min(r.bottomRow, r1 + count - 1), lCol = arguments.length > 2 ? leftCol : r.leftCol, rCol = arguments.length > 2 ? rightCol : r.rightCol;

                        ranges.push(new _grid.CellRange(r1, lCol, r2, rCol));

                        count -= r2 - r1 + 1;
                    }
                }

                return new RowRange(this._flex, ranges);
            };
            return RowRange;
        })();
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexGridPdfConverter.js.map
