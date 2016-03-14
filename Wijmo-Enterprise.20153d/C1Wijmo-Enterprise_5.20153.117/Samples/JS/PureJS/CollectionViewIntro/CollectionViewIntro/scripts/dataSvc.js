﻿// create an array with the specified count
function getData(count) {
    var data = [],
        dt = new Date(),

        // data used to generate random items
        countries = ['US', 'Germany', 'UK', 'Japan', 'Italy', 'Greece'],
        products = ['Widget', 'Gadget', 'Doohickey'],
        colors = ['Black', 'White', 'Red', 'Green', 'Blue'];

    // add count items
    for (var i = 0; i < count; i++) {
        // constants used to create data items
        var date = new Date(dt.getFullYear(), i % 12, 25, i % 24, i % 60, i % 60),
            countryId = Math.floor(Math.random() * countries.length),
            productId = Math.floor(Math.random() * products.length),
            colorId = Math.floor(Math.random() * colors.length);

        // create the item
        var item = {
            id: i,
            start: date,
            end: date,
            country: countries[countryId],
            product: products[productId],
            color: colors[colorId],
            amount: Math.random() * 10000 - 5000,
            active: i % 4 === 0,
        };

        // add the item to the list
        data.push(item);
    }
    return data;
}

function getNames() {
    return ['id', 'start', 'end', 'country', 'product', 'color', 'amount', 'active'];
}