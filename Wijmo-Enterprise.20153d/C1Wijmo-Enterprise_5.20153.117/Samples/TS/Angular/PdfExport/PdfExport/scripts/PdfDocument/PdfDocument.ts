//#region PdfDocument.ts
module wijmo.pdf {
	'use strict';

	/** Specifies the page orientation. */
	export enum PdfPageOrientation {
		/** Portrait orientation. */
		Portrait,

		/** Landscape orientation. */
		Landscape
	}

	// Wraps the PdfKit's SIZES object.
	/** Specifies the page size. */
	export enum PdfPageSize {
		'4A0',
		'2A0',
		A0,
		A1,
		A2,
		A3,
		A4,
		A5,
		A6,
		A7,
		A8,
		A9,
		A10,
		B0,
		B1,
		B2,
		B3,
		B4,
		B5,
		B6,
		B7,
		B8,
		B9,
		B10,
		C0,
		C1,
		C2,
		C3,
		C4,
		C5,
		C6,
		C7,
		C8,
		C9,
		C10,
		RA0,
		RA1,
		RA2,
		RA3,
		RA4,
		SRA0,
		SRA1,
		SRA2,
		SRA3,
		SRA4,
		EXECUTIVE,
		FOLIO,
		LEGAL,
		LETTER,
		TABLOID
	}

	/**
	 * Represents the font attributes.
	 */
	export interface IPdfFontAttributes {
		/** Glyphs have finishing strokes, flared or tapering ends, or have actual serifed endings. */
		cursive?: boolean;

		/** Fantasy fonts are primarily decorative fonts that contain playful representations of characters. */
		fantasy?: boolean;

		/** All glyphs have the same fixed width. */
		monospace?: boolean;

		/** Glyphs have finishing strokes, flared or tapering ends, or have actual serifed endings. */
		serif?: boolean;

		/** Glyphs have stroke endings that are plain. */
		sansSerif?: boolean;
	}

	/**
	 * Represents the settings of the font to register.
	 */
	export interface IPdfFontFile extends IPdfFontAttributes {
		/** An ArrayBuffer containing binary data or URL to load the font from. Following font formats are supprorted: TrueType (.ttf), TrueType Collection (.ttc), Datafork TrueType (.dfont). */
		source: any; /*ArrayBuffer | string */
		
		/** The name of the font to use. */
		name: string;
		
		/** The style of the font. One of the following values: 'normal', 'italic', 'oblique'. */
		style?: string;
		
		/** The weight of the font. One of the following values: 'normal', 'bold', 100, 200, 300, 400, 500, 600, 700, 800, 900. */
		weight?: any;

		/** An optional parameter determining the TrueType Collection font family. */
		ttcFamily?: string;
	}

	/**
	 * Represents the document information.
	 */
	export interface IPdfDocumentInfo {
		/**
		 * Determines the name of the person who created the document.
		 */
		author?: string;

		/**
		 * Determines the date and time the document was created.
		 */
		creationDate?: Date;

		/**
		 * Determines the keywords associated with the document. 
		 */
		keywords?: string;

		/**
		 * Determines the date and time the document was most recently modified.
		 */
		modDate?: Date;

		/**
		 * Determines the sets the subject of the document.
		 */
		subject?: string;

		/**
		 * Determines the title of the document.
		 */
		title?: string;
	}

	/**
	 * Represents the page settings.
	 */
	export interface IPdfPageSettings {
		/**
		 * Determines the layout of the page.
		 */
		layout?: PdfPageOrientation;

		/**
		 * Determines the margins of the page.
		 */
		margins?: IPdfKitPageMargins;

		/**
		 * Determines the size of the page.
		 */
		size?: PdfPageSize;
	}

	/**
	 * Represents a section of the document like header and footer.
	 */
	export interface IPdfPageSection {
		/** Determines the font. */
		font?: PdfFont;

		/** Determines the height of the page section. */
		height?: number;

		/**
		 * Determines the text of the page section.
		 * May contain up to 3 tabular characters ('\t') which are used for separating the text into the parts that will be aligned within the section area using 'left', 'right' and 'center' alignment.
		 * 2 kinds of macros are supported, '&[Page]' and '&[Pages]'. The former one designates the current page index while the latter one designates the total pages count.
		 */
		text?: string;

		/**
		 * Determines the color of the text.
		 */
		textColor?: string;
	}

	//#region internal interfaces
	interface IPdfDocumentOptions {
		compress?: boolean;
		documentInfo?: IPdfDocumentInfo;
		footer?: IPdfPageSection;
		header?: IPdfPageSection;
		ended?: (sender: any, args: PdfDocumentEndedEventArgs) => void;
		pageAdded?: (sender: any, args: PdfDocumentPageAddedEventArgs) => void;
		pageSettings?: IPdfPageSettings;
	}

	interface ICellInfo {
		contentX: number;
		contentY: number;
		contentHeight: number;
		contentWidth: number;
	}
	//#endregion

	/**
	 * Represents a wrapper of the PDFDocument object.
	 */
	export class PdfDocument {
		private static DEF_SECTION_HEIGHT = 25;
		private static DEF_FONT_STROKE_COLOR = 'black';
		private static IE = 'ActiveXObject' in window;

		private _ehOnDocData: Function;
		private _ehOnDocEnding: Function;
		private _ehOnDocEnded: Function;
		private _ehOnPageAdding: (doc: IPdfKitDocument, options: IPdfKitPageOptions) => void;
		private _ehOnPageAdded: (doc: IPdfKitDocument, pageIndex: number) => void;

		private _doc: IPdfKitDocument;
		private _chunks: any[] = [];
		private _fontReg: FontRegistrar;
		private _compress: boolean = true;

		/**
		 * Initializes a new instance of the @see:PdfDocument class.
		 *
		 * @param options An optional object containing initialization settings.
		 */
		constructor(options?: any) {
			wijmo.copy(this, options);

			this._doc = new PDFDocument(this._createPdfKitOptions(options));

			this._fontReg = new FontRegistrar(this._doc);

			this._doc
				.on('data', this._ehOnDocData = (chunk) => { this._onDocData(chunk); })
				.on('ending', this._ehOnDocEnding = () => {	this._onDocEnding(); })
				.on('end', this._ehOnDocEnded = () => { this._onDocEnded(); });
		}

		_copy(key: string, value: any): boolean {
			if (key === 'compress') {
				this._compress = asBoolean(value);
				return true;
			}
			return false;
		}

		//#region public properties

		/** Gets a value that determines whether the document should be compressed or not. */
		public get compress(): boolean {
			return this._compress;
		}

		/**
		 * Gets the underlying PDFDocument object.
		 */
		public get _document(): IPdfKitDocument {
			return this._doc;
		}

