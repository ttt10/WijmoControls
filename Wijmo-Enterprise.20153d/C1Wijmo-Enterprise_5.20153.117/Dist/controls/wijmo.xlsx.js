/*
    *
    * Wijmo Library 5.20153.117
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    *
    * Licensed under the Wijmo Commercial License.
    * sales@wijmo.com
    * http://wijmo.com/products/wijmo-5/license/
    *
    */
//----------------------------------------------------------
// Copyright (C) Microsoft Corporation. All rights reserved.
// Released under the Microsoft Office Extensible File License
// https://raw.github.com/stephen-hardy/xlsx.js/master/LICENSE.txt
//
// The library includes changes made by GrapeCity.
//
// 1.  Add row height / column width support for exporting.
//     We add the height property in the worksheet.row for exporting row height.
//     We add the width property in the worksheet.col for exporting column width.
// 2.  Add row/column visible support for exporting.
//     We add the rowVisible property in the first cell of each row to supporting the row visible feature.
//     We add the visible property in the cells for supporting the column visible feature.
// 3.  Add group header support for exporting/importing.
//     We add the groupLevel property in the cells for exporting group.
//     We read the outlineLevel property of the excel row for importing group.
// 4.  Add indent property for nested group for exporting.
//     We add the indent property in the cells of the group row for exporting the indentation for the nested groups.
// 5.  Modify the excel built-in format 'mm-dd-yy' to 'm/d/yyyy'.
// 6.  Add excel built-in format '$#,##0.00_);($#,##0.00)'.
// 7.  Fix issue that couldn't read rich text content of excel cell.
// 8.  Fix issue that couldn't read the excel cell content processed by the string processing function.
// 9.  Fix issue exporting empty sheet 'dimension ref' property incorrect.
// 10. Add frozen rows and columns supporting for exporting/importing.
//     We add frozenPane property that includes rows and columns sub properties in each worksheet.
// 11. Add 'ca' attribute for the cellFormula element for exporting.
// 12. Add formula supporting for importing.
// 13. escapeXML for the formula of the cell.
// 14. Add font color and fill color processing for exporting.
// 15. Add font and fill color processing for importing.
// 16. Add horizontal alignment processing for importing.
// 17. Add column width and row height processing for importing.
// 18. Update merge cells processing for exporting.
// 19. Add merge cells processing for importing.
// 20. Packed cell styles into the style property of cell for exporting.
// 21. Fixed convert excel date value to JS Date object issue.
// 22. Parse the merge cell info to rowSpan and colSpan property of cell.
// 23. Add row collapsed processing for importing.
// 24. Fixed the getting type of cell issue when there is shared formula in the cell.
// 25. Rename the method name from xlsx to _xlsx.
// 26. Add isDate property for cell to indicated whether the value of the cell is date or not.
// 27. Add parsePixelToCharWidth method and parseCharWidthToPixel method.
// 28. Just get the display string for importing.
// 29. Add inheritance style parsing for exporting.
// 30. Fixed the issue that the string like number pattern won't be exported as string.
// 31. Added parse indexed color processing.
// 32. Added parse theme color processing.
// 33. Added row style supporting.
// 34. Added column style supporting.
// 35. Added check empty object function.
// 36. Added hidden worksheet supporting for importing\exporting.
// 37. Parse the different color pattern to Hex pattern like #RRGGBB for exporting.
// 38. Add vertical alignment processing for exporting.
// 39. Add shared formula importing.
// 40. Add macro importing\exporting.
//
//----------------------------------------------------------
if ((typeof JSZip === 'undefined' || !JSZip) && typeof require === 'function') {
    var JSZip = require('node-zip');
}

