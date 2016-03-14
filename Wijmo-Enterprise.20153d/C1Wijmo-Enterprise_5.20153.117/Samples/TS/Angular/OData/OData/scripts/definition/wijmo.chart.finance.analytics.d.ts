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
/**
* Analytics extensions for @see:FinancialChart.
*/
declare module wijmo.chart.finance.analytics {
    /**
    * Represents a Fibonacci Retracements tool for the @see:FinancialChart.
    
    * The tool enables the calculation and plotting of various alert levels that are
    * useful in financial charts.
    *
    * To add Fibonacci tool to a @see:FinancialChart control, create an instance
    * of the @see:Fibonacci and add it to the <b>series</b> collection of the chart.
    * For example:
    *
    * <pre>
    * // create chart
    * var chart = new wijmo.chart.finance.FinancialChart('#chartElement');
    * // create Fibonacci tool
    * var ftool = new wijmo.chart.finance.analytics.Fibonacci();
    * chart.series.push(ftool);
    * </pre>
    */
    class Fibonacci extends SeriesBase {
        private _high;
        private _low;
        private _minX;
        private _maxX;
        private _actualHigh;
        private _actualLow;
        private _levels;
        private _uptrend;
        private _labelPosition;
        /**
        * Initializes a new instance of a @see:Fibonacci object.
        *
        * @param options A JavaScript object containing initialization data.
        */
        constructor(options?: any);
        /**
        * Gets or sets the low value of @see:Fibonacci tool.
        *
        * If not specified, the low value is calculated based on data values provided by <b>itemsSource</b>.
        */
        public low : number;
        /**
        * Gets or sets the high value of @see:Fibonacci tool.
        *
        * If not specified, the high value is caclulated based on
        * data values provided by the <b>itemsSource</b>.
        */
        public high : number;
        /**
        * Gets or sets the label position for levels in @see:Fibonacci tool.
        */
        public labelPosition : LabelPosition;
        /**
        * Gets or sets a value indicating whether to create uptrending @see:Fibonacci tool.
        *
        * Default value is true(uptrend). If the value is false, the downtrending levels are plotted.
        */
        public uptrend : boolean;
        /**
        * Gets or sets the array of levels for plotting.
        *
        * Default value is [0, 23.6, 38.2, 50, 61.8, 100].
        */
        public levels : number[];
        /**
        * Gets or sets the x minimal value of the @see:Fibonacci tool.
        *
        * If not specified, current minimum of x-axis is used.
        * The value can be specified as a number or Date object.
        */
        public minX : any;
        /**
        * Gets or sets the x maximum value of the @see:Fibonacci tool.
        *
        * If not specified, current maximum of x-axis is used.
        * The value can be specified as a number or Date object.
        */
        public maxX : any;
        private _getMinX();
        private _getMaxX();
        private _updateLevels();
        private _render(sender, args);
        public _getChartType(): ChartType;
    }
    /**
    * Represents a Fibonacci Arcs tool for the @see:FinancialChart.
    */
    class FibonacciArcs extends SeriesBase {
        private _start;
        private _end;
        private _levels;
        private _labelPosition;
        /**
        * Initializes a new instance of a @see:FibonacciArcs object.
        *
        * @param options A JavaScript object containing initialization data.
        */
        constructor(options?: any);
        /**
        * Gets or sets the starting @see:DataPoint for the base line.
        *
        * The @see:DataPoint x value can be a number or a Date object
        * (for time-based data).
        *
        * Unlike some of the other Fibonacci tools, the starting
        * @see:DataPoint is <b>not</b> calculated automatically if
        * undefined.
        */
        public start : DataPoint;
        /**
        * Gets or sets the ending @see:DataPoint for the base line.
        *
        * The @see:DataPoint x value can be a number or a Date object
        * (for time-based data).
        *
        * Unlike some of the other Fibonacci tools, the ending
        * @see:DataPoint is <b>not</b> calculated automatically if
        * undefined.
        */
        public end : DataPoint;
        /**
        * Gets or sets the array of levels for plotting.
        *
        * Default value is [38.2, 50, 61.8].
        */
        public levels : number[];
        /**
        * Gets or sets the @see:LabelPosition for levels in @see:FibonacciArcs tool.
        */
        public labelPosition : LabelPosition;
        public _render(sender: SeriesBase, args: RenderEventArgs): void;
        private _getX(dim);
        private _getY(dim);
        public _getChartType(): ChartType;
    }
    /**
    * Represents a Fibonacci Fans tool for the @see:FinancialChart.
    */
    class FibonacciFans extends SeriesBase {
        private _start;
        private _end;
        private _levels;
        private _labelPosition;
        /**
        * Initializes a new instance of a @see:FibonacciFans object.
        *
        * @param options A JavaScript object containing initialization data.
        */
        constructor(options?: any);
        /**
        * Gets or sets the starting @see:DataPoint for the base line.
        *
        * If not set, the starting @see:DataPoint is calculated automatically.
        * The @see:DataPoint x value can be a number or a Date object (for
        * time-based data).
        */
        public start : DataPoint;
        /**
        * Gets or sets the ending @see:DataPoint for the base line.
        *
        * If not set, the starting @see:DataPoint is calculated automatically.
        * The @see:DataPoint x value can be a number or a Date object (for
        * time-based data).
        */
        public end : DataPoint;
        /**
        * Gets or sets the array of levels for plotting.
        *
        * Default value is [0, 23.6, 38.2, 50, 61.8, 100].
        */
        public levels : number[];
        /**
        * Gets or sets the @see:LabelPosition for levels in @see:FibonacciFans tool.
        */
        public labelPosition : LabelPosition;
        public _updateLevels(): void;
        public _render(sender: SeriesBase, args: RenderEventArgs): void;
        private _getX(dim);
        private _getY(dim);
        public _getChartType(): ChartType;
    }
    /**
    * Represents a Fibonacci Time Zones tool for the @see:FinancialChart.
    */
    class FibonacciTimeZones extends SeriesBase {
        private _startX;
        private _endX;
        private _levels;
        private _labelPosition;
        /**
        * Initializes a new instance of a @see:FibonacciTimeZones object.
        *
        * @param options A JavaScript object containing initialization data.
        */
        constructor(options?: any);
        /**
        * Gets or sets the starting X data point for the time zones.
        *
        * If not set, the starting X data point is calculated automatically. The
        * value can be a number or a Date object (for time-based data).
        */
        public startX : any;
        /**
        * Gets or sets the ending X data point for the time zones.
        *
        * If not set, the ending X data point is calculated automatically. The
        * value can be a number or a Date object (for time-based data).
        */
        public endX : any;
        /**
        * Gets or sets the array of levels for plotting.
        *
        * Default value is [0, 1, 2, 3, 5, 8, 13, 21, 34].
        */
        public levels : number[];
        /**
        * Gets or sets the @see:LabelPosition for levels in @see:FibonacciTimeZones tool.
        */
        public labelPosition : LabelPosition;
        public _render(sender: SeriesBase, args: RenderEventArgs): void;
        public _updateLevels(): void;
        private _getX(dim);
        public _getChartType(): ChartType;
    }
}

