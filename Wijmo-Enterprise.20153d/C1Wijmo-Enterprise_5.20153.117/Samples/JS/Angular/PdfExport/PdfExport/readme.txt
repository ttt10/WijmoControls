PdfExport
-----------------------------------------------------------------------------------
Shows how to use the FlexGridPdfConverter, a <a href="https://github.com/devongovett/pdfkit">PDFKit</a>-based JavaScript library, to export FlexGrid to PDF (Portable Document Format) without using any server-side code.


<b>Export</b>

To export a FlexGrid you need to use the <b>FlexGridPdfConverter.export</b> function, which takes the following arguments:
<ul>
	<li>A FlexGrid instance.</li>
	<li>Name of the file to export.</li>
	<li>The export settings, like a page orientation, scale mode, the maximum number of pages.</li>
</ul>

<b>Adding it to your application</b>

In order to add the FlexGridPdfConverter to your application, please perform the following steps:

<ol>
    <li>Add the c1pdfkit.js, PdfDocument.js and FlexGridPdfConverter.js files to your application.</li>
    <li>
        In the HTML page, add references to:
        <ul>
            <li>c1pdfkit.js</li>
            <li>PdfDocument.js</li>
            <li>FlexGridPdfConverter.js</li>
        </ul>
    </li>
    <li>
        Add the code which calls the wijmo.grid.FlexGridPdfConverter.export function that saves the export results to a local file.
	</li>
</ol>