		/**
		 * Gets the document information.
		 */
		public documentInfo: IPdfDocumentInfo = {
			author: undefined,
			creationDate: undefined,
			keywords: undefined,
			modDate: undefined,
			subject: undefined,
			title: undefined
		};

		/**
		 * Gets the page settings.
		 */
		public pageSettings: IPdfPageSettings = {
			layout: PdfPageOrientation.Portrait,
			size: PdfPageSize.LETTER,
			margins: {
				top: 72,
				left: 72,
				bottom: 72,
				right: 72
			}
		};

		/**
		 * Gets an object that represents the page's footer settings.
		 */
		public header: IPdfPageSection = {
			font: new PdfFont(''),
			text: '',
			textColor: PdfDocument.DEF_FONT_STROKE_COLOR,
			height: PdfDocument.DEF_SECTION_HEIGHT
		};

		/**
		 * Gets an object that represents the page's header settings.
		 */
		public footer: IPdfPageSection = {
			font: new PdfFont(''),
			text: '',
			textColor: PdfDocument.DEF_FONT_STROKE_COLOR,
			height: PdfDocument.DEF_SECTION_HEIGHT
		}

		//#endregion public properties

		//#region public
		/**
		 * Disposes the document.
		 */
		public dispose() {
			if (this._doc) {
				this._doc
					.removeEventListener('data', this._ehOnDocData)
					.removeEventListener('ending', this._ehOnDocEnding)
					.removeEventListener('end', this._ehOnDocEnded)
					.removeEventListener('pageAdding', this._ehOnPageAdding)
					.removeEventListener('pageAdded', this._ehOnPageAdded);

				this._doc = null;
				this._chunks = null;
			}
		}

		/**
		 * Finishes the document rendering.
		 */
		public end(): void {
			this._doc.end();
		}

		/**
		 * Occurs when the document rendering is done.
		 */
		public ended = new wijmo.Event();
		/**
		 * Raises the @see:end event.
		 */
		public onEnded(args: PdfDocumentEndedEventArgs) {
			if (this.ended) {
				this.ended.raise(this, args);
			}
		}

		/**
		 * Occurs when a new page is added to the document.
		 */
		public pageAdded = new wijmo.Event();
		/**
		 * Raises the @see:pageAdded event.
		 */
		public onPageAdded(args: PdfDocumentPageAddedEventArgs) {
			if (this.pageAdded) {
				this.pageAdded.raise(this, args);
			}
		}

		/**
		 * Renders a cell with a checkbox inside.
		 *
		 * The following CSSStyleDeclaration properties are supported for now:
		 *   left, top
		 *   width, height
		 *	 border<Left \ Right\ Top\ Bottom>Style (if 'none' then no border, otherwise a solid border)
		 *	 border<Left\ Right\ Top\ Bottom>Width,
		 *	 border<Left\ Right\ Top\ Bottom>Color
		 *   backgroundColor
		 *   boxSizing (content-box + border-box)
		 *	 padding<Left\ Top\ Right\ Bottom>
		 *   textAlign
		 *   fontFamily, fontStyle, fontWeight, fontSize
		 *
		 * @param value Boolean value.
		 * @param style A CSSStyleDeclaration object that represents the cell style and positioning.
		 *
		 * @return A reference to the document.
		 */
		public renderBooleanCell(value: boolean, style: CSSStyleDeclaration): wijmo.pdf.PdfDocument {
			var ci = this._renderCell(style),
				doc = this._doc,
				x = ci.contentX,
				y = ci.contentY,
				rectSize = doc.heightOfString('A', { lastLineExternalLeadingGap: false, width: Infinity });

			switch (style.verticalAlign) {
				case 'middle':
					y = y + ci.contentHeight / 2 - rectSize / 2;
					break;

				case 'bottom':
					y = y + ci.contentHeight - rectSize;
					break;
			}

			switch (style.textAlign) {
				case 'justify':
				case 'center':
					x = x + ci.contentWidth / 2 - rectSize / 2;
					break;

				case 'right':
					x = x + ci.contentWidth - rectSize;
					break;
			}

			var border = 0.5;

			// border and content area
			doc.lineWidth(border).rect(x, y, rectSize, rectSize).fillAndStroke('white', PdfDocument.DEF_FONT_STROKE_COLOR);

			// checkmark
			if (wijmo.changeType(value, DataType.Boolean, '') === true) {
				var space = rectSize / 20,
					cmRectSize = rectSize - border - space * 2,
					cmLineWidth = rectSize / 8;

				doc
					.save()
					.translate(x + border / 2 + space, y + border / 2 + space)
					.lineWidth(cmLineWidth)
					.moveTo(cmLineWidth / 2, cmRectSize * 0.6)
					.lineTo(cmRectSize - cmRectSize * 0.6, cmRectSize - cmLineWidth)
					.lineTo(cmRectSize - cmLineWidth / 2, cmLineWidth / 2)
					.stroke(PdfDocument.DEF_FONT_STROKE_COLOR)
					.restore();
			}

			return this;
		}

		/**
		 * Renders a cell with a text inside.
		 *
		 * The following CSSStyleDeclaration properties are supported for now:
		 *   left, top
		 *   width, height
		 *	 border<Left \ Right\ Top\ Bottom>Style (if 'none' then no border, otherwise a solid border)
		 *	 border<Left\ Right\ Top\ Bottom>Width,
		 *	 border<Left\ Right\ Top\ Bottom>Color
		 *   backgroundColor
		 *   boxSizing (content-box + border-box)
		 *	 padding<Left\ Top\ Right\ Bottom>
		 *   textAlign
		 *   fontFamily, fontStyle, fontWeight, fontSize
		 *
		 * @param text The inner text of the cell.
		 * @param style A CSSStyleDeclaration object that represents the cell style and positioning.
		 *
		 * @return A reference to the document.
		 */
		public renderTextCell(text: string, style: CSSStyleDeclaration): wijmo.pdf.PdfDocument {
			var ci = this._renderCell(style);

			if (text) {
				// set a font
				this.font(new PdfFont(style.fontFamily, <any>style.fontSize, style.fontStyle, style.fontWeight));

				// set a font color
				this._doc.fillColor(CssUtil.parseColor(style.color) || PdfDocument.DEF_FONT_STROKE_COLOR);

				// draw a text
				var textOptions: IPdfKitHeightOfStringOptions = {
						height: ci.contentHeight,
						width: ci.contentWidth,
						align: style.textAlign,
						lastLineExternalLeadingGap: false
					},
					x = ci.contentX,
					y = ci.contentY;

				switch (style.verticalAlign) {
					case 'bottom':
						var txtHeight = this._doc.heightOfString(text, textOptions);

						if (txtHeight < textOptions.height) {
							y += textOptions.height - txtHeight;
							textOptions.height = txtHeight
					}
						break;

					case 'middle':
						var txtHeight = this._doc.heightOfString(text, textOptions);

						if (txtHeight < textOptions.height) {
							y += textOptions.height / 2 - txtHeight / 2;
							textOptions.height = txtHeight;
						}
						break;

					default: // 'top'
						break;
				}

				this._doc.text(text, x, y, textOptions);
			}

			return this;
		}

