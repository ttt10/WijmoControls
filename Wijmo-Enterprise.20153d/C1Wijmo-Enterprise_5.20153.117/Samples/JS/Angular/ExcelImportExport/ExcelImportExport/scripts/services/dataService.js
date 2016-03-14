﻿'use strict';

var app = angular.module('app');

// defines functions that can be called from controllers and directives
app.factory('dataService', function () {

	// data used to generate random items
	var countries = ['US', 'Germany', 'UK', 'Japan', 'Italy', 'Greece'];//, 'France', 'Austria', 'Canada', 'Denmark' ];
	var products = ['Widget', 'Gadget', 'Doohickey'];
	var colors = ['Black', 'White', 'Red', 'Green', 'Blue'];//, 'Yellow', 'Orange', 'Brown'];

	var serviceFunctions = {

		// get possible values for each field
		getCountries: function () {
			return countries;
		},
		getProducts: function () {
			return products;
		},
		getColors: function () {
			return colors;
		},

		// get matches for a search term
		getProductOrders: function (count, unique) {
			var data = [];
			var dt = new Date();

			// if unique items, limit to number of countries
			if (unique == true) {
				count = countries.length;
			}

			// add count items
			for (var i = 0; i < count; i++) {

				// constants used to create data items
				var date = new Date(dt.getFullYear(), i % 12, 25, i % 24, i % 60, i % 60),
					countryId = unique == true ? i : Math.floor(Math.random() * countries.length),
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
					amount2: Math.random() * 10000 - 5000,
					discount: Math.random() / 4,
					active: i % 4 == 0,
				};

				// add an array (should not auto-bind)
				item.sales = [];
				for (var j = 0; j < 12; j++) {
					item.sales.push(50 + 20 * (Math.random() - .5) + j);
				}

				// add an object (should not auto-bind)
				item.someObject = {
					name: i,
					value: i
				};

				// add lots of columns to test virtualization
				if (false) {
					for (var j = 0; j < 400; j++) {
						item['x' + j] = j;
					}
				}

				// add the item to the list
				data.push(item);
			}
			return data;
		},

	    getExpenseItems: function() {
	        // [5; 10]
	        var count = 5 + Math.round(Math.random() * 5),
                ret = [],
                msPerDay = 1000 * 24 * 60 * 60,
                curDate = Date.now() - 60 * msPerDay;
	        for (var i = 0; i < count; i++) {
	            ret.push(
                    {
                        Date: new Date(curDate),
                        Decsription: 'Customer visit',
                        Hotel: 30 + Math.random() * 200,
                        Transport: 10 + Math.random() * 150,
                        Fuel: Math.random() * 50,
                        Meal: 30 + Math.random() * 170,
                        ParkingRate: 3.75,
                        ParkingHours: 8 + Math.round(Math.random() * 16),
                        Misc: Math.random() * 220

                    });

	            curDate += msPerDay * Math.round(Math.random() * 4);
	        }

	        return ret;
	    },

	    getEmployeesWithExpences: function() {
	        return [
                {
                    Id: 'E892659',
                    Name: 'Robert King',
                    Department: 'Sales',
                    Position: 'Sales Representative',
                    SSN: 'A37830',
                    Manager: 'Andrew Fuller',
                    Purpose: 'On business',
                    Attachment: true,
                    Advance: 1000,
                    Expenses: serviceFunctions.getExpenseItems()
                },
                {
                    Id: 'E3667093',
                    Name: 'John Taylor',
                    Department: 'Sales',
                    Position: 'Sales Representative',
                    SSN: 'A83745',
                    Manager: 'Andrew Fuller',
                    Purpose: 'On business',
                    Attachment: false,
                    Advance: 800,
                    Expenses: serviceFunctions.getExpenseItems()
                },
                {
                    Id: 'E294989',
                    Name: 'Gregory Allen',
                    Department: 'Sales',
                    Position: 'Sales Representative',
                    SSN: 'A23927',
                    Manager: 'Andrew Fuller',
                    Purpose: 'On business',
                    Attachment: true,
                    Advance: 1200,
                    Expenses: serviceFunctions.getExpenseItems()
                },
	        ];
	    }

	}

	return serviceFunctions;
});