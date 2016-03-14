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
* Wijmo culture file: lv (Latvian)
*/
var wijmo;
(function (wijmo) {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': ' ',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-$n', '$n'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['svētdiena', 'pirmdiena', 'otrdiena', 'trešdiena', 'ceturtdiena', 'piektdiena', 'sestdiena'],
                daysAbbr: ['Sv', 'Pr', 'Ot', 'Tr', 'Ce', 'Pk', 'Se'],
                months: ['Janvāris', 'Februāris', 'Marts', 'Aprīlis', 'Maijs', 'Jūnijs', 'Jūlijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'],
                monthsAbbr: ['Janv.', 'Febr.', 'Marts', 'Apr.', 'Maijs', 'Jūn.', 'Jūl.', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dec.'],
                am: ['priekšpusdienā', 'priekšpusdienā'],
                pm: ['pēcpusdienā', 'pēcpusdienā'],
                eras: ['m.ē.'],
                patterns: {
                    d: 'dd.MM.yyyy', D: 'dddd, yyyy. "gada" d. MMMM',
                    f: 'dddd, yyyy. "gada" d. MMMM HH:mm', F: 'dddd, yyyy. "gada" d. MMMM HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd. MMMM', M: 'd. MMMM',
                    y: 'yyyy. "g". MMMM', Y: 'yyyy. "g". MMMM',
                    g: 'dd.MM.yyyy HH:mm', G: 'dd.MM.yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                }
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} priekšmeti izvēlēts'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} vienumi)'
        },
        FlexGridFilter: {
            // filter
            ascending: '\u2191 Augošā secībā',
            descending: '\u2193 Dilstošā secībā',
            apply: 'Lietot',
            clear: 'Notīrīt',
            conditions: 'Filtrēt pēc stāvokļa',
            values: 'Filtrēt pēc vērtības',
            // value filter
            search: 'Meklēt',
            selectAll: 'Atlasīt visu',
            null: '(nekas)',
            // condition filter
            header: 'Rādīt vienumus, kur vērtība',
            and: 'un',
            or: 'vai',
            stringOperators: [
                { name: '(nav iestatīta)', op: null },
                { name: 'ir vienāda ar', op: 0 },
                { name: 'nav vienāda ar', op: 1 },
                { name: 'sākas ar', op: 6 },
                { name: 'beidzas ar', op: 7 },
                { name: 'satur', op: 8 },
                { name: 'nesatur', op: 9 }
            ],
            numberOperators: [
                { name: '(nav iestatīta)', op: null },
                { name: 'ir vienāda ar', op: 0 },
                { name: 'nav vienāda ar', op: 1 },
                { name: 'ir lielāka nekā', op: 2 },
                { name: 'ir lielāka nekā vai vienāda ar', op: 3 },
                { name: 'ir mazāka nekā', op: 4 },
                { name: 'ir mazāka nekā vai vienāda ar', op: 5 }
            ],
            dateOperators: [
                { name: '(nav iestatīta)', op: null },
                { name: 'ir vienāda ar', op: 0 },
                { name: 'ir pirms', op: 4 },
                { name: 'ir pēc', op: 3 }
            ],
            booleanOperators: [
                { name: '(nav iestatīta)', op: null },
                { name: 'ir vienāda ar', op: 0 },
                { name: 'nav vienāda ar', op: 1 }
            ]
        }
    };
})(wijmo || (wijmo = {}));
;
//# sourceMappingURL=wijmo.culture.lv.js.map