		/**
		 * Sets the document font.
		 *		
		 * If font with exact given style and weight properties is not found then:
		 * 1. Tries to search closest font using font weight fallback (https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight)
		 * 2. If still nothing is found, tries to find closest font with other style in following order:
		 * 'italic': 'oblique', 'normal'.
		 * 'oblique': 'italic', 'normal'.
		 * 'normal': 'oblique', 'italic'.
		 *
		 * @param font The font object to set.
		 *
		 * @return The @see:PdfDocument object.
		 */
		public font(font: PdfFont): wijmo.pdf.PdfDocument {
			var internalName = this._fontReg.findFont(font.family, font.style, font.weight);
			this._doc.font(internalName, CssUtil.parseFontSize(font.size));
			return this;
		}

		/**
		 * Registers a font from the source using a given name and associates a set of the font styles with it.
		 *
		 * @param font The font to register.
		 * @param callback An optional parameter determining the callback function which will be called when the font has been registered.
		 *
		 * @return The @see:PdfDocument object.
		 */
		public registerFont(font: IPdfFontFile, callback?: (uid: string) => void): wijmo.pdf.PdfDocument {
			if (!font) {
				throw 'Font cannot be null';
			}

			var buffer: ArrayBuffer;

			if (wijmo.isString(font.source)) { // URL
				buffer = XHRArrayBuffer(font.source);
			} else {
				if (font.source instanceof ArrayBuffer) {
					buffer = font.source;
				} else {
					throw 'Unsupported source.';
				}
			}

			font = wijmo.pdf.shallowCopy(font);
			font.source = buffer;

			var uid = this._fontReg.registerFont(font);

			if (callback) {
				callback(uid);
			}

			return this;
		}

		/**
		 * Registers a font from a URL asynchronously using a given name and associates a set of the font styles with it.
		 *
		 * @param The font to register.
		 * @param callback A callback function which will be called when the font has been registered.
		 *
		 * @return The PdfDocument object.
		 */
		public registerFontAsync(font: IPdfFontFile, callback: (uid: string) => void): void {
			if (typeof (font.source) !== 'string') {
				throw 'The fount.source must be of type string.';
			}

			XHRArrayBufferAsync(font.source, (xhr, buffer) => {
				font = wijmo.pdf.shallowCopy(font);
				font.source = buffer;

				var uid = this._fontReg.registerFont(font);

				if (callback) {
					callback(uid);
				}
			});
		}

		//#endregion public

		//#region PDFDocument's native event handlers
		private _onDocData(chunk: any): void {
			this._chunks.push(chunk);
		}

		private _onDocEnding(): void {
			this._processHeadersFooters();

			// setup document info
			if (this.documentInfo) {
				var v;

				if (v = this.documentInfo.author) {
					this._doc.info.Author = v;
				}

				if (v = this.documentInfo.creationDate) {
					this._doc.info.CreationDate = v;
				}

				if (v = this.documentInfo.keywords) {
					this._doc.info.Keywords = v;
				}

				if (v = this.documentInfo.modDate) {
					this._doc.info.ModDate = v;
				}

				if (v = this.documentInfo.subject) {
					this._doc.info.Subject = v;
				}

				if (v = this.documentInfo.title) {
					this._doc.info.Title = v;
				}
			}
		}

		private _onDocEnded(): void {
			if (PdfDocument.IE) { // 'InvalidStateError' exception occurs in IE10 (IE11 works fine) when chunks are passed directly into the Blob constructor, so convert each item to ArrayBuffer first.
				for (var i = 0; i < this._chunks.length; i++) {
					this._chunks[i] = this._chunks[i].toArrayBuffer();
				}
			}

			var blob = new Blob(this._chunks, { type: 'application/pdf' });

			this._chunks = [];
			this.onEnded(new PdfDocumentEndedEventArgs(blob));
		}

		private _onPageAdding(doc: IPdfKitDocument, options: IPdfKitPageOptions): void {
			if (this.pageSettings) {
				var v;

				if (v = this.pageSettings.layout) {
					options.layout = doc.options.layout = (PdfPageOrientation[v] || '').toLowerCase();
				}

				if (v = this.pageSettings.margins) {
					options.margins = doc.options.margins = v;
				}

				if (v = this.pageSettings.size) {
					options.size = doc.options.size = (PdfPageSize[v] || '').toUpperCase();
				}
			}
		}

		private _onPageAdded(doc: IPdfKitDocument, pageIndex: number): void {
			doc.page.originalMargins = {
				left: doc.page.margins.left,
				right: doc.page.margins.right,
				top: doc.page.margins.top,
				bottom: doc.page.margins.bottom
			};

			this._updateTopMargin(doc);
			this._updateBottomMargin(doc);
			this.onPageAdded(new PdfDocumentPageAddedEventArgs(doc.page, pageIndex));
		}
		//#endregion

		//#region private
		_clientRect(): Rect {
			var page = this._doc.page;

			return new Rect(
				page.margins.left,
				page.margins.top,
				Math.max(0, page.width - page.margins.left - page.margins.right),
				Math.max(0, page.height - page.margins.top - page.margins.bottom)
			);
		}

		private _createPdfKitOptions(options: IPdfDocumentOptions): IPdfKitDocumentOptions {
			return {
				compress: options.compress,
				bufferPages: true, // required to render headers and footers
				pageAdding: this._ehOnPageAdding = (doc: IPdfKitDocument, options: IPdfKitPageOptions) => {
					this._onPageAdding(doc, options);
				},
				pageAdded: this._ehOnPageAdded = (doc: IPdfKitDocument, pageIndex: number) => {
					this._onPageAdded(doc, pageIndex);
				}
			};
		}

