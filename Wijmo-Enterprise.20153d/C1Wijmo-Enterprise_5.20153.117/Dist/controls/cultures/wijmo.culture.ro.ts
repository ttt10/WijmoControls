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
 * Wijmo culture file: ro (Romanian)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': '.',
                percent: { pattern: ['-n %', 'n %'] },
                currency: { decimals: 2, symbol: 'RON', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
                daysAbbr: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],
                months: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
                monthsAbbr: ['ian.', 'feb.', 'mar.', 'apr.', 'mai', 'iun.', 'iul.', 'aug.', 'sept.', 'oct.', 'nov.', 'dec.'],
                am: ['a.m.', 'a'],
                pm: ['p.m.', 'p'],
                eras: ['d.Hr.'],
                patterns: {
                    d: 'dd.MM.yyyy', D: 'dddd, d MMMM yyyy',
                    f: 'dddd, d MMMM yyyy HH:mm', F: 'dddd, d MMMM yyyy HH:mm:ss',
                    t: 'HH:mm', T: 'HH:mm:ss',
                    m: 'd MMMM', M: 'd MMMM', 
                    y: 'MMMM yyyy', Y: 'MMMM yyyy', 
                    g: 'dd.MM.yyyy HH:mm', G: 'dd.MM.yyyy HH:mm:ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
                
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} articole selectat'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} articole)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Crescător',
            descending: '\u2193 Descrescător',
            apply: 'Aplicare',
            clear: 'Golire',
            conditions: 'Filtrare după stare',
            values: 'Filtrare după valoare',

            // value filter
            search: 'Căutare',
            selectAll: 'Selectare totală',
            null: '(nimic)',

            // condition filter
            header: 'Indică articolele unde valoarea',
            and: 'Și',
            or: 'Sau',
            stringOperators: [
                { name: '(nu este setat)', op: null },
                { name: 'Este egal cu', op: 0 },
                { name: 'Nu este egal cu', op: 1 },
                { name: 'Începe cu', op: 6 },
                { name: 'Se încheie cu', op: 7 },
                { name: 'Conține', op: 8 },
                { name: 'Nu conține', op: 9 }
            ],
            numberOperators: [
                { name: '(nu este setat)', op: null },
                { name: 'Este egal cu', op: 0 },
                { name: 'Nu este egal cu', op: 1 },
                { name: 'Este mai mare decât', op: 2 },
                { name: 'Este mai mare decât sau egală cu', op: 3 },
                { name: 'Este mai mică decât', op: 4 },
                { name: 'Este mai mică decât sau egală cu', op: 5 }
            ],
            dateOperators: [
                { name: '(nu este setat)', op: null },
                { name: 'Este egal cu', op: 0 },
                { name: 'Este înainte de', op: 4 },
                { name: 'Este după', op: 3 }
            ],
            booleanOperators: [
                { name: '(nu este setat)', op: null },
                { name: 'Este egal cu', op: 0 },
                { name: 'Nu este egal cu', op: 1 }
            ]
        }
    };
};