var wijmo;
(function (wijmo) {
    /*
    * Defines the xlsx exporting\importing related class and methods.
    */
    (function (xlsx) {
        'use strict';

        /*
        * xlsx file exporting\importing processing.
        *
        * @param file The object module for exporting to xlsx file or the encoded base64 string of xlsx file for importing.
        */
        function _xlsx(file) {
            'use strict'; // v2.3.2

            // check dependency...
            wijmo.assert(JSZip != null, 'wijmo.c1xlsx requires the JSZip library.');

            var result, zip = new JSZip(), zipTime, processTime, s, content, contentResult, f, i, j, k, l, t, w, sharedStrings, styles, index, data, val, formula, sharedFormulas, cellRef, si, rowStyle, columnStyle, style, borders, border, borderIndex, fonts, font, fontIndex, docProps, xl, xlWorksheets, worksheet, worksheetVisible, contentTypes = [[], []], props = [], xlRels = [], worksheets = [], id, columns, cols, columnSettings, colWidth, cell, row, merges, rowStr, rowHeightSetting, groupLevelSetting, rowVisible, hiddenColumns, idx, colIndex, groupLevel, frozenPane, frozenRows, frozenCols, fills, fill, fillIndex, macroEnabled, applicationType, numFmts = [
                'General', '0', '0.00', '#,##0', '#,##0.00', , , '$#,##0.00_);($#,##0.00)', , '0%', '0.00%', '0.00E+00', '# ?/?', '# ??/??', 'm/d/yyyy', 'd-mmm-yy', 'd-mmm', 'mmm-yy', 'h:mm AM/PM', 'h:mm:ss AM/PM',
                'h:mm', 'h:mm:ss', 'm/d/yy h:mm', , , , , , , , , , , , , , , '#,##0 ;(#,##0)', '#,##0 ;[Red](#,##0)', '#,##0.00;(#,##0.00)', '#,##0.00;[Red](#,##0.00)', , , , , 'mm:ss', '[h]:mm:ss', 'mmss.0', '##0.0E+0', '@'], numFmtArray, fontArray, fillArray, colorThemes, colsSetting, height, mergeCellArray, mergeRange, mergeCells, mergeCell, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', defaultFontName = 'Calibri', defaultFontSize = 11, indexedColors = [
                '000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF',
                '000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF',
                '800000', '008000', '000080', '808000', '800080', '008080', 'C0C0C0', '808080',
                '9999FF', '993366', 'FFFFCC', 'CCFFFF', '660066', 'FF8080', '0066CC', 'CCCCFF',
                '000080', 'FF00FF', 'FFFF00', '00FFFF', '800080', '800000', '008080', '0000FF',
                '00CCFF', 'CCFFFF', 'CCFFCC', 'FFFF99', '99CCFF', 'FF99CC', 'CC99FF', 'FFCC99',
                '3366FF', '33CCCC', '99CC00', 'FFCC00', 'FF9900', 'FF6600', '666699', '969696',
                '003366', '339966', '003300', '333300', '993300', '993366', '333399', '333333',
                '000000', 'FFFFFF'];

            // GrapeCity End
            function numAlpha(i) {
                var t = Math.floor(i / 26) - 1;
                return (t > -1 ? numAlpha(t) : '') + alphabet.charAt(i % 26);
            }

            function alphaNum(s) {
                var t = 0;
                if (s.length === 2) {
                    t = alphaNum(s.charAt(0)) + 1;
                }
                return t * 26 + alphabet.indexOf(s.substr(-1));
            }

            function convertDate(input) {
                var d = new Date(1900, 0, 0), isDateObject = Object.prototype.toString.call(input) === "[object Date]", offset = ((isDateObject ? input.getTimezoneOffset() : (new Date()).getTimezoneOffset()) - d.getTimezoneOffset()) * 60000;

                // GrapeCity Begin: Fixed convert excel date value to JS Date object issue.
                if (isDateObject) {
                    return ((input.getTime() - d.getTime() + offset) / 86400000) + 1;
                } else if (wijmo.isNumber(input)) {
                    return new Date(Math.round((+d + offset + (input - 1) * 86400000) / 1000) * 1000);
                } else {
                    return null;
                }
                // GrapeCity End
            }

            function typeOf(obj) {
                return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
            }

            function getAttr(s, n) {
                s = s.substr(s.indexOf(n + '="') + n.length + 2);
                return s.substring(0, s.indexOf('"'));
            }

            // GrapeCity Begin: Add the function to get the value of child node
            function getChildNodeValue(s, n) {
                s = s.substr(s.indexOf(n + ' val="') + n.length + 6);
                return s.substring(0, s.indexOf('"'));
            }

            // GrapeCity End
            // GrapeCity Begin: Add the function to get the color for the font or the fill node.
            function getColor(s, isFillColor) {
                var isThemeColor, theme, index, value;
                if ((s.search(/fgcolor/i) === -1 && isFillColor) || (s.search(/color/i) === -1 && !isFillColor)) {
                    return undefined;
                }
                s = isFillColor ? s.substring(s.indexOf('<fgColor'), s.indexOf('/>')) : s.substring(s.indexOf('<color'));
                if (s.indexOf('rgb=') !== -1) {
                    value = getAttr(s, 'rgb');
                    if (value && value.length === 8) {
                        value = value.substring(2);
                    }
                } else if (s.indexOf('indexed') !== -1) {
                    index = +getAttr(s, 'indexed');
                    value = indexedColors[index] || '';
                } else {
                    isThemeColor = true;
                    theme = +getAttr(s, 'theme');
                    if (s.indexOf('tint') !== -1) {
                        value = +getAttr(s, 'tint');
                    }
                    value = getThemeColor(theme, value);
                }
                return value && value[0] === '#' ? value : '#' + value;
            }

            // GrapeCity End
            // GrapeCity Begin: Add the function to parse the theme color to RGB color.
            function getThemeColor(theme, tint) {
                var themeColor = colorThemes[theme], color, hslArray;
                if (tint != null) {
                    color = new wijmo.Color('#' + themeColor);
                    hslArray = color.getHsl();

                    // About the tint value and theme color convert to rgb color,
                    // please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.color.aspx
                    if (tint < 0) {
                        hslArray[2] = hslArray[2] * (1.0 + tint);
                    } else {
                        hslArray[2] = hslArray[2] * (1.0 - tint) + (1 - 1 * (1.0 - tint));
                    }
                    color = wijmo.Color.fromHsl(hslArray[0], hslArray[1], hslArray[2]);
                    return color.toString().substring(1);
                }

                // if the color value is undefined, we should return the themeColor (TFS 121712)
                return themeColor;
            }

            // GrapeCity End
            //  GrapeCity Begin: Parse the different color pattern to Hex pattern like #RRGGBB for exporting.
            function parseColor(color) {
                var parsedColor = new wijmo.Color(color);

                // Because excel doesn't support transparency, we have to make the color closer to white to simulate the transparency.
                if (parsedColor.a < 1) {
                    parsedColor = wijmo.Color.toOpaque(parsedColor);
                }
                return parsedColor.toString();
            }

            // GrapeCity End
            function escapeXML(s) {
                return typeof s === 'string' ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;') : '';
            }

            function unescapeXML(s) {
                return typeof s === 'string' ? s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, '\'') : '';
            }

            // Parse the pixel width to character width for exporting
            function parsePixelToCharWidth(pixels) {
                if (pixels == null || isNaN(+pixels)) {
                    return null;
                }

                // The calculation is =Truncate(({pixels}-5)/{Maximum Digit Width} * 100+0.5)/100
                // Please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
                return ((+pixels - 5) / 7 * 100 + 0.5) / 100;
            }

            // Parse the character width to pixel width for importing
            function parseCharWidthToPixel(charWidth) {
                if (charWidth == null || isNaN(+charWidth)) {
                    return null;
                }

                // The calculation is =Truncate(((256 * {width} + Truncate(128/{Maximum Digit Width}))/256)*{Maximum Digit Width})
                // Please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
                return ((256 * (+charWidth) + (128 / 7)) / 256) * 7;
            }

            function parseCharCountToCharWidth(charCnt) {
                if (charCnt == null || isNaN(+charCnt)) {
                    return null;
                }

                // The calculation is =Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256
                // Please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
                return (((+charCnt) * 7 + 5) / 7 * 256) / 256;
            }

            // Parse inheritance style
            function resolveStyleInheritance(style) {
                var resolvedStyle;

                // no inheritance? save some time
                if (!style.basedOn) {
                    return style;
                }

                for (var key in style.basedOn) {
                    if (key === 'basedOn') {
                        resolvedStyle = resolveStyleInheritance(style.basedOn);
                        for (key in resolvedStyle) {
                            var val = resolvedStyle[key];
                            style[key] = style[key] == null ? val : extend(style[key], val);
                        }
                    } else {
                        var val = style.basedOn[key];
                        style[key] = style[key] == null ? val : extend(style[key], val);
                    }
                }
                delete style.basedOn;

                // return resolved style
                return style;
            }

            // Gets all base shared formulas for a worksheet.
            function getsBaseSharedFormulas(sheet) {
                var formulas = sheet.match(/\<f[^<]*ref[^<]*>[^<]+(?=\<\/f>)/g), formula, sharedIndex, cellRef;

                sharedFormulas = [];
                if (formulas && formulas.length > 0) {
                    for (var i = 0; i < formulas.length; i++) {
                        formula = formulas[i];
                        sharedIndex = getAttr(formula, 'si');
                        cellRef = getAttr(formula, 'ref');
                        cellRef = cellRef ? cellRef.substring(0, cellRef.indexOf(':')) : '';
                        formula = formula.replace(/(\<f.*>)(.+)/, "$2");
                        sharedFormulas[+sharedIndex] = parseSharedFormulaInfo(cellRef, formula);
                    }
                }
            }

            // Parse the base shared formula to shared formula info that contains the cell reference, formula and the formula cell references of the shared formula.
            function parseSharedFormulaInfo(cellRef, formula) {
                var formulaRefs = formula.match(/(\'?\w+\'?\!)?(\$?[A-Za-z]+)(\$?\d+)/g), formulaRef, formulaRefCellIndex, sheetRef, cellRefAddress, formulaRefsAddress;

                cellRefAddress = xlsx.Workbook.tableAddress(cellRef);
                if (formulaRefs && formulaRefs.length > 0) {
                    formulaRefsAddress = [];
                    for (var i = 0; i < formulaRefs.length; i++) {
                        formulaRef = formulaRefs[i];
                        formula = formula.replace(formulaRef, '{' + i + '}');
                        formulaRefCellIndex = formulaRef.indexOf('!');
                        if (formulaRefCellIndex > 0) {
                            sheetRef = formulaRef.substring(0, formulaRefCellIndex);
                            formulaRef = formulaRef.substring(formulaRefCellIndex + 1);
                        }
                        formulaRefsAddress[i] = {
                            cellAddress: xlsx.Workbook.tableAddress(formulaRef),
                            sheetRef: sheetRef
                        };
                    }
                }

                return {
                    cellRef: cellRefAddress,
                    formula: formula,
                    formulaRefs: formulaRefsAddress
                };
            }

            // Gets the shared formula via the si and cell reference.
            function getSharedFormula(si, cellRef) {
                var sharedFormulaInfo, cellAddress, rowDiff, colDiff, rowIndex, colIndex, formula, formulaRefs, formulaRef, formulaCell;

                if (sharedFormulas && sharedFormulas.length > 0) {
                    sharedFormulaInfo = sharedFormulas[+si];
                    if (sharedFormulaInfo) {
                        formula = sharedFormulaInfo.formula;
                        formulaRefs = sharedFormulaInfo.formulaRefs;
                        if (formulaRefs && formulaRefs.length > 0) {
                            cellAddress = xlsx.Workbook.tableAddress(cellRef);
                            rowDiff = cellAddress.row - sharedFormulaInfo.cellRef.row;
                            colDiff = cellAddress.col - sharedFormulaInfo.cellRef.col;
                            for (var i = 0; i < formulaRefs.length; i++) {
                                formulaRef = formulaRefs[i];
                                rowIndex = formulaRef.cellAddress.row + (formulaRef.cellAddress.absRow ? 0 : rowDiff);
                                colIndex = formulaRef.cellAddress.col + (formulaRef.cellAddress.absCol ? 0 : colDiff);
                                formulaCell = xlsx.Workbook.xlsxAddress(rowIndex, colIndex, formulaRef.cellAddress.absRow, formulaRef.cellAddress.absCol);
                                if (formulaRef.sheetRef != null && formulaRef.sheetRef !== '') {
                                    formulaCell = formulaRef.sheetRef + '!' + formulaCell;
                                }
                                formula = formula.replace('{' + i + '}', formulaCell);
                            }
                        }
                        return formula;
                    }
                }
                return '';
            }

            // extends the source hash to destination hash
            function extend(dst, src) {
                if (wijmo.isObject(dst) && wijmo.isObject(src)) {
                    for (var key in src) {
                        var value = src[key];
                        if (wijmo.isObject(value) && dst[key] != null) {
                            extend(dst[key], value); // extend sub-objects
                        } else if (value != null && dst[key] == null) {
                            dst[key] = value; // assign values
                        }
                    }
                    return dst;
                } else {
                    return src;
                }
            }

            function isEmpty(obj) {
                // Speed up calls to hasOwnProperty
                var hasOwnProperty = Object.prototype.hasOwnProperty;

                // null and undefined are "empty"
                if (obj == null)
                    return true;

                // Assume if it has a length property with a non-zero value
                // that that property is correct.
                if (obj.length > 0)
                    return false;
                if (obj.length === 0)
                    return true;

                for (var key in obj) {
                    if (hasOwnProperty.call(obj, key))
                        return false;
                }

                return true;
            }

            if (typeof file === 'string') {
                zipTime = Date.now();
                zip = zip.load(file, { base64: true });
                result = { sheets: [], zipTime: Date.now() - zipTime };
                processTime = Date.now();
                sharedStrings = [];
                styles = [];

                // GrapeCity Begin: initialize the fonts, fills and themes array for importing.
                fonts = [];
                fills = [];
                colorThemes = [];

                // GrapeCity End
                if (s = zip.file('xl/sharedStrings.xml')) {
                    // GrapeCity Begin: For fixing issue the content of cell is cut off if it is rich text with multiple style.
                    // Do not process i === 0, because s[0] is the text before first t element
                    s = s.asText().split(/<si.*?>/g);
                    i = s.length;
                    while (--i) {
                        j = 1;
                        if (s[i].search(/<r>/gi) > -1) {
                            // GrapeCity: Handle the rich text run.
                            content = s[i].split(/<r>/g);
                        } else {
                            // GrapeCity: We just need the display string for importing.
                            s[i] = s[i].substring(0, s[i].indexOf('</t>'));
                            content = s[i].split(/<t.*?>/g);
                        }
                        sharedStrings[i - 1] = '';
                        while (j < content.length) {
                            if (content[j].search(/<t.*?>/g) > -1) {
                                // GrapeCity: Get the text for the rich text run.
                                contentResult = content[j].match(/(<t.*?>)(.*)/);
                                if (contentResult && contentResult.length === 3 && contentResult[2] != null) {
                                    content[j] = contentResult[2].substring(0, contentResult[2].indexOf('</t>'));
                                }
                            }
                            sharedStrings[i - 1] += unescapeXML(content[j]);
                            j++;
                        }
                    }
                    // GrapeCity End
                }
                if (s = zip.file('docProps/core.xml')) {
                    s = s.asText();
                    s = s.substr(s.indexOf('<dc:creator>') + 12);
                    result.creator = s.substring(0, s.indexOf('</dc:creator>'));
                    s = s.substr(s.indexOf('<cp:lastModifiedBy>') + 19);
                    result.lastModifiedBy = s.substring(0, s.indexOf('</cp:lastModifiedBy>'));
                    s = s.substr(s.indexOf('<dcterms:created xsi:type="dcterms:W3CDTF">') + 43);
                    result.created = new Date(s.substring(0, s.indexOf('</dcterms:created>')));
                    s = s.substr(s.indexOf('<dcterms:modified xsi:type="dcterms:W3CDTF">') + 44);
                    result.modified = new Date(s.substring(0, s.indexOf('</dcterms:modified>')));
                }
                if (s = zip.file('xl/workbook.xml')) {
                    s = s.asText();
                    index = s.indexOf('activeTab="');
                    if (index > 0) {
                        s = s.substr(index + 11); // Must eliminate first 11 characters before finding the index of " on the next line. Otherwise, it finds the " before the value.
                        result.activeWorksheet = +s.substring(0, s.indexOf('"'));
                    } else {
                        result.activeWorksheet = 0;
                    }
                    s = s.split('<sheet ');
                    i = s.length;
                    while (--i) {
                        id = s[i].substr(s[i].indexOf('name="') + 6);

                        // GrapeCity Begin: Gets the worksheet visible property.
                        worksheetVisible = getAttr(s[i], 'state') !== 'hidden';
                        result.sheets.unshift({ name: id.substring(0, id.indexOf('"')), visible: worksheetVisible, cols: [], columns: [], rows: [] });
                        // GrapeCity End
                    }
                }

                // GrapeCity Begin: Add processing for getting theme color.
                if (s = zip.file('xl/theme/theme1.xml')) {
                    s = s.asText();
                    colorThemes[0] = getAttr(s.substring(s.indexOf('a:lt1'), s.indexOf('</a:lt1>')), 'lastClr');
                    colorThemes[1] = getAttr(s.substring(s.indexOf('a:dk1'), s.indexOf('</a:dk1>')), 'lastClr');
                    colorThemes[2] = getAttr(s.substring(s.indexOf('a:lt2'), s.indexOf('</a:lt2>')), 'val');
                    colorThemes[3] = getAttr(s.substring(s.indexOf('a:dk2'), s.indexOf('</a:dk2>')), 'val');
                    s = s.substring(s.indexOf('<a:accent1'), s.indexOf('</a:accent6>')).split('<a:accent');
                    i = s.length;
                    while (--i) {
                        t = s[i];
                        colorThemes[i + 3] = getAttr(t, 'val');
                    }
                }

                // GrapeCity End
                if (s = zip.file('xl/styles.xml')) {
                    s = s.asText();
                    numFmtArray = s.substring(s.indexOf('<numFmts'), s.indexOf('</numFmts>')).split('<numFmt ');
                    i = numFmtArray.length;
                    while (--i) {
                        t = numFmtArray[i];
                        numFmts[+getAttr(t, 'numFmtId')] = getAttr(t, 'formatCode');
                    }

                    // GrapeCity Begin: Add processing for getting font setting.
                    fontArray = s.substring(s.indexOf('<fonts'), s.indexOf('</fonts>')).split('<font>');
                    i = fontArray.length;
                    while (--i) {
                        t = fontArray[i];
                        fonts[i - 1] = {
                            bold: t.indexOf('<b/>') !== -1,
                            italic: t.indexOf('<i/>') !== -1,
                            underline: t.indexOf('<u/>') !== -1,
                            size: Math.round(+getChildNodeValue(t, "sz") * 96 / 72),
                            family: getChildNodeValue(t, "name"),
                            color: getColor(t, false)
                        };
                    }

                    // GrapeCity End
                    // GrapeCity Begin: Add processing for getting fill setting.
                    fillArray = s.substring(s.indexOf('<fills'), s.indexOf('</fills>')).split('<fill>');
                    i = fillArray.length;
                    while (--i) {
                        t = fillArray[i];
                        fills[i - 1] = getColor(t, true);
                    }

                    // GrapeCity End
                    s = s.substr(s.indexOf('cellXfs')).split('<xf ');
                    i = s.length;
                    while (--i) {
                        id = getAttr(s[i], 'numFmtId');
                        f = numFmts[id];
                        if (/[hsmy\:]/i.test(f)) {
                            t = 'date';
                        } else if (f.indexOf('0') > -1) {
                            t = 'number';
                        } else if (f === '@') {
                            t = 'string';
                        } else {
                            t = 'unknown';
                        }

                        // GrapeCity Begin: Add processing for adding font setting and fill setting and horizontal alignment in the style.
                        id = getAttr(s[i], 'fontId');
                        font = +id > 0 ? fonts[id] : undefined;
                        id = getAttr(s[i], 'fillId');
                        fill = +id > 1 ? fills[id] : undefined;
                        styles.unshift({
                            formatCode: f,
                            type: t,
                            font: font,
                            fillColor: fill,
                            hAlign: s[i].indexOf('<alignment') > -1 ? xlsx.Workbook._parseStringToHAlign(getAttr(s[i], 'horizontal')) : undefined
                        });
                        // GrapeCity End
                    }
                }
                result.styles = styles;

                // GrapeCity Begin: load the macro of the xlsx file into workbook object model.
                if (s = zip.file('xl/vbaProject.bin')) {
                    if (result.reservedContent == null) {
                        result.reservedContent = {};
                    }
                    result.reservedContent.macros = s.asUint8Array();
                }

                // GrapeCity End
                // Get worksheet info from "xl/worksheets/sheetX.xml"
                i = result.sheets.length;
                while (i--) {
                    s = zip.file('xl/worksheets/sheet' + (i + 1) + '.xml').asText();

                    // GrapeCity Begin: Add merge cells processing.
                    mergeCells = [];
                    if (s.indexOf('<mergeCells') > -1) {
                        mergeCellArray = s.substring(s.indexOf('<mergeCells'), s.indexOf('</mergeCells>')).split('<mergeCell ');
                        j = mergeCellArray.length;
                        while (--j) {
                            mergeRange = getAttr(mergeCellArray[j], 'ref').split(':');
                            if (mergeRange.length === 2) {
                                mergeCells.unshift({
                                    topRow: +mergeRange[0].match(/\d*/g).join('') - 1,
                                    leftCol: alphaNum(mergeRange[0].match(/[a-zA-Z]*/g)[0]),
                                    bottomRow: +mergeRange[1].match(/\d*/g).join('') - 1,
                                    rightCol: alphaNum(mergeRange[1].match(/[a-zA-Z]*/g)[0])
                                });
                            }
                        }
                    }

                    // GrapeCity End
                    // GrapeCity Begin: Gets tha base shared formula for current sheet.
                    getsBaseSharedFormulas(s);

                    // GrapeCity End
                    s = s.split('<row ');
                    w = result.sheets[i];
                    w.table = s[0].indexOf('<tableParts ') > 0;
                    t = getAttr(s[0].substr(s[0].indexOf('<dimension')), 'ref');
                    t = t.substr(t.indexOf(':') + 1);

                    // GrapeCity Begin: Add hidden column and column width processing.
                    cols = [];
                    colsSetting = [];
                    hiddenColumns = [];
                    if (s.length > 0 && s[0].indexOf('<cols>') > -1) {
                        cols = s[0].substring(s[0].indexOf('<cols>') + 6, s[0].indexOf('</cols>')).split('<col ');
                        for (idx = cols.length - 1; idx > 0; idx--) {
                            colWidth = parseCharWidthToPixel(+getAttr(cols[idx], 'width'));
                            f = undefined;
                            if (cols[idx].indexOf('style') > -1) {
                                f = styles[+getAttr(cols[idx], 'style')] || { type: 'General', formatCode: undefined };
                            }
                            style = undefined;
                            if (f && (f.font || f.fillColor || f.hAlign || (f.formatCode && f.formatCode !== 'General'))) {
                                style = {
                                    format: !f.formatCode || f.formatCode === 'General' ? undefined : f.formatCode,
                                    font: f.font,
                                    fill: {
                                        color: f.fillColor
                                    },
                                    hAlign: f.hAlign
                                };
                            }
                            for (colIndex = +getAttr(cols[idx], 'min') - 1; colIndex < +getAttr(cols[idx], 'max'); colIndex++) {
                                colsSetting[colIndex] = {
                                    visible: getAttr(cols[idx], 'hidden') !== '1',
                                    autoWidth: getAttr(cols[idx], 'bestFit') === '1',
                                    width: colWidth,
                                    style: style
                                };
                            }
                        }
                    }
                    w.cols = w.columns = colsSetting;

                    // GrapeCity End
                    // GrapeCity Begin: Add frozen cols/rows processing.
                    if (s.length > 0 && s[0].indexOf('<pane') > -1) {
                        if (getAttr(s[0].substr(s[0].indexOf('<pane')), 'state') === 'frozen') {
                            frozenRows = getAttr(s[0].substr(s[0].indexOf('<pane')), 'ySplit');
                            frozenRows = frozenRows ? +frozenRows : NaN;
                            frozenCols = getAttr(s[0].substr(s[0].indexOf('<pane')), 'xSplit');
                            frozenCols = frozenCols ? +frozenCols : NaN;
                            w.frozenPane = {
                                rows: frozenRows,
                                columns: frozenCols
                            };
                        }
                    }

                    // GrapeCity End
                    w.maxCol = alphaNum(t.match(/[a-zA-Z]*/g)[0]) + 1;
                    w.maxRow = +t.match(/\d*/g).join('');

                    // GrapeCity Begin: Check whether the Group Header is below the group content.
                    w.summaryBelow = getAttr(s[0], 'summaryBelow') !== '0';

                    // GrapeCity End
                    w = w.rows;
                    j = s.length;
                    while (--j) {
                        row = w[+getAttr(s[j], 'r') - 1] = { visible: true, groupLevel: NaN, cells: [] };

                        // GrapeCity Begin: Check the visibility of the row.
                        if (s[j].substring(0, s[j].indexOf('>')).indexOf('hidden') > -1 && getAttr(s[j], 'hidden') === '1') {
                            row.visible = false;
                        }

                        // GrapeCity End
                        // GrapeCity Begin: Get the row height setting for the custom Height row.
                        if (getAttr(s[j], 'customHeight') === '1') {
                            height = +getAttr(s[j].substring(0, s[j].indexOf('>')).replace('customHeight', ''), 'ht');
                            row.height = height * 96 / 72;
                        }
                        if (getAttr(s[j], 'customFormat') === '1') {
                            f = styles[+getAttr(s[j].substring(s[j].indexOf(' s=')), 's')] || { type: 'General', formatCode: undefined };
                            if (f.font || f.fillColor || f.hAlign || (f.formatCode && f.formatCode !== 'General')) {
                                style = {
                                    format: !f.formatCode || f.formatCode === 'General' ? undefined : f.formatCode,
                                    font: f.font,
                                    fill: {
                                        color: f.fillColor
                                    },
                                    hAlign: f.hAlign
                                };
                            } else {
                                style = undefined;
                            }
                        } else {
                            style = undefined;
                        }
                        row.style = style;

                        // GrapeCity End
                        // GrapeCity Begin: Get the group level.
                        groupLevel = getAttr(s[j], 'outlineLevel');
                        row.groupLevel = groupLevel && groupLevel !== '' ? +groupLevel : NaN;

                        // GrapeCity End
                        // GrapeCity Begin: Get the collapsed attribute of the row.
                        row.collapsed = getAttr(s[j], 'collapsed') === '1';

                        // GrapeCity End
                        columns = s[j].split('<c ');
                        k = columns.length;
                        while (--k) {
                            cell = columns[k];
                            f = styles[+getAttr(cell, 's')] || { type: 'General', formatCode: undefined };

                            // GrapeCity Begin: set font setting, fill setting and horizontal alignment into the style property.
                            if (f.font || f.fillColor || f.hAlign || (f.formatCode && f.formatCode !== 'General')) {
                                style = {
                                    format: !f.formatCode || f.formatCode === 'General' ? undefined : f.formatCode,
                                    font: f.font,
                                    fill: {
                                        color: f.fillColor
                                    },
                                    hAlign: f.hAlign
                                };
                            } else {
                                style = undefined;
                            }

                            // GrapeCity End
                            t = getAttr(cell.substring(0, cell.indexOf('>')), 't') || f.type;
                            val = undefined;
                            if (cell.indexOf('<v>') > -1) {
                                val = cell.substring(cell.indexOf('<v>') + 3, cell.indexOf('</v>'));
                            }

                            // GrapeCity Begin: Add formula processing.
                            formula = undefined;
                            si = undefined;
                            cellRef = undefined;
                            if (cell.indexOf('<f') > -1) {
                                if (cell.indexOf('</f>') > -1) {
                                    formula = cell.match(/<f.*>.+(?=<\/f>)/);
                                    if (formula) {
                                        formula = formula[0].replace(/(\<f.*>)(.+)/, "$2");
                                    }
                                } else {
                                    si = getAttr(cell, 'si');
                                    if (si) {
                                        cellRef = getAttr(cell, 'r');
                                        formula = getSharedFormula(si, cellRef);
                                    }
                                }
                            }

                            // GrapeCity End
                            // GrapeCity Begin: Fix issue that couldn't read the excel cell content processed by the string processing function.
                            if (t !== 'str') {
                                val = val ? +val : '';
                            }

                            // GrapeCity End
                            colIndex = alphaNum(getAttr(cell, 'r').match(/[a-zA-Z]*/g)[0]);
                            switch (t) {
                                case 's':
                                    val = sharedStrings[val];
                                    break;
                                case 'b':
                                    val = val === 1;
                                    break;
                                case 'date':
                                    val = val ? convertDate(val) : '';
                                    break;
                            }
                            row.cells[colIndex] = {
                                value: val,
                                isDate: t === 'date',
                                formula: unescapeXML(formula) /* GrapeCity: Add formula property.*/ ,
                                style: style,
                                visible: hiddenColumns.indexOf(colIndex) === -1
                            };
                        }
                    }

                    for (k = 0; k < mergeCells.length; k++) {
                        mergeCell = mergeCells[k];
                        result.sheets[i].rows[mergeCell.topRow].cells[mergeCell.leftCol].rowSpan = mergeCell.bottomRow - mergeCell.topRow + 1;
                        result.sheets[i].rows[mergeCell.topRow].cells[mergeCell.leftCol].colSpan = mergeCell.rightCol - mergeCell.leftCol + 1;
                    }
                    // GrapeCity End.
                }

                result.processTime = Date.now() - processTime;
            } else {
                processTime = Date.now();
                sharedStrings = [[], 0];

                // Fully static
                zip.folder('_rels').file('.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
                docProps = zip.folder('docProps');

                xl = zip.folder('xl');
                xl.folder('theme').file('theme1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS P????"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS P????"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="80000"><a:schemeClr val="phClr"><a:shade val="93000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>');

                // GrapeCity Begin: Export the macro to xlsx file.
                macroEnabled = !!(file.reservedContent && file.reservedContent.macros);
                if (macroEnabled) {
                    xl.file('vbaProject.bin', file.reservedContent.macros);
                }

                // GrapeCity End
                xlWorksheets = xl.folder('worksheets');

                // Not content dependent
                docProps.file('core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>' + (file.creator || '') + '</dc:creator><cp:lastModifiedBy>' + (file.lastModifiedBy || '') + '</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">' + (file.created || new Date()).toISOString() + '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' + (file.modified || new Date()).toISOString() + '</dcterms:modified></cp:coreProperties>');

                // Content dependent
                styles = new Array(1);
                borders = new Array(1);
                fonts = new Array(1);
                fills = new Array(2); /* GrapeCity: Initialize the fills array for fill color processing.*/

                w = file.sheets.length;
                while (w--) {
                    // Generate worksheet (gather sharedStrings), and possibly table files, then generate entries for constant files below
                    id = w + 1;

                    // Generate sheetX.xml in var s
                    worksheet = file.sheets[w];
                    columnSettings = worksheet.columns || worksheet.cols;
                    if (!worksheet) {
                        throw 'Worksheet should not be empty!';
                    }
                    data = worksheet.rows;

                    // GrapeCity Begin: Add frozen cols/rows processing.
                    frozenPane = '';
                    if (worksheet.frozenPane && (worksheet.frozenPane.rows !== 0 || worksheet.frozenPane.columns !== 0)) {
                        frozenPane = '<pane state="frozen" activePane="' + (worksheet.frozenPane.rows !== 0 && worksheet.frozenPane.columns !== 0 ? 'bottomRight' : (worksheet.frozenPane.rows !== 0 ? 'bottomLeft' : 'topRight')) + '" topLeftCell="' + numAlpha(worksheet.frozenPane.columns) + (worksheet.frozenPane.rows + 1) + '" ySplit="' + worksheet.frozenPane.rows + '" xSplit="' + worksheet.frozenPane.columns + '"/>';
                    }

                    // GrapeCity End
                    s = '';
                    columns = [];
                    merges = [];
                    i = -1;
                    l = data ? data.length : 0;
                    while (++i < l) {
                        j = -1;
                        k = data[i] && data[i].cells ? data[i].cells.length : 0;

                        // GrapeCity Begin: Add row visibility, row height and group level for current excel row.
                        rowHeightSetting = '';
                        groupLevelSetting = '';
                        if (k > 0) {
                            if (data[i].height) {
                                rowHeightSetting = 'customHeight="1" ht="' + (+data[i].height * 72 / 96) + '"';
                            }
                            if (data[i].groupLevel) {
                                groupLevelSetting = 'outlineLevel=' + '"' + data[i].groupLevel + '"';
                            }
                            rowStyle = data[i].style;
                            if (rowStyle) {
                                rowStyle = resolveStyleInheritance(rowStyle);
                                if (rowStyle.hAlign != null && !wijmo.isString(rowStyle.hAlign)) {
                                    rowStyle.hAlign = xlsx.Workbook._parseHAlignToString(wijmo.asEnum(rowStyle.hAlign, xlsx.HAlign));
                                }
                                if (rowStyle.vAlign != null && !wijmo.isString(rowStyle.vAlign)) {
                                    rowStyle.vAlign = xlsx.Workbook._parseVAlignToString(wijmo.asEnum(rowStyle.vAlign, xlsx.VAlign));
                                }
                                style = JSON.stringify(rowStyle);
                                index = styles.indexOf(style);
                                if (index < 0) {
                                    style = styles.push(style) - 1;
                                } else {
                                    style = index;
                                }
                            }
                        }
                        rowStr = '<row r="' + (i + 1) + (rowStyle ? '" s="' + style + '" customFormat="1' : '') + '" {rowHeight} x14ac:dyDescent="0.25" {groupLevel} ' + (data[i] && data[i].visible === false ? 'hidden="1" ' : '') + (data[i] && data[i].collapsed === true ? 'collapsed="1"' : '') + '>';
                        rowStr = rowStr.replace('{rowHeight}', rowHeightSetting);
                        rowStr = rowStr.replace('{groupLevel}', groupLevelSetting);
                        s += rowStr;

                        while (++j < k) {
                            cell = data[i].cells[j];

                            // GrapeCity Begin: We should reset all the related variable before processing a new cell.
                            val = undefined;
                            style = undefined;
                            t = '';
                            index = -1;

                            // GrapeCity End
                            val = cell && cell.hasOwnProperty('value') ? cell.value : cell;
                            style = cell && cell.style ? JSON.parse(JSON.stringify(cell.style)) : {}; /* GrapeCity: Packed cell styles into the style property of cell */

                            // GrapeCity: remove the isFinite checking for the string value.  If the value is string, it will always be exported as string.
                            if (val && typeof val === 'string' && (+val).toString() !== val) {
                                // If value is string, and not string of just a number, place a sharedString reference instead of the value
                                val = escapeXML(val);
                                sharedStrings[1]++; // Increment total count, unique count derived from sharedStrings[0].length
                                index = sharedStrings[0].indexOf(val);
                                if (index < 0) {
                                    index = sharedStrings[0].push(val) - 1;
                                }
                                val = index;
                                t = 's';
                            } else if (typeof val === 'boolean') {
                                val = (val ? 1 : 0);
                                t = 'b';
                            } else if (typeOf(val) === 'date' || (cell && cell.isDate)) {
                                val = convertDate(val);
                                style.format = style.format || 'mm-dd-yy';
                            } else if (typeof val === 'object') {
                                val = null;
                            }

                            // Resolve the inheritance style.
                            style = resolveStyleInheritance(style);

                            // GrapeCity Begin: Extends the cell style with column style and row style.
                            columnStyle = columnSettings && columnSettings[j] ? columnSettings[j].style : null;
                            if (columnStyle) {
                                columnStyle = resolveStyleInheritance(columnStyle);
                                style = extend(style, columnStyle);
                            }
                            if (rowStyle) {
                                style = extend(style, rowStyle);
                            }

                            // GrapeCity End
                            // GrapeCity Begin: Parse the hAlign/vAlign from enum to string.
                            if (style.hAlign != null && !wijmo.isString(style.hAlign)) {
                                style.hAlign = xlsx.Workbook._parseHAlignToString(wijmo.asEnum(style.hAlign, xlsx.HAlign));
                            }
                            if (style.vAlign != null && !wijmo.isString(style.vAlign)) {
                                style.vAlign = xlsx.Workbook._parseVAlignToString(wijmo.asEnum(style.vAlign, xlsx.VAlign));
                            }

                            // GrapeCity End
                            // GrapeCity Begin: Parse the different color pattern to Hex pattern like #RRGGBB for the font color and fill color.
                            if (style.font && style.font.color) {
                                style.font.color = parseColor(style.font.color);
                            }
                            if (style.fill && style.fill.color) {
                                style.fill.color = parseColor(style.fill.color);
                            }

                            // GrapeCity End
                            // use stringified version as unique and reproducible style signature
                            style = JSON.stringify(style);
                            index = styles.indexOf(style);
                            if (index < 0) {
                                style = styles.push(style) - 1;
                            } else {
                                style = index;
                            }

                            // store merges if needed and add missing cells. Cannot have rowSpan AND colSpan
                            // GrapeCity Begin: Update for merge cells processing.
                            if (cell) {
                                if ((cell.colSpan != null && cell.colSpan > 1) || (cell.rowSpan != null && cell.rowSpan > 1)) {
                                    cell.colSpan = cell.colSpan || 1;
                                    cell.rowSpan = cell.rowSpan || 1;
                                    merges.push([numAlpha(j) + (i + 1), numAlpha(j + cell.colSpan - 1) + (i + cell.rowSpan)]);
                                }
                            }

                            // GrapeCity End
                            s += '<c r="' + numAlpha(j) + (i + 1) + '"' + ' s="' + style + '"' + (t ? ' t="' + t + '"' : '');
                            if (val != null || (cell && cell.formula)) {
                                // add 'ca' attribute for the cellFormula element.
                                s += '>' + (cell && cell.formula ? '<f ca="1">' + escapeXML(cell.formula) + '</f>' : '') + (val != null ? '<v>' + val + '</v>' : '') + '</c>';
                            } else {
                                s += '/>';
                            }
                        }
                        s += '</row>';
                    }

                    cols = [];
                    if (columnSettings) {
                        for (i = 0; i < columnSettings.length; i++) {
                            // GrapeCity Begin: Add the column visibilty for the excel column
                            if (!isEmpty(columnSettings[i])) {
                                columnStyle = columnSettings[i].style;
                                if (columnStyle) {
                                    columnStyle = resolveStyleInheritance(columnStyle);
                                    if (columnStyle.hAlign != null && !wijmo.isString(columnStyle.hAlign)) {
                                        columnStyle.hAlign = xlsx.Workbook._parseHAlignToString(wijmo.asEnum(columnStyle.hAlign, xlsx.HAlign));
                                    }
                                    if (columnStyle.vAlign != null && !wijmo.isString(columnStyle.vAlign)) {
                                        columnStyle.vAlign = xlsx.Workbook._parseVAlignToString(wijmo.asEnum(columnStyle.vAlign, xlsx.VAlign));
                                    }
                                    columnStyle = JSON.stringify(columnStyle);
                                    index = styles.indexOf(columnStyle);
                                    if (index < 0) {
                                        columnStyle = styles.push(columnStyle) - 1;
                                    } else {
                                        columnStyle = index;
                                    }
                                }
                                colWidth = columnSettings[i].width;
                                if (colWidth != null) {
                                    if (typeof colWidth === 'string' && colWidth.indexOf('ch') > -1) {
                                        colWidth = parseCharCountToCharWidth(colWidth.substring(0, colWidth.indexOf('ch')));
                                    } else {
                                        colWidth = parsePixelToCharWidth(colWidth);
                                    }
                                } else {
                                    colWidth = 8.43;
                                }
                                cols.push('<col min="', i + 1, '" max="', i + 1, '"', (columnStyle ? ' style="' + columnStyle + '"' : ''), (colWidth ? ' width="' + colWidth + '" customWidth="1"' : ''), (columnSettings[i].autoWidth !== false ? ' bestFit="1"' : ''), (columnSettings[i].visible === false ? ' hidden="1"' : ''), '/>');
                            }
                            // GrapeCity End
                        }
                    }

                    // only add cols definition if not empty
                    if (cols.length > 0) {
                        cols = ['<cols>'].concat(cols, ['</cols>']).join('');
                    }

                    l = data && data[0] && data[0].cells ? data[0].cells.length : 0;
                    s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">' + '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>' + '<dimension ref="A1' + (l > 0 ? ':' + numAlpha(l - 1) + (data.length) : '') + '"/><sheetViews><sheetView ' + (w === file.activeWorksheet ? 'tabSelected="1" ' : '') + ' workbookViewId="0">' + frozenPane + '</sheetView>' + '</sheetViews><sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/>' + cols + '<sheetData>' + s + '</sheetData>';
                    if (merges.length > 0) {
                        s += '<mergeCells count="' + merges.length + '">';
                        for (i = 0; i < merges.length; i++) {
                            s += '<mergeCell ref="' + merges[i].join(':') + '"/>';
                        }
                        s += '</mergeCells>';
                    }
                    s += '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>';
                    if (worksheet.table) {
                        s += '<tableParts count="1"><tablePart r:id="rId1"/></tableParts>';
                    }
                    xlWorksheets.file('sheet' + id + '.xml', s + '</worksheet>');

                    if (worksheet.table) {
                        i = -1;

                        /* GrapeCity: Fix issue exporting empty sheet 'dimension ref' property incorrect.*/
                        t = l > 0 ? ':' + numAlpha(l - 1) + data.length : '';
                        s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="' + id + '" name="Table' + id + '" displayName="Table' + id + '" ref="A1' + t + '" totalsRowShown="0"><autoFilter ref="A1' + t + '"/><tableColumns count="' + l + '">';
                        while (++i < l) {
                            s += '<tableColumn id="' + (i + 1) + '" name="' + (data[0].cells[i].hasOwnProperty('value') ? data[0].cells[i].value : data[0].cells[i]) + '"/>';
                        }
                        s += '</tableColumns><tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>';

                        xl.folder('tables').file('table' + id + '.xml', s);
                        xlWorksheets.folder('_rels').file('sheet' + id + '.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table' + id + '.xml"/></Relationships>');
                        contentTypes[1].unshift('<Override PartName="/xl/tables/table' + id + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>');
                    }

                    contentTypes[0].unshift('<Override PartName="/xl/worksheets/sheet' + id + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>');
                    props.unshift(escapeXML(worksheet.name) || 'Sheet' + id);
                    xlRels.unshift('<Relationship Id="rId' + id + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + id + '.xml"/>');
                    worksheets.unshift('<sheet name="' + (escapeXML(worksheet.name) || 'Sheet' + id) + '" sheetId="' + id + '" r:id="rId' + id + (worksheet.visible === false ? '" state="hidden' : '') + '"/>');
                }

                // xl/styles.xml
                i = styles.length;
                t = [];
                while (--i) {
                    // Don't process index 0, already added
                    style = JSON.parse(styles[i]);

                    // cell formatting, refer to it if necessary
                    if (style.format && style.format !== 'General') {
                        index = numFmts.indexOf(style.format);
                        if (index < 0) {
                            index = 164 + t.length;
                            t.push('<numFmt formatCode="' + style.format + '" numFmtId="' + index + '"/>');
                        }
                        style.format = index;
                    } else {
                        style.format = 0;
                    }

                    // border declaration: add a new declaration and refer to it in style
                    borderIndex = 0;
                    if (style.borders) {
                        border = ['<border>'];

                        for (var edge in { left: 0, right: 0, top: 0, bottom: 0, diagonal: 0 }) {
                            if (style.borders[edge]) {
                                var color = style.borders[edge];

                                // add transparency if missing
                                if (color.length === 6) {
                                    color = 'FF' + color;
                                }
                                border.push('<', edge, ' style="thin">', '<color rgb="', style.borders[edge], '"/></', edge, '>');
                            } else {
                                border.push('<', edge, '/>');
                            }
                        }
                        border.push('</border>');
                        border = border.join('');

                        // try to reuse existing border
                        borderIndex = borders.indexOf(border);
                        if (borderIndex < 0) {
                            borderIndex = borders.push(border) - 1;
                        }
                    }

                    // font declaration: add a new declaration and refer to it in style
                    fontIndex = 0;
                    if (style.font) {
                        font = ['<font>'];
                        if (style.font.bold) {
                            font.push('<b/>');
                        }
                        if (style.font.italic) {
                            font.push('<i/>');
                        }

                        // GrapeCity Begin: Add underline property for font
                        if (style.font.underline) {
                            font.push('<u/>');
                        }

                        // GrapeCity End
                        font.push('<sz val="', Math.round(style.font.size * 72 / 96) || defaultFontSize, '"/>');

                        // GrapeCity Begin: Add color property for font
                        font.push('<color ', style.font.color ? 'rgb="FF' + (style.font.color[0] === '#' ? style.font.color.substring(1) : style.font.color) + '"' : 'theme="1"', '/>');

                        // GrapeCity End
                        font.push('<name val="', style.font.family || defaultFontName, '"/>');
                        font.push('<family val="2"/>', '</font>');
                        font = font.join('');

                        // try to reuse existing font
                        fontIndex = fonts.indexOf(font);
                        if (fontIndex < 0) {
                            fontIndex = fonts.push(font) - 1;
                        }
                    }

                    // GrapeCity Begin: Add fill color property
                    fillIndex = 0;
                    if (style.fill && style.fill.color) {
                        fill = ['<fill><patternFill patternType="solid">'];
                        fill.push('<fgColor rgb="FF', (style.fill.color[0] === '#' ? style.fill.color.substring(1) : style.fill.color), '"/>');
                        fill.push('<bgColor indexed="64"/>');
                        fill.push('</patternFill></fill>');
                        fill = fill.join('');
                        fillIndex = fills.indexOf(fill);
                        if (fillIndex < 0) {
                            fillIndex = fills.push(fill) - 1;
                        }
                    }

                    // GrapeCity End
                    // declares style, and refer to optionnal formatCode, font and borders
                    styles[i] = [
                        '<xf xfId="0" borderId="',
                        borderIndex,
                        '" fontId="',
                        fontIndex,
                        '" fillId="',
                        fillIndex,
                        '" numFmtId="',
                        style.format,
                        '" ',
                        (style.hAlign || style.vAlign ? 'applyAlignment="1" ' : ' '),
                        (style.format > 0 ? 'applyNumberFormat="1" ' : ' '),
                        (borderIndex > 0 ? 'applyBorder="1" ' : ' '),
                        (fontIndex > 0 ? 'applyFont="1" ' : ' '),
                        (fillIndex > 0 ? 'applyFill="1" ' : ' '),
                        '>'
                    ];
                    if (style.hAlign || style.vAlign || style.indent) {
                        styles[i].push('<alignment');
                        if (style.hAlign) {
                            styles[i].push(' horizontal="', style.hAlign, '"');
                        }
                        if (style.vAlign) {
                            styles[i].push(' vertical="', style.vAlign, '"');
                        }

                        // GrapeCity Begin: Add indent property for the nested group
                        if (style.indent) {
                            styles[i].push(' indent="', style.indent, '"');
                        }

                        // GrapeCity End
                        styles[i].push('/>');
                    }
                    styles[i].push('</xf>');
                    styles[i] = styles[i].join('');
                }
                t = t.length ? '<numFmts count="' + t.length + '">' + t.join('') + '</numFmts>' : '';

                xl.file('styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">' + t + '<fonts count="' + fonts.length + '" x14ac:knownFonts="1"><font><sz val="' + defaultFontSize + '"/><color theme="1"/><name val="' + defaultFontName + '"/><family val="2"/>' + '<scheme val="minor"/></font>' + fonts.join('') + '</fonts><fills count="' + fills.length + '"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' + fills.join('') + '</fills>' + '<borders count="' + borders.length + '"><border><left/><right/><top/><bottom/><diagonal/></border>' + borders.join('') + '</borders><cellStyleXfs count="1">' + '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="' + styles.length + '"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' + styles.join('') + '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/>' + '<tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>' + '<extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">' + '<x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext></extLst></styleSheet>');

                // [Content_Types].xml
                zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' + (macroEnabled ? '<Default Extension="bin" ContentType="application/vnd.ms-office.vbaProject"/>' : '') + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' + '<Default Extension="xml" ContentType ="application/xml"/>' + '<Override PartName="/xl/workbook.xml" ContentType="' + (macroEnabled ? 'application/vnd.ms-excel.sheet.macroEnabled.main+xml' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml') + '"/>' + contentTypes[0].join('') + '<Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>' + contentTypes[1].join('') + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>');

                // docProps/app.xml
                docProps.file('app.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>' + (file.application || 'wijmo.xlsx') + '</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>' + file.sheets.length + '</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="' + props.length + '" baseType="lpstr"><vt:lpstr>' + props.join('</vt:lpstr><vt:lpstr>') + '</vt:lpstr></vt:vector></TitlesOfParts><Manager></Manager><Company>' + (file.company || 'GrapeCity, Inc.') + '</Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>');

                // xl/_rels/workbook.xml.rels
                xl.folder('_rels').file('workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + xlRels.join('') + '<Relationship Id="rId' + (xlRels.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>' + '<Relationship Id="rId' + (xlRels.length + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' + '<Relationship Id="rId' + (xlRels.length + 3) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>' + (macroEnabled ? '<Relationship Id="rId' + (xlRels.length + 4) + '" Type="http://schemas.microsoft.com/office/2006/relationships/vbaProject" Target="vbaProject.bin"/>' : '') + '</Relationships>');

                // xl/sharedStrings.xml
                xl.file('sharedStrings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' + sharedStrings[1] + '" uniqueCount="' + sharedStrings[0].length + '"><si><t>' + sharedStrings[0].join('</t></si><si><t>') + '</t></si></sst>');

                // xl/workbook.xml
                xl.file('workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' + '<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="9303"/><workbookPr defaultThemeVersion="124226"/><bookViews><workbookView ' + (file.activeWorksheet != null ? 'activeTab="' + file.activeWorksheet + '" ' : '') + 'xWindow="480" yWindow="60" windowWidth="18195" windowHeight="8505"/></bookViews><sheets>' + worksheets.join('') + '</sheets><calcPr fullCalcOnLoad="1"/></workbook>');

                // GrapeCity Begin: If the exported file contains macros, it should set the macro enable application type for the download href of the result.
                if (macroEnabled) {
                    applicationType = 'application/vnd.ms-excel.sheet.macroEnabled.12;';
                } else {
                    applicationType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;';
                }

                // GrapeCity End
                processTime = Date.now() - processTime;
                zipTime = Date.now();
                result = {
                    base64: zip.generate({ compression: 'DEFLATE' }), zipTime: Date.now() - zipTime, processTime: processTime,
                    href: function () {
                        return 'data:' + applicationType + 'base64,' + this.base64;
                    }
                };
            }
            return result;
        }
        xlsx._xlsx = _xlsx;
    })(wijmo.xlsx || (wijmo.xlsx = {}));
    var xlsx = wijmo.xlsx;
})(wijmo || (wijmo = {}));

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = wijmo.xlsx._xlsx;
}
//# sourceMappingURL=c1xlsx.js.map

var wijmo;
(function (wijmo) {
    /**
    * The module has dependency on the external <a href="https://stuk.github.io/jszip" target="_blank">JSZip</a> library,
    * which should be referenced in html page with the markup like this:
    * <pre>&lt;script src="http://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"&gt;&lt;/script&gt;</pre>
    */
    (function (xlsx) {
        'use strict';

        /**
        * Represents Excel Workbook.
        */
        var Workbook = (function () {
            function Workbook() {
            }
            Object.defineProperty(Workbook.prototype, "sheets", {
                /**
                * Gets the WorkSheet array of the Workbook.
                */
                get: function () {
                    if (this._sheets == null) {
                        this._sheets = [];
                    }
                    return this._sheets;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Workbook.prototype, "styles", {
                /**
                * Gets the styles table of the workbook.
                */
                get: function () {
                    if (this._styles == null) {
                        this._styles = [];
                    }
                    return this._styles;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Workbook.prototype, "reservedContent", {
                /**
                * Gets or sets the reserved content from xlsx file that flexgrid or flexsheet doesn't support yet.
                */
                get: function () {
                    if (this._reservedContent == null) {
                        this._reservedContent = {};
                    }
                    return this._reservedContent;
                },
                set: function (value) {
                    this._reservedContent = value;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Saves to base 64 string containing xlsx file content and returns it. If fileName is specified then saves it to xlsx file.
            *
            * For example:
            * <pre>// This sample saves the workbook instance xlsx file, containing "Hello, Excel!" in a single cell,
            * // click.
            * &nbsp;
            * // HTML
            * &lt;button
            *     onclick="saveXlsx('Hello.xlsx')"&gt;
            *     Save
            * &lt;/button&gt;
            * &nbsp;
            * // JavaScript
            * function exportXlsx(fileName) {
            *     // Define a workbook content.
            *     var workbook = new wijmo.xlsx.Workbook(),
            *         worksheet = new wijmo.grid.xlsx.WorkSheet(),
            *         workbookRow = new wijmo.grid.xlsx.WorkbookRow(),
            *         workbookCell = new wijmo.grid.xlsx.WorkbookCell();
            *     workbookCell.value = 'Hello, Excel!';
            *     workbookRow.cells.push(workbookCell);
            *     worksheet.rows.push(workbookRow);
            *     workbook.sheets.push(worksheet);
            * &nbsp;
            *     // If the fileName is specified, the Workbook.save method exports the workbook to xlsx file and return the base64 string of the xlsx content.
            *     workbook.save(fileName);
            * }</pre>
            * <pre>// This sample saves the workbook instance to base64 string containing xlsx content "Hello, Excel!" in a single cell,
            * // click.
            * &nbsp;
            * // HTML
            * &lt;button
            *     onclick="saveXlsx()"&gt;
            *     Save
            * &lt;/button&gt;
            * &nbsp;
            * // JavaScript
            * function exportXlsx() {
            *     // Define a workbook content.
            *     var workbook = new wijmo.xlsx.Workbook(),
            *         worksheet = new wijmo.grid.xlsx.WorkSheet(),
            *         workbookRow = new wijmo.grid.xlsx.WorkbookRow(),
            *         workbookCell = new wijmo.grid.xlsx.WorkbookCell(),
            *         fileContent;
            *     workbookCell.value = 'Hello, Excel!';
            *     workbookRow.cells.push(workbookCell);
            *     worksheet.rows.push(workbookRow);
            *     workbook.sheets.push(worksheet);
            * &nbsp;
            *     // If the fileName is not specified, the Workbook.save method just return the base64 string of the xlsx content.
            *     fileContent = workbook.save();
            *     // TODO: The base64 string can be sent to server-side to generate the xlsx at server-side and etc..
            * }</pre>
            *
            * @param fileName the name of the saved xlsx file.
            */
            Workbook.prototype.save = function (fileName) {
                var suffix, suffixIndex, blob, result = xlsx._xlsx(this._serialize()), nameSuffix = this._reservedContent && this._reservedContent.macros ? 'xlsm' : 'xlsx', applicationType = nameSuffix === 'xlsm' ? 'application/vnd.ms-excel.sheet.macroEnabled.12' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

                if (fileName) {
                    suffixIndex = fileName.lastIndexOf('.');
                    if (suffixIndex < 0) {
                        fileName += '.' + nameSuffix;
                    } else if (suffixIndex === 0) {
                        throw 'Invalid file name.';
                    } else {
                        suffix = fileName.substring(suffixIndex + 1);
                        if (suffix === '') {
                            fileName += '.' + nameSuffix;
                        } else if (suffix !== nameSuffix) {
                            fileName += '.' + nameSuffix;
                        }
                    }
                    blob = new Blob([Workbook._base64DecToArr(result.base64)], { type: applicationType });
                    this._saveToFile(blob, fileName);
                }
                return result.base64;
            };

            /**
            * Loads from base 64 string or data url.
            *
            * For example:
            * <pre>// This sample opens an xlsx file chosen from Open File
            * // dialog and creates a workbook instance to load the file.
            * &nbsp;
            * // HTML
            * &lt;input type="file"
            *     id="importFile"
            *     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            * /&gt;
            * &nbsp;
            * // JavaScript
            * var workbook, // receives imported IWorkbook
            *     importFile = document.getElementById('importFile');
            * &nbsp;
            * importFile.addEventListener('change', function () {
            *     loadWorkbook();
            * });
            * &nbsp;
            * function loadWorkbook() {
            *     var reader,
            *         workbook,
            *         file = importFile.files[0];
            *     if (file) {
            *         reader = new FileReader();
            *         reader.onload = function (e) {
            *            workbook = new wijmo.xlsx.Workbook(),
            *            workbook.load(reader.result);
            *         };
            *         reader.readAsDataURL(file);
            *     }
            * }</pre>
            *
            * @param base64 the base 64 string that contains the xlsx file content.
            */
            Workbook.prototype.load = function (base64) {
                var dataPrefixIndex;

                if (base64 == null || base64.length === 0) {
                    throw 'Invalid xlsx file content.';
                }

                dataPrefixIndex = base64.search(/base64,/i);
                if (dataPrefixIndex !== -1) {
                    base64 = base64.substring(dataPrefixIndex + 7);
                }
                this._deserialize(xlsx._xlsx(base64));
            };

            // Serializes the workbook instance to workbook object model.
            Workbook.prototype._serialize = function () {
                var workbookOM = { sheets: [] };

                workbookOM.sheets = this._serializeWorkSheets();
                if (this._styles && this._styles.length > 0) {
                    workbookOM.styles = this._serializeWorkbookStyles();
                }
                if (this._reservedContent) {
                    workbookOM.reservedContent = this._reservedContent;
                }
                if (this.activeWorksheet != null && !isNaN(this.activeWorksheet) && this.activeWorksheet >= 0) {
                    workbookOM.activeWorksheet = this.activeWorksheet;
                }
                if (this.application) {
                    workbookOM.application = this.application;
                }
                if (this.company) {
                    workbookOM.company = this.company;
                }
                if (this.created != null) {
                    workbookOM.created = this.created;
                }
                if (this.creator) {
                    workbookOM.creator = this.creator;
                }
                if (this.lastModifiedBy) {
                    workbookOM.lastModifiedBy = this.lastModifiedBy;
                }
                if (this.modified != null) {
                    workbookOM.modified = this.modified;
                }
                return workbookOM;
            };

            // Deserializes the workbook object model to workbook instance.
            Workbook.prototype._deserialize = function (workbookOM) {
                this._deserializeWorkSheets(workbookOM.sheets);
                if (workbookOM.styles && workbookOM.styles.length > 0) {
                    this._deserializeWorkbookStyles(workbookOM.styles);
                }
                this.activeWorksheet = workbookOM.activeWorksheet;
                this.application = workbookOM.application;
                this.company = workbookOM.company;
                this.created = workbookOM.created;
                this.creator = workbookOM.creator;
                this.lastModifiedBy = workbookOM.lastModifiedBy;
                this.modified = workbookOM.modified;
                this.reservedContent = workbookOM.reservedContent;
            };

            // add worksheet instance into the _sheets array of the workbook.
            Workbook.prototype._addWorkSheet = function (workSheet, sheetIndex) {
                if (this._sheets == null) {
                    this._sheets = [];
                }

                if (sheetIndex != null && !isNaN(sheetIndex)) {
                    this._sheets[sheetIndex] = workSheet;
                } else {
                    this._sheets.push(workSheet);
                }
            };

            // Save the blob object generated by the workbook instance to xlsx file.
            Workbook.prototype._saveToFile = function (blob, fileName) {
                var reader, link, click;

                if (navigator.msSaveBlob) {
                    // Saving the xlsx file using Blob and msSaveBlob in IE.
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    reader = new FileReader();
                    link = document.createElement('a');
                    click = function (element) {
                        var evnt = document.createEvent('MouseEvents');
                        evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        element.dispatchEvent(evnt);
                    };
                    reader.onload = function () {
                        link.download = fileName;
                        link.href = reader.result;
                        click(link);
                        link = null;
                    };
                    reader.readAsDataURL(blob);
                }
            };

            /**
            * Converts the wijmo date format to Excel format.
            *
            * @param format The wijmo date format.
            * @return Excel format representation.
            */
            Workbook.toXlsxDateFormat = function (format) {
                var xlsxFormat;

                if (format.length === 1) {
                    switch (format) {
                        case 'r':
                        case 'R':
                            return 'ddd, dd MMM yyyy HH:mm:ss &quot;GMT&quot;';
                        case 'u':
                            return 'yyyy-MM-dd&quot;T&quot;HH:mm:ss&quot;Z&quot;';
                        case 'o':
                        case 'O':
                            xlsxFormat = wijmo.culture.Globalize.calendar.patterns[format];
                            xlsxFormat = xlsxFormat.replace(/f+k/gi, '000');
                            break;
                        default:
                            xlsxFormat = wijmo.culture.Globalize.calendar.patterns[format];
                            break;
                    }
                }
                if (!xlsxFormat) {
                    xlsxFormat = format;
                }
                xlsxFormat = xlsxFormat.replace(/"/g, '').replace(/tt/, 'AM/PM').replace(/t/, 'A/P').replace(/M+/gi, function (str) {
                    return str.toLowerCase();
                }).replace(/g+y+/gi, function (str) {
                    return str.substring(0, str.indexOf('y')) + 'e';
                });
                return xlsxFormat;
            };

            /**
            * Converts the wijmo number format to xlsx format.
            *
            * @param format The wijmo number format.
            * @return Excel format representation.
            */
            Workbook.toXlsxNumberFormat = function (format) {
                var dec = -1, wijmoFormat = format ? format.toLowerCase() : '', fisrtFormatChar = wijmoFormat[0], mapFormat = this._formatMap[fisrtFormatChar], currencySymbol = wijmo.culture.Globalize.numberFormat.currency.symbol, commaArray = wijmoFormat.split(','), decimalArray = [], xlsxFormat, i;

                if (mapFormat) {
                    if (fisrtFormatChar === 'c') {
                        mapFormat = mapFormat.replace(/\{1\}/g, currencySymbol);
                    }

                    if (wijmoFormat.length > 1) {
                        dec = parseInt(commaArray[0].substr(1));
                    }

                    if (!isNaN(dec)) {
                        for (i = 0; i < dec; i++) {
                            decimalArray.push(0);
                        }
                    }

                    for (i = 0; i < commaArray.length - 1; i++) {
                        decimalArray.push(',');
                    }

                    if (decimalArray.length > 0) {
                        if (fisrtFormatChar === 'd') {
                            xlsxFormat = mapFormat.replace(/\{0\}/g, decimalArray.join(''));
                        } else {
                            xlsxFormat = mapFormat.replace(/\{0\}/g, (!isNaN(dec) && dec > 0 ? '.' : '') + decimalArray.join(''));
                        }
                    } else {
                        if (fisrtFormatChar === 'd') {
                            xlsxFormat = mapFormat.replace(/\{0\}/g, '0');
                        } else {
                            xlsxFormat = mapFormat.replace(/\{0\}/g, '');
                        }
                    }
                } else {
                    xlsxFormat = wijmoFormat;
                }

                return xlsxFormat;
            };

            /**
            * Converts the xlsx multi-section format string to an array of corresponding wijmo formats.
            *
            * @param xlsxFormat The Excel format string, that may contain multiple format sections separated by semicolon.
            * @return An array of .Net format strings where each element corresponds to a separate Excel format section.
            * The returning array always contains at least one element. It can be an empty string in case the passed Excel format is empty.
            */
            Workbook.fromXlsxFormat = function (xlsxFormat) {
                var wijmoFormats = [], wijmoFormat, formats, currentFormat, i, j, lastDotIndex, lastZeroIndex, lastCommaIndex, commaArray, currencySymbol = wijmo.culture.Globalize.numberFormat.currency.symbol;

                if (!xlsxFormat || xlsxFormat === 'General') {
                    return [''];
                }

                xlsxFormat = xlsxFormat.replace(/;@/g, '').replace(/&quot;?/g, '');
                formats = xlsxFormat.split(';');

                for (i = 0; i < formats.length; i++) {
                    currentFormat = formats[i];

                    if (/[hsmy\:]/i.test(currentFormat)) {
                        wijmoFormat = currentFormat.replace(/\[\$\-.+\]/g, '').replace(/(\\)(.)/g, '$2').replace(/H+/g, function (str) {
                            return str.toLowerCase();
                        }).replace(/m+/g, function (str) {
                            return str.toUpperCase();
                        }).replace(/S+/g, function (str) {
                            return str.toLowerCase();
                        }).replace(/AM\/PM/gi, 'tt').replace(/A\/P/gi, 't').replace(/\.000/g, '.fff').replace(/\.00/g, '.ff').replace(/\.0/g, '.f').replace(/\\[\-\s,]/g, function (str) {
                            return str.substring(1);
                        }).replace(/Y+/g, function (str) {
                            return str.toLowerCase();
                        }).replace(/D+/g, function (str) {
                            return str.toLowerCase();
                        }).replace(/M+:?|:?M+/gi, function (str) {
                            if (str.indexOf(':') > -1) {
                                return str.toLowerCase();
                            } else {
                                return str;
                            }
                        }).replace(/g+e/gi, function (str) {
                            return str.substring(0, str.length - 1) + 'yy';
                        });
                    } else {
                        lastDotIndex = currentFormat.lastIndexOf('.');
                        lastZeroIndex = currentFormat.lastIndexOf('0');
                        lastCommaIndex = currentFormat.lastIndexOf(',');
                        if (currentFormat.search(/\[\$([^\-\]]+)[^\]]*\]/) > -1 || (currentFormat.indexOf(currencySymbol) > -1 && currentFormat.search(/\[\$([\-\]]+)[^\]]*\]/) === -1)) {
                            wijmoFormat = 'c';
                        } else if (currentFormat[xlsxFormat.length - 1] === '%') {
                            wijmoFormat = 'p';
                        } else {
                            wijmoFormat = 'n';
                        }

                        if (lastDotIndex > -1 && lastDotIndex < lastZeroIndex) {
                            wijmoFormat += currentFormat.substring(lastDotIndex, lastZeroIndex).length;
                        } else {
                            wijmoFormat += '0';
                        }

                        if (/^0+,*$/.test(currentFormat)) {
                            lastZeroIndex = currentFormat.lastIndexOf('0');
                            wijmoFormat = 'd' + (lastZeroIndex + 1);
                        }

                        if (lastCommaIndex > -1 && lastZeroIndex < lastCommaIndex) {
                            commaArray = currentFormat.substring(lastZeroIndex + 1, lastCommaIndex + 1).split('');
                            for (j = 0; j < commaArray.length; j++) {
                                wijmoFormat += ',';
                            }
                        }
                    }

                    wijmoFormats.push(wijmoFormat);
                }

                return wijmoFormats;
            };

            // Parse the cell format of flex grid to excel format.
            Workbook._parseCellFormat = function (format, isDate) {
                if (isDate) {
                    return this.toXlsxDateFormat(format);
                }

                return this.toXlsxNumberFormat(format);
            };

            // parse the basic excel format to js format
            Workbook._parseExcelFormat = function (item) {
                if (item === undefined || item === null || item.value === undefined || item.value === null || isNaN(item.value)) {
                    return undefined;
                }

                var formatCode = item.style && item.style.format ? item.style.format : '', format = '';

                if (item.isDate || wijmo.isDate(item.value)) {
                    format = this.fromXlsxFormat(formatCode)[0];
                } else if (wijmo.isNumber(item.value)) {
                    if (!formatCode || formatCode === 'General') {
                        format = wijmo.isInt(item.value) ? 'd' : 'f2';
                    } else {
                        format = this.fromXlsxFormat(formatCode)[0];
                    }
                } else {
                    format = formatCode;
                }

                return format;
            };

            /**
            * Converts zero-based cell, row or column index to Excel alphanumeric representation.
            *
            * @param row The zero-based row index or a null value if only column index should be converted.
            * @param col The zero-based column index or a null value if only row index should be converted.
            * @param absolute True value indicates that absolute indexes should be returned for both row and
            *        column indexes (like $D$7). The <b>absoluteCol</b> parameter allows to redefine this value for the column index.
            * @param absoluteCol True value indicates that column index is absolute.
            * @return The alphanumeric Excel index representation.
            */
            Workbook.xlsxAddress = function (row, col, absolute, absoluteCol) {
                var absRow = absolute ? '$' : '', absCol = absoluteCol == null ? absRow : (absoluteCol ? '$' : '');
                return (isNaN(col) ? '' : absCol + this._numAlpha(col)) + (isNaN(row) ? '' : absRow + (row + 1).toString());
            };

            /**
            * Convert Excel's alphanumeric cell, row or column index to the zero-based row/column indexes pair.
            *
            * @param xlsxIndex The alphanumeric Excel index that may include alphabetic A-based on column index
            * and/or numeric 1-based on row index, like "D15", "D" or "15". The alphabetic column index can be
            * in lower or upper case.
            * @return The object with <b>row</b> and <b>col</b> properties containing zero-based row and/or column indexes.
            * If row or column component is not specified in the alphanumeric index then corresponding returning property is undefined.
            */
            Workbook.tableAddress = function (xlsxIndex) {
                var patt = /^((\$?)([A-Za-z]+))?((\$?)(\d+))?$/, m = xlsxIndex && patt.exec(xlsxIndex), ret = {};

                if (!m) {
                    return null;
                }
                if (m[3]) {
                    ret.col = this._alphaNum(m[3]);
                    ret.absCol = !!m[2];
                }
                if (m[6]) {
                    ret.row = +m[6] - 1;
                    ret.absRow = !!m[5];
                }
                return ret;
            };

            // Parse the horizontal alignment enum to string.
            Workbook._parseHAlignToString = function (hAlign) {
                switch (hAlign) {
                    case 1 /* Left */:
                        return 'left';
                    case 2 /* Center */:
                        return 'center';
                    case 3 /* Right */:
                        return 'right';
                    default:
                        return null;
                }
            };

            // Parse the horizontal alignment string to enum.
            Workbook._parseStringToHAlign = function (hAlign) {
                var strAlign = hAlign ? hAlign.toLowerCase() : '';

                if (strAlign === 'left') {
                    return 1 /* Left */;
                }
                if (strAlign === 'center') {
                    return 2 /* Center */;
                }
                if (strAlign === 'right') {
                    return 3 /* Right */;
                }

                return undefined;
            };

            // Parse the vartical alignment enum to string.
            Workbook._parseVAlignToString = function (vAlign) {
                switch (vAlign) {
                    case 2 /* Bottom */:
                        return 'bottom';
                    case 1 /* Center */:
                        return 'center';
                    case 0 /* Top */:
                        return 'top';
                    default:
                        return null;
                }
            };

            // Parse the vartical alignment string to enum.
            Workbook._parseStringToVAlign = function (vAlign) {
                var strAlign = vAlign ? vAlign.toLowerCase() : '';

                if (strAlign === 'top') {
                    return 0 /* Top */;
                }
                if (strAlign === 'center') {
                    return 1 /* Center */;
                }
                if (strAlign === 'bottom') {
                    return 2 /* Bottom */;
                }

                return undefined;
            };

            //TBD: make these functions accessible from c1xlsx.ts and reference them there.
            // Parse the number to alphat
            // For e.g. 5 will be converted to 'E'.
            Workbook._numAlpha = function (i) {
                var t = Math.floor(i / 26) - 1;

                return (t > -1 ? this._numAlpha(t) : '') + this._alphabet.charAt(i % 26);
            };
            Workbook._alphaNum = function (s) {
                var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', t = 0;

                if (s.length === 2) {
                    t = this._alphaNum(s.charAt(0)) + 1;
                }
                return t * 26 + this._alphabet.indexOf(s.substr(-1));
            };

            // taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
            Workbook._b64ToUint6 = function (nChr) {
                return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
            };

            // decode the base64 string to int array
            Workbook._base64DecToArr = function (sBase64, nBlocksSize) {
                var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length, nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

                for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                    nMod4 = nInIdx & 3;
                    nUint24 |= this._b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                    if (nMod4 === 3 || nInLen - nInIdx === 1) {
                        for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                            taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                        }
                        nUint24 = 0;
                    }
                }
                return taBytes;
            };

            // taken from https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
            /* Base64 string to array encoding */
            Workbook._uint6ToB64 = function (nUint6) {
                return nUint6 < 26 ? nUint6 + 65 : nUint6 < 52 ? nUint6 + 71 : nUint6 < 62 ? nUint6 - 4 : nUint6 === 62 ? 43 : nUint6 === 63 ? 47 : 65;
            };

            Workbook._base64EncArr = function (aBytes) {
                var nMod3 = 2, sB64Enc = "";

                for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
                    nMod3 = nIdx % 3;
                    if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) {
                        sB64Enc += "\r\n";
                    }
                    nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
                    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
                        sB64Enc += String.fromCharCode(this._uint6ToB64(nUint24 >>> 18 & 63), this._uint6ToB64(nUint24 >>> 12 & 63), this._uint6ToB64(nUint24 >>> 6 & 63), this._uint6ToB64(nUint24 & 63));
                        nUint24 = 0;
                    }
                }

                return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
            };

            // Serializes the array of worksheet instance to the array of worksheet object model.
            Workbook.prototype._serializeWorkSheets = function () {
                var sheetOMs = [], workSheet, i;

                for (i = 0; i < this._sheets.length; i++) {
                    workSheet = this._sheets[i];
                    if (workSheet) {
                        sheetOMs[i] = workSheet._serialize();
                    }
                }
                return sheetOMs;
            };

            //Serializes the array of workbookstyle instance to the array of workbookstyle object model.
            Workbook.prototype._serializeWorkbookStyles = function () {
                var styleOMs = [], style, i;

                for (i = 0; i < this._styles.length; i++) {
                    style = this._styles[i];
                    if (style) {
                        styleOMs[i] = style._serialize();
                    }
                }
                return styleOMs;
            };

            // Deserializes the array of worksheet object model to the array of worksheet instance.
            Workbook.prototype._deserializeWorkSheets = function (workSheets) {
                var sheet, sheetOM, i;

                this._sheets = [];
                for (i = 0; i < workSheets.length; i++) {
                    sheetOM = workSheets[i];
                    if (sheetOM) {
                        sheet = new WorkSheet();
                        sheet._deserialize(sheetOM);
                        this._sheets[i] = sheet;
                    }
                }
            };

            // Deserializes the array of workbookstyle object model to the array of the workbookstyle instance.
            Workbook.prototype._deserializeWorkbookStyles = function (workbookStyles) {
                var style, styleOM, i;

                this._styles = [];
                for (i = 0; i < workbookStyles.length; i++) {
                    styleOM = workbookStyles[i];
                    if (styleOM) {
                        style = new WorkbookStyle();
                        style._deserialize(styleOM);
                        this._styles[i] = style;
                    }
                }
            };
            Workbook._alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            Workbook._formatMap = {
                n: '#,##0{0}',
                c: '{1}#,##0{0}_);({1}#,##0{0})',
                p: '0{0}%',
                f: '0{0}',
                d: '{0}'
            };
            return Workbook;
        })();
        xlsx.Workbook = Workbook;

        /**
        * Represents the Workbook Object Model sheet definition that includes sheet properties and data.
        *
        * The sheet cells are stored in row objects and are accessible using the path like <b>sheet.rows[i].cells[j]</b>.
        */
        var WorkSheet = (function () {
            function WorkSheet() {
            }
            Object.defineProperty(WorkSheet.prototype, "columns", {
                /**
                * Gets or sets an array of sheet columns definitions.
                *
                * Each @see:WorkbookColumn object in the array describes a column at the corresponding position in xlsx sheet,
                * i.e. the column with index 0
                * corresponds to xlsx sheet column with index A, object with index 1 defines sheet column with index B, and so on. If certain column
                * has no description in xlsx file then corresponding array element is undefined for both export and import operations.
                *
                * If @see:WorkbookColumn object in the array doesn't specify the <b>width</b> property value then the default column width
                * is applied.
                */
                get: function () {
                    if (this._columns == null) {
                        this._columns = [];
                    }
                    return this._columns;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(WorkSheet.prototype, "cols", {
                /*
                * Gets the @see:WorkbookColumn array of the @see:WorkSheet.
                *
                * This property is deprecated. Please use the @see:columns property instead.
                */
                get: function () {
                    console.error('** The "WorkSheet.cols" property is deprecated. Please use the "WorkSheet.columns" property instead.');
                    return this.columns;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(WorkSheet.prototype, "rows", {
                /**
                * Gets an array of sheet rows definition.
                *
                * Each @see:WorkbookRow object in the array describes a row at the corresponding position in xlsx sheet,
                * i.e. the row with index 0
                * corresponds to xlsx sheet row with index 1, object with index 1 defines sheet row with index 2, and so on. If certain row
                * has no properties and data in xlsx file then corresponding array element is undefined for both export and import operations.
                *
                * If @see:WorkbookRow object in the array doesn't specify the <b>height</b> property value then the default row height
                * is applied.
                */
                get: function () {
                    if (this._rows == null) {
                        this._rows = [];
                    }
                    return this._rows;
                },
                enumerable: true,
                configurable: true
            });

            // Serializes the worksheet instance to worksheet object model.
            WorkSheet.prototype._serialize = function () {
                var workSheetOM;

                if (this._checkEmptyWorkSheet()) {
                    return null;
                }
                workSheetOM = {};
                if (this._columns && this._columns.length > 0) {
                    workSheetOM.cols = workSheetOM.columns = this._serializeWorkbookColumns();
                }
                if (this._rows && this._rows.length > 0) {
                    workSheetOM.rows = this._serializeWorkbookRows();
                }
                if (this.frozenPane) {
                    workSheetOM.frozenPane = this.frozenPane._serialize();
                }
                if (this.name) {
                    workSheetOM.name = this.name;
                }
                if (this.summaryBelow != null) {
                    workSheetOM.summaryBelow = this.summaryBelow;
                }
                if (this.visible != null) {
                    workSheetOM.visible = this.visible;
                }
                return workSheetOM;
            };

            // Deserializes the worksheet object model to worksheet instance.
            WorkSheet.prototype._deserialize = function (workSheetOM) {
                var frozenPane;

                if (workSheetOM.columns && workSheetOM.columns.length > 0) {
                    this._deserializeWorkbookColumns(workSheetOM.columns);
                }
                if (workSheetOM.rows && workSheetOM.rows.length > 0) {
                    this._deserializeWorkbookRows(workSheetOM.rows);
                }
                if (workSheetOM.frozenPane) {
                    frozenPane = new WorkbookFrozenPane();
                    frozenPane._deserialize(workSheetOM.frozenPane);
                    this.frozenPane = frozenPane;
                }
                this.name = workSheetOM.name;
                this.summaryBelow = workSheetOM.summaryBelow;
                this.visible = workSheetOM.visible;
            };

            // Add the workbookcolumn instance into the _columns array.
            WorkSheet.prototype._addWorkbookColumn = function (column, columnIndex) {
                if (this._columns == null) {
                    this._columns = [];
                }

                if (columnIndex != null && !isNaN(columnIndex)) {
                    this._columns[columnIndex] = column;
                } else {
                    this._columns.push(column);
                }
            };

            // Add the workbookrow instance into the _rows array.
            WorkSheet.prototype._addWorkbookRow = function (row, rowIndex) {
                if (this._rows == null) {
                    this._rows = [];
                }

                if (rowIndex != null && !isNaN(rowIndex)) {
                    this._rows[rowIndex] = row;
                } else {
                    this._rows.push(row);
                }
            };

            // Serializes the array of the workbookcolumn instance to the array of the workbookcolumn object model.
            WorkSheet.prototype._serializeWorkbookColumns = function () {
                var columnOMs = [], column, i;

                for (i = 0; i < this._columns.length; i++) {
                    column = this._columns[i];
                    if (column) {
                        ;
                        columnOMs[i] = column._serialize();
                    }
                }
                return columnOMs;
            };

            // Serializes the array of workbookrow instance to the array of the workbookrow object model.
            WorkSheet.prototype._serializeWorkbookRows = function () {
                var rowOMs = [], row, i;

                for (i = 0; i < this._rows.length; i++) {
                    row = this._rows[i];
                    if (row) {
                        rowOMs[i] = row._serialize();
                    }
                }
                return rowOMs;
            };

            // Deserializes the arry of the workbookcolumn object model to the array of the workbookcolumn instance.
            WorkSheet.prototype._deserializeWorkbookColumns = function (workbookColumns) {
                var columnOM, column, i;

                this._columns = [];
                for (i = 0; i < workbookColumns.length; i++) {
                    columnOM = workbookColumns[i];
                    if (columnOM) {
                        column = new WorkbookColumn();
                        column._deserialize(columnOM);
                        this._columns[i] = column;
                    }
                }
            };

            // Deserializes the array of the workbookrow object model to the array of the workbookrow instance.
            WorkSheet.prototype._deserializeWorkbookRows = function (workbookRows) {
                var rowOM, row, i;

                this._rows = [];
                for (i = 0; i < workbookRows.length; i++) {
                    rowOM = workbookRows[i];
                    if (rowOM) {
                        row = new WorkbookRow();
                        row._deserialize(rowOM);
                        this._rows[i] = row;
                    }
                }
            };

            // Checks whether the worksheet instance is empty.
            WorkSheet.prototype._checkEmptyWorkSheet = function () {
                return this._rows == null && this._columns == null && this.visible == null && this.summaryBelow == null && this.frozenPane == null && (this.name == null || this.name === '');
            };
            return WorkSheet;
        })();
        xlsx.WorkSheet = WorkSheet;

        /**
        * Represents the Workbook Object Model column definition.
        */
        var WorkbookColumn = (function () {
            function WorkbookColumn() {
            }
            // Serializes the workbookcolumn instance to workbookcolumn object model.
            WorkbookColumn.prototype._serialize = function () {
                var workbookColumnOM;

                if (this._checkEmptyWorkbookColumn()) {
                    return null;
                }

                workbookColumnOM = {};
                if (this.style) {
                    workbookColumnOM.style = this.style._serialize();
                }
                if (this.autoWidth != null) {
                    workbookColumnOM.autoWidth = this.autoWidth;
                }
                if (this.width != null) {
                    workbookColumnOM.width = this.width;
                }
                if (this.visible != null) {
                    workbookColumnOM.visible = this.visible;
                }
                return workbookColumnOM;
            };

            // Deserializes the workbookColummn object model to workbookcolumn instance.
            WorkbookColumn.prototype._deserialize = function (workbookColumnOM) {
                var style;

                if (workbookColumnOM.style) {
                    style = new WorkbookStyle();
                    style._deserialize(workbookColumnOM.style);
                    this.style = style;
                }
                this.autoWidth = workbookColumnOM.autoWidth;
                this.visible = workbookColumnOM.visible;
                this.width = workbookColumnOM.width;
            };

            // Checks whether the workbookcolumn instance is empty.
            WorkbookColumn.prototype._checkEmptyWorkbookColumn = function () {
                return this.style == null && this.width == null && this.autoWidth == null && this.visible == null;
            };
            return WorkbookColumn;
        })();
        xlsx.WorkbookColumn = WorkbookColumn;

        /**
        * Represents the Workbook Object Model row definition.
        */
        var WorkbookRow = (function () {
            function WorkbookRow() {
            }
            Object.defineProperty(WorkbookRow.prototype, "cells", {
                /**
                * Gets or sets an array of cells in the row.
                *
                * Each @see:WorkbookCell object in the array describes a cell at the corresponding position in the row,
                * i.e. the cell with index 0
                * pertain to column with index A, cell with index 1 defines cell pertain to column with index B, and so on. If a certain cell
                * has no definition (empty) in xlsx file then corresponding array element is undefined for both export and import operations.
                */
                get: function () {
                    if (this._cells == null) {
                        this._cells = [];
                    }
                    return this._cells;
                },
                enumerable: true,
                configurable: true
            });

            // Serializes the workbookrow instance to workbookrow object model.
            WorkbookRow.prototype._serialize = function () {
                var workbookRowOM;

                if (this._checkEmptyWorkbookRow()) {
                    return null;
                }

                workbookRowOM = {};
                if (this._cells && this._cells.length > 0) {
                    workbookRowOM.cells = this._serializeWorkbookCells();
                }
                if (this.style) {
                    workbookRowOM.style = this.style._serialize();
                }
                if (this.collapsed != null) {
                    workbookRowOM.collapsed = this.collapsed;
                }
                if (this.groupLevel != null && !isNaN(this.groupLevel)) {
                    workbookRowOM.groupLevel = this.groupLevel;
                }
                if (this.height != null && !isNaN(this.height)) {
                    workbookRowOM.height = this.height;
                }
                if (this.visible != null) {
                    workbookRowOM.visible = this.visible;
                }
                return workbookRowOM;
            };

            // Deserializes the workbookrow object model to workbookrow instance.
            WorkbookRow.prototype._deserialize = function (workbookRowOM) {
                var style;

                if (workbookRowOM.cells && workbookRowOM.cells.length > 0) {
                    this._deserializeWorkbookCells(workbookRowOM.cells);
                }
                if (workbookRowOM.style) {
                    style = new WorkbookStyle();
                    style._deserialize(workbookRowOM.style);
                    this.style = style;
                }
                this.collapsed = workbookRowOM.collapsed;
                this.groupLevel = workbookRowOM.groupLevel;
                this.height = workbookRowOM.height;
                this.visible = workbookRowOM.visible;
            };

            // Add the workbook cell instance into the _cells array.
            WorkbookRow.prototype._addWorkbookCell = function (cell, cellIndex) {
                if (this._cells == null) {
                    this._cells = [];
                }

                if (cellIndex != null && !isNaN(cellIndex)) {
                    this._cells[cellIndex] = cell;
                } else {
                    this._cells.push(cell);
                }
            };

            // Serializes the array of the workbookcell instance to workbookcell object model.
            WorkbookRow.prototype._serializeWorkbookCells = function () {
                var cellOMs = [], cell, i;

                for (i = 0; i < this._cells.length; i++) {
                    cell = this._cells[i];
                    if (cell) {
                        cellOMs[i] = cell._serialize();
                    }
                }
                return cellOMs;
            };

            // Deserializes the array of the workbookcell object model to workbookcell instance.
            WorkbookRow.prototype._deserializeWorkbookCells = function (workbookCells) {
                var cellOM, cell, i;

                this._cells = [];
                for (i = 0; i < workbookCells.length; i++) {
                    cellOM = workbookCells[i];
                    if (cellOM) {
                        cell = new WorkbookCell();
                        cell._deserialize(cellOM);
                        this._cells[i] = cell;
                    }
                }
            };

            // Checks whether the workbookcell instance is empty.
            WorkbookRow.prototype._checkEmptyWorkbookRow = function () {
                return this._cells == null && this.style == null && this.collapsed == null && this.visible == null && (this.height == null || isNaN(this.height)) && (this.groupLevel == null || isNaN(this.groupLevel));
            };
            return WorkbookRow;
        })();
        xlsx.WorkbookRow = WorkbookRow;

        /**
        * Represents the Workbook Object Model cell definition.
        */
        var WorkbookCell = (function () {
            function WorkbookCell() {
            }
            // Serializes the workbookcell instance to workbookcell object model.
            WorkbookCell.prototype._serialize = function () {
                var workbookCellOM;

                if (this._checkEmptyWorkbookCell()) {
                    return null;
                }

                workbookCellOM = {};
                if (this.style) {
                    workbookCellOM.style = this.style._serialize();
                }
                if (this.value != null) {
                    workbookCellOM.value = this.value;
                }
                if (this.formula) {
                    workbookCellOM.formula = this.formula;
                }
                if (this.isDate != null) {
                    workbookCellOM.isDate = this.isDate;
                }
                if (this.colSpan != null && !isNaN(this.colSpan) && this.colSpan > 1) {
                    workbookCellOM.colSpan = this.colSpan;
                }
                if (this.rowSpan != null && !isNaN(this.rowSpan) && this.rowSpan > 1) {
                    workbookCellOM.rowSpan = this.rowSpan;
                }
                return workbookCellOM;
            };

            // Deserializes the workbookcell object model to workbookcell instance.
            WorkbookCell.prototype._deserialize = function (workbookCellOM) {
                var style;

                if (workbookCellOM.style) {
                    style = new WorkbookStyle();
                    style._deserialize(workbookCellOM.style);
                    this.style = style;
                }
                this.value = workbookCellOM.value;
                this.formula = workbookCellOM.formula;
                this.isDate = workbookCellOM.isDate;
                this.colSpan = workbookCellOM.colSpan;
                this.rowSpan = workbookCellOM.rowSpan;
            };

            // Checks whether the workbookcell instance is empty.
            WorkbookCell.prototype._checkEmptyWorkbookCell = function () {
                return this.style == null && this.value == null && this.isDate == null && (this.formula == null || this.formula === '') && (this.colSpan == null || isNaN(this.colSpan) || this.colSpan <= 1) && (this.rowSpan == null || isNaN(this.rowSpan) || this.rowSpan <= 1);
            };
            return WorkbookCell;
        })();
        xlsx.WorkbookCell = WorkbookCell;

        /**
        * Workbook frozen pane definition
        */
        var WorkbookFrozenPane = (function () {
            function WorkbookFrozenPane() {
            }
            // Serializes the workbookfrozenpane instance to the workbookfrozenpane object model.
            WorkbookFrozenPane.prototype._serialize = function () {
                if ((this.columns == null || isNaN(this.columns) || this.columns === 0) && (this.rows == null || isNaN(this.rows) || this.rows === 0)) {
                    return null;
                } else {
                    return {
                        columns: this.columns,
                        rows: this.rows
                    };
                }
            };

            // Deserializes the workbookfrozenpane object model to workbookfrozenpane instance.
            WorkbookFrozenPane.prototype._deserialize = function (workbookFrozenPaneOM) {
                this.columns = workbookFrozenPaneOM.columns;
                this.rows = workbookFrozenPaneOM.rows;
            };
            return WorkbookFrozenPane;
        })();
        xlsx.WorkbookFrozenPane = WorkbookFrozenPane;

        /**
        * Represents the Workbook Object Model style definition used to style Excel cells, columns and rows.
        */
        var WorkbookStyle = (function () {
            function WorkbookStyle() {
            }
            // Serializes the workbookstyle instance to the workbookstyle object model.
            WorkbookStyle.prototype._serialize = function () {
                var workbookStyleOM;

                if (this._checkEmptyWorkbookStyle()) {
                    return null;
                }

                workbookStyleOM = {};
                if (this.basedOn) {
                    workbookStyleOM.basedOn = this.basedOn._serialize();
                }
                if (this.fill) {
                    workbookStyleOM.fill = this.fill._serialize();
                }
                if (this.font) {
                    workbookStyleOM.font = this.font._serialize();
                }
                if (this.format) {
                    workbookStyleOM.format = this.format;
                }
                if (this.hAlign != null) {
                    workbookStyleOM.hAlign = wijmo.asEnum(this.hAlign, HAlign, false);
                }
                if (this.vAlign != null) {
                    workbookStyleOM.vAlign = wijmo.asEnum(this.vAlign, VAlign, false);
                }
                if (this.indent != null && !isNaN(this.indent)) {
                    workbookStyleOM.indent = this.indent;
                }
                return workbookStyleOM;
            };

            // Deserializes the workbookstyle object model to workbookstyle instance.
            WorkbookStyle.prototype._deserialize = function (workbookStyleOM) {
                var baseStyle, fill, font;

                if (workbookStyleOM.basedOn) {
                    baseStyle = new WorkbookStyle();
                    baseStyle._deserialize(workbookStyleOM.basedOn);
                    this.basedOn = baseStyle;
                }
                if (workbookStyleOM.fill) {
                    fill = new WorkbookFill();
                    fill._deserialize(workbookStyleOM.fill);
                    this.fill = fill;
                }
                if (workbookStyleOM.font) {
                    font = new WorkbookFont();
                    font._deserialize(workbookStyleOM.font);
                    this.font = font;
                }
                this.format = workbookStyleOM.format;
                if (workbookStyleOM.hAlign != null) {
                    this.hAlign = wijmo.asEnum(workbookStyleOM.hAlign, HAlign, false);
                }
                if (workbookStyleOM.vAlign != null) {
                    this.vAlign = wijmo.asEnum(workbookStyleOM.vAlign, VAlign, false);
                }
                if (workbookStyleOM.indent != null && !isNaN(workbookStyleOM.indent)) {
                    this.indent = workbookStyleOM.indent;
                }
            };

            // Checks whether the workbookstyle instance is empty.
            WorkbookStyle.prototype._checkEmptyWorkbookStyle = function () {
                return this.basedOn == null && this.fill == null && this.font == null && (this.format == null || this.format === '') && this.hAlign == null && this.vAlign == null;
            };
            return WorkbookStyle;
        })();
        xlsx.WorkbookStyle = WorkbookStyle;

        /**
        * Represents the Workbook Object Model font definition.
        */
        var WorkbookFont = (function () {
            function WorkbookFont() {
            }
            //Serializes the workbookfont instance to the workbookfont object model.
            WorkbookFont.prototype._serialize = function () {
                var workbookFontOM;

                if (this._checkEmptyWorkbookFont()) {
                    return null;
                }

                workbookFontOM = {};
                if (this.bold != null) {
                    workbookFontOM.bold = this.bold;
                }
                if (this.italic != null) {
                    workbookFontOM.italic = this.italic;
                }
                if (this.underline != null) {
                    workbookFontOM.underline = this.underline;
                }
                if (this.color) {
                    workbookFontOM.color = this.color;
                }
                if (this.family) {
                    workbookFontOM.family = this.family;
                }
                if (this.size != null && !isNaN(this.size)) {
                    workbookFontOM.size = this.size;
                }
                return workbookFontOM;
            };

            // Deserializes the workbookfotn object model to the workbookfont instance.
            WorkbookFont.prototype._deserialize = function (workbookFontOM) {
                this.bold = workbookFontOM.bold;
                this.color = workbookFontOM.color;
                this.family = workbookFontOM.family;
                this.italic = workbookFontOM.italic;
                this.size = workbookFontOM.size;
                this.underline = workbookFontOM.underline;
            };

            // Checks whether the workbookfont instance is empty.
            WorkbookFont.prototype._checkEmptyWorkbookFont = function () {
                return this.bold == null && this.italic == null && this.underline == null && (this.color == null || this.color === '') && (this.family == null || this.family === '') && (this.size == null || isNaN(this.size));
            };
            return WorkbookFont;
        })();
        xlsx.WorkbookFont = WorkbookFont;

        /**
        * Represents the Workbook Object Model background fill definition.
        */
        var WorkbookFill = (function () {
            function WorkbookFill() {
            }
            // Serializes the workbookfill instance to the workbookfill object model.
            WorkbookFill.prototype._serialize = function () {
                var workbookFillOM;

                if (this.color) {
                    return {
                        color: this.color
                    };
                } else {
                    return null;
                }
            };

            // Deserializes the workbookfill object model to workbookfill instance.
            WorkbookFill.prototype._deserialize = function (workbookFillOM) {
                this.color = workbookFillOM.color;
            };
            return WorkbookFill;
        })();
        xlsx.WorkbookFill = WorkbookFill;

        

        

        

        

        

        

        

        

        

        

        

        

        /**
        * Defines the Workbook Object Model horizontal text alignment.
        */
        (function (HAlign) {
            /** Alignment depends on the cell value type. */
            HAlign[HAlign["General"] = 0] = "General";

            /** Text is aligned to the left. */
            HAlign[HAlign["Left"] = 1] = "Left";

            /** Text is centered. */
            HAlign[HAlign["Center"] = 2] = "Center";

            /** Text is aligned to the right. */
            HAlign[HAlign["Right"] = 3] = "Right";

            /** Text is replicated to fill the whole cell width. */
            HAlign[HAlign["Fill"] = 4] = "Fill";

            /** Text is justified. */
            HAlign[HAlign["Justify"] = 5] = "Justify";
        })(xlsx.HAlign || (xlsx.HAlign = {}));
        var HAlign = xlsx.HAlign;

        /**
        * Vertical alignment
        */
        (function (VAlign) {
            /** Top vertical alignment */
            VAlign[VAlign["Top"] = 0] = "Top";

            /** Center vertical alignment */
            VAlign[VAlign["Center"] = 1] = "Center";

            /** Bottom vertical alignment */
            VAlign[VAlign["Bottom"] = 2] = "Bottom";

            /** Justify vertical alignment */
            VAlign[VAlign["Justify"] = 3] = "Justify";
        })(xlsx.VAlign || (xlsx.VAlign = {}));
        var VAlign = xlsx.VAlign;
    })(wijmo.xlsx || (wijmo.xlsx = {}));
    var xlsx = wijmo.xlsx;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Workbook.js.map

var wijmo;
(function (wijmo) {
    /*
    * Defines the @see:XlsxConverter class that provides client-side Excel xlsx file import/export capabilities, and @see:IWorkbook
    * interface that along with the associated interfaces defines Excel Workbook Object Model that represents Excel Workbook
    * data.
    *
    * The module has dependency on the external <a href="https://stuk.github.io/jszip" target="_blank">JSZip</a> library,
    * which should be referenced in html page with the markup like this:
    * <pre>&lt;script src="http://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"&gt;&lt;/script&gt;</pre>
    *
    * The import/export operations are performed solely on a client and don't require any server-side services.
    */
    (function (xlsx) {
        'use strict';

        /*
        * This class provides static <b>import</b> and <b>export</b> methods for importing and exporting Excel xlsx files.
        */
        var XlsxConverter = (function () {
            function XlsxConverter() {
            }
            /*
            * Exports the Excel Workbook content to xlsx file.
            *
            * For example:
            * <pre>// This sample saves xlsx file, containing "Hello, Excel!" in a single cell,
            * // to a local disk in response to the Export hyperlink
            * // click.
            * &nbsp;
            * // HTML
            * &lt;a download="Hello.xlsx"
            *     href=""
            *     id="export"
            *     onclick="exportXlsx()"&gt;
            *     Export
            * &lt;/a&gt;
            * &nbsp;
            * // JavaScript
            * function exportXlsx() {
            *     // Define a workbook content.
            *     var workbook =
            *         {
            *             sheets: [
            *                 {
            *                     rows: [
            *                       {
            *                           cells: [
            *                             { value: 'Hello, Excel!' }
            *                           ]
            *                       }]
            *                 }]
            *         };
            * &nbsp;
            *     // Export to xlsx format.
            *     var fileContent = wijmo.xlsx.XlsxConverter.export(workbook);
            *     // Save the xlsx content to a file.
            *     var link = document.getElementById("export");
            *     if (navigator.msSaveBlob) {
            *         // Save the xlsx file using Blob and msSaveBlob in IE10+.
            *         var blob = new Blob([fileContent.base64Array]);
            *         navigator.msSaveBlob(blob, link.getAttribute("download"));
            *     } else {
            *         link.href = fileContent.href();
            *     }
            * }</pre>
            * @param workbook The workbook (data and properties) being exported as JavaScript object which conforms to
            * the @see:IWorkbook interface.
            * @return An object containing xlsx file content in different formats that can be saved on a local disk or transferred to server
            * .
            */
            XlsxConverter.export = function (workbook) {
                console.error('** The "XlsxConverter.export" method is deprecated. Please use the "Workbook.save" method instead.');
                var result = xlsx._xlsx(workbook);

                result.base64Array = xlsx.Workbook._base64DecToArr(result.base64);

                return result;
            };

            /*
            * Exports the Workbook Object Model instance to a local xlsx file.
            *
            * This method brings up a browser dependent Open/Save File dialog that usually allows to Open it using program/application which
            * is xls compatible and Save a file to a specific location
            *
            * For example:
            * <pre>// This sample saves xlsx file with a single "Hello, Excel!"
            * // cell to a local disk.
            * &nbsp;
            * // Define a workbook content.
            * var workbook =
            *     {
            *         sheets: [
            *             {
            *                 rows: [
            *                     {
            *                       cells: [
            *                           { value: 'Hello, Excel!' }
            *                       ]
            *                 }]
            *              }]
            *      };
            * &nbsp;
            * // Export to xlsx format and save to a file.
            * wijmo.xlsx.XlsxConverter.exportToFile(workbook, 'Hello.xlsx');</pre>
            * @param workbook The workbook (data and properties) being exported as JavaScript object that conforms to
            * the @see:IWorkbook interface.
            * @param fileName The name without a path of the saving file.
            * @return An object containing xlsx file content in different formats that can be saved on a local disk or transferred to server.
            */
            XlsxConverter.exportToFile = function (workbook, fileName) {
                console.error('** The "XlsxConverter.exportToFile" method is deprecated. Please use the "Workbook.save" method instead.');
                var result = XlsxConverter.export(workbook);
                var blob = new Blob([result.base64Array]);

                if (!fileName) {
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
                        link.href = result.href();
                        click(link);
                        link = null;
                    };

                    fr.readAsDataURL(blob);
                }
            };

            /*
            * Imports the xlsx file content to the Workbook Object Model instance.
            *
            * For example:
            * <pre>// This sample opens an xlsx file chosen from Open File
            * // dialog and stores its Workbook Object Model
            * // representation in the 'workbook' variable.
            * &nbsp;
            * // HTML
            * &lt;input type="file"
            *     id="importFile"
            *     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            * /&gt;
            * &nbsp;
            * // JavaScript
            * var workbook, // receives imported IWorkbook
            *     importFile = document.getElementById('importFile');
            * &nbsp;
            * importFile.addEventListener('change', function () {
            *     loadWorkbook();
            * });
            * &nbsp;
            * function loadWorkbook() {
            *     var reader = new FileReader(),
            *         fileData;
            *     reader.onload = function (e) {
            *        workbook = wijmo.xlsx.XlsxConverter.import(reader.result);
            *     };
            *     var file = importFile.files[0];
            *     if (file) {
            *         reader.readAsArrayBuffer(file);
            *     }
            * }</pre>
            * @param fileContent The content of the importing xlsx file represented as an encoded base64 string or
            * as an <b>ArrayBuffer</b> object.
            * @return A Workbook Object Model instance that allows to inspect workbook data and properties.
            */
            XlsxConverter.import = function (fileContent) {
                console.error('** The "XlsxConverter.import" method is deprecated. Please use the "Workbook.load" method instead.');
                var fileData = typeof fileContent === 'string' ? fileContent : xlsx.Workbook._base64EncArr(new Uint8Array(fileContent));

                return xlsx._xlsx(fileData);
            };

            /*
            * Converts the .Net date format to Excel format.
            *
            * @param netFormat The .Net date format.
            * @return Excel format representation.
            */
            XlsxConverter.xlsxDateFormat = function (netFormat) {
                console.error('** The "XlsxConverter.xlsxDateFormat" method is deprecated. Please use the "Workbook.toXlsxDateFormat" method instead.');
                return xlsx.Workbook.toXlsxDateFormat(netFormat);
            };

            /*
            * Converts the .Net number format to xlsx format.
            *
            * @param netFormat The .Net number format.
            * @return Excel format representation.
            */
            XlsxConverter.xlsxNumberFormat = function (netFormat) {
                console.error('** The "XlsxConverter.xlsxNumberFormat" method is deprecated. Please use the "Workbook.toXlsxNumberFormat" method instead.');
                return xlsx.Workbook.toXlsxNumberFormat(netFormat);
            };

            /*
            * Converts the xlsx multi-section format string to an array of corresponding .Net formats.
            *
            * @param xlsxFormat The Excel format string, that may contain multiple format sections separated by semicolon.
            * @return An array of .Net format strings where each element corresponds to a separate Excel format section.
            * The returning array always contains at least one element. It can be an empty string in case the passed Excel format is empty.
            */
            XlsxConverter.netFormat = function (xlsxFormat) {
                console.error('** The "XlsxConverter.netFormat" method is deprecated. Please use the "Workbook.fromXlsxFormat" method instead.');
                return xlsx.Workbook.fromXlsxFormat(xlsxFormat);
            };

            /*
            * Converts zero-based cell, row or column index to Excel alphanumeric representation.
            *
            * @param row The zero-based row index or a null value if only column index should be converted.
            * @param col The zero-based column index or a null value if only row index should be converted.
            * @param absolute True value indicates that absolute indexes should be returned for both row and
            *        column indexes (like $D$7). The <b>absoluteCol</b> parameter allows to redefine this value for the column index.
            * @param absoluteCol True value indicates that column index is absolute.
            * @return The alphanumeric Excel index representation.
            */
            XlsxConverter.xlsxIndex = function (row, col, absolute, absoluteCol) {
                console.error('** The "XlsxConverter.xlsxIndex" method is deprecated. Please use the "Workbook.xlsxAddress" method instead.');
                return xlsx.Workbook.xlsxAddress(row, col, absolute, absoluteCol);
            };

            /*
            * Convert Excel's alphanumeric cell, row or column index to the zero-based row/column indexes pair.
            *
            * @param xlsxIndex The alphanumeric Excel index that may include alphabetic A-based on column index
            * and/or numeric 1-based on row index, like "D15", "D" or "15". The alphabetic column index can be
            * in lower or upper case.
            * @return The object with <b>row</b> and <b>col</b> properties containing zero-based row and/or column indexes.
            * If row or column component is not specified in the alphanumeric index then corresponding returning property is undefined.
            */
            XlsxConverter.numericIndex = function (xlsxIndex) {
                console.error('** The "XlsxConverter.numericIndex" method is deprecated. Please use the "Workbook.numericAddress" method instead.');
                return xlsx.Workbook.tableAddress(xlsxIndex);
            };
            return XlsxConverter;
        })();
        xlsx.XlsxConverter = XlsxConverter;
    })(wijmo.xlsx || (wijmo.xlsx = {}));
    var xlsx = wijmo.xlsx;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=XlsxConverter.js.map

