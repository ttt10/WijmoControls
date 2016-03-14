declare var PDFDocument: {
	prototype: IPdfKitDocument;
	new (options?: IPdfKitDocumentOptions): IPdfKitDocument;
} 

interface IPdfKitDocument {
	x: number;
	y: number;
	info: IPdfKitDocumentInfo;
	compress: boolean;
	options: IPdfKitDocumentOptions;
	page: IPdfKitPage;

	addPage(options?: IPdfKitPageOptions): IPdfKitDocument;
	bufferedPageRange(): { start: number; count: number; };
	flushPages(): void;
	switchToPage(pageNumber: number): IPdfKitPage;
	end(): boolean;

	currentLineHeight(includeGap?: boolean): number;
	widthOfString(value: string, options?: any): number;
	heightOfString(value: string, options?: IPdfKitHeightOfStringOptions): number;

	font(name: string, size?: number): IPdfKitDocument;
	font(src: ArrayBuffer, size?: number): IPdfKitDocument;
	font(src: ArrayBuffer, ttcFamily: string, size?: number): IPdfKitDocument;

	fontSize(size: number): IPdfKitDocument;

	moveDown(lines?: number): IPdfKitDocument;
	moveUp(lines?: number): IPdfKitDocument;

	registerFont(name: string, standardFontName: string): IPdfKitDocument;
	registerFont(name: string, src: ArrayBuffer, ttcFamily?: string): IPdfKitDocument;

	text(text: string, options?: IPdfKitTextOptions): IPdfKitDocument;
	text(text: string, x?: number, y?: number, options?: IPdfKitTextOptions): IPdfKitDocument;

	image(URI: string, options?: IPdfKitImageOptions): IPdfKitDocument;
	image(URI: string, x?: number, y?: number, options?: IPdfKitImageOptions): IPdfKitDocument;

	on(eventName: string, handler: Function): IPdfKitDocument;
	on(eventName: 'data', handler: (chunk: any) => {}): IPdfKitDocument;
	removeAllListeners(type: string): IPdfKitDocument;
	removeEventListener(type: string, listener: Function): IPdfKitDocument;

	clip(rule: string): IPdfKitDocument;

	circle(x: number, y: number, radius: number): IPdfKitDocument;
	ellipse(x: number, y: number, r1: number, r2?: number): IPdfKitDocument;

	fill(colorOrRule: string): IPdfKitDocument;
	fill(color: string, rule?: string): IPdfKitDocument;
	fill(color: number[], rule?: string): IPdfKitDocument;
	fill(color: IPdfKitGradient, rule?: string): IPdfKitDocument;

	fillAndStroke(fillColor: string, strokeColor: string, rule?: string): IPdfKitDocument;
	fillAndStroke(fillColor: number[], strokeColor: number[], rule?: string): IPdfKitDocument;
	fillAndStroke(fillColor: IPdfKitGradient, strokeColor: IPdfKitGradient, rule?: string): IPdfKitDocument;

	fillColor(color: string, opacity?: number): IPdfKitDocument;
	fillColor(color: number[], opacity?: number): IPdfKitDocument;
	fillColor(color: IPdfKitGradient, opacity?: number): IPdfKitDocument;

	lineTo(x: number, y: number): IPdfKitDocument;
	linearGradient(x1: number, y1: number, x2: number, y2: number): IPdfKitLinearGradient;
	lineWidth(width: number): IPdfKitDocument;
	moveTo(x: number, y: number): IPdfKitDocument;
	path(path: string): IPdfKitDocument;
	radialGradient(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): IPdfKitRadialGradient;
	rect(x: number, y: number, w: number, h: number): IPdfKitDocument;
	polygon(...points: number[][]): IPdfKitDocument;

	stroke(color?: string): IPdfKitDocument;
	stroke(color?: number[]): IPdfKitDocument;
	stroke(color?: IPdfKitGradient): IPdfKitDocument;

	scale(xFactor: number, yFactor: number, options?: IPdfKitScaleOptions): IPdfKitDocument;
	scale(factor: number): IPdfKitDocument;
	translate(x: number, y: number): IPdfKitDocument;
	transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): IPdfKitDocument;
	rotate(angle: number, options?: IPdfKitRotateOptions): IPdfKitDocument;

	restore(): IPdfKitDocument;
	save(): IPdfKitDocument;
}

interface IPdfKitPage {
	document: IPdfKitDocument;
	width: number;
	height: number;
	margins: IPdfKitPageMargins;
	size: string;
	layout: string;

	// GrapeCity
	originalMargins: IPdfKitPageMargins;
}

interface IPdfKitDocumentOptions extends IPdfKitPageOptions {
	bufferPages?: boolean;
	compress?: boolean;
	info?: IPdfKitDocumentInfo;

	// GrapeCity
	pageAdding?: (document: IPdfKitDocument, options: IPdfKitPageOptions) => void;
	pageAdded?: (document: IPdfKitDocument, pageIndex: number) => void;
}

interface IPdfKitPageOptions {
	layout?: string;
	margin?: number;
	margins?: IPdfKitPageMargins;
	size?: string;
}

interface IPdfKitDocumentInfo {
	Author?: string;
	CreationDate?: Date;
	Keywords?: string;
	ModDate?: Date;
	Subject?: string;
	Title?: string;
}

interface IPdfKitPageMargins {
	bottom: number;
	left: number;
	right: number;
	top: number;
}

interface IPdfKitTextOptions {
	align?: string; // "left", "center", "right", "justify".
	lineBreak?: boolean; // set to false to disable line wrapping all together
	width?: number; // the width that text should be wrapped to (by default, the page width minus the left and right margin)
	height?: number; // the maximum height that text should be clipped to
	ellipsis?: any; // the character to display at the end of the text when it is too long. Set to true to use the default character.
	columns?: number; // the number of columns to flow the text into
	columnGap?: number; // the amount of space between each column(1 / 4 inch by default)
	indent?: number; // the amount in PDF points(72 per inch) to indent each paragraph of text
	paragraphGap?: number; // the amount of space between each paragraph of text
	lineGap?: number; // the amount of space between each line of text
	wordSpacing?: number; // the amount of space between each word in the text
	characterSpacing?: number; // the amount of space between each character in the text
	fill?: boolean; // whether to fill the text(true by default)
	stroke?: boolean; // whether to stroke the text
	link?: string; // a URL to link this text to(shortcut to create an annotation)
	underline?: boolean; // whether to underline the text
	strike?: boolean; // whether to strike out the text
	continued?: boolean; // whether the text segment will be followed immediately by another segment.Useful for changing styling in the middle of a paragraph.
}

interface IPdfKitHeightOfStringOptions extends IPdfKitTextOptions {
	// GrapeCity
	lastLineExternalLeadingGap?: boolean; // default: true
}

interface IPdfKitImageOptions {
	width?: number;
	height?: number;
	scale?: number;
	fit?: number[];
}

interface IPdfKitGradient {
}

interface IPdfKitLinearGradient extends IPdfKitGradient {
}

interface IPdfKitRadialGradient extends IPdfKitGradient {
}

interface IPdfKitOrigin {
	origin?: number[];
}

interface IPdfKitScaleOptions extends IPdfKitOrigin {
}

interface IPdfKitRotateOptions extends IPdfKitOrigin {
}