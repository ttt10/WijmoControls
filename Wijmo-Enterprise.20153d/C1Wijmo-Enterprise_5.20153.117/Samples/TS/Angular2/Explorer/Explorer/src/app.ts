// Angular
import { Component, View, EventEmitter, provide, Input, Inject, enableProdMode } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { bootstrap } from 'angular2/platform/browser';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, PathLocationStrategy, APP_BASE_HREF,
LocationStrategy, HashLocationStrategy } from 'angular2/router';
// Services
import { MenuSvc } from './services/MenuSvc';
import { DataSvc } from './services/DataSvc';
import { SparkSvc } from './services/SparkSvc';
// Wijmo Input components 
import { wjNg2Input } from '../scripts/wijmo.angular2/wijmo.angular2.all';

// Sample components
// Infrastructure
import { IntroCmp } from './components/infra/IntroCmp';
// Input
import { ComboBoxCmp } from './components/input/ComboBoxCmp';
import { ListBoxCmp } from './components/input/ListBoxCmp';
import { MenuCmp } from './components/input/MenuCmp';
import { AutoCompleteCmp } from './components/input/AutoCompleteCmp';
import { MultiSelectCmp } from './components/input/MultiSelectCmp';
import { DateTimeCmp } from './components/input/DateTimeCmp';
import { NumbersCmp } from './components/input/NumbersCmp';
import { ColorsCmp } from './components/input/ColorsCmp';
import { MaskedInputCmp } from './components/input/MaskedInputCmp';
import { PopupCmp } from './components/input/PopupCmp';
// Grid
import { GridIntroCmp } from './components/grid/GridIntroCmp';
import { GridGroupingCmp } from './components/grid/GridGroupingCmp';
import { GridPagingCmp } from './components/grid/GridPagingCmp';
import { GridTemplatesCmp } from './components/grid/GridTemplatesCmp';
//import { Test1Cmp } from './components/grid/Test1Cmp';
// Chart
import { ChartIntroCmp } from './components/chart/ChartIntroCmp';
import { ChartAxesCmp } from './components/chart/ChartAxesCmp';
// Pie
import { PieChartIntroCmp } from './components/piechart/PieChartIntroCmp';
// Gauge
import { LinearGaugeCmp } from './components/gauge/LinearGaugeCmp';
import { RadialGaugeCmp } from './components/gauge/RadialGaugeCmp';
import { BulletGaugeCmp } from './components/gauge/BulletGaugeCmp';


export module explorer {
    'use strict';

    // The Explorer application root component.
    @Component({
        selector: 'app-cmp',
    })
    @RouteConfig([
            //{ path: '/', redirectTo: ['/infra/intro'] },
            { path: '/', redirectTo: ['InfraIntro'] },
            // Infra
            { path: '/infra/intro', component: IntroCmp, as: 'InfraIntro' },
            // Input
            { path: '/input/listbox', component: ListBoxCmp, as: 'InputListBox' },
            { path: '/input/combo', component: ComboBoxCmp, as: 'InputCombo' },
            { path: '/input/menu', component: MenuCmp, as: 'InputMenu' },
            { path: '/input/autocomplete', component: AutoCompleteCmp, as: 'InputAutoComplete' }, 
            { path: '/input/multiselect', component: MultiSelectCmp, as: 'InputMultiSelect' }, 
            { path: '/input/datetime', component: DateTimeCmp, as: 'InputDateTime' }, 
            { path: '/input/number', component: NumbersCmp, as: 'InputNumber' },
            { path: '/input/color', component: ColorsCmp, as: 'InputColor' },
            { path: '/input/mask', component: MaskedInputCmp, as: 'InputMask' },
            { path: '/input/popup', component: PopupCmp, as: 'InputPopup' },
            // Grid 
            { path: '/grid/intro', component: GridIntroCmp, as: 'GridIntro' }, 
            { path: '/grid/grouping', component: GridGroupingCmp, as: 'GridGrouping' }, 
            { path: '/grid/paging', component: GridPagingCmp, as: 'GridPaging' }, 
            { path: '/grid/templates', component: GridTemplatesCmp, as: 'GridTemplates' }, 
            //{ path: '/grid/test1', component: Test1Cmp, as: 'GridTest1' }, 
            // Chart
            { path: '/chart/intro', component: ChartIntroCmp, as: 'ChartIntro' }, 
            { path: '/chart/axes', component: ChartAxesCmp, as: 'ChartAxes' }, 
            // Pie
            { path: '/piechart/intro', component: PieChartIntroCmp, as: 'PieChartIntro' }, 
            // Gauge
            { path: '/gauge/linear', component: LinearGaugeCmp, as: 'GaugeLinear' }, 
            { path: '/gauge/radial', component: RadialGaugeCmp, as: 'GaugeRadial' }, 
            { path: '/gauge/bullet', component: BulletGaugeCmp, as: 'GaugeBullet' }, 
    ])
    @View({
            templateUrl: 'src/app.html',
            directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES , wjNg2Input.WjMenu, wjNg2Input.WjMenuItem,
                wjNg2Input.WjMenuSeparator],
    })
    export class AppCmp {
        private _activeTheme = '';

        @Input() menuData;
        @Input() navCollapsed = true;

        constructor(@Inject(MenuSvc) menuSvc: MenuSvc) {
            this.menuData = menuSvc.getMenu();
        }

        get activeTheme(): string {
            return this._activeTheme;
        }
        set activeTheme(value: string) {
            if (this._activeTheme != value) {
                this._activeTheme = value;
                let themeLink = <HTMLLinkElement>document.getElementById('activeThemeLink');
                if (themeLink) {
                    themeLink.href = value;
                }
            }
        }
    }
}

enableProdMode();
// Bootstrap application with hash style navigation and global services.
bootstrap(explorer.AppCmp, [
    ROUTER_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    MenuSvc,
    DataSvc,
    SparkSvc
]);