(function (wijmo, data) {
    'use strict';

    // create grid, some data
    var grid = new wijmo.grid.FlexGrid('#csFlexGrid'),
        cv = new wijmo.collections.CollectionView(data.getData(100));

    // initialize grid
    grid.initialize({
        autoGenerateColumns: false,
        columns: [
            { header: 'Country', binding: 'country', width: '*', isContentHtml: true, isReadOnly: true },
            { header: 'Date', binding: 'date' },
            { header: 'Revenue', binding: 'amount', format: 'n0' },
            { header: 'Active', binding: 'active' },
        ],
        itemsSource: cv,
        itemFormatter: function (panel, r, c, cell) {

            // validate CellType and if correct column
            if (wijmo.grid.CellType.Cell === panel.cellType &&
                'amount' === panel.columns[c].binding) {

                // get the cell's data
                var cellData = panel.getCellData(r, c);

                // set cell's foreground color
                cell.style.color = getAmountColor(cellData);
            }
        }
    });

    // get the color used to display an amount
    function getAmountColor(amount) {
        return amount < 500 ? 'red' : amount < 2500 ? 'black' : 'green';
    }
})(wijmo, appData);