declare module wijmo.chart.finance.analytics {
    /**
    * Base class for overlay and indicator series (abstract).
    */
    class OverlayIndicatorBase extends SeriesBase {
        private __plotter;
        private __hitTester;
        public _styles: any;
        public _seriesCount: number;
        constructor();
        public _plotter : _IPlotter;
        public _hitTester : _HitTester;
        public _getChartType(): ChartType;
        public _getXValues(): number[];
        public _getDataPoint(dataX: number, dataY: number, seriesIndex: number, pointIndex: number, ax: Axis, ay: Axis): _DataPoint;
        public _shouldCalculate(): boolean;
        public _init(): void;
        public _calculate(): void;
        public _clearValues(): void;
        public _getName(dim: number): string;
        public _getStyles(dim: number): any;
        public legendItemLength(): number;
        public measureLegendItem(engine: IRenderEngine, index: number): Size;
        public drawLegendItem(engine: IRenderEngine, rect: Rect, index: number): void;
    }
    /**
    * Base class for overlay and indicator series that render a single series (abstract).
    */
    class SingleOverlayIndicatorBase extends OverlayIndicatorBase {
        private _period;
        public _xvals: number[];
        public _yvals: number[];
        constructor();
        /**
        * Gets or sets the period for the calculation as an integer value.
        */
        public period : any;
        public getValues(dim: number): number[];
        public getDataRect(): Rect;
        public _clearValues(): void;
        public _shouldCalculate(): boolean;
        public _init(): void;
        public _getItem(pointIndex: number): any;
    }
}

declare module wijmo.chart.finance.analytics {
    /**
    * Represents an Average True Range indicator series for the @see:FinancialChart.
    *
    * Average true range is used to measure the volatility of an asset. Average true range
    * does not provide any indication of the price's trend, but rather the degree of price
    * volatility.
    */
    class ATR extends SingleOverlayIndicatorBase {
        constructor();
        public _calculate(): void;
    }
}

declare module wijmo.chart.finance.analytics {
    /**
    * Represents a Commodity Channel Index indicator series for the @see:FinancialChart.
    *
    * The commodity channel index is an oscillator that measures an asset's current price
    * level relative to an average price level over a specified period of time.
    */
    class CCI extends SingleOverlayIndicatorBase {
        private _constant;
        constructor();
        /**
        * Gets or sets the constant value for the CCI calculation.  The default
        * value is 0.015.
        */
        public constant : number;
        public _calculate(): void;
    }
    function _cci(highs: number[], lows: number[], closes: number[], period: number, constant: number): number[];
}

declare module wijmo.chart.finance.analytics {
    /**
    * Represents a Willaims %R indicator series for the @see:FinancialChart.
    *
    * Williams %R is a momentum indicator that is the inverse of a fast stochastic
    * oscillator (@see:Stochastic).  The Williams %R indicator is designed to
    * tell whether an asset is trading near the high or low of its trading range.
    */
    class WilliamsR extends SingleOverlayIndicatorBase {
        constructor();
        public _calculate(): void;
    }
    function _williamsR(highs: number[], lows: number[], closes: number[], period: number): number[];
}

declare module wijmo.chart.finance.analytics {
    enum MovingAverageType {
        Simple = 0,
        Exponential = 1,
    }
    /**
    * Represents a Moving Average Envelopes overlay series for the @see:FinancialChart.
    *
    * Moving average envelopes are moving averages set above and below a standard moving
    * average.  The amount above/below the standard moving average is percentage based and
    * dictated by the @see:size property.
    */
    class Envelopes extends OverlayIndicatorBase {
        private _upperYVals;
        private _lowerYVals;
        private _xVals;
        private _period;
        private _type;
        private _size;
        constructor();
        /**
        * Gets or sets the period for the calculation as an integer value.
        */
        public period : any;
        /**
        * Gets or sets the moving average type for the
        * envelopes.  The default value is Simple.
        */
        public type : MovingAverageType;
        /**
        * Gets or set the size of the moving average
        * envelopes.  The default value is 2.5 percent (0.025).
        */
        public size : number;
        public getDataRect(): Rect;
        public _clearValues(): void;
        public _init(): void;
        public _shouldCalculate(): boolean;
        public _calculate(): void;
        private _rendering(sender, args);
        public getCalculatedValues(key: string): any[];
    }
}

declare module wijmo.chart.finance.analytics {
    /**
    * Represents a Bollinger Bands&reg; overlay series for the @see:FinancialChart.
    *
    * <i>Bollinger Bands is a registered trademark of John Bollinger.</i>
    */
    class BollingerBands extends OverlayIndicatorBase {
        private _upperYVals;
        private _middleYVals;
        private _lowerYVals;
        private _xVals;
        private _period;
        private _multiplier;
        constructor();
        /**
        * Gets or sets the period for the calculation as an integer value.
        */
        public period : any;
        /**
        * Gets or sets the standard deviation multiplier.
        */
        public multiplier : number;
        public getDataRect(): Rect;
        public _clearValues(): void;
        public _shouldCalculate(): boolean;
        public _init(): void;
        public _calculate(): void;
        private _rendering(sender, args);
        public getCalculatedValues(key: string): any[];
    }
    function _bollingerBands(ys: number[], period: number, multiplier: number): any;
}

declare module wijmo.chart.finance.analytics {
    /**
    * Represents a Relative Strength Index indicator series for the @see:FinancialChart.
    *
    * Relative strength index is a momentum osciallator designed to measure the current
    * and historical strength or weakness of an asset based on the closing prices of a
    * recent trading period.
    */
    class RSI extends SingleOverlayIndicatorBase {
        constructor();
        public _calculate(): void;
    }
    function _rsi(ys: number[], period: number): number[];
}

declare module wijmo.chart.finance.analytics {
    /**
    * Base class for @see:Macd and @see:MacdHistogram series (abstract).
    */
    class MacdBase extends OverlayIndicatorBase {
        public _macdXVals: number[];
        public _macdVals: number[];
        public _signalXVals: number[];
        public _signalVals: number[];
        public _histogramXVals: number[];
        public _histogramVals: number[];
        private _fastPeriod;
        private _slowPeriod;
        private _smoothingPeriod;
        constructor();
        /**
        * Gets or sets the fast exponential moving average period
        * for the MACD line.
        */
        public fastPeriod : number;
        /**
        * Gets or sets the slow exponential moving average period
        * for the MACD line.
        */
        public slowPeriod : number;
        /**
        * Gets or sets the exponential moving average period
        * for the signal line.
        */
        public smoothingPeriod : number;
        public _clearValues(): void;
        public _shouldCalculate(): boolean;
        public _init(): void;
        public _calculate(): void;
    }
    /**
    * Represents a Moving Average Convergence/Divergence (MACD) indicator series
    * for the @see:FinancialChart.
    *
    * The MACD indicator is designed to reveal changes in strength, direction, momentum,
    * and duration of an asset's price trend.
    */
    class Macd extends MacdBase {
        constructor();
        /**
        * Gets or sets the styles for the MACD and Signal lines.
        *
        * The following options are supported:
        *
        * <pre>series.styles = {
        *   macdLine: {
        *      stroke: 'red',
        *      strokeWidth: 1
        *   },
        *   signalLine: {
        *      stroke: 'green',
        *      strokeWidth: 1
        *   },
        * }</pre>
        */
        public styles : any;
        public getDataRect(): Rect;
        private _rendering(sender, args);
        public getCalculatedValues(key: string): any[];
    }
    /**
    * Represents a Moving Average Convergence/Divergence (MACD) Histogram indicator series
    * for the @see:FinancialChart.
    *
    * The MACD indicator is designed to reveal changes in strength, direction, momentum,
    * and duration of an asset's price trend.
    */
    class MacdHistogram extends MacdBase {
        constructor();
        public getValues(dim: number): number[];
        public getDataRect(): Rect;
        public _getChartType(): ChartType;
        public _getItem(pointIndex: number): any;
    }
    function _macd(ys: number[], fastPeriod: number, slowPeriod: number, smoothingPeriod: number): any;
}

declare module wijmo.chart.finance.analytics {
    /**
    * Represents a Stochastic Oscillator indicator series for the @see:FinancialChart.
    *
    * Stochastic oscillators are momentum indicators designed to predict price turning
    * points by comparing an asset's closing price to its high-low range.
    *
    * The @see:Stochastic series can be used for fast (default), slow and full stochastic
    * oscillators.  To create a slow or full stochastic oscillator, set the @see:smoothingPeriod
    * to an integer value greater than one; slow stochastic oscillators generally use a fixed
    * @see:smoothingPeriod of three.  To create or revert to a fast stochastic oscillator, set the
    * @see:smoothingPeriod to an integer value of one.
    */
    class Stochastic extends OverlayIndicatorBase {
        private _kVals;
        private _kXVals;
        private _dVals;
        private _dXVals;
        private _kPeriod;
        private _dPeriod;
        private _smoothingPeriod;
        constructor();
        /**
        * Gets or sets the period for the %K calculation.
        */
        public kPeriod : number;
        /**
        * Gets or sets the period for the %D simple moving average.
        */
        public dPeriod : number;
        /**
        * Gets or sets the smoothing period for full %K.
        */
        public smoothingPeriod : number;
        /**
        * Gets or sets the styles for the %K and %D lines.
        *
        * The following options are supported:
        *
        * <pre>series.styles = {
        *   kLine: {
        *      stroke: 'red',
        *      strokeWidth: 1
        *   },
        *   dLine: {
        *      stroke: 'green',
        *      strokeWidth: 1
        *   },
        * }</pre>
        */
        public styles : any;
        public getDataRect(): Rect;
        public _clearValues(): void;
        public _shouldCalculate(): boolean;
        public _init(): void;
        public _calculate(): void;
        private _rendering(sender, args);
        public getCalculatedValues(key: string): any[];
    }
    function _stochastic(highs: number[], lows: number[], closes: number[], kPeriod: number, dPeriod: number, smoothingPeriod: number): any;
}

