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
 * Wijmo culture file: et (Estonian)
 */
module wijmo {
    wijmo.culture = {
        Globalize: {
            numberFormat: {
                '.': ',',
                ',': ' ',
                percent: { pattern: ['-n%', 'n%'] },
                currency: { decimals: 2, symbol: '€', pattern: ['-n $', 'n $'] }
            },
            calendar: {
                '/': '.',
                ':': ':',
                firstDay: 1,
                days: ['pühapäev', 'esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev'],
                daysAbbr: ['P', 'E', 'T', 'K', 'N', 'R', 'L'],
                months: ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
                monthsAbbr: ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets'],
                am: ['e.k.', 'e'],
                pm: ['p.k.', 'p'],
                eras: ['m.a.j.'],
                patterns: {
                    d: 'dd.MM.yyyy', D: 'dddd, d. MMMM yyyy',
                    f: 'dddd, d. MMMM yyyy H:mm', F: 'dddd, d. MMMM yyyy H:mm.ss',
                    t: 'H:mm', T: 'H:mm.ss',
                    m: 'd. MMMM', M: 'd. MMMM', 
                    y: 'MMMM yyyy', Y: 'MMMM yyyy', 
                    g: 'dd.MM.yyyy H:mm', G: 'dd.MM.yyyy H:mm.ss',
                    s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss'
                },
                
            }
        },
        MultiSelect: {
            itemsSelected: '{count:n0} kirjed valitud'
        },
        FlexGrid: {
            groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} üksust)'
        },
        FlexGridFilter: {

            // filter
            ascending: '\u2191 Kasvav',
            descending: '\u2193 Kahanev',
            apply: 'Rakenda',
            clear: 'Tühjenda',
            conditions: 'Filtreeri tingimuse alusel',
            values: 'Filtreeri väärtuse alusel',

            // value filter
            search: 'Otsi',
            selectAll: 'Vali kõik',
            null: '(mitte midagi)',

            // condition filter
            header: 'Kuva üksused, mille puhul väärtus',
            and: 'Ja',
            or: 'Või',
            stringOperators: [
                { name: '(määramata)', op: null },
                { name: 'Võrdub', op: 0 },
                { name: 'Ei võrdu', op: 1 },
                { name: 'Algab väärtusega', op: 6 },
                { name: 'Lõpeb väärtusega', op: 7 },
                { name: 'Sisaldab', op: 8 },
                { name: 'Ei sisalda', op: 9 }
            ],
            numberOperators: [
                { name: '(määramata)', op: null },
                { name: 'Võrdub', op: 0 },
                { name: 'Ei võrdu', op: 1 },
                { name: 'On suurem kui', op: 2 },
                { name: 'On suurem kui või võrdub', op: 3 },
                { name: 'On väiksem kui', op: 4 },
                { name: 'On väiksem kui või võrdub', op: 5 }
            ],
            dateOperators: [
                { name: '(määramata)', op: null },
                { name: 'Võrdub', op: 0 },
                { name: 'On enne väärtust', op: 4 },
                { name: 'On pärast väärtust', op: 3 }
            ],
            booleanOperators: [
                { name: '(määramata)', op: null },
                { name: 'Võrdub', op: 0 },
                { name: 'Ei võrdu', op: 1 }
            ]
        }
    };
};
