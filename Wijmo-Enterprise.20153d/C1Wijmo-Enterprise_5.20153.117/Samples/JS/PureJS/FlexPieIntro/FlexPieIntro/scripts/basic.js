﻿(function (wijmo, app) {
    'use strict';

    // create controls
    var chart = new wijmo.chart.FlexPie('#basicChart'),
        innerRadius = new wijmo.input.InputNumber('#basicInnerRadius'),
        offset = new wijmo.input.InputNumber('#basicOffset'),
        startAngle = new wijmo.input.InputNumber('#basicStartAngle'),
        palettes = new wijmo.input.Menu('#basicPalette'),
        reversed = document.getElementById('basicReversed');

    // initialize FlexPie's properties
    chart.beginUpdate();
    chart.binding = 'value';
    chart.bindingName = 'name';
    chart.itemsSource = app.getData();
    chart.endUpdate();

    // innerRadius - initialize InputNumber's properties
    innerRadius.min = 0;
    innerRadius.max = 1;
    innerRadius.step = 0.1;
    innerRadius.format = 'n';
    innerRadius.valueChanged.addHandler(function (sender) {
        chart.innerRadius = sender.value;
    });

    // offset - initialize InputNumber's properties
    offset.min = 0;
    offset.max = 1;
    offset.step = 0.1;
    offset.format = 'n';
    offset.valueChanged.addHandler(function (sender) {
        chart.offset = sender.value;
    });

    // startAngle - initialize InputNumber's properties
    startAngle.min = -360;
    startAngle.max = 360;
    startAngle.step = 45;
    startAngle.valueChanged.addHandler(function (sender) {
        chart.startAngle = sender.value;
    });

    // palettes - initialize Menu's properties
    palettes.itemsSource = app.palettes;
    palettes.selectedValue = 'standard';
    palettes.textChanged.addHandler(function (sender) {
        if (!sender.selectedValue) return;

        chart.palette = wijmo.chart.Palettes[app.palettes[sender.selectedIndex]];
        app.updateMenuHeader(sender, '<b>Palette</b>: ', sender.text);
    });
    app.updateMenuHeader(palettes, '<b>Palette</b>: ', palettes.text);

    // change event for reversed checkbox
    reversed.addEventListener('change', function() {
        chart.reversed = this.checked;
    });

})(wijmo, app);