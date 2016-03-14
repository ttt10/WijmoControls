﻿var wijmo;
(function (wijmo) {
    (function (_grid) {
        /**
        * Extension that creates column groups for @see:FlexGrid controls.
        */
        (function (columngroups) {
            'use strict';

            var ColumnGroupProvider = (function () {
                /**
                * Initializes a new instance of a @see:ColumngroupCreator object.
                *
                * @param grid The @see:FlexGrid object that owns this @see:DetailMergeManager.
                * @param columnGroups Array containing objects with @see:Column properties and
                * an optional "columns" property that contains sub-columns.
                */
                function ColumnGroupProvider(grid, columnGroups) {
                    var _this = this;
                    this._g = grid;
                    this._groups = columnGroups;
                    this._selectOnClick = true;

                    // create the columns
                    grid.autoGenerateColumns = false;
                    this._createColumnGroups(columnGroups, 0);

                    // merge the headers
                    this._mergeColumnGroups();

                    // center-align headers vertically and horizontally
                    grid.formatItem.addHandler(function (s, e) {
                        if (e.panel == grid.columnHeaders) {
                            wijmo.setCss(e.cell, {
                                display: 'table',
                                tableLayout: 'fixed'
                            });
                            e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
                            wijmo.setCss(e.cell.children[0], {
                                display: 'table-cell',
                                verticalAlign: 'middle',
                                textAlign: 'center'
                            });
                        }
                    });

                    // select column groups by clicking the merged headers
                    grid.addEventListener(grid.hostElement, 'click', function (e) {
                        if (_this._selectOnClick) {
                            var ht = grid.hitTest(e);
                            if (ht.panel == grid.columnHeaders) {
                                var rng = grid.getMergedRange(grid.columnHeaders, ht.row, ht.col, false) || ht.range;
                                grid.select(new wijmo.grid.CellRange(0, rng.col, grid.rows.length - 1, rng.col2));
                                e.preventDefault();
                            }
                        }
                    });

                    // prevent sort/drag when selectOnClick is true
                    grid.sortingColumn.addHandler(function (s, e) {
                        if (_this._selectOnClick) {
                            e.cancel = true;
                        }
                    });
                    grid.draggingColumn.addHandler(function (s, e) {
                        if (_this._selectOnClick) {
                            e.cancel = true;
                        }
                    });
                }
                Object.defineProperty(ColumnGroupProvider.prototype, "selectOnClick", {
                    // ** object model
                    get: function () {
                        return this._selectOnClick;
                    },
                    set: function (value) {
                        this._selectOnClick = wijmo.asBoolean(value);
                    },
                    enumerable: true,
                    configurable: true
                });

                // ** implementation
                // create the column groups
                ColumnGroupProvider.prototype._createColumnGroups = function (groups, level) {
                    // prepare to generate columns
                    var colHdrs = this._g.columnHeaders;

                    // add an extra header row if necessary
                    if (level >= colHdrs.rows.length) {
                        colHdrs.rows.splice(colHdrs.rows.length, 0, new wijmo.grid.Row());
                    }

                    for (var i = 0; i < groups.length; i++) {
                        var group = groups[i];
                        if (!group.columns) {
                            // create a single column
                            var col = new wijmo.grid.Column();

                            for (var prop in group) {
                                if (prop in col) {
                                    col[prop] = group[prop];
                                }
                            }

                            // add the new column to the grid, set the header
                            this._g.columns.push(col);
                            colHdrs.setCellData(level, colHdrs.columns.length - 1, group.header);
                        } else {
                            // get starting column index for this group
                            var colIndex = colHdrs.columns.length;

                            // create columns for this group
                            this._createColumnGroups(group.columns, level + 1);

                            for (var j = colIndex; j < colHdrs.columns.length; j++) {
                                colHdrs.setCellData(level, j, group.header);
                            }
                        }
                    }
                };

                // merge the column group headers
                ColumnGroupProvider.prototype._mergeColumnGroups = function () {
                    // merge headers
                    var colHdrs = this._g.columnHeaders;
                    this._g.allowMerging = 2 /* ColumnHeaders */;

                    for (var r = 0; r < colHdrs.rows.length; r++) {
                        colHdrs.rows[r].allowMerging = true;
                    }

                    for (var c = 0; c < colHdrs.columns.length; c++) {
                        colHdrs.columns[c].allowMerging = true;
                    }

                    for (var c = 0; c < colHdrs.columns.length; c++) {
                        for (var r = 1; r < colHdrs.rows.length; r++) {
                            var hdr = colHdrs.getCellData(r, c, true);
                            if (!hdr || hdr == colHdrs.columns[c].binding) {
                                var hdr = colHdrs.getCellData(r - 1, c, true);
                                colHdrs.setCellData(r, c, hdr);
                            }
                        }
                    }

                    for (var c = 0; c < this._g.topLeftCells.columns.length; c++) {
                        this._g.topLeftCells.columns[c].allowMerging = true;
                    }
                };
                return ColumnGroupProvider;
            })();
            columngroups.ColumnGroupProvider = ColumnGroupProvider;
        })(_grid.columngroups || (_grid.columngroups = {}));
        var columngroups = _grid.columngroups;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ColumnGroupProvider.js.map
