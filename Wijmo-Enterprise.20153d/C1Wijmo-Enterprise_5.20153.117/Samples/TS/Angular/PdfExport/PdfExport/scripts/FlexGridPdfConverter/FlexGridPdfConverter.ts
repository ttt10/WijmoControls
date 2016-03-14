module wijmo.grid {
	'use strict';

	/** Specifies how the grid content should be scaled to fit the page. */
	export enum ScaleMode {
		/** Render the grid in actual size, breaking pages as needed. */
		ActualSize,

		/** Scale the grid so it fits the page width. */
		PageWidth,

		/** Scale the grid so it fits on a single page. */
		SinglePage
	}

	/** Specifies which part of the grid should be rendered. */
	export enum ExportMode {
		/** Exports all the grid data. */
		All,

		/** Exports the current selection only. */
		Selection
	}

	/** Represents the look and feel of a cell. */
	export interface ICellStyle {
		/** Represents the background color of a cell. */
		backgroundColor?: string;

		/** Represents the border color of a cell. */
		borderColor?: string;

		/** Represents the font of a cell. */
		font?: wijmo.pdf.PdfFont;
	}

	/** Represents the look and feel of the @see:FlexGrid being exported. */
	export interface IFlexGridStyle {
		/** Specifies the cell style applied to cells within a @see:FlexGrid. */
		cellStyle?: ICellStyle;

		/** Represents the cell style applied to odd-numbered rows of the @see:FlexGrid. */
		altCellStyle?: ICellStyle;

		/** Represents the cell style applied to grouped rows of the @see:FlexGrid. */
		groupCellStyle?: ICellStyle;

		/** Represents the cell style applied to row headers and column headers of the @see:FlexGrid. */
		headerCellStyle?: ICellStyle;
	}


	/** Represents the export settings. */
	export interface IFlexGridExportSettings {
		/**
		* Represents an array of custom fonts that will be embedded into the document.
		*
		* This sample illustrates how to setup the FlexGridPdfConverter to use two custom fonts, Cuprum-Bold.ttf and Cuprum-Regular.ttf.
		* The first one is applied to the header cells only, while the second one is applied to all the remaining cells.
		*
		* <pre>wijmo.grid.FlexGridPdfConverter.export(flex, fileName, {
		*	embeddedFonts: [
		*		{
		*			source: 'resources/ttf/Cuprum-Bold.ttf',
		*			name: 'cuprum',
		*			style: 'normal',
		*			weight: 'bold'
		*		},
		*		{
		*			source: 'resources/ttf/Cuprum-Regular.ttf',
		*			name: 'cuprum',
		*			style: 'normal',
		*			weight: 'normal'
		*		}
		*	],
		*	styles: {
		*		cellStyle: {
		*			font: {
		*				family: 'cuprum'
		*			}
		*		},
		*		headerCellStyle: {
		*		    font: {
		*				weight: 'bold'
		*			}
		*		}
		*	}
		* });</pre>
		*/
		embeddedFonts?: wijmo.pdf.IPdfFontFile[];
		
		/** Determines the export mode. */
		exportMode?: ExportMode;

		/** Determines the maximum number of pages to export. */
		maxPages?: number;

		/** Indicates whether merged values should be repeated across pages when the merged range is split on multiple pages. */
		repeatMergedValuesAcrossPages?: boolean;

		/** Indicates whether star-sized columns widths should be recalculated against the PDF page width instead of using the grid's width. */
		recalculateStarWidths?: boolean;

		/** Determines the scale mode. */
		scaleMode?: ScaleMode;

		/** Represents the look and feel of a exported FlexGrid. */
		styles?: IFlexGridStyle;

		/** Represents the options of the underlying @see:PdfDocument. */
		documentOptions?: any;
	}

	/** Provides a functionality to export the @see:FlexGrid to PDF. */
	export class FlexGridPdfConverter {
		private static EmptyRange = new CellRange(-1, -1, -1, -1);
		private static BorderWidth = 1; // pt, hardcoded because of border collapsing.
		private static DefaultSettings: IFlexGridExportSettings = {
			maxPages: Number.MAX_VALUE,
			exportMode: ExportMode.Selection,
			scaleMode: ScaleMode.SinglePage,
			recalculateStarWidths: true,
			repeatMergedValuesAcrossPages: true,
			documentOptions: {
				compress: false, // turn off by default to improve performance
				documentInfo: {
				},
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

		/**
		 * Exports the @see:FlexGrid to PDF.
		 * @param flex The @see:FlexGrid instance to export.
		 * @param fileName Name of the file to export.
		 * @param settings The export settings.
		 */
		static export(flex: wijmo.grid.FlexGrid, fileName: string, settings?: IFlexGridExportSettings): void {
			assert(!!flex, 'The flex argument cannot be null.');
			assert(!!fileName, 'The fileName argument cannot be empty.');

			settings = wijmo.pdf.merge({}, settings), // clone
			wijmo.pdf.merge(settings, this.DefaultSettings);

			var originalEnded = settings.documentOptions.ended;

			settings.documentOptions.ended = (sender, args: wijmo.pdf.PdfDocumentEndedEventArgs) => {
				FlexGridPdfConverter._save(args.blob, fileName);

				if (originalEnded) {
					originalEnded.apply(doc, arguments);
				}
			};

			var doc = new wijmo.pdf.PdfDocument(settings.documentOptions);

			try {
				if (settings.recalculateStarWidths) {
					// Recalculate to get a lesser scale factor.
					flex.columns._updateStarSizes(wijmo.pdf.PtToPx(doc._clientRect().width));
				}

				var range = RowRange.getSelection(flex, settings.exportMode),
					grid = new GridRenderer(flex, range, false, false, this.BorderWidth, null);

				if (wijmo.isArray(settings.embeddedFonts)) {
					settings.embeddedFonts.forEach((font) => {
						doc.registerFont(font);
					});
				}

				var scaleFactor = this._getScaleFactor(grid, settings.scaleMode, doc._clientRect()),
					pages = this._getPages(flex, range, doc._clientRect(), settings, scaleFactor);

				for (var i = 0; i < pages.length; i++) {
					if (i > 0) { // PDFKit adds first page automatically
						doc._document.addPage();
					}

					doc._document
						.save()
						.scale(scaleFactor, scaleFactor, {
							origin: [doc._document.page.margins.left, doc._document.page.margins.top]
						});

					var gridPage = new GridRenderer(flex, pages[i], settings.scaleMode === ScaleMode.ActualSize, settings.repeatMergedValuesAcrossPages, this.BorderWidth, settings.styles);
					gridPage.render(doc);

					doc._document.restore();
				}

				doc.end();
			}
			finally {
				if (settings.recalculateStarWidths) {
					flex.invalidate(true); // Rollback changes
				}
			}
		}

		private static _getScaleFactor(grid: GridRenderer, scaleMode: ScaleMode, pageSize: Rect): number {
			var factor = 1;

			if (!(scaleMode === ScaleMode.PageWidth || scaleMode === ScaleMode.SinglePage)) {
				return factor;
			}

			var size = grid.renderSize;

			if (scaleMode === ScaleMode.SinglePage) {
				var f = Math.min(pageSize.width / size.width, pageSize.height / size.height);

				if (f < 1) {
					factor = f;
				}
			} else { // pageWidth
				var f = pageSize.width / size.width;

				if (f < 1) {
					factor = f;
				}
			}

			return factor;
		}

		private static _getPages(flex: wijmo.grid.FlexGrid, ranges: RowRange, pageSize: Rect, settings: IFlexGridExportSettings, scaleFactor: number): RowRange[] {
			var rowBreaks: number[] = [],
				colBreaks: number[] = [],
				p2u = wijmo.pdf.PxToPt,

				showColumnHeader = flex.headersVisibility & HeadersVisibility.Column,
				showRowHeader = flex.headersVisibility & HeadersVisibility.Row,

				colHeaderHeight = showColumnHeader ? p2u(flex.columnHeaders.height) : 0,
				rowHeaderWidth = showRowHeader ? p2u(flex.rowHeaders.width) : 0,

				breakRows = settings.scaleMode === ScaleMode.ActualSize || settings.scaleMode === ScaleMode.PageWidth,
				breakColumns = settings.scaleMode === ScaleMode.ActualSize,

				pageWidth = pageSize.width * (1 / scaleFactor),
				pageHeight = pageSize.height * (1 / scaleFactor),

				totalHeight = colHeaderHeight,
				totalWidth = rowHeaderWidth;

			if (breakRows) {
				var visibleRowsCnt = 0;

				ranges.forEach(flex.cells, (row, rng, rIdx, sIdx) => {
					if (row.isVisible) {
						var rowHeight = p2u(row.renderHeight);

						visibleRowsCnt++;
						totalHeight += rowHeight;

						if (showColumnHeader || visibleRowsCnt > 1) {
							totalHeight -= this.BorderWidth; // border collapse
						}

						if (totalHeight > pageHeight) {
							if (colHeaderHeight + rowHeight > pageHeight) { // current row is too big, break on it
								rowBreaks.push(sIdx);
								totalHeight = colHeaderHeight;
							} else { // break on previous row
								rowBreaks.push(sIdx - 1);
								totalHeight = colHeaderHeight + rowHeight;
							}

							if (showColumnHeader) {
								totalHeight -= this.BorderWidth; // border collapse
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
					var col = <Column>flex.columns[i];

					if (col.isVisible) {
						var colWidth = p2u(col.renderWidth);

						visibleColumnsCnt++;
						totalWidth += colWidth;

						if (showRowHeader > 0 || visibleColumnsCnt > 1) {
							totalWidth -= this.BorderWidth; // border collapse
						}

						if (totalWidth > pageWidth) {
							if (rowHeaderWidth + colWidth > pageWidth) { // current columns is too big, break on it
								colBreaks.push(i);
								totalWidth = rowHeaderWidth;
							} else { // break on previous column
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

			var pages: RowRange[] = [],
				flag = false,
				pageCount = 1;

			for (var i = 0; i < rowBreaks.length && !flag; i++) {
				for (var j = 0; j < colBreaks.length && !flag; j++, pageCount++) {

					if (!(flag = pageCount > settings.maxPages)) {
						var r = i == 0 ? 0 : rowBreaks[i - 1] + 1,
							c = j == 0 ? ranges.leftCol : colBreaks[j - 1] + 1;

						pages.push(ranges.subrange(r, rowBreaks[i] - r + 1, c, colBreaks[j]));
					}
				}
			}

			return pages;
		}

		private static _save(blob: Blob, fileName: string): void {
			if (!blob || !(blob instanceof Blob) || !fileName) {
				return;
			}

			if (navigator.msSaveBlob) {
				navigator.msSaveBlob(blob, fileName);
			} else {
				var link = <HTMLAnchorElement>document.createElement('a'),
					click = function (element) {
						var evnt = <MouseEvent>document.createEvent('MouseEvents');
						evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
						element.dispatchEvent(evnt);
					},
					fr = new FileReader();

				// Save a blob using data URI scheme
				fr.onloadend = (e) => {
					(<any>link).download = fileName;
					link.href = fr.result;
					click(link);
					link = null;
				};

				fr.readAsDataURL(blob);
			}
		}
	}

	interface IDraftCell {
		width: number;
		height: number;
		value: any;
	}

	class PanelSection {
		private _range: RowRange;
		private _panel: GridPanel;

		private _visibleRows: number;
		private _visibleColumns: number;
		private _size: Size;

		constructor(panel: GridPanel, range: RowRange) {
			this._panel = panel;
			this._range = range.clone();
		}

		public get visibleRows(): number {
			if (this._visibleRows == null) {
				this._visibleRows = 0;

				this._range.forEach(this._panel, (row) => {
					if (row.isVisible) {
						this._visibleRows++;
					}
				});
			}

			return this._visibleRows;
		}

		public get visibleColumns(): number {
			if (this._visibleColumns == null) {
				this._visibleColumns = 0;

				if (this._range.isValid) {
					for (var i = this._range.leftCol; i <= this._range.rightCol; i++) {
						if ((<Column>this._panel.columns[i]).isVisible) {
							this._visibleColumns++;
						}
					}
				}
			}

			return this._visibleColumns;
		}

		// pt units
		public get size(): Size {
			if (this._size == null) {
				var sz = this._range.getRenderSize(this._panel);

				this._size = new Size(wijmo.pdf.PxToPt(sz.width), wijmo.pdf.PxToPt(sz.height));
			}

			return this._size;
		}

		public get range(): RowRange {
			return this._range;
		}

		public get panel(): GridPanel {
			return this._panel;
		}
	}

	class PanelSectionRenderer extends PanelSection {
		private _borderWidth: number;
		private _flex: wijmo.grid.FlexGrid;
		private _renderSize: Size;
		private _clipCells: boolean;
		private _repeatMergedValues: boolean;
		private _styles: IFlexGridStyle;

		constructor(flex: wijmo.grid.FlexGrid, panel: wijmo.grid.GridPanel, range: RowRange, clipCells: boolean, repeatMergedValues: boolean, borderWidth: number, styles: IFlexGridStyle) {
			super(panel, range);
			this._flex = flex;
			this._clipCells = clipCells;
			this._repeatMergedValues = repeatMergedValues;
			this._borderWidth = borderWidth;
			this._styles = styles;
		}

		// pt units
		public get renderSize(): Size {
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
		}

		public getRangeWidth(leftCol: number, rightCol: number): number {
			var width = 0,
				visibleColumns = 0,
				pnl = this.panel;

			for (var i = leftCol; i <= rightCol; i++) {
				var col = <Column>pnl.columns[i];
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
		}

		public getRangeHeight(topRow: number, bottomRow: number): number {
			var height = 0,
				visibleRows = 0,
				pnl = this.panel;

			for (var i = topRow; i <= bottomRow; i++) {
				var row = <Row>pnl.rows[i];
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
		}

		public render(doc: wijmo.pdf.PdfDocument, x: number, y: number): void {
			var ranges = this.range,
				pnl = this.panel,
				mngr = new GetMergedRangeProxy(this._flex);

			if (!ranges.isValid) {
				return;
			}

			var	pY: { [key: number]: number } = {}; // tracks the current Y position for each column

			for (var c = ranges.leftCol; c <= ranges.rightCol; c++) {
				pY[c] = y;
			}

			ranges.forEach(pnl, (row, rng, r) => {
				if (!row.isVisible) {
					return;
				}

				var pX = x;

				for (var c = ranges.leftCol; c <= ranges.rightCol; c++) {
					var col = <Column>pnl.columns[c],
						cell: IDraftCell = undefined,
						height: number = undefined,
						width: number = undefined,
						skipC: number = undefined;

					if (!col.isVisible) {
						continue;
					}

					var value = this._getCellValue(c, r),
						mergedRng: CellRange;

					if ((row.allowMerging || col.allowMerging || row instanceof GroupRow) && (mergedRng = mngr.getMergedRange(pnl, r, c))) {
						if (mergedRng.topRow !== mergedRng.bottomRow) { // vertical merging
							if (mergedRng.topRow === r || r === rng.topRow) { // The very first cell or the remains of the range spreaded between multiple pages
								cell = {
									value: this._repeatMergedValues
										? value
										: (mergedRng.topRow === r ? value : ''), // set value to the very fist cell of the merged range only
									height: height = this.getRangeHeight(r, Math.min(mergedRng.bottomRow, rng.bottomRow)),
									width: width = this.getRangeWidth(c, c)
								};
							} else {
								width = this.getRangeWidth(c, c); // an absorbed cell
							}

						} else { // horizontal merging
							// c === mrg.leftCol means the very first cell of the range, otherwise it is the remains of the range spreaded between multiple pages
							cell = {
								value: this._repeatMergedValues
									? value
									: (c === mergedRng.leftCol ? value : ''), // set value to the very fist cell of the merged range only
								height: height = this.getRangeHeight(r, r),
								width: width = this.getRangeWidth(Math.max(ranges.leftCol, mergedRng.leftCol), Math.min(ranges.rightCol, mergedRng.rightCol))
							};

							// skip absorbed cells until the end of the merged range or page (which comes first)
							skipC = Math.min(ranges.rightCol, mergedRng.rightCol); // to update loop variable later
							for (var t = c + 1; t <= skipC; t++) {
								pY[t] += height - this._borderWidth; // collapse borders
							}
						}
					} else { // an ordinary cell
						cell = {
							value: value,
							height: height = this.getRangeHeight(r, r),
							width: width = this.getRangeWidth(c, c)
						}
					}

					if (cell) {
						this._renderCell(doc, cell, row, col, r, c, pX, pY[c]);
					}

					if (height) {
						pY[c] += height - this._borderWidth; // collapse borders
					}

					if (width) {
						pX += width - this._borderWidth; // collapse borders
					}

					if (skipC) {
						c = skipC;
					}
				}
			});
		}

		private _getCellValue(col: number, row: number): any {
			var pnl = this.panel,
				value = pnl.getCellData(row, col, true);

			if (!value && value !== 0 && pnl.cellType === CellType.Cell) { // then try to get group header text
				var flexRow = <Row>pnl.rows[row];

				// seems that FlexGrid doesn't provide an API for getting group header text, so build it manually
				if (flexRow instanceof GroupRow && flexRow.dataItem.groupDescription && col === pnl.columns.firstVisibleIndex) {
					var propName = flexRow.dataItem.groupDescription.propertyName,
						column = <Column>pnl.columns.getColumn(propName);

					if (column && column.header) {
						propName = column.header;
					}

					value = propName + ': ' + flexRow.dataItem.name + ' (' + flexRow.dataItem.items.length + ' items)';
				}
			}

			return value;
		}

		private _isGroupRow(row: Row): boolean {
			return row instanceof GroupRow && (<GroupRow>row).hasChildren; // Group row with no children should be treated as a data row (hierarchical grid)
		}

		private _renderCell(doc: wijmo.pdf.PdfDocument, cell: IDraftCell,
			row: Row, column: Column, rowIndex: number, columnIndex: number,
			x: number, y: number): void
		{
			var panel = this.panel;

			// clipping
			if (this._clipCells) {
				var clientRect = doc._clientRect();
				cell.height = Math.min(cell.height, clientRect.height);
				cell.width = Math.min(cell.width, clientRect.width);
			}

			// merge cell styles
			var cellStyle: ICellStyle = wijmo.pdf.merge({}, this._styles.cellStyle);
			
			switch (panel.cellType) {
				case CellType.Cell:
					if (this._isGroupRow(row)) { 
						wijmo.pdf.merge(cellStyle, this._styles.groupCellStyle, true);
					} else {
						if (rowIndex % 2 != 0) {
							wijmo.pdf.merge(cellStyle, this._styles.altCellStyle, true);
						}
					}
					break;

				case CellType.ColumnHeader:
				case CellType.RowHeader:
				case CellType.TopLeft:
					wijmo.pdf.merge(cellStyle, this._styles.headerCellStyle, true);
					break;
			}

			// convert ICellStyle to CssStyleDeclaration
			var cssStyle: CSSStyleDeclaration = <any>cellStyle; // sharing the some object!
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
			if (!(row instanceof GroupRow && !column.aggregate)) {
				switch (column.dataType) {
					case DataType.Number:
						cssStyle.textAlign = 'right';
						break;

					case DataType.Boolean:
						cssStyle.textAlign = 'center';
						break;
				}
			}

			cssStyle.left = <any>x;
			cssStyle.top = <any>y;
			cssStyle.width = <any>cell.width;
			cssStyle.height = <any>cell.height;
			cssStyle.boxSizing = 'no-box';
			// required border styles
			cssStyle.borderWidth = <any>this._borderWidth;
			cssStyle.borderStyle = 'solid';

			// add indent
			var grid = panel.grid;
			if (panel.cellType === CellType.Cell && grid.rows.maxGroupLevel >= 0 && columnIndex === grid.columns.firstVisibleIndex) {
				var level = (row instanceof GroupRow)
					? Math.max((<GroupRow>row).level, 0) // group row cell
					: grid.rows.maxGroupLevel + 1; // data cell

				var basePadding = wijmo.pdf.CssUtil.parseSize(cssStyle.paddingLeft || cssStyle.padding) || 0,
					levelPadding = wijmo.pdf.PxToPt(level * grid.treeIndent);

				cssStyle.paddingLeft = <any>(basePadding + levelPadding);
			} 

			if (column.dataType === DataType.Boolean && panel.cellType === CellType.Cell && !this._isGroupRow(row)) {
				doc.renderBooleanCell(cell.value, cssStyle);
			} else {
				doc.renderTextCell(cell.value, cssStyle);
			}
		}
	}

	class GridRenderer {
		private _flex: FlexGrid;
		private _borderWidth: number;

		private _topLeft: PanelSectionRenderer;
		private _rowHeader: PanelSectionRenderer;
		private _columnHeader: PanelSectionRenderer;
		private _cells: PanelSectionRenderer;

		constructor(flex: FlexGrid, range: RowRange, clipCells: boolean, repeatMergedValues: boolean, borderWidth: number, styles: IFlexGridStyle) {
			this._flex = flex;
			this._borderWidth = borderWidth;

			this._topLeft = new PanelSectionRenderer(flex, flex.topLeftCells,
				this._showRowHeader && this._showColumnHeader
					? new RowRange(flex, [new CellRange(0, 0, flex.topLeftCells.rows.length - 1, flex.topLeftCells.columns.length - 1)])
					: new RowRange(flex, []),
				clipCells,
				repeatMergedValues,
				borderWidth,
				styles);

			this._rowHeader = new PanelSectionRenderer(flex, flex.rowHeaders,
				this._showRowHeader
					? range.clone(0, flex.rowHeaders.columns.length - 1)
					: new RowRange(flex, []),
				clipCells,
				repeatMergedValues,
				borderWidth,
				styles);

			this._columnHeader = new PanelSectionRenderer(flex, flex.columnHeaders,
				this._showColumnHeader
					? new RowRange(flex, [new CellRange(0, range.leftCol, flex.columnHeaders.rows.length - 1, range.rightCol)])
					: new RowRange(flex, []),
				clipCells,
				repeatMergedValues,
				borderWidth,
				styles);

			this._cells = new PanelSectionRenderer(flex, flex.cells, range, clipCells, repeatMergedValues, borderWidth, styles);
		}

		public render(doc: wijmo.pdf.PdfDocument) {
			var offsetX = Math.max(0, this._rowHeader.renderSize.width - this._borderWidth),
				offsetY = Math.max(0, this._columnHeader.renderSize.height - this._borderWidth);

			this._topLeft.render(doc, 0, 0);
			this._rowHeader.render(doc, 0, offsetY);
			this._columnHeader.render(doc, offsetX, 0);
			this._cells.render(doc, offsetX, offsetY);
		}

		public get renderSize(): Size {
			var height = this._columnHeader.renderSize.height + this._cells.renderSize.height,
				width = this._rowHeader.renderSize.width + this._cells.renderSize.width;

			if (this._columnHeader.visibleRows > 0) {
				height -= this._borderWidth;
			}

			if (this._rowHeader.visibleColumns > 0) {
				width -= this._borderWidth;
			}

			return new Size(width, height);
		}

		private get _showColumnHeader(): boolean {
			return !!(this._flex.headersVisibility & HeadersVisibility.Column);
		}

		private get _showRowHeader(): boolean {
			return !!(this._flex.headersVisibility & HeadersVisibility.Row);
		}
	}

	// A caching proxy for the flex.getMergedRange method, caches last vertical range for each column.
	class GetMergedRangeProxy {
		private _flex: FlexGrid;
		private _columns: { [key: number]: CellRange } = {};

		constructor(flex: FlexGrid) {
			this._flex = flex;
		}

		public getMergedRange(panel: GridPanel, r: number, c: number): CellRange {
			var rng = this._columns[c];

			if (rng && r >= rng.topRow && r <= rng.bottomRow) {
				return rng;
			} else {
				return this._columns[c] = this._flex.getMergedRange(panel, r, c, false);
			}
		}
	}

	class RowRange {
		public static getSelection(flex: FlexGrid, exportMode: ExportMode): RowRange {
			var ranges: CellRange[] = [];

			if (exportMode === ExportMode.All) {
				ranges.push(new CellRange(0, 0, flex.rows.length - 1, flex.columns.length - 1));
			} else {
				var selection = flex.selection;

				switch (flex.selectionMode) {
					case SelectionMode.None:
						break;

					case SelectionMode.Cell:
					case SelectionMode.CellRange:
						ranges.push(selection);
						break;

					case SelectionMode.Row:
						ranges.push(new CellRange(selection.topRow, 0, selection.topRow, flex.cells.columns.length - 1));
						break;

					case SelectionMode.RowRange:
						ranges.push(new CellRange(selection.topRow, 0, selection.bottomRow, flex.cells.columns.length - 1));
						break;

					case SelectionMode.ListBox:
						var top = -1;

						for (var r = 0; r < flex.rows.length; r++) {
							var row = <Row>flex.rows[r];

							if (row.isSelected) {
								if (top < 0) {
									top = r;
								}

								if (r === flex.rows.length - 1) {
									ranges.push(new CellRange(top, 0, r, flex.cells.columns.length - 1));
								}
							} else {
								if (top >= 0) {
									ranges.push(new CellRange(top, 0, r - 1, flex.cells.columns.length - 1));
								}

								top = -1;
							}
						}

						break;
				}
			}

			return new RowRange(flex, ranges);
		}

		private _flex: FlexGrid;
		private _ranges: CellRange[];

		constructor(flex: FlexGrid, ranges: CellRange[]) {
			this._flex = flex;
			this._ranges = ranges || [];
		}

		public length(): number {
			var res = 0;

			for (var i = 0; i < this._ranges.length; i++) {
				var r = this._ranges[i];

				if (r.isValid) {
					res += r.bottomRow - r.topRow + 1;
				}
			}

			return res;
		}

		public get isValid(): boolean {
			return this._ranges.length && this._ranges[0].isValid;
		}

		public get leftCol(): number {
			if (this._ranges.length) {
				return this._ranges[0].leftCol;
			}

			return -1;
		}

		public get rightCol(): number {
			if (this._ranges.length) {
				return this._ranges[0].rightCol;
			}

			return -1;
		}

		public clone(leftCol?: number, rightCol?: number): RowRange {
			var ranges: CellRange[] = [];

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
		}

		public getRenderSize(panel: GridPanel): Size {
			var res = new Size(0, 0);

			for (var i = 0; i < this._ranges.length; i++) {
				var size = this._ranges[i].getRenderSize(panel);

				res.width = Math.max(res.width, size.width);
				res.height += size.height;
			}

			return res;
		}

		public forEach(panel: GridPanel, fn: (row: Row, range?: CellRange, rowIdx?: number, seqIdx?: number) => void): void {
			var idx = 0;

			for (var i = 0; i < this._ranges.length; i++) {
				var range = this._ranges[i];

				if (range.isValid) {
					for (var j = range.topRow; j <= range.bottomRow; j++) {
						fn(panel.rows[j], range, j, idx++);
					}
				}
			}
		}

		public subrange(from: number, count: number, leftCol?: number, rightCol?: number): RowRange {
			var ranges: CellRange[] = [];

			if (from >= 0 && count > 0) {
				var	start = 0,
					end = 0;

				for (var i = 0; i < this._ranges.length && count > 0; i++, start = end + 1) {
					var r = this._ranges[i];

					end = start + (r.bottomRow - r.topRow);

					if (from > end) {
						continue;
					}

					var r1 = (from > start) ? r.topRow + (from - start) : r.topRow,
						r2 = Math.min(r.bottomRow, r1 + count - 1),
						lCol = arguments.length > 2 ? leftCol : r.leftCol,
						rCol = arguments.length > 2 ? rightCol : r.rightCol;

					ranges.push(new CellRange(r1, lCol, r2, rCol));

					count -= r2 - r1 + 1;
				}
			}

			return new RowRange(this._flex, ranges);
		}
	}
} 