angular.module('app').controller('basicController', function ($scope, dataService) {
	'use strict';

	$scope.ctx = {
		groupedGrid: null,
		mergedGrid: null,
		treeViewGrid: null,
		data: dataService.getData(25),
		data2: dataService.getData(25),
		treeData: [
			{ name: 'Adriane Simione', items: [
				{ name: 'Intelligible Sky', items: [
					{ name: 'Theories', length: '2:02' },
					{ name: 'Giant Eyes', length: '3:29' },
					{ name: 'Jovian Moons', length: '1:02' },
					{ name: 'Open Minds', length: '2:41' },
					{ name: 'Spacetronic Eyes', length: '3:41' }
				]}
			]},
			{ name: 'Amy Winehouse', items: [
				{ name: 'Back to Black', items: [
					{ name: 'Addicted', length: '1:34' },
					{ name: 'He Can Only Hold Her', length: '2:22' },
					{ name: 'Some Unholy War', length: '2:21' },
					{ name: 'Wake Up Alone', length: '3:43' },
					{ name: 'Tears Dry On Their Own', length: '1:25' }
				]},
				{ name: 'Live in Paradiso', items: [
					{ name: "You Know That I'm No Good", length: '2:32' },
					{ name: 'Wake Up Alone', length: '1:04' },
					{ name: 'Valerie', length: '1:22' },
					{ name: 'Tears Dry On Their Own', length: '3:15' },
					{ name: 'Rehab', length: '3:40' }
				]}
			]},
			{ name: 'Black Sabbath', items: [
				{ name: 'Heaven and Hell', items: [
					{ name: 'Neon Knights', length: '3:03' },
					{ name: 'Children of the Sea', length: '2:54' },
					{ name: 'Lady Evil', length: '1:43' },
					{ name: 'Heaven and Hell', length: '2:23' },
					{ name: 'Wishing Well', length: '3:22' },
					{ name: 'Die Young', length: '2:21' }
				]},
				{ name: 'Never Say Die!', items: [
					{ name: 'Swinging The Chain', length: '4:32' },
					{ name: 'Breakout', length: '3:54' },
					{ name: 'Over To You', length: '2:43' },
					{ name: 'Air Dance', length: '1:34' },
					{ name: 'Johnny Blade', length: '1:02' },
					{ name: 'Never Say Die', length: '2:11' }
				]},
				{ name: 'Paranoid', items: [
					{ name: 'Rat Salad', length: '3:44' },
					{ name: 'Hand Of Doom', length: '4:21' },
					{ name: 'Electric Funeral', length: '2:12' },
					{ name: 'Iron Man', length: '3:22' },
					{ name: 'War Pigs', length: '3:13' }
				]}
			]},
			{ name: 'Brand X', items: [
				{ name: 'Unorthodox Behaviour', items: [
					{ name: 'Touch Wood', length: '2:54' },
					{ name: 'Running of Three', length: '1:34' },
					{ name: 'Unorthodox Behaviour', length: '2:23' },
					{ name: 'Smacks of Euphoric Hysteria', length: '3:12' },
					{ name: 'Euthanasia Waltz', length: '2:22' },
					{ name: 'Nuclear Burn', length: '4:01' }
				]}
			]}
		],
		exportMode: wijmo.grid.ExportMode.All,
		orientation: wijmo.pdf.PdfPageOrientation.Portrait,
		scaleMode: wijmo.grid.ScaleMode.ActualSize
	};

	// export 
	$scope.exportGroupedGrid = function () {
		wijmo.grid.FlexGridPdfConverter.export($scope.ctx.groupedGrid, 'FlexGrid.pdf', {
			maxPages: 10,
			exportMode: $scope.ctx.exportMode,
			scaleMode: $scope.ctx.scaleMode,
			documentOptions: {
				pageSettings: {
					layout: $scope.ctx.orientation
				},
				header: {
					text: '&[Page]\\&[Pages]\theader\t&[Page]\\&[Pages]'
				},
				footer: {
					text: '&[Page]\\&[Pages]\tfooter\t&[Page]\\&[Pages]'
				},
				documentInfo: {
					author: 'C1',
					title: 'PdfDocument sample',
					keywords: 'PDF, C1, sample',
					subject: 'PdfDocument'
				}
			},
			styles: {
				cellStyle: {
					backgroundColor: '#ffffff',
					borderColor: '#c6c6c6'
				},
				altCellStyle: {
					backgroundColor: '#f9f9f9'
				},
				groupCellStyle: {
					backgroundColor: '#dddddd'
				},
				headerCellStyle: {
					backgroundColor: '#eaeaea'
				}
			}
		});
	};

	$scope.exportMergedGrid = function () {
		wijmo.grid.FlexGridPdfConverter.export($scope.ctx.mergedGrid, 'FlexGrid.pdf', {
			maxPages: 10,
			exportMode: $scope.ctx.exportMode,
			scaleMode: $scope.ctx.scaleMode,
			documentOptions: {
				pageSettings: {
					layout: $scope.ctx.orientation
				},
				header: {
					text: '&[Page]\\&[Pages]\theader\t&[Page]\\&[Pages]'
				},
				footer: {
					text: '&[Page]\\&[Pages]\tfooter\t&[Page]\\&[Pages]'
				},
				documentInfo: {
					author: 'C1',
					title: 'PdfDocument sample',
					keywords: 'PDF, C1, sample',
					subject: 'PdfDocument'
				}
			},
			styles: {
				cellStyle: {
					backgroundColor: '#ffffff',
					borderColor: '#c6c6c6'
				},
				altCellStyle: {
					backgroundColor: '#f9f9f9'
				},
				groupCellStyle: {
					backgroundColor: '#dddddd'
				},
				headerCellStyle: {
					backgroundColor: '#eaeaea'
				}
			}
		});
	};

	$scope.exportTreeViewGrid = function () {
		wijmo.grid.FlexGridPdfConverter.export($scope.ctx.treeViewGrid, 'FlexGrid.pdf', {
			maxPages: 10,
			exportMode: $scope.ctx.exportMode,
			scaleMode: $scope.ctx.scaleMode,
			embeddedFonts: [{
				source: 'resources/fonts/fira/FiraSans-Regular.ttf',
				name: 'fira',
				style: 'normal',
				weight: 'normal',
				sansSerif: true
			}, {
				source: 'resources/fonts/fira/FiraSans-Bold.ttf',
				name: 'fira',
				style: 'normal',
				weight: 'bold',
				sansSerif: true
			}],
			documentOptions: {
				pageSettings: {
					layout: $scope.ctx.orientation
				},
				header: {
					text: '&[Page]\\&[Pages]\theader\t&[Page]\\&[Pages]'
				},
				footer: {
					text: '&[Page]\\&[Pages]\tfooter\t&[Page]\\&[Pages]'
				},
				documentInfo: {
					author: 'C1',
					title: 'PdfDocument sample',
					keywords: 'PDF, C1, sample',
					subject: 'PdfDocument'
				}
			},
			styles: {
				cellStyle: {
					backgroundColor: '#ffffff',
					borderColor: '#c6c6c6',
					font: {
						family: 'fira'
					}
				},
				altCellStyle: {
					backgroundColor: '#f9f9f9'
				},
				groupCellStyle: {
					backgroundColor: '#dddddd'
				},
				headerCellStyle: {
					backgroundColor: '#eaeaea'
				}
			}
		});
	};

	// update group setting
	$scope.$watch('ctx.groupedGrid', function () {
		updateGroup();
	});

	// connect to flex when it becomes available
	$scope.$watch('ctx.mergedGrid', function () {
		// update data maps, formatting, and headers when the grid is populated
		update();
	});

	$scope.onMergedGridSourceChanged = function (sender, args) {
		// update data maps, formatting, and headers when the grid is populated
		update();
	}

	// update group setting for the flex grid
	function updateGroup() {
		var flex = $scope.ctx.groupedGrid,
			groupNames = ['Product', 'Country', 'Amount'],
			cv,
			propName,
			groupDesc;

		if (flex) {
			// get the collection view, start update
			cv = flex.collectionView;
			cv.beginUpdate();

			// clear existing groups
			cv.groupDescriptions.clear();

			// add new groups
			for (var i = 0; i < groupNames.length; i++) {
				propName = groupNames[i].toLowerCase();
				if (propName == 'amount') {

					// group amounts in ranges
					// (could use the mapping function to group countries into continents, 
					// names into initials, etc)
					groupDesc = new wijmo.collections.PropertyGroupDescription(propName, function (item, prop) {
						var value = item[prop];
						if (value > 1000) return 'Large Amounts';
						if (value > 100) return 'Medium Amounts';
						if (value > 0) return 'Small Amounts';
						return 'Negative';
					});
					cv.groupDescriptions.push(groupDesc);
				} else if (propName) {

					// group other properties by their specific values
					groupDesc = new wijmo.collections.PropertyGroupDescription(propName);
					cv.groupDescriptions.push(groupDesc);
				}
			}

			// done updating
			cv.endUpdate();
		}
	}

	function update() {
		if ($scope.ctx.mergedGrid) {
			updateDataMaps();
			updateFormatting();
			updateHeaders();
		}
	}

	// apply data maps
	function updateDataMaps() {
		var flex = $scope.ctx.flex;
		if (flex) {
			var colCountry = flex.columns.getColumn('countryId');
			var colProduct = flex.columns.getColumn('productId');
			var colColor = flex.columns.getColumn('colorId');
			if (colCountry && colProduct && colColor) {
				colCountry.dataMap = new wijmo.grid.DataMap(dataSvc.getCountries());
				colProduct.dataMap = new wijmo.grid.DataMap(dataSvc.getProducts());
				colColor.dataMap = new wijmo.grid.DataMap(dataSvc.getColors());
				colCountry.align = 'left';
				colProduct.align = 'left';
				colColor.align = 'left';
			}
		}
	}

	// apply/remove column formatting
	function updateFormatting() {
		var flex = $scope.ctx.mergedGrid;
		if (flex) {
			var fmt = $scope.ctx.formatting;
			setColumnFormat('amount', fmt ? 'c' : null);
			setColumnFormat('discount', fmt ? 'p0' : null);
			setColumnFormat('start', fmt ? 'MMM d yy' : null);
			setColumnFormat('end', fmt ? 'HH:mm' : null);
		}
	}
	function setColumnFormat(name, format) {
		var col = $scope.ctx.mergedGrid.columns.getColumn(name);
		if (col) {
			col.format = format;
		}
	}

	// add some column headers to show merging
	function updateHeaders() {
		var flex = $scope.ctx.mergedGrid;
		if (flex) {

			// insert new row if not yet
			if (flex.columnHeaders.rows.length === 1) {
				flex.columnHeaders.rows.insert(0, new wijmo.grid.Row());
			}
			var row = flex.columnHeaders.rows[0];
			row.allowMerging = true;

			// set headings so the cells merge
			for (var i = 0; i < flex.columns.length; i++) {
				var hdr = 'String';
				switch (flex.columns[i].binding) {
					case 'id':
					case 'amount':
					case 'discount':
						hdr = 'Number';
						break;
					case 'active':
						hdr = 'Boolean';
						break;
				}
				flex.columnHeaders.setCellData(0, i, hdr);
			}
		}
	}
});