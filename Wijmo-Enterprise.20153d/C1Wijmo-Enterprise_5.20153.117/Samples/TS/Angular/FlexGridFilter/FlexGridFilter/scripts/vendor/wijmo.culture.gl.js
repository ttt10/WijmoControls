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
/*
* Wijmo culture file: gl (Galician)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-$n', '$n'] }
            },
            calendar: {
                '/': '/',
                ':': ':',
                firstDay: 1,
                days: ['domingo', 'luns', 'martes', 'mércores', 'xoves', 'venres', 'sábado'],
                daysAbbr: ['dom', 'lun', 'mar', 'mér', 'xov', 'ven', 'sáb'],
                months: ['Xaneiro', 'Febreiro', 'Marzo', 'Abril', 'Maio', 'Xuño', 'Xullo', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Decembro'],
                monthsAbbr: ['Xan', 'Feb', 'Mar', 'Abr', 'Mai', 'Xuñ', 'Xul', 'Ago', 'Set', 'Out', 'Nov', 'Dec'],
                am: ['a.m.', 'a'],
                pm: ['p.m.', 'p'],
                eras: ['d.C.'],
                patterns: {
                    d: 'dd/MM/yyyy', D: 'dddd dd MMMM yyyy',
                    f: 'dddd dd MMMM yyyy HH:mm', F: 'dddd dd MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd MMMM', M: 'd MMMM',
                    y: 'MMMM yyyy', Y: 'MMMM yyyy',
                    g: 'dd/MM/yyyy HH:mm', G: 'dd/MM/yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} elementos seleccionados'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} elementos)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Ascendente',
            descending: '\u2193 Descendente',
            apply: 'Aplicar',
            clear: 'Borrar',
            conditions: 'Filtrar por condición',
            values: 'Filtrar por valor',
            // value filter
            search: 'Buscar',
            selectAll: 'Seleccionar todo',
            null: '(nada)',
            // condition filter
            header: 'Mostrar elementos onde o valor',
            and: 'E',
            or: 'Ou',
            stringOperators: [
                { name: '(non establecido)', op: null },
                { name: 'Igual a', op: 0 },
                { name: 'Non igual a', op: 1 },
                { name: 'Comeza por', op: 6 },
                { name: 'Finaliza con', op: 7 },
                { name: 'Contén', op: 8 },
                { name: 'Non contén', op: 9 }
            ],
            numberOperators: [
                { name: '(non establecido)', op: null },
                { name: 'Igual a', op: 0 },
                { name: 'Non igual a', op: 1 },
                { name: 'É maior que', op: 2 },
                { name: 'É maior que ou igual a', op: 3 },
                { name: 'É menor que', op: 4 },
                { name: 'É menor que ou igual a', op: 5 }
            ],
            dateOperators: [
                { name: '(non establecido)', op: null },
                { name: 'Igual a', op: 0 },
                { name: 'É anterior a', op: 4 },
                { name: 'É posterior a', op: 3 }
            ],
            booleanOperators: [
                { name: '(non establecido)', op: null },
                { name: 'Igual a', op: 0 },
                { name: 'Non igual a', op: 1 }
            ]
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.gl.js.map

