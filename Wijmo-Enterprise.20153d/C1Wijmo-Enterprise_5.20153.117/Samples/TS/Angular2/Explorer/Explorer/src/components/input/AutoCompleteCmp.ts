'use strict';

import { Component, View, EventEmitter, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { InputBaseCmp } from './InputBaseCmp';
import { DataSvc } from '../../services/DataSvc';
import { wjNg2Input } from '../../../scripts/wijmo.angular2/wijmo.angular2.all';

// AutoComplete sample component.
@Component({
    selector: 'auto-complete-cmp'
})
@View({
        templateUrl: 'src/components/input/autoCompleteCmp.html',
        directives: [wjNg2Input.WjAutoComplete, CORE_DIRECTIVES]
})
export class AutoCompleteCmp extends InputBaseCmp {

    constructor( @Inject(DataSvc) dataSvc: DataSvc) {
        super(dataSvc);

        // start service so there's no delay when the user starts typing
        var params = { query: 'start', max: 0 };
        $.getJSON('companycatalog.ashx', params);
    }

    // function to retrieve companies using web service
    private _cache = {};
    getCompanies = this.getCompaniesFunc.bind(this);
    getCompaniesFunc(query, max, callback) {

        // try getting the result from the cache
        var self = this,
            result = self._cache[query];
        if (result) {
            callback(result);
            return;
        }

        // not in cache, get from server
        var params = { query: query, max: max };
        $.getJSON('companycatalog.ashx', params, function (response) {

            // add 'SymbolName' property to result
            let items = [];
            for (var i = 0; i < response.length; i++) {
                var c = response[i];
                c.SymbolName = c.Symbol + ': ' + c.Name;
            }

            // store result in cache
            self._cache[query] = response;

            // and return the result
            callback(response);
        })
            .fail(function (error) {
            console.log('error: ' + error.responseText);
            self._cache[query] = null; // << no point in trying this query again
            callback(null);
        });
    }

}