		/**
		 * Renders an empty cell.
		 *
		 * The following CSSStyleDeclaration properties are supported for now:
		 *   left, top
		 *   width, height
		 *	 border<Left \ Right\ Top\ Bottom>Style (if 'none' then no border, otherwise a solid border)
		 *	 border<Left\ Right\ Top\ Bottom>Width,
		 *	 border<Left\ Right\ Top\ Bottom>Color
		 *   backgroundColor
		 *   boxSizing (content-box + border-box)
		 *	 padding<Left\ Top\ Right\ Bottom>
		 *   textAlign
		 *   fontFamily, fontStyle, fontWeight, fontSize
		 *
		 * @param style A CSSStyleDeclaration object that represents the cell style and positioning.
		 * @return A ICellInfo object that represents information about the cell's content.
		 */
		private _renderCell(style: CSSStyleDeclaration): ICellInfo {
			this._resolveStyle(style); // trying to decomposite some properties to handle the situation when the style was created manually.

			var doc = this._doc,
				ps = CssUtil.parseSize,
				pc = CssUtil.parseColor,

				x = ps(style.left) || 0,
				y = ps(style.top) || 0,

				brd = CssUtil.parseBorder(style),
				blw = brd.left && brd.left.width || 0,
				btw = brd.top && brd.top.width || 0,
				bbw = brd.bottom && brd.bottom.width || 0,
				brw = brd.right && brd.right.width || 0,

				pad = CssUtil.parsePadding(style),

				height = ps(style.height) || 0,
				width = ps(style.width) || 0,

				// content + padding
				clientHeight = 0,
				clientWidth = 0,

				// content
				contentHeight = 0,
				contentWidth = 0;

			// taking the PDFPage margins into account
			x += doc.page.margins.left;
			y += doc.page.margins.top;

			// setup client and content dimensions depending on boxing model.
			if (style.boxSizing === 'content-box') {
				clientHeight = pad.top + height + pad.bottom;
				clientWidth = pad.left + width + pad.right;

				contentHeight = height;
				contentWidth = width;
			} else {
				if (style.boxSizing === 'border-box') {
					// Browsers are using different approaches to calculate style.width and style.heigth properties. While Chrome and FireFox returns the total size, IE returns the content size only.
					if (PdfDocument.IE) { // content size: max(0, specifiedSizeValue - (padding + border))
						clientHeight = pad.top + pad.bottom + height;
						clientWidth = pad.left + pad.right + width;
					} else { // total size: Max(specifiedSizeValue, padding + border)
						clientHeight = height - btw - bbw;
						clientWidth = width - blw - brw;
					}

					contentHeight = clientHeight - pad.top - pad.bottom;
					contentWidth = clientWidth - pad.left - pad.right;
				} else {
					if (style.boxSizing === 'no-box') {
						clientHeight = height - btw - bbw;
						clientWidth = width - blw - brw;
						contentHeight = clientHeight - pad.top - pad.bottom;
						contentWidth = clientWidth - pad.left - pad.right;
					} else {
						// padding-box? It is supported by Mozilla only.
						throw 'Invalid value: ' + style.boxSizing;
					}
				}
			}

			if (blw || brw || bbw || btw) {
				// all borders has the same width and color, draw a rectangle
				if ((blw && btw && bbw && brw) && (blw === brw && blw === bbw && blw === btw) && (style.borderLeftColor === style.borderRightColor && style.borderLeftColor === style.borderBottomColor && style.borderLeftColor === style.borderTopColor)) {
					var border = blw,
						half = border / 2; // use an adjustment because of center border alignment used by PDFKit.

					doc.lineWidth(border);
					doc.rect(x + half, y + half, clientWidth + border, clientHeight + border);
					doc.stroke(brd.left.color || PdfDocument.DEF_FONT_STROKE_COLOR);
				} else {
					// use a trapeze for each border
					if (blw) {
						doc.polygon([x, y], [x + blw, y + btw], [x + blw, y + btw + clientHeight], [x, y + btw + clientHeight + bbw]);
						doc.fill(brd.left.color);
					}

					if (btw) {
						doc.polygon([x, y], [x + blw, y + btw], [x + blw + clientWidth, y + btw], [x + blw + clientWidth + brw, y]);
						doc.fill(brd.top.color);
					}

					if (brw) {
						doc.polygon([x + blw + clientWidth + brw, y], [x + blw + clientWidth, y + btw], [x + blw + clientWidth, y + btw + clientHeight], [x + blw + clientWidth + brw, y + btw + clientHeight + bbw]);
						doc.fill(brd.right.color);
					}

					if (bbw) {
						doc.polygon([x, y + btw + clientHeight + bbw], [x + blw, y + btw + clientHeight], [x + blw + clientWidth, y + btw + clientHeight], [x + blw + clientWidth + brw, y + btw + clientHeight + bbw]);
						doc.fill(brd.bottom.color);
					}
				}
			}

			// draw background
			if (style.backgroundColor && clientWidth > 0 && clientHeight > 0) {
				doc.rect(x + blw, y + btw, clientWidth, clientHeight);
				doc.fill(pc(style.backgroundColor));
			}

			return {
				contentX: x + blw + pad.left,
				contentY: y + btw + pad.top,
				contentHeight: contentHeight,
				contentWidth: contentWidth
			};
		}

		private _resolveStyle(style: CSSStyleDeclaration) {
			if (style) {
				var val: any;

				if (val = style.borderColor) {
					// honor single properties
					if (!style.borderLeftColor) {
						style.borderLeftColor = val;
					}

					if (!style.borderRightColor) {
						style.borderRightColor = val;
					}

					if (!style.borderTopColor) {
						style.borderTopColor = val;
					}

					if (!style.borderBottomColor) {
						style.borderBottomColor = val;
					}
				}

				if (val = style.borderWidth) {
					// honor single properties
					if (!style.borderLeftWidth) {
						style.borderLeftWidth = val;
					}

					if (!style.borderRightWidth) {
						style.borderRightWidth = val;
					}

					if (!style.borderTopWidth) {
						style.borderTopWidth = val;
					}

					if (!style.borderBottomWidth) {
						style.borderBottomWidth = val;
					}
				}

				if (val = style.borderStyle) {
					// honor single properties
					if (!style.borderLeftStyle) {
						style.borderLeftStyle = val;
					}

					if (!style.borderRightStyle) {
						style.borderRightStyle = val;
					}

					if (!style.borderTopStyle) {
						style.borderTopStyle = val;
					}

					if (!style.borderBottomStyle) {
						style.borderBottomStyle = val;
					}
				}

				if (val = style.padding) {
					// honor single properties
					if (!style.paddingLeft) {
						style.paddingLeft = val;
					}

					if (!style.paddingRight) {
						style.paddingRight = val;
					}

					if (!style.paddingTop) {
						style.paddingTop = val;
					}

					if (!style.paddingBottom) {
						style.paddingBottom = val;
					}
				}
			}
		}

		private _processHeadersFooters(): void {
			var hdr = this.header,
				ftr = this.footer;

			if (this._needToRenderSection(this.header) || this._needToRenderSection(this.footer)) {
				var doc = this._document;

				if (!doc.options.bufferPages) {
					throw 'The bufferPages option must be enabled to render pagers and footers.';
				}

				var range = doc.bufferedPageRange();
				for (var i = range.start; i < range.count; i++) {
					var page = doc.switchToPage(i),
						frmt = {
							'Page': i + 1,
							'Pages': range.count
						};

					this._renderHeaderFooter(hdr, frmt, true);
					this._renderHeaderFooter(ftr, frmt, false);
				}
			}
		}

		private _renderHeaderFooter(section: IPdfPageSection, macros: any, isHeader): void {
			if (section.text) {
				var text = formatMacros(section.text, macros),
					parts = text.split('\t');

				if (parts.length > 0) {
					this._renderHeaderFooterPart(section, parts[0], 'left', isHeader);
				}

				if (parts.length > 1) {
					this._renderHeaderFooterPart(section, parts[1], 'center', isHeader);
				}

				if (parts.length > 2) {
					this._renderHeaderFooterPart(section, parts[2], 'right', isHeader);
				}
			}
		}

		private _renderHeaderFooterPart(section: IPdfPageSection, text: string, alignment: string, isHeader): void {
			var doc = this._doc,
				mrg = doc.page.margins,
				sctY = 0,
				font = this._fontReg.findFont(section.font.family, section.font.style, section.font.weight),
				textSettings: IPdfKitTextOptions = {
					width: doc.page.width - mrg.left - mrg.right,
					height: section.height,
					align: alignment
				};


			if (isHeader) {
				sctY = mrg.top - section.height;
			} else {
				sctY = doc.page.height + section.height - mrg.bottom - doc.heightOfString(text);
				textSettings.height = Infinity; // to be able to write below the page bottom margin without adding a new page automatically.
			}

			doc.font(font, section.font.size);
			doc.fillColor(section.textColor);
			doc.text(text, mrg.left, sctY, textSettings);
		}

		private _needToRenderSection(section: IPdfPageSection): boolean {
			return !!section && section.height > 0 && !!section.text;
		}

		private _updateTopMargin(doc: IPdfKitDocument): void {
			if (this._needToRenderSection(this.header)) {
				doc.page.margins.top = doc.page.originalMargins.top + this.header.height;
				doc.y = doc.page.margins.top;
			}
		}

		private _updateBottomMargin(doc: IPdfKitDocument): void {
			if (this._needToRenderSection(this.footer)) {
				doc.page.margins.bottom = doc.page.originalMargins.bottom + this.footer.height;
			}
		}

		//#endregion private
	}

	/**
	 * Represents a font.
	 */
	export class PdfFont {
		/**
		 * Gets or sets the name of the font.
		 *
		 * The list of the font family names, in the order of preferences, separated by commas. Each font family name can be the name that was registered using the @see:PdfDocument.registerFont method or the name of one of the PDF standard fonts: 'courier', 'helvetica', 'symbol', 'times', 'zapfdingbats' or PDFKit's internal font name or the superfamily name: 'cursive', 'fantasy', 'monospace', 'serif', 'sans-serif'.
		 */
		public family: string;

		/**
		 * Gets or sets the size of the font.
		 */
		public size: number;

		/**
		 * Gets or sets the style of the font.
		 *
		 * The following values are supported: 'normal', 'italic', 'oblique'.
		 */
		public style: string;

		/**
		 * Gets or sets the weight of the font.
		 *
		 * The following values are supported: 'normal', 'bold', 100, 200, 300, 400, 500, 600, 700, 800, 900.
		 */
		public weight: any;

		/**
		* Initializes a new instance of the @see:PdfFont class.
		*
		* @param family The name of the font.
		* @param size The size of the font.
		* @param style The style of the font.
		* @param weight The weight of the font.
		*/
		constructor(family: string, size: number = 10, style: string = 'normal', weight: any = 'normal') {
			this.family = family;
			this.size = size;
			this.style = style;
			this.weight = weight;
		}
	}

	/**
	 * Provides arguments for the @see:end event.
	 */
	export class PdfDocumentEndedEventArgs extends EventArgs {
		private _blob: Blob;

		/**
		* Initializes a new instance of the @see:DocumentEndEventArgs class.
		*
		* @param blob A Blob object that contains the document data.
		*/
		constructor(blob: Blob) {
			super();
			this._blob = blob;
		}

		/**
		 * Gets a Blob object that contains the document data.
		 */
		public get blob(): Blob {
			return this._blob;
		}
	}

	/**
	 * Provides arguments for the @see:pageAdded event.
	 */
	export class PdfDocumentPageAddedEventArgs extends EventArgs {
		private _page: IPdfKitPage;
		private _pageIndex: number;

		/**
		 * Initializes a new instance of the @see:DocumentPageAddedEventArgs class.
		 *
		 * @param pageIndex The index of the page being added.
		 */
		constructor(page: IPdfKitPage, pageIndex: number) {
			super();
			this._page = page;
			this._pageIndex = pageIndex;
		}

		/**
		 * Gets the page being added.
		 */
		public get page(): IPdfKitPage {
			return this._page;
		}

		/**
		 * Gets the index of the page being added.
		 */
		public get pageIndex(): number {
			return this._pageIndex;
		}
	}
}
//#endregion

//#region FontRegistrar.ts
module wijmo.pdf {
	'use strict';

	interface IFontWeightDescription {
		[index: number]: string; // <weight>: <PDFKit's internal name to use>
	}

	interface IFontDescription {
		attributes: IPdfFontAttributes;
		normal?: IFontWeightDescription;
		italic?: IFontWeightDescription;
		oblique?: IFontWeightDescription
	}

	interface INormalizedFontSelector {
		name: string;
		style: string;
		weight: number;
	}

	class OrderedDictionary<T> {
		private _values: { key: string; value: T }[] = [];
		private _keys: { [key: string]: number } = {};

		constructor(values?: { key: string; value: T }[]) {
			if (values) {
				for (var i = 0; i < values.length; i++) {
					var val = values[i];

					this._keys[val.key] = i;
					this._values.push({ key: val.key, value: val.value });
				}
			}
		}

		public hasKey(key: string): T {
			var idx = this._keys[key];

			if (idx !== undefined) {
				return this._values[idx].value;
			}

			return null;
		}

		public add(key: string, value: T): T {
			if (!this.hasKey(key)) {
				this._keys[key] = this._values.length;
				this._values.push({ key: key, value: value });
				return value;
			}

			return null;
		}

		public each(fn: (key: string, value: T) => any): void {
			if (fn) {
				for (var i = 0; i < this._values.length; i++) {
					var val = this._values[i];

					if (fn(val.key, val.value) === false) {
						break;
					}
				}
			}
		}

		public eachReverse(fn: (key: string, value: T) => any): void {
			if (fn) {
				for (var i = this._values.length - 1; i >= 0; i--) {
					var val = this._values[i];

					if (fn(val.key, val.value) === false) {
						break;
					}
				}
			}
		}
	}

	/**
	 * Provides font registration functionality. For internal use only.
	 */
	export class FontRegistrar {
		private DEF_FONT = 'Times-Roman'; // used by default if closest font can not be found.

		// standard fonts, starting from the specific one
		private _fonts = new OrderedDictionary<IFontDescription>([
			{
				key: 'zapfdingbats',
				value: {
					attributes: {
						fantasy: true
					},
					normal: {
						400: 'ZapfDingbats'
					}
				}
			},
			{
				key: 'symbol',
				value: {
					attributes: {
						serif: true
					},
					normal: {
						400: 'Symbol'
					}
				}
			},
			{
				key: 'courier',
				value: {
					attributes: {
						serif: true,
						monospace: true
					},
					normal: {
						400: 'Courier',
						700: 'Courier-Bold'
					},
					oblique: {
						400: 'Courier-Oblique',
						700: 'Courier-BoldOblique'
					}
				}
			},
			{
				key: 'helvetica',
				value: {
					attributes: {
						sansSerif: true
					},
					normal: {
						400: 'Helvetica',
						700: 'Helvetica-Bold'
					},
					oblique: {
						400: 'Helvetica-Oblique',
						700: 'Helvetica-BoldOblique'
					}
				}
			},
			{
				key: 'times',
				value: {
					attributes: {
						serif: true
					},
					normal: {
						400: 'Times-Roman',
						700: 'Times-Bold'
					},
					italic: {
						400: 'Times-Italic',
						700: 'Times-BoldItalic'
					}
				}
			}
		]);

		private _weightNameToNum = {
			'normal': 400,
			'bold': 700
		};

		private _doc: IPdfKitDocument;
		private _findFontCache: { [uid: string]: string } = {};
		private _internalFontNames: { [key: string]: any; } = {}; // stores all internal names of the registered fonts.

		/**
		 * Initializes a new instance of the @see:FontRegistrar class.
		 *
		 * @param doc A IPdfKitDocument object.
		 */
		constructor(doc: IPdfKitDocument) {
			this._doc = doc;

			// fill _internalFontNames
			this._fonts.each((key, value) => {
				var facesIterator = (descr: IFontWeightDescription) => {
					for (var key in descr) {
						this._internalFontNames[descr[key]] = 1;
					}
				};

				facesIterator(value.normal) || facesIterator(value.italic) || facesIterator(value.oblique);
			});
		}

		/**
		 * Registers a font from a ArrayBuffer.
		 *
		 * @param name A font to register.
		 *
		 * @return A PDFKit internal font name.
		 */
		public registerFont(font: IPdfFontFile): string {
			if (!font || !font.name || !(font.source instanceof ArrayBuffer)) {
				throw 'Invalid name.';
			}

			font = wijmo.pdf.shallowCopy(font);

			var ns = this._normalizeFontSelector(font.name, font.style, font.weight),
				fntDscr = this._fonts.hasKey(ns.name);

			if (!fntDscr) {
				fntDscr = this._fonts.add(ns.name, { attributes: <IPdfFontAttributes>font });
			}

			var face = fntDscr[ns.style];
			if (!face) {
				face = fntDscr[ns.style] = {};
			}

			var internalName = this._makeInternalName(ns);

			if (!face[ns.weight]) {
				this._findFontCache = {};

				face[ns.weight] = internalName;
				this._doc.registerFont(internalName, font.source, font.ttcFamily);
				this._internalFontNames[internalName] = 1;
			}

			return internalName;
		}

		/**
		 * Finds a closest registered font for a given font name, style and weight.
		 *		
		 * If font with exact given style and weight properties is not found then:
		 * 1. Tries to search closest font using font weight fallback (https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight)
		 * 2. If still nothing is found, tries to find closest font with other style in following order:
		 * 'italic': 'oblique', 'normal'.
		 * 'oblique': 'italic', 'normal'.
		 * 'normal': 'oblique', 'italic'.
		 *
		 * @param name The name of the font that was registered before using the @see:registerFont or the name of one of the PDF standard fonts: 'courier', 'helvetica', 'symbol', 'times', 'zapfdingbats', or the superfamily name: 'cursive', 'fantasy', 'monospace', 'serif', 'sans-serif'.
		 * @param style The style of the font. One of the following values: 'normal', 'italic', 'oblique'.
		 * @param weight The weight of the font. One of the following values: 'normal', 'bold', 100, 200, 300, 400, 500, 600, 700, 800, 900.
		 * @return A PDFKit internal font name or null.
		 */
		public findFont(name: string, style?: string, weight?: any): string {
			var ns = this._normalizeFontSelector(name, style, weight),
				internalName = this._makeInternalName(ns);

			if (this._findFontCache[internalName]) {
				return this._findFontCache[internalName];
			}

			for (var i = 0, names = ns.name.split(','); i < names.length; i++) {
				var tmp = this._findFont(names[i].replace(/["']/g, '').trim(), ns.style, ns.weight);
				if (tmp) {
					return this._findFontCache[internalName] = tmp;
				}
			}

			return this._findFontCache[internalName] = this._internalFontNames[name]
				? name
				: this.DEF_FONT;
		}

		private _normalizeFontSelector(name: string, style?: string, weight?: any): INormalizedFontSelector {
			return {
				name: (name || '').toLowerCase(),
				style: (style || 'normal').toLowerCase(),
				weight: parseInt(this._weightNameToNum[weight] || weight) || 400
			}
		}

		private _findFont(name: string, style?: string, weight?: number): string {
			var facesToTest: string[] = [],
				res: string;

			switch (style) {
				// setup fallback font styles
				case 'italic':
					facesToTest = ['italic', 'oblique', 'normal'];
					break;
				case 'oblique':
					facesToTest = ['oblique', 'italic', 'normal'];
					break;
				default:
					facesToTest = ['normal', 'oblique', 'italic'];
					break;
			}

			switch (name) {
				case 'cursive':
				case 'fantasy':
				case 'monospace':
				case 'serif':
				case 'sans-serif':
					// try to find closest font within the given font superfamily using font-weight and font-style fallbacks if necessary.
					this._fonts.eachReverse((key, font) => { // try custom fonts first
						var propName = (name === 'sans-serif') ? 'sansSerif' : name;

						if (font.attributes[propName]) {
							for (var i = 0; i < facesToTest.length; i++) {
								res = this._findFontWeightFallback(key, facesToTest[i], weight);
								if (res) {
									return false; // break the loop
								}
							}
						}
					});
					break;

				default:
					if (this._fonts.hasKey(name)) {
						// try to find closest font within the given font family (name) using font-weight and font-style fallbacks if necessary.
						for (var i = 0; i < facesToTest.length && !res; i++) {
							res = this._findFontWeightFallback(name, facesToTest[i], weight);
						}
					}
			}

			return res;
		}

		private _findFontWeightFallback(name: string, style: string, weight: number, availableWeights?: number[]): string {
			var font = this._fonts.hasKey(name);

			if (font && font[style]) {
				var weights = font[style];

				if (weights[weight]) {
					return weights[weight];
				} else {
					// font-weight fallback (https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight)

					if (!availableWeights) {
						availableWeights = [];

						for (var key in weights) {
							availableWeights.push(key);
						}

						availableWeights.sort(function (a, b) { return a - b; });
					}

					if (weight > 500) { // the closest available darker weight is used (or, if there is none, the closest available lighter weight).
						var less = 0;

						for (var i = 0; i < availableWeights.length; i++) {
							var cur = availableWeights[i];

							if (cur > weight) {
								return weights[cur];
							} else {
								less = cur;
							}
						}

						if (less) {
							return weights[less];
						}
					} else {
						if (weight < 400) { // the closest available lighter weight is used (or, if there is none, the closest available darker weight).
							var greater = 0;

							for (var i = availableWeights.length - 1; i >= 0; i--) {
								var cur = availableWeights[i];

								if (cur < weight) {
									return weights[cur];
								} else {
									greater = cur;
								}
							}

							if (greater) {
								return weights[greater];
							}
						} else {
							if (weight == 400) { // then 500 is used. If 500 is not available, then the heuristic for font weights less than 500 is used.
								if (weights[500]) {
									return weights[500]
								} else {
									return this._findFontWeightFallback(name, style, 400, availableWeights);
								}
							} else { // (500) then 400 is used. If 400 is not available, then the heuristic for font weights less than 400 is used.
								if (weights[400]) {
									return weights[400]
								} else {
									return this._findFontWeightFallback(name, style, 300, availableWeights);
								}
							}
						}
					}
				}
			}

			return null;
		}

		private _makeInternalName(ns: INormalizedFontSelector): string {
			return ns.name + '-' + ns.style + '-' + ns.weight;
		}
	}
} 
//#endregion


//#region Util.cs
module wijmo.pdf {
	'use strict';

	/**
	 * Represents a XMLHttpRequest settings.
	 */
	export interface IXHRSettings {
		responseType?: string;
		headers?: { [index: string]: string };
		method?: string;
		async?: boolean;
		user?: string;
		password?: string;
		data?: any;
		overrideMimeType?: string;
	}

	var XhrOverrideMimeTypeSupported = !!new XMLHttpRequest().overrideMimeType;

	/**
	 * Retrieves data from a URL using XMLHttpRequest.
	 *
	 * @param url The URL to send the request to.
	 * @param settings Request settings.
	 * @param success A function to be called if the request succeeds.
	 * @param error A function to be called if the request fails.
	 */
	export function XHR(url: string, settings: IXHRSettings, success: (xhr: XMLHttpRequest, response: any) => void, error?: (xhr: XMLHttpRequest) => void): void {
		var xhr = new XMLHttpRequest();

		settings = settings || {};

		xhr.open(settings.method, url, settings.async, settings.user, settings.password);

		xhr.addEventListener('load', () => {
			if (xhr.readyState === 4) {
				var status = xhr.status;

				if (status >= 200 && status < 300 || status === 304) {
					if (success) {
						success(xhr, xhr.response);
					}
				} else {
					if (error) {
						error(xhr);
					}
				}
			}
		});

		if (settings.headers) {
			for (var key in settings.headers) {
				xhr.setRequestHeader(key, settings.headers[key]);
			}
		}

		if (settings.responseType) {
			xhr.responseType = settings.responseType;
		}

		if (settings.overrideMimeType && xhr.overrideMimeType) {
			xhr.overrideMimeType(settings.overrideMimeType);
		}

		xhr.send(settings.data);
	}

	/**
	 * Asynchronously retrieves an ArrayBuffer from a URL using XMLHttpRequest.
	 *
	 * @param url The URL to send the request to.
	 * @param success A function to be called if the request succeeds.
	 * @param error A function to be called if the request fails.
	 */
	export function XHRArrayBufferAsync(url: string, success: (xhr: XMLHttpRequest, data: ArrayBuffer) => void, error?: (xhr: XMLHttpRequest) => void): void {
		var settings: IXHRSettings = {
			method: 'GET',
			responseType: 'arraybuffer',
			async: true
		};

		XHR(url, settings, success, error);
	}

	/**
	 * Synchronously retrieves an ArrayBuffer from a URL using XMLHttpRequest.
	 *
	 * @param url The URL to send the request to.
	 * @param success A function to be called if the request succeeds.
	 * @param error A function to be called if the request fails.
	 */
	export function XHRArrayBuffer(url: string, error?: (xhr: XMLHttpRequest) => void): ArrayBuffer {
		var buffer: ArrayBuffer,
			settings: IXHRSettings = {
				method: 'GET',
				async: false
			};

		if (XhrOverrideMimeTypeSupported) { // IE>10, Chrome, FireFox
			// Note: the responseType parameter must be empty in case of synchronous request (http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute)
			settings.overrideMimeType = 'text/plain; charset=x-user-defined'; // retrieve unprocessed data as a binary string

			XHR(url, settings, (xhr, response: string) => {
				// convert string to ArrayBuffer
				buffer = new ArrayBuffer(response.length);

				var byteView = new Uint8Array(buffer);

				for (var i = 0, len = response.length; i < len; i++) {
					byteView[i] = response.charCodeAt(i) & 0xFF;
				}
			}, error);
		} else {
			// We can retrive binary data synchronously using xhr.responseType in case of IE10.
			settings.responseType = 'arraybuffer';

			XHR(url, settings, (xhr, response: ArrayBuffer) => {
				buffer = response;
			}, error);
		}

		return buffer;
	}

	/**
	 * Merges the content of the source object with the desination object.
	 *
	 * @param dst The destination object.
	 * @param src The source object.
	 * @return The modifled destination object. 
	 */
	export function merge(dst: any, src: any, overwrite = false): any {
		if (src && dst) {
			for (var key in src) {
				var srcProp = src[key],
					dstProp = dst[key];

				if (!isObject(srcProp)) {
					if (dstProp === undefined || (overwrite && srcProp !== undefined)) {
						dst[key] = srcProp;
					}
				} else {
					if (dstProp === undefined || !isObject(dstProp) && overwrite) {
						dst[key] = dstProp = {};
					}

					if (isObject(dstProp)) {
						merge(dst[key], srcProp, overwrite);
					}
				}
			}
		}

		return dst;
	}

	/**
	 * Creates a shallow copy of the source object.
	 *
	 * @param src The source object.
	 * @return The shallow copy of the source object. 
	 */
	export function shallowCopy(src: any): any {
		var dst = {};

		for (var key in src) {
			dst[key] = src[key];
		}

		return dst;
	}

	/**
	 * Replaces each macro item in a specified string with the text equivalent of an object's value.
	 *
	 * The function works by replacing parts of the <b>str</b> with the pattern
	 * '&[MacroName]' with properties of the <b>dict</b> argument.
	 *
	 * Use '&&' to indicate an actual ampersand.
	 *
	 * @param str A string to format.
	 * @param dict The macros dictionary used to format the string.
	 * @return The formatted string.
	 */
	export function formatMacros(str: string, dict: any): string {
		var amps = {},
			ampsCnt = 0;

		// && -> &
		str = str.replace(/&&/g, (match, offset, str) => {
			amps[offset - (ampsCnt * 2) + ampsCnt] = true; // store the position of an actual ampersand within the string
			ampsCnt++;
			return '&';
		});

		// process macros
		str = str.replace(/&\[(\S+?)\]/g, (match, p1, offset, str) => {
			var macros = dict[p1];

			return macros && !amps[offset]
				? macros
				: match;
		});

		return str;
	}

	/**
	 * Converts a pixel value to a point unit.
	 *
	 * @param value A value to convert.
	 * @return A point unit value.
	 */
	export function PxToPt(value: number): number {
		return value * 0.75; // value * 72 / 96;
	}

	/**
	 * Converts a point unit value to a pixel value.
	 *
	 * @param value A value to convert.
	 * @return A pixel value.
	 */
	export function PtToPx(value: number): number {
		return value * 96 / 72;
	}
}
//#endregion

//#region CssUtil.cs
module wijmo.pdf {
	'use strict';

	/**
	* Represents a single border.
	*/
	export interface ISingleBorder {
		width: number;
		style: string;
		color: any;
	}

	/**
	* Represents a border.
	*/
	export interface IBorder {
		left: ISingleBorder;
		top: ISingleBorder;
		bottom: ISingleBorder;
		right: ISingleBorder;
	}

	/**
	* Represents a padding.
	*/
	export interface IPadding {
		left: number;
		top: number;
		bottom: number;
		right: number;
	}

	var FontSizeToPt = {
		'xx-small': 7,
		'x-small': 7.5,
		small: 10,
		//smaller: 10,
		medium: 12,
		large: 13.5,
		//larger: 14,
		'x-large': 18,
		'xx-large': 24
	};

	/** For internal use only. */
	export class CssUtil {
		/**
		* Extracts the border values from the CSSStyleDeclaration object.
		*
		* @param style A value to extract from.
		* @param normailize Means that if a particular border has no style or width then it will be null.
		* @return A @see:IBorder object.
		*/
		public static parseBorder(style: CSSStyleDeclaration, normalize = true): IBorder {
			var borders: IBorder,
				ps = CssUtil.parseSize,
				pc = CssUtil.parseColor;

			if (normalize) {
				borders = {
					left: null,
					top: null,
					bottom: null,
					right: null
				};

				if (style.borderLeftStyle !== 'none') {
					var width = ps(style.borderLeftWidth);

					if (width > 0) {
						borders.left = {
							width: width,
							style: style.borderLeftStyle,
							color: pc(style.borderLeftColor)
						};
					}
				}

				if (style.borderTopStyle !== 'none') {
					var width = ps(style.borderTopWidth);

					if (width > 0) {
						borders.top = {
							width: width,
							style: style.borderTopStyle,
							color: pc(style.borderTopColor)
						};
					}
				}

				if (style.borderBottomStyle !== 'none') {
					var width = ps(style.borderBottomWidth);

					if (width > 0) {
						borders.bottom = {
							width: width,
							style: style.borderBottomStyle,
							color: pc(style.borderBottomColor)
						};
					}
				}

				if (style.borderRightStyle !== 'none') {
					var width = ps(style.borderRightWidth);

					if (width > 0) {
						borders.right = {
							width: width,
							style: style.borderRightStyle,
							color: pc(style.borderRightColor)
						};
					}
				}
			} else {
				borders = {
					left: {
						width: ps(style.borderLeftWidth),
						style: style.borderLeftStyle,
						color: pc(style.borderLeftColor)
					},
					top: {
						width: ps(style.borderTopWidth),
						style: style.borderTopStyle,
						color: pc(style.borderTopColor)
					},
					bottom: {
						width: ps(style.borderBottomWidth),
						style: style.borderBottomStyle,
						color: pc(style.borderBottomColor)
					},
					right: {
						width: ps(style.borderRightWidth),
						style: style.borderRightStyle,
						color: pc(style.borderRightColor)
					}
				}
			}

			return borders;
		}

		/**
		* Extracts the padding values from the CSSStyleDeclaration object.
		*
		* @param style A value to extract from.
		* @return A @see:IPadding object.
		*/
		public static parsePadding(style: CSSStyleDeclaration): IPadding {
			var ps = CssUtil.parseSize;

			return {
				left: ps(style.paddingLeft) || 0,
				top: ps(style.paddingTop) || 0,
				bottom: ps(style.paddingBottom) || 0,
				right: ps(style.paddingRight) || 0
			};
		}

		/**
		* Converts a value to a point unit.
		*
		* The following values are supported:
		*   1. A number (treated as point unit itself, no conversion here).
		*   2. A string postfixed with the 'px' or 'pt'.
		*  
		* @param value A value to convert.
		* @return A point unit value or undefined if conversion fails.
		*/
		public static parseSize(value: any): number {
			if (value || value === 0) {
				if (wijmo.isNumber(value)) {
					return value;
				}

				if (wijmo.isString(value)) {
					var num = parseFloat(value);
					if (num === num) { // not a NaN
						if (value.match(/(px)$/i)) {
							num = num * 0.75; // px -> pt
						}

						return num;
					}
				}
			}

			return undefined;
		}

		/**
		 * Converts a font size value to a point unit.
		 *
		 * The following values are supported:
		 *   1. A number (treated as point unit itself, no conversion here).
		 *   2. A string postfixed with the 'px' or 'pt'.
		 *   3. An absolute font size value like 'xx-small', 'x-small' etc.
		 *  
		 * @param value A value to convert.
		 * @return A point unit value or undefined if conversion fails.
		 */
		public static parseFontSize(value: any): number {
			if (wijmo.isString(value)) {
				if (FontSizeToPt[value]) {
					return FontSizeToPt[value];
				}
			}

			return CssUtil.parseSize(value);
		}

		/**
		 * Converts a color value in functional notation 'rgb(byte, byte, byte)' to a number array.
		 *
		 * @param value A value to convert.
		 * @return A number array or original value if conversion fails.
		 */
		public static parseColor(value: any): any {
			if (value && wijmo.isString(value)) {
				if (!value.indexOf('rgb')) {
					var rgb = <number[]><any>value.match(/\d+/g);

					rgb[0] = rgb[0] * 1;
					rgb[1] = rgb[1] * 1;
					rgb[2] = rgb[2] * 1;

					return rgb;
				}
			}

			return value;
		}
	}
}
//#endregion CssUtil.cs