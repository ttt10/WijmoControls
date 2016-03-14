(function (wijmo, data) {
    'use strict';

    // create a grid and define the columns
    new wijmo.grid.FlexGrid('#nvGrid', {
        autoGenerateColumns: false,
        itemsSource: data.getData(100),
        columns: [
            { header: 'Country', binding: 'country', width: '*', required: true },
            { header: 'Date', binding: 'date', required: false },
            { header: 'Revenue', binding: 'amount', format: 'n0', required: false },
            { header: 'Active', binding: 'active', required: false }
        ]
    });

})(wijmo, appData);