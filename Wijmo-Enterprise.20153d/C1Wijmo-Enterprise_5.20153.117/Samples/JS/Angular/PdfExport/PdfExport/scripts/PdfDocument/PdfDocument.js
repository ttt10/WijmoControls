var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    //#region PdfDocument.ts
    (function (pdf) {
        'use strict';

        /** Specifies the page orientation. */
        (function (PdfPageOrientation) {
            /** Portrait orientation. */
            PdfPageOrientation[PdfPageOrientation["Portrait"] = 0] = "Portrait";

            /** Landscape orientation. */
            PdfPageOrientation[PdfPageOrientation["Landscape"] = 1] = "Landscape";
        })(pdf.PdfPageOrientation || (pdf.PdfPageOrientation = {}));
        var PdfPageOrientation = pdf.PdfPageOrientation;

        // Wraps the PdfKit's SIZES object.
        /** Specifies the page size. */
        (function (PdfPageSize) {
            PdfPageSize[PdfPageSize['4A0'] = 0] = '4A0';
            PdfPageSize[PdfPageSize['2A0'] = 1] = '2A0';
            PdfPageSize[PdfPageSize["A0"] = 2] = "A0";
            PdfPageSize[PdfPageSize["A1"] = 3] = "A1";
            PdfPageSize[PdfPageSize["A2"] = 4] = "A2";
            PdfPageSize[PdfPageSize["A3"] = 5] = "A3";
            PdfPageSize[PdfPageSize["A4"] = 6] = "A4";
            PdfPageSize[PdfPageSize["A5"] = 7] = "A5";
            PdfPageSize[PdfPageSize["A6"] = 8] = "A6";
            PdfPageSize[PdfPageSize["A7"] = 9] = "A7";
            PdfPageSize[PdfPageSize["A8"] = 10] = "A8";
            PdfPageSize[PdfPageSize["A9"] = 11] = "A9";
            PdfPageSize[PdfPageSize["A10"] = 12] = "A10";
            PdfPageSize[PdfPageSize["B0"] = 13] = "B0";
            PdfPageSize[PdfPageSize["B1"] = 14] = "B1";
            PdfPageSize[PdfPageSize["B2"] = 15] = "B2";
            PdfPageSize[PdfPageSize["B3"] = 16] = "B3";
            PdfPageSize[PdfPageSize["B4"] = 17] = "B4";
            PdfPageSize[PdfPageSize["B5"] = 18] = "B5";
            PdfPageSize[PdfPageSize["B6"] = 19] = "B6";
            PdfPageSize[PdfPageSize["B7"] = 20] = "B7";
            PdfPageSize[PdfPageSize["B8"] = 21] = "B8";
            PdfPageSize[PdfPageSize["B9"] = 22] = "B9";
            PdfPageSize[PdfPageSize["B10"] = 23] = "B10";
            PdfPageSize[PdfPageSize["C0"] = 24] = "C0";
            PdfPageSize[PdfPageSize["C1"] = 25] = "C1";
            PdfPageSize[PdfPageSize["C2"] = 26] = "C2";
            PdfPageSize[PdfPageSize["C3"] = 27] = "C3";
            PdfPageSize[PdfPageSize["C4"] = 28] = "C4";
            PdfPageSize[PdfPageSize["C5"] = 29] = "C5";
            PdfPageSize[PdfPageSize["C6"] = 30] = "C6";
            PdfPageSize[PdfPageSize["C7"] = 31] = "C7";
            PdfPageSize[PdfPageSize["C8"] = 32] = "C8";
            PdfPageSize[PdfPageSize["C9"] = 33] = "C9";
            PdfPageSize[PdfPageSize["C10"] = 34] = "C10";
            PdfPageSize[PdfPageSize["RA0"] = 35] = "RA0";
            PdfPageSize[PdfPageSize["RA1"] = 36] = "RA1";
            PdfPageSize[PdfPageSize["RA2"] = 37] = "RA2";
            PdfPageSize[PdfPageSize["RA3"] = 38] = "RA3";
            PdfPageSize[PdfPageSize["RA4"] = 39] = "RA4";
            PdfPageSize[PdfPageSize["SRA0"] = 40] = "SRA0";
            PdfPageSize[PdfPageSize["SRA1"] = 41] = "SRA1";
            PdfPageSize[PdfPageSize["SRA2"] = 42] = "SRA2";
            PdfPageSize[PdfPageSize["SRA3"] = 43] = "SRA3";
            PdfPageSize[PdfPageSize["SRA4"] = 44] = "SRA4";
            PdfPageSize[PdfPageSize["EXECUTIVE"] = 45] = "EXECUTIVE";
            PdfPageSize[PdfPageSize["FOLIO"] = 46] = "FOLIO";
            PdfPageSize[PdfPageSize["LEGAL"] = 47] = "LEGAL";
            PdfPageSize[PdfPageSize["LETTER"] = 48] = "LETTER";
            PdfPageSize[PdfPageSize["TABLOID"] = 49] = "TABLOID";
        })(pdf.PdfPageSize || (pdf.PdfPageSize = {}));
        var PdfPageSize = pdf.PdfPageSize;

        

        

        

        

        

        

        //#endregion
        /**
        * Represents a wrapper of the PDFDocument object.
        */
        var PdfDocument = (function () {
            /**
            * Initializes a new instance of the @see:PdfDocument class.
            *
            * @param options An optional object containing initialization settings.
            */
            function PdfDocument(options) {
                var _this = this;
                this._chunks = [];
                this._compress = true;
                /**
                * Gets the document information.
                */
                this.documentInfo = {
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
                this.pageSettings = {
                    layout: 0 /* Portrait */,
                    size: 48 /* LETTER */,
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
                this.header = {
                    font: new PdfFont(''),
                    text: '',
                    textColor: PdfDocument.DEF_FONT_STROKE_COLOR,
                    height: PdfDocument.DEF_SECTION_HEIGHT
                };
                /**
                * Gets an object that represents the page's header settings.
                */
                this.footer = {
                    font: new PdfFont(''),
                    text: '',
                    textColor: PdfDocument.DEF_FONT_STROKE_COLOR,
                    height: PdfDocument.DEF_SECTION_HEIGHT
                };
                /**
                * Occurs when the document rendering is done.
                */
                this.ended = new wijmo.Event();
                /**
                * Occurs when a new page is added to the document.
                */
                this.pageAdded = new wijmo.Event();
                wijmo.copy(this, options);

                this._doc = new PDFDocument(this._createPdfKitOptions(options));

                this._fontReg = new pdf.FontRegistrar(this._doc);

                this._doc.on('data', this._ehOnDocData = function (chunk) {
                    _this._onDocData(chunk);
                }).on('ending', this._ehOnDocEnding = function () {
                    _this._onDocEnding();
                }).on('end', this._ehOnDocEnded = function () {
                    _this._onDocEnded();
                });
            }
            PdfDocument.prototype._copy = function (key, value) {
                if (key === 'compress') {
                    this._compress = wijmo.asBoolean(value);
                    return true;
                }
                return false;
            };

            Object.defineProperty(PdfDocument.prototype, "compress", {
                //#region public properties
                /** Gets a value that determines whether the document should be compressed or not. */
                get: function () {
                    return this._compress;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PdfDocument.prototype, "_document", {
                /**
                * Gets the underlying PDFDocument object.
                */
                get: function () {
                    return this._doc;
                },
                enumerable: true,
                configurable: true
            });

            //#endregion public properties
            //#region public
            /**
            * Disposes the document.
            */
            PdfDocument.prototype.dispose = function () {
                if (this._doc) {
                    this._doc.removeEventListener('data', this._ehOnDocData).removeEventListener('ending', this._ehOnDocEnding).removeEventListener('end', this._ehOnDocEnded).removeEventListener('pageAdding', this._ehOnPageAdding).removeEventListener('pageAdded', this._ehOnPageAdded);

                    this._doc = null;
                    this._chunks = null;
                }
            };

            /**
            * Finishes the document rendering.
            */
            PdfDocument.prototype.end = function () {
                this._doc.end();
            };

            /**
            * Raises the @see:end event.
            */
            PdfDocument.prototype.onEnded = function (args) {
                if (this.ended) {
                    this.ended.raise(this, args);
                }
            };

            /**
            * Raises the @see:pageAdded event.
            */
            PdfDocument.prototype.onPageAdded = function (args) {
                if (this.pageAdded) {
                    this.pageAdded.raise(this, args);
                }
            };

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
            PdfDocument.prototype.renderBooleanCell = function (value, style) {
                var ci = this._renderCell(style), doc = this._doc, x = ci.contentX, y = ci.contentY, rectSize = doc.heightOfString('A', { lastLineExternalLeadingGap: false, width: Infinity });

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
                if (wijmo.changeType(value, 3 /* Boolean */, '') === true) {
                    var space = rectSize / 20, cmRectSize = rectSize - border - space * 2, cmLineWidth = rectSize / 8;

                    doc.save().translate(x + border / 2 + space, y + border / 2 + space).lineWidth(cmLineWidth).moveTo(cmLineWidth / 2, cmRectSize * 0.6).lineTo(cmRectSize - cmRectSize * 0.6, cmRectSize - cmLineWidth).lineTo(cmRectSize - cmLineWidth / 2, cmLineWidth / 2).stroke(PdfDocument.DEF_FONT_STROKE_COLOR).restore();
                }

                return this;
            };

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
            PdfDocument.prototype.renderTextCell = function (text, style) {
                var ci = this._renderCell(style);

                if (text) {
                    // set a font
                    this.font(new PdfFont(style.fontFamily, style.fontSize, style.fontStyle, style.fontWeight));

                    // set a font color
                    this._doc.fillColor(pdf.CssUtil.parseColor(style.color) || PdfDocument.DEF_FONT_STROKE_COLOR);

                    // draw a text
                    var textOptions = {
                        height: ci.contentHeight,
                        width: ci.contentWidth,
                        align: style.textAlign,
                        lastLineExternalLeadingGap: false
                    }, x = ci.contentX, y = ci.contentY;

                    switch (style.verticalAlign) {
                        case 'bottom':
                            var txtHeight = this._doc.heightOfString(text, textOptions);

                            if (txtHeight < textOptions.height) {
                                y += textOptions.height - txtHeight;
                                textOptions.height = txtHeight;
                            }
                            break;

                        case 'middle':
                            var txtHeight = this._doc.heightOfString(text, textOptions);

                            if (txtHeight < textOptions.height) {
                                y += textOptions.height / 2 - txtHeight / 2;
                                textOptions.height = txtHeight;
                            }
                            break;

                        default:
                            break;
                    }

                    this._doc.text(text, x, y, textOptions);
                }

                return this;
            };

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
            PdfDocument.prototype.font = function (font) {
                var internalName = this._fontReg.findFont(font.family, font.style, font.weight);
                this._doc.font(internalName, pdf.CssUtil.parseFontSize(font.size));
                return this;
            };

            /**
            * Registers a font from the source using a given name and associates a set of the font styles with it.
            *
            * @param font The font to register.
            * @param callback An optional parameter determining the callback function which will be called when the font has been registered.
            *
            * @return The @see:PdfDocument object.
            */
            PdfDocument.prototype.registerFont = function (font, callback) {
                if (!font) {
                    throw 'Font cannot be null';
                }

                var buffer;

                if (wijmo.isString(font.source)) {
                    buffer = pdf.XHRArrayBuffer(font.source);
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
            };

            /**
            * Registers a font from a URL asynchronously using a given name and associates a set of the font styles with it.
            *
            * @param The font to register.
            * @param callback A callback function which will be called when the font has been registered.
            *
            * @return The PdfDocument object.
            */
            PdfDocument.prototype.registerFontAsync = function (font, callback) {
                var _this = this;
                if (typeof (font.source) !== 'string') {
                    throw 'The fount.source must be of type string.';
                }

                pdf.XHRArrayBufferAsync(font.source, function (xhr, buffer) {
                    font = wijmo.pdf.shallowCopy(font);
                    font.source = buffer;

                    var uid = _this._fontReg.registerFont(font);

                    if (callback) {
                        callback(uid);
                    }
                });
            };

            //#endregion public
            //#region PDFDocument's native event handlers
            PdfDocument.prototype._onDocData = function (chunk) {
                this._chunks.push(chunk);
            };

            PdfDocument.prototype._onDocEnding = function () {
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
            };

            PdfDocument.prototype._onDocEnded = function () {
                if (PdfDocument.IE) {
                    for (var i = 0; i < this._chunks.length; i++) {
                        this._chunks[i] = this._chunks[i].toArrayBuffer();
                    }
                }

                var blob = new Blob(this._chunks, { type: 'application/pdf' });

                this._chunks = [];
                this.onEnded(new PdfDocumentEndedEventArgs(blob));
            };

            PdfDocument.prototype._onPageAdding = function (doc, options) {
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
            };

            PdfDocument.prototype._onPageAdded = function (doc, pageIndex) {
                doc.page.originalMargins = {
                    left: doc.page.margins.left,
                    right: doc.page.margins.right,
                    top: doc.page.margins.top,
                    bottom: doc.page.margins.bottom
                };

                this._updateTopMargin(doc);
                this._updateBottomMargin(doc);
                this.onPageAdded(new PdfDocumentPageAddedEventArgs(doc.page, pageIndex));
            };

            //#endregion
            //#region private
            PdfDocument.prototype._clientRect = function () {
                var page = this._doc.page;

                return new wijmo.Rect(page.margins.left, page.margins.top, Math.max(0, page.width - page.margins.left - page.margins.right), Math.max(0, page.height - page.margins.top - page.margins.bottom));
            };

            PdfDocument.prototype._createPdfKitOptions = function (options) {
                var _this = this;
                return {
                    compress: options.compress,
                    bufferPages: true,
                    pageAdding: this._ehOnPageAdding = function (doc, options) {
                        _this._onPageAdding(doc, options);
                    },
                    pageAdded: this._ehOnPageAdded = function (doc, pageIndex) {
                        _this._onPageAdded(doc, pageIndex);
                    }
                };
            };

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
            PdfDocument.prototype._renderCell = function (style) {
                this._resolveStyle(style); // trying to decomposite some properties to handle the situation when the style was created manually.

                var doc = this._doc, ps = pdf.CssUtil.parseSize, pc = pdf.CssUtil.parseColor, x = ps(style.left) || 0, y = ps(style.top) || 0, brd = pdf.CssUtil.parseBorder(style), blw = brd.left && brd.left.width || 0, btw = brd.top && brd.top.width || 0, bbw = brd.bottom && brd.bottom.width || 0, brw = brd.right && brd.right.width || 0, pad = pdf.CssUtil.parsePadding(style), height = ps(style.height) || 0, width = ps(style.width) || 0, clientHeight = 0, clientWidth = 0, contentHeight = 0, contentWidth = 0;

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
                        if (PdfDocument.IE) {
                            clientHeight = pad.top + pad.bottom + height;
                            clientWidth = pad.left + pad.right + width;
                        } else {
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
                            throw 'Invalid value: ' + style.boxSizing;
                        }
                    }
                }

                if (blw || brw || bbw || btw) {
                    // all borders has the same width and color, draw a rectangle
                    if ((blw && btw && bbw && brw) && (blw === brw && blw === bbw && blw === btw) && (style.borderLeftColor === style.borderRightColor && style.borderLeftColor === style.borderBottomColor && style.borderLeftColor === style.borderTopColor)) {
                        var border = blw, half = border / 2;

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
            };

            PdfDocument.prototype._resolveStyle = function (style) {
                if (style) {
                    var val;

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
            };

            PdfDocument.prototype._processHeadersFooters = function () {
                var hdr = this.header, ftr = this.footer;

                if (this._needToRenderSection(this.header) || this._needToRenderSection(this.footer)) {
                    var doc = this._document;

                    if (!doc.options.bufferPages) {
                        throw 'The bufferPages option must be enabled to render pagers and footers.';
                    }

                    var range = doc.bufferedPageRange();
                    for (var i = range.start; i < range.count; i++) {
                        var page = doc.switchToPage(i), frmt = {
                            'Page': i + 1,
                            'Pages': range.count
                        };

                        this._renderHeaderFooter(hdr, frmt, true);
                        this._renderHeaderFooter(ftr, frmt, false);
                    }
                }
            };

            PdfDocument.prototype._renderHeaderFooter = function (section, macros, isHeader) {
                if (section.text) {
                    var text = pdf.formatMacros(section.text, macros), parts = text.split('\t');

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
            };

            PdfDocument.prototype._renderHeaderFooterPart = function (section, text, alignment, isHeader) {
                var doc = this._doc, mrg = doc.page.margins, sctY = 0, font = this._fontReg.findFont(section.font.family, section.font.style, section.font.weight), textSettings = {
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
            };

            PdfDocument.prototype._needToRenderSection = function (section) {
                return !!section && section.height > 0 && !!section.text;
            };

            PdfDocument.prototype._updateTopMargin = function (doc) {
                if (this._needToRenderSection(this.header)) {
                    doc.page.margins.top = doc.page.originalMargins.top + this.header.height;
                    doc.y = doc.page.margins.top;
                }
            };

            PdfDocument.prototype._updateBottomMargin = function (doc) {
                if (this._needToRenderSection(this.footer)) {
                    doc.page.margins.bottom = doc.page.originalMargins.bottom + this.footer.height;
                }
            };
            PdfDocument.DEF_SECTION_HEIGHT = 25;
            PdfDocument.DEF_FONT_STROKE_COLOR = 'black';
            PdfDocument.IE = 'ActiveXObject' in window;
            return PdfDocument;
        })();
        pdf.PdfDocument = PdfDocument;

        /**
        * Represents a font.
        */
        var PdfFont = (function () {
            /**
            * Initializes a new instance of the @see:PdfFont class.
            *
            * @param family The name of the font.
            * @param size The size of the font.
            * @param style The style of the font.
            * @param weight The weight of the font.
            */
            function PdfFont(family, size, style, weight) {
                if (typeof size === "undefined") { size = 10; }
                if (typeof style === "undefined") { style = 'normal'; }
                if (typeof weight === "undefined") { weight = 'normal'; }
                this.family = family;
                this.size = size;
                this.style = style;
                this.weight = weight;
            }
            return PdfFont;
        })();
        pdf.PdfFont = PdfFont;

        /**
        * Provides arguments for the @see:end event.
        */
        var PdfDocumentEndedEventArgs = (function (_super) {
            __extends(PdfDocumentEndedEventArgs, _super);
            /**
            * Initializes a new instance of the @see:DocumentEndEventArgs class.
            *
            * @param blob A Blob object that contains the document data.
            */
            function PdfDocumentEndedEventArgs(blob) {
                _super.call(this);
                this._blob = blob;
            }
            Object.defineProperty(PdfDocumentEndedEventArgs.prototype, "blob", {
                /**
                * Gets a Blob object that contains the document data.
                */
                get: function () {
                    return this._blob;
                },
                enumerable: true,
                configurable: true
            });
            return PdfDocumentEndedEventArgs;
        })(wijmo.EventArgs);
        pdf.PdfDocumentEndedEventArgs = PdfDocumentEndedEventArgs;

        /**
        * Provides arguments for the @see:pageAdded event.
        */
        var PdfDocumentPageAddedEventArgs = (function (_super) {
            __extends(PdfDocumentPageAddedEventArgs, _super);
            /**
            * Initializes a new instance of the @see:DocumentPageAddedEventArgs class.
            *
            * @param pageIndex The index of the page being added.
            */
            function PdfDocumentPageAddedEventArgs(page, pageIndex) {
                _super.call(this);
                this._page = page;
                this._pageIndex = pageIndex;
            }
            Object.defineProperty(PdfDocumentPageAddedEventArgs.prototype, "page", {
                /**
                * Gets the page being added.
                */
                get: function () {
                    return this._page;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PdfDocumentPageAddedEventArgs.prototype, "pageIndex", {
                /**
                * Gets the index of the page being added.
                */
                get: function () {
                    return this._pageIndex;
                },
                enumerable: true,
                configurable: true
            });
            return PdfDocumentPageAddedEventArgs;
        })(wijmo.EventArgs);
        pdf.PdfDocumentPageAddedEventArgs = PdfDocumentPageAddedEventArgs;
    })(wijmo.pdf || (wijmo.pdf = {}));
    var pdf = wijmo.pdf;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    //#endregion
    //#region FontRegistrar.ts
    (function (pdf) {
        'use strict';

        var OrderedDictionary = (function () {
            function OrderedDictionary(values) {
                this._values = [];
                this._keys = {};
                if (values) {
                    for (var i = 0; i < values.length; i++) {
                        var val = values[i];

                        this._keys[val.key] = i;
                        this._values.push({ key: val.key, value: val.value });
                    }
                }
            }
            OrderedDictionary.prototype.hasKey = function (key) {
                var idx = this._keys[key];

                if (idx !== undefined) {
                    return this._values[idx].value;
                }

                return null;
            };

            OrderedDictionary.prototype.add = function (key, value) {
                if (!this.hasKey(key)) {
                    this._keys[key] = this._values.length;
                    this._values.push({ key: key, value: value });
                    return value;
                }

                return null;
            };

            OrderedDictionary.prototype.each = function (fn) {
                if (fn) {
                    for (var i = 0; i < this._values.length; i++) {
                        var val = this._values[i];

                        if (fn(val.key, val.value) === false) {
                            break;
                        }
                    }
                }
            };

            OrderedDictionary.prototype.eachReverse = function (fn) {
                if (fn) {
                    for (var i = this._values.length - 1; i >= 0; i--) {
                        var val = this._values[i];

                        if (fn(val.key, val.value) === false) {
                            break;
                        }
                    }
                }
            };
            return OrderedDictionary;
        })();

        /**
        * Provides font registration functionality. For internal use only.
        */
        var FontRegistrar = (function () {
            /**
            * Initializes a new instance of the @see:FontRegistrar class.
            *
            * @param doc A IPdfKitDocument object.
            */
            function FontRegistrar(doc) {
                var _this = this;
                this.DEF_FONT = 'Times-Roman';
                // standard fonts, starting from the specific one
                this._fonts = new OrderedDictionary([
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
                this._weightNameToNum = {
                    'normal': 400,
                    'bold': 700
                };
                this._findFontCache = {};
                this._internalFontNames = {};
                this._doc = doc;

                // fill _internalFontNames
                this._fonts.each(function (key, value) {
                    var facesIterator = function (descr) {
                        for (var key in descr) {
                            _this._internalFontNames[descr[key]] = 1;
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
            FontRegistrar.prototype.registerFont = function (font) {
                if (!font || !font.name || !(font.source instanceof ArrayBuffer)) {
                    throw 'Invalid name.';
                }

                font = wijmo.pdf.shallowCopy(font);

                var ns = this._normalizeFontSelector(font.name, font.style, font.weight), fntDscr = this._fonts.hasKey(ns.name);

                if (!fntDscr) {
                    fntDscr = this._fonts.add(ns.name, { attributes: font });
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
            };

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
            FontRegistrar.prototype.findFont = function (name, style, weight) {
                var ns = this._normalizeFontSelector(name, style, weight), internalName = this._makeInternalName(ns);

                if (this._findFontCache[internalName]) {
                    return this._findFontCache[internalName];
                }

                for (var i = 0, names = ns.name.split(','); i < names.length; i++) {
                    var tmp = this._findFont(names[i].replace(/["']/g, '').trim(), ns.style, ns.weight);
                    if (tmp) {
                        return this._findFontCache[internalName] = tmp;
                    }
                }

                return this._findFontCache[internalName] = this._internalFontNames[name] ? name : this.DEF_FONT;
            };

            FontRegistrar.prototype._normalizeFontSelector = function (name, style, weight) {
                return {
                    name: (name || '').toLowerCase(),
                    style: (style || 'normal').toLowerCase(),
                    weight: parseInt(this._weightNameToNum[weight] || weight) || 400
                };
            };

            FontRegistrar.prototype._findFont = function (name, style, weight) {
                var _this = this;
                var facesToTest = [], res;

                switch (style) {
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
                        this._fonts.eachReverse(function (key, font) {
                            var propName = (name === 'sans-serif') ? 'sansSerif' : name;

                            if (font.attributes[propName]) {
                                for (var i = 0; i < facesToTest.length; i++) {
                                    res = _this._findFontWeightFallback(key, facesToTest[i], weight);
                                    if (res) {
                                        return false;
                                    }
                                }
                            }
                        });
                        break;

                    default:
                        if (this._fonts.hasKey(name)) {
                            for (var i = 0; i < facesToTest.length && !res; i++) {
                                res = this._findFontWeightFallback(name, facesToTest[i], weight);
                            }
                        }
                }

                return res;
            };

            FontRegistrar.prototype._findFontWeightFallback = function (name, style, weight, availableWeights) {
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

                            availableWeights.sort(function (a, b) {
                                return a - b;
                            });
                        }

                        if (weight > 500) {
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
                            if (weight < 400) {
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
                                if (weight == 400) {
                                    if (weights[500]) {
                                        return weights[500];
                                    } else {
                                        return this._findFontWeightFallback(name, style, 400, availableWeights);
                                    }
                                } else {
                                    if (weights[400]) {
                                        return weights[400];
                                    } else {
                                        return this._findFontWeightFallback(name, style, 300, availableWeights);
                                    }
                                }
                            }
                        }
                    }
                }

                return null;
            };

            FontRegistrar.prototype._makeInternalName = function (ns) {
                return ns.name + '-' + ns.style + '-' + ns.weight;
            };
            return FontRegistrar;
        })();
        pdf.FontRegistrar = FontRegistrar;
    })(wijmo.pdf || (wijmo.pdf = {}));
    var pdf = wijmo.pdf;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    //#endregion
    //#region Util.cs
    (function (pdf) {
        'use strict';

        

        var XhrOverrideMimeTypeSupported = !!new XMLHttpRequest().overrideMimeType;

        /**
        * Retrieves data from a URL using XMLHttpRequest.
        *
        * @param url The URL to send the request to.
        * @param settings Request settings.
        * @param success A function to be called if the request succeeds.
        * @param error A function to be called if the request fails.
        */
        function XHR(url, settings, success, error) {
            var xhr = new XMLHttpRequest();

            settings = settings || {};

            xhr.open(settings.method, url, settings.async, settings.user, settings.password);

            xhr.addEventListener('load', function () {
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
        pdf.XHR = XHR;

        /**
        * Asynchronously retrieves an ArrayBuffer from a URL using XMLHttpRequest.
        *
        * @param url The URL to send the request to.
        * @param success A function to be called if the request succeeds.
        * @param error A function to be called if the request fails.
        */
        function XHRArrayBufferAsync(url, success, error) {
            var settings = {
                method: 'GET',
                responseType: 'arraybuffer',
                async: true
            };

            XHR(url, settings, success, error);
        }
        pdf.XHRArrayBufferAsync = XHRArrayBufferAsync;

        /**
        * Synchronously retrieves an ArrayBuffer from a URL using XMLHttpRequest.
        *
        * @param url The URL to send the request to.
        * @param success A function to be called if the request succeeds.
        * @param error A function to be called if the request fails.
        */
        function XHRArrayBuffer(url, error) {
            var buffer, settings = {
                method: 'GET',
                async: false
            };

            if (XhrOverrideMimeTypeSupported) {
                // Note: the responseType parameter must be empty in case of synchronous request (http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute)
                settings.overrideMimeType = 'text/plain; charset=x-user-defined'; // retrieve unprocessed data as a binary string

                XHR(url, settings, function (xhr, response) {
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

                XHR(url, settings, function (xhr, response) {
                    buffer = response;
                }, error);
            }

            return buffer;
        }
        pdf.XHRArrayBuffer = XHRArrayBuffer;

        /**
        * Merges the content of the source object with the desination object.
        *
        * @param dst The destination object.
        * @param src The source object.
        * @return The modifled destination object.
        */
        function merge(dst, src, overwrite) {
            if (typeof overwrite === "undefined") { overwrite = false; }
            if (src && dst) {
                for (var key in src) {
                    var srcProp = src[key], dstProp = dst[key];

                    if (!wijmo.isObject(srcProp)) {
                        if (dstProp === undefined || (overwrite && srcProp !== undefined)) {
                            dst[key] = srcProp;
                        }
                    } else {
                        if (dstProp === undefined || !wijmo.isObject(dstProp) && overwrite) {
                            dst[key] = dstProp = {};
                        }

                        if (wijmo.isObject(dstProp)) {
                            merge(dst[key], srcProp, overwrite);
                        }
                    }
                }
            }

            return dst;
        }
        pdf.merge = merge;

        /**
        * Creates a shallow copy of the source object.
        *
        * @param src The source object.
        * @return The shallow copy of the source object.
        */
        function shallowCopy(src) {
            var dst = {};

            for (var key in src) {
                dst[key] = src[key];
            }

            return dst;
        }
        pdf.shallowCopy = shallowCopy;

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
        function formatMacros(str, dict) {
            var amps = {}, ampsCnt = 0;

            // && -> &
            str = str.replace(/&&/g, function (match, offset, str) {
                amps[offset - (ampsCnt * 2) + ampsCnt] = true; // store the position of an actual ampersand within the string
                ampsCnt++;
                return '&';
            });

            // process macros
            str = str.replace(/&\[(\S+?)\]/g, function (match, p1, offset, str) {
                var macros = dict[p1];

                return macros && !amps[offset] ? macros : match;
            });

            return str;
        }
        pdf.formatMacros = formatMacros;

        /**
        * Converts a pixel value to a point unit.
        *
        * @param value A value to convert.
        * @return A point unit value.
        */
        function PxToPt(value) {
            return value * 0.75;
        }
        pdf.PxToPt = PxToPt;

        /**
        * Converts a point unit value to a pixel value.
        *
        * @param value A value to convert.
        * @return A pixel value.
        */
        function PtToPx(value) {
            return value * 96 / 72;
        }
        pdf.PtToPx = PtToPx;
    })(wijmo.pdf || (wijmo.pdf = {}));
    var pdf = wijmo.pdf;
})(wijmo || (wijmo = {}));

var wijmo;
(function (wijmo) {
    //#endregion
    //#region CssUtil.cs
    (function (pdf) {
        'use strict';

        

        

        

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
        var CssUtil = (function () {
            function CssUtil() {
            }
            /**
            * Extracts the border values from the CSSStyleDeclaration object.
            *
            * @param style A value to extract from.
            * @param normailize Means that if a particular border has no style or width then it will be null.
            * @return A @see:IBorder object.
            */
            CssUtil.parseBorder = function (style, normalize) {
                if (typeof normalize === "undefined") { normalize = true; }
                var borders, ps = CssUtil.parseSize, pc = CssUtil.parseColor;

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
                    };
                }

                return borders;
            };

            /**
            * Extracts the padding values from the CSSStyleDeclaration object.
            *
            * @param style A value to extract from.
            * @return A @see:IPadding object.
            */
            CssUtil.parsePadding = function (style) {
                var ps = CssUtil.parseSize;

                return {
                    left: ps(style.paddingLeft) || 0,
                    top: ps(style.paddingTop) || 0,
                    bottom: ps(style.paddingBottom) || 0,
                    right: ps(style.paddingRight) || 0
                };
            };

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
            CssUtil.parseSize = function (value) {
                if (value || value === 0) {
                    if (wijmo.isNumber(value)) {
                        return value;
                    }

                    if (wijmo.isString(value)) {
                        var num = parseFloat(value);
                        if (num === num) {
                            if (value.match(/(px)$/i)) {
                                num = num * 0.75; // px -> pt
                            }

                            return num;
                        }
                    }
                }

                return undefined;
            };

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
            CssUtil.parseFontSize = function (value) {
                if (wijmo.isString(value)) {
                    if (FontSizeToPt[value]) {
                        return FontSizeToPt[value];
                    }
                }

                return CssUtil.parseSize(value);
            };

            /**
            * Converts a color value in functional notation 'rgb(byte, byte, byte)' to a number array.
            *
            * @param value A value to convert.
            * @return A number array or original value if conversion fails.
            */
            CssUtil.parseColor = function (value) {
                if (value && wijmo.isString(value)) {
                    if (!value.indexOf('rgb')) {
                        var rgb = value.match(/\d+/g);

                        rgb[0] = rgb[0] * 1;
                        rgb[1] = rgb[1] * 1;
                        rgb[2] = rgb[2] * 1;

                        return rgb;
                    }
                }

                return value;
            };
            return CssUtil;
        })();
        pdf.CssUtil = CssUtil;
    })(wijmo.pdf || (wijmo.pdf = {}));
    var pdf = wijmo.pdf;
})(wijmo || (wijmo = {}));
//#endregion CssUtil.cs
//# sourceMappingURL=PdfDocument.js.map
