var wijmo;
(function (wijmo) {
    (function (_chart) {
        (function (interaction) {
            /**
            * Specifies the mouse action of the chart gestures.
            */
            (function (MouseAction) {
                /** Zoom chart by mouse. */
                MouseAction[MouseAction["Zoom"] = 0] = "Zoom";

                /** Pan chart by mouse. */
                MouseAction[MouseAction["Pan"] = 1] = "Pan";
            })(interaction.MouseAction || (interaction.MouseAction = {}));
            var MouseAction = interaction.MouseAction;

            /**
            * Specifies the iInteractive axes of the chart gestures.
            */
            (function (InteractiveAxes) {
                /** Interactive Axis X. */
                InteractiveAxes[InteractiveAxes["X"] = 0] = "X";

                /** Interactive Axis Y. */
                InteractiveAxes[InteractiveAxes["Y"] = 1] = "Y";

                /** Interactive Both Axis X and Axis Y. */
                InteractiveAxes[InteractiveAxes["XY"] = 2] = "XY";
            })(interaction.InteractiveAxes || (interaction.InteractiveAxes = {}));
            var InteractiveAxes = interaction.InteractiveAxes;

            var ChartGestures = (function () {
                //constructor
                function ChartGestures(chart, options) {
                    this._isTouch = false;
                    this._chart = null;
                    this._zoomEle = null;
                    this._overlayEle = null;
                    //events
                    this._wrapperMousedown = null;
                    this._wrapperMouseMove = null;
                    this._wrapperMouseup = null;
                    this._wrapperPointerdown = null;
                    this._wrapperPointerMove = null;
                    this._wrapperPointerup = null;
                    this._wrapperTouchStart = null;
                    this._wrapperTouchMove = null;
                    this._wrapperTouchEnd = null;
                    this._wrapperMouseWheel = null;
                    this._startFirstPt = null;
                    this._minX = null;
                    this._maxX = null;
                    this._minY = null;
                    this._maxY = null;
                    this._threadHold = 20;
                    this._clip = {};
                    this._selection = {};
                    this._startPointers = [];
                    this._mvPointers = [];
                    this._pinchStartEvents = [];
                    this._minXRange = null;
                    this._minYRange = null;
                    //option
                    this._mouseAction = 0 /* Zoom */;
                    this._interactiveAxes = 0 /* X */;
                    this._enable = true;
                    /**
                    * Occurs after the range changes.
                    */
                    this.rangeChanged = new wijmo.Event();
                    if (!chart) {
                        wijmo.assert(false, 'The FlexChart cannot be null.');
                    }

                    this._isTouch = 'ontouchstart' in window; //isTouchDevice();

                    this._chart = chart;
                    wijmo.copy(this, options);
                    this._initialize();
                }
                Object.defineProperty(ChartGestures.prototype, "mouseAction", {
                    /**
                    * Gets or sets the mouseAction of the ChartGestures.
                    */
                    get: function () {
                        return this._mouseAction;
                    },
                    set: function (value) {
                        if (value !== this._mouseAction) {
                            this._mouseAction = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(ChartGestures.prototype, "interactiveAxes", {
                    /**
                    * Gets or sets the interactiveAxes of the ChartGestures.
                    */
                    get: function () {
                        return this._interactiveAxes;
                    },
                    set: function (value) {
                        if (value !== this._interactiveAxes) {
                            this._interactiveAxes = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(ChartGestures.prototype, "enable", {
                    /**
                    * Gets or sets the enable of the ChartGestures.
                    */
                    get: function () {
                        return this._enable;
                    },
                    set: function (value) {
                        if (value !== this._enable) {
                            this._enable = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });


                /**
                * Raises the @see:rangeChanged event.
                */
                ChartGestures.prototype.onRangeChanged = function (e) {
                    this.rangeChanged.raise(this, e);
                };

                /** Reset the axis of chart.*/
                ChartGestures.prototype.reset = function () {
                    var chart = this._chart, axisX = chart.axisX, axisY = chart.axisY;

                    if (this._maxX) {
                        axisX.max = this._maxX;
                    }
                    if (this._minX) {
                        axisX.min = this._minX;
                    }
                    if (this._maxY) {
                        axisY.max = this._maxY;
                    }
                    if (this._minY) {
                        axisY.min = this._minY;
                    }
                    this._chart.invalidate();
                };

                ChartGestures.prototype._initialize = function () {
                    var chart = this._chart, chartHostEle = chart.hostElement;

                    this._zoomEle = wijmo.createElement('<div class="' + ChartGestures._CSS_ZOOM + '">' + '<div class="' + ChartGestures._CSS_ZOOM_OVERLAY + '"></div>');
                    this._zoomEle.style.visibility = 'visible';

                    chartHostEle.appendChild(this._zoomEle);

                    this._overlayEle = this._zoomEle.querySelector('.' + ChartGestures._CSS_ZOOM_OVERLAY);

                    //bind event
                    this._wrapperMousedown = this._onMousedown.bind(this);
                    this._wrapperMouseMove = this._onMouseMove.bind(this);
                    this._wrapperMouseup = this._onMouseup.bind(this);
                    this._wrapperPointerdown = this._onPointerdown.bind(this);
                    this._wrapperPointerMove = this._onPointerMove.bind(this);
                    this._wrapperPointerup = this._onPointerup.bind(this);
                    this._wrapperMouseWheel = this._onMouseWheel.bind(this);
                    this._wrapperTouchStart = this._onTouchStart.bind(this);
                    this._wrapperTouchMove = this._onTouchMove.bind(this);
                    this._wrapperTouchEnd = this._onTouchEnd.bind(this);
                    this._switchEvent(true);
                };

                ChartGestures.prototype._switchEvent = function (isOn) {
                    var chartHostEle = this._chart.hostElement, eventListener = isOn ? 'addEventListener' : 'removeEventListener', eventHandler = isOn ? 'addHandler' : 'removeHandler';

                    if (chartHostEle) {
                        chartHostEle[eventListener]('mousedown', this._wrapperMousedown);
                        chartHostEle[eventListener]('mousemove', this._wrapperMouseMove);
                        document[eventListener]('mouseup', this._wrapperMouseup);
                        if ('onpointerdown' in window) {
                            chartHostEle[eventListener]('pointerdown', this._wrapperPointerdown);
                            chartHostEle[eventListener]('pointermove', this._wrapperPointerMove);
                            document[eventListener]('pointerup', this._wrapperPointerup);
                        }
                        if ('onmousewheel' in window) {
                            chartHostEle[eventListener]('mousewheel', this._wrapperMouseWheel);
                        }
                        chartHostEle[eventListener]('DOMMouseScroll', this._wrapperMouseWheel);
                        if ('ontouchstart' in window) {
                            chartHostEle[eventListener]('touchstart', this._wrapperTouchStart);
                            chartHostEle[eventListener]('touchmove', this._wrapperTouchMove);
                            document[eventListener]('touchend', this._wrapperTouchEnd);
                        }
                        this._chart.rendered[eventHandler](this._refresh, this);
                    }
                };

                ChartGestures.prototype._refresh = function () {
                    var chart = this._chart, axisX = chart.axisX, axisY = chart.axisY, chartHostEle = chart.hostElement, pa;

                    //TODO: get series group element
                    this._seriesGroup = chartHostEle.querySelectorAll('g')[6];

                    pa = chartHostEle.querySelector('.' + _chart.FlexChart._CSS_PLOT_AREA);
                    this._plotOffset = wijmo.getElementRect(pa);
                    this._plotBox = pa.getBBox();
                    this._zoomEleOffset = wijmo.getElementRect(this._zoomEle);

                    //TODO: min and max value
                    if (this._minX === null || this._minX === 0 || this._minX === -1) {
                        this._minX = wijmo.isDate(axisX.actualMin) ? axisX.actualMin.valueOf() : axisX.actualMin;
                    }
                    if (this._maxX === null || this._maxX === 0 || this._maxX === -1) {
                        this._maxX = wijmo.isDate(axisX.actualMax) ? axisX.actualMax.valueOf() : axisX.actualMax;
                    }

                    if (this._minY === null || isNaN(this._minY)) {
                        this._minY = axisY.actualMin;
                    }
                    if (this._maxY === null || isNaN(this._maxY)) {
                        this._maxY = axisY.actualMax;
                    }

                    //setting the min&max scale range
                    this._minXRange = (this._maxX - this._minX) * 0.005;
                    this._minYRange = (this._maxY - this._minY) * 0.005;

                    if (this._overlayEle) {
                        this._overlayEle.removeAttribute('style');
                    }
                };

                /** mouse event*/
                ChartGestures.prototype._onMousedown = function (e) {
                    if (!this._enable) {
                        return;
                    }
                    this._mouseDown(e);
                    e.preventDefault();
                };

                ChartGestures.prototype._onMouseMove = function (e) {
                    if (!this._enable) {
                        return;
                    }
                    this._mouseMove(e);
                    e.preventDefault();
                };

                ChartGestures.prototype._onMouseup = function (e) {
                    if (!this._enable) {
                        return;
                    }
                    this._mouseup(e);
                    //e.preventDefault();
                };

                ChartGestures.prototype._onMouseWheel = function (e) {
                    var delta = e.detail || e.wheelDelta, chg = delta > 0 ? 0.05 : -0.05;
                    if (!this._enable) {
                        return;
                    }
                    this._scaling = true;
                    if (this._interactiveAxes === 0 /* X */ || this._interactiveAxes === 2 /* XY */) {
                        this._updateAxisByChg(true, chg, -chg);
                    }

                    if (this._interactiveAxes === 1 /* Y */ || this._interactiveAxes === 2 /* XY */) {
                        this._updateAxisByChg(false, chg, -chg);
                    }
                    this._chart.invalidate();
                    this._fireRangeChanged();
                    this._scaling = false;
                    e.preventDefault();
                };

                ChartGestures.prototype._mouseDown = function (e) {
                    this._startFirstPt = this._getPoint(e);
                    this._updatePoint(this._startFirstPt);
                    if (this._mouseAction === 0 /* Zoom */) {
                        this._initOverlay();
                    } else {
                        this._seriesGroup.setAttribute('clip-path', 'url(#' + this._chart._plotrectId + ')');
                        wijmo.toggleClass(this._chart.hostElement, ChartGestures._CSS_PANABLE, this._mouseAction === 1 /* Pan */);
                    }
                };

                ChartGestures.prototype._mouseMove = function (e) {
                    var mvPt;
                    if (!this._startFirstPt) {
                        return;
                    }

                    mvPt = this._getPoint(e);
                    this._updatePoint(mvPt);
                    this._endPoint = new wijmo.Point(mvPt.x, mvPt.y);

                    if (this._mouseAction === 0 /* Zoom */) {
                        this._updateOverLay(mvPt);
                    } else {
                        this._panning = true;
                        this._panningChart(mvPt.x - this._startFirstPt.x, mvPt.y - this._startFirstPt.y);
                    }
                };

                ChartGestures.prototype._mouseup = function (e) {
                    var endPt = this._endPoint, axisX = this._chart.axisX;

                    if (!this._startFirstPt || !endPt) {
                        wijmo.removeClass(this._chart.hostElement, ChartGestures._CSS_PANABLE);
                        this._reset();
                        return;
                    }

                    if (this._mouseAction === 0 /* Zoom */) {
                        this._zoomedChart(endPt);
                        this._reset();
                    } else {
                        this._pannedChart(endPt.x - this._startFirstPt.x, endPt.y - this._startFirstPt.y);
                        this._reset();
                    }
                    wijmo.removeClass(this._chart.hostElement, ChartGestures._CSS_PANABLE);
                };

                /** ms pointer event*/
                ChartGestures.prototype._onPointerdown = function (e) {
                    if (!this._enable) {
                        return;
                    }
                    switch (e.pointerType) {
                        case "touch":
                            this._pointerDown(e);
                            break;
                        case "mouse":
                            this._mouseDown(e);
                            break;
                    }
                    e.preventDefault();
                };

                ChartGestures.prototype._onPointerMove = function (e) {
                    if (!this._enable) {
                        return;
                    }
                    switch (e.pointerType) {
                        case "touch":
                            this._pointerMove(e);
                            break;
                        case "mouse":
                            this._mouseMove(e);
                            break;
                    }
                    e.preventDefault();
                };

                ChartGestures.prototype._onPointerup = function (e) {
                    if (!this._enable) {
                        return;
                    }
                    switch (e.pointerType) {
                        case "touch":
                            this._pointerUp(e);
                            break;
                        case "mouse":
                            this._mouseup(e);
                            break;
                    }
                    e.preventDefault();
                };

                ChartGestures.prototype._pointerDown = function (e) {
                    if (e.preventManipulation)
                        e.preventManipulation();

                    this._seriesGroup.setAttribute('clip-path', 'url(#' + this._chart._plotrectId + ')');
                    this._startPointers.push({ id: e.pointerId, x: e.clientX, y: e.clientY });
                    if (this._startPointers.length === 1) {
                        this._scaling = false;
                        this._panning = true;
                    } else if (this._startPointers.length === 2) {
                        this._panning = false;
                        this._scaling = true;
                        this._startDistance = {
                            x: this._startPointers[0].x - this._startPointers[1].x,
                            y: this._startPointers[0].y - this._startPointers[1].y
                        };
                    }
                };

                ChartGestures.prototype._pointerMove = function (e) {
                    var pt1, pt2, mvPt = new wijmo.Point(e.clientX, e.clientY), rNowCordinate, rStartCordinate, offset = {}, scale = {};
                    if (e.preventManipulation)
                        e.preventManipulation();

                    if (this._panning) {
                        if (!this._pointInPlotArea(mvPt)) {
                            return;
                        }
                        this._endPoint = new wijmo.Point(e.clientX, e.clientY);
                        this._panningChart(this._endPoint.x - this._startPointers[0].x, this._endPoint.y - this._startPointers[0].y);
                    } else if (this._scaling) {
                        pt1 = this._startPointers[0].id + '';
                        pt2 = this._startPointers[1].id + '';

                        this._mvPointers[e.pointerId + ''] = { x: e.clientX, y: e.clientY };

                        if (this._mvPointers[pt1] && this._mvPointers[pt2]) {
                            if (Math.abs(this._startDistance.x) > this._threadHold && this._interactiveAxes !== 1 /* Y */) {
                                rNowCordinate = this._mvPointers[pt1].x - this._plotOffset.left;
                                rStartCordinate = this._startPointers[0].x - this._plotOffset.left;
                                scale['x'] = Math.abs((this._mvPointers[pt1].x - this._mvPointers[pt2].x) / this._startDistance.x);
                                offset['x'] = rNowCordinate - scale['x'] * rStartCordinate;
                                this._clip['x'] = (this._plotBox.x - rNowCordinate) / scale['x'] + rStartCordinate;
                                this._selection['w'] = this._plotBox.width / scale['x'];
                            }
                            if (Math.abs(this._startDistance.y) > this._threadHold && this._interactiveAxes !== 0 /* X */) {
                                rNowCordinate = this._mvPointers[pt1].y - this._plotOffset.top;
                                rStartCordinate = this._startPointers[0].y - this._plotOffset.top;
                                scale['y'] = Math.abs((this._mvPointers[pt1].y - this._mvPointers[pt2].y) / this._startDistance.y);
                                offset['y'] = rNowCordinate - scale['y'] * rStartCordinate;
                                this._clip['y'] = (this._plotBox.y - rNowCordinate) / scale['y'] + rStartCordinate;
                                this._selection['h'] = this._plotBox.height / scale['y'];
                            }
                            this._scalingChart(scale, offset);
                        }
                    }
                };

                ChartGestures.prototype._pointerUp = function (e) {
                    if (e.preventManipulation)
                        e.preventManipulation();

                    if (this._panning) {
                        this._pannedChart(this._endPoint.x - this._startPointers[0].x, this._endPoint.y - this._startPointers[0].y);
                        this._reset();
                    } else if (this._scaling) {
                        this._scaledChart(e);
                        this._reset();
                    }
                };

                /** touch event*/
                ChartGestures.prototype._onTouchStart = function (e) {
                    if (!this._enable) {
                        return;
                    }
                    if (e.touches.length == 1) {
                        this._scaling = false;
                        this._panning = true;
                        this._startFirstPt = this._getPoint(e);
                    } else if (e.touches.length == 2) {
                        this._pinchStartEvents = this._getTouchPair(e);
                        this._startDistance = this._touchDistance(e);
                        this._panning = false;
                        this._scaling = true;
                    }
                    if (this._seriesGroup) {
                        this._seriesGroup.setAttribute('clip-path', 'url(#' + this._chart._plotrectId + ')');
                    }

                    e.preventDefault();
                    return true;
                };

                ChartGestures.prototype._onTouchMove = function (e) {
                    if (!this._enable) {
                        return;
                    }
                    var scale = {}, offset = {}, touchs = e.touches[0], mvPt = new wijmo.Point(touchs.pageX, touchs.pageY), rNowCordinate, rStartCordinate, nowDist, nowPos, startPos;
                    e.preventDefault();

                    if (this._panning) {
                        if (this._startFirstPt) {
                            if (!this._pointInPlotArea(mvPt)) {
                                return;
                            }
                            this._endPoint = new wijmo.Point(touchs.pageX, touchs.pageY);
                            this._panningChart(this._endPoint.x - this._startFirstPt.x, this._endPoint.y - this._startFirstPt.y);
                        }
                    } else if (this._scaling) {
                        nowDist = this._touchDistance(e);
                        nowPos = this._getTouchPair(e)[0];
                        startPos = this._pinchStartEvents[0];

                        //horizontal
                        if (Math.abs(this._startDistance.x) > this._threadHold && this._interactiveAxes !== 1 /* Y */) {
                            rNowCordinate = nowPos.pageX - this._plotOffset.left;
                            rStartCordinate = startPos.pageX - this._plotOffset.left;
                            scale['x'] = Math.abs(nowDist.x / this._startDistance.x);
                            offset['x'] = rNowCordinate - (scale['x'] * rStartCordinate);
                            this._clip['x'] = (this._plotBox.x - rNowCordinate) / scale['x'] + rStartCordinate;
                            this._selection['w'] = this._plotBox.width / scale['x'];
                        }

                        //vertical
                        if (Math.abs(this._startDistance.y) > this._threadHold && this._interactiveAxes !== 0 /* X */) {
                            rNowCordinate = nowPos.pageY - this._plotOffset.top;
                            rStartCordinate = startPos.pageY - this._plotOffset.top;
                            scale['y'] = Math.abs(nowDist.y / this._startDistance.y);
                            offset['y'] = rNowCordinate - (scale['y'] * rStartCordinate);
                            this._clip['y'] = (this._plotBox.y - rNowCordinate) / scale['y'] + rStartCordinate;
                            this._selection['h'] = this._plotBox.height / scale['y'];
                        }
                        this._scalingChart(scale, offset);
                    }

                    return true;
                };

                ChartGestures.prototype._onTouchEnd = function (e) {
                    if (!this._enable) {
                        return;
                    }
                    var endPt = this._endPoint;

                    if (this._panning) {
                        if (!this._startFirstPt || !endPt) {
                            this._reset();
                            return;
                        }
                        this._pannedChart(endPt.x - this._startFirstPt.x, endPt.y - this._startFirstPt.y);
                    } else if (this._scaling) {
                        this._scaledChart(e);
                    }
                    this._reset();

                    //e.preventDefault();
                    return true;
                };

                /** help method of zooming chart by mouse */
                ChartGestures.prototype._initOverlay = function () {
                    this._zoomEle.style.visibility = 'visible';
                    switch (this._interactiveAxes) {
                        case 0 /* X */:
                            this._overlayEle.style.left = (this._startFirstPt.x - this._zoomEleOffset.left) + 'px';
                            this._overlayEle.style.top = (this._plotOffset.top - this._zoomEleOffset.top) + 'px';
                            break;
                        case 1 /* Y */:
                            this._overlayEle.style.left = (this._plotBox.x) + 'px';
                            this._overlayEle.style.top = (this._startFirstPt.y - this._zoomEleOffset.top) + 'px';
                            break;
                        case 2 /* XY */:
                            this._overlayEle.style.left = (this._startFirstPt.x - this._zoomEleOffset.left) + 'px';
                            this._overlayEle.style.top = (this._startFirstPt.y - this._zoomEleOffset.top) + 'px';
                            break;
                    }
                };

                ChartGestures.prototype._updateOverLay = function (mvPt) {
                    var distanceX = this._startFirstPt.x - mvPt.x, distanceY = this._startFirstPt.y - mvPt.y, style = {};

                    switch (this._interactiveAxes) {
                        case 0 /* X */:
                            if ((Math.abs(distanceX)) < this._threadHold) {
                                return;
                            }
                            style = distanceX <= 0 ? { width: Math.abs(distanceX) + 'px', height: this._plotBox.height + 'px' } : { left: (mvPt.x - this._zoomEleOffset.left) + 'px', width: distanceX + 'px', height: this._plotBox.height + 'px' };
                            break;
                        case 1 /* Y */:
                            if ((Math.abs(distanceY)) < this._threadHold) {
                                return;
                            }
                            style = distanceY <= 0 ? { height: Math.abs(distanceY) + 'px', width: this._plotBox.width + 'px' } : { top: (mvPt.y - this._zoomEleOffset.top) + 'px', height: distanceY + 'px', width: this._plotBox.width + 'px' };
                            break;
                        case 2 /* XY */:
                            //horizontal
                            if ((Math.abs(distanceX)) >= this._threadHold) {
                                style['width'] = Math.abs(distanceX) + 'px';
                                if (distanceX > 0) {
                                    style['left'] = (mvPt.x - this._zoomEleOffset.left) + 'px';
                                }
                            }

                            //vertical
                            if ((Math.abs(distanceY)) >= this._threadHold) {
                                style['height'] = Math.abs(distanceY) + 'px';
                                if (distanceY > 0) {
                                    style['top'] = (mvPt.y - this._zoomEleOffset.top) + 'px';
                                }
                            }
                            break;
                    }
                    wijmo.setCss(this._overlayEle, style);
                };

                ChartGestures.prototype._updatePoint = function (mvPt) {
                    var plotRect = this._plotOffset;
                    if (mvPt.x < plotRect.left) {
                        mvPt.x = plotRect.left;
                    }
                    if (mvPt.x > plotRect.left + plotRect.width) {
                        mvPt.x = plotRect.left + plotRect.width;
                    }
                    if (mvPt.y < plotRect.top) {
                        mvPt.y = plotRect.top;
                    }
                    if (mvPt.y > plotRect.top + plotRect.height) {
                        mvPt.y = plotRect.top + plotRect.height;
                    }
                };

                ChartGestures.prototype._pointInPlotArea = function (mvPt) {
                    var plotRect = this._plotOffset;
                    if (mvPt.x >= plotRect.left && mvPt.x <= plotRect.left + plotRect.width && mvPt.y >= plotRect.top && mvPt.y <= plotRect.top + plotRect.height) {
                        return true;
                    }
                    return false;
                };

                ChartGestures.prototype._zoomedChart = function (endPt) {
                    if (!endPt) {
                        return;
                    }

                    //horizontal
                    if (this._interactiveAxes === 0 /* X */ || this._interactiveAxes === 2 /* XY */) {
                        this._zoomedAxis(endPt, true);
                    }

                    //vertical
                    if (this._interactiveAxes === 1 /* Y */ || this._interactiveAxes === 2 /* XY */) {
                        this._zoomedAxis(endPt, false);
                    }
                    this._startFirstPt = null;
                    this._refresh();
                };

                ChartGestures.prototype._zoomedAxis = function (endPt, isX) {
                    var htStart, htEnd, min, max, axis = isX ? this._chart.axisX : this._chart.axisY, xy = isX ? 'x' : 'y', lt = isX ? 'left' : 'top';

                    if (!endPt) {
                        return;
                    }
                    if (Math.abs(this._startFirstPt[xy] - endPt[xy]) > this._threadHold) {
                        min = axis.convertBack(this._startFirstPt[xy] - this._plotOffset[lt] + this._plotBox[xy]);
                        max = axis.convertBack(endPt[xy] - this._plotOffset[lt] + this._plotBox[xy]);

                        if (max - min !== 0) {
                            axis.min = Math.min(min, max);
                            axis.max = Math.max(min, max);
                            this._chart.invalidate();
                            this._fireRangeChanged();
                        }
                    }
                };

                ChartGestures.prototype._panningChart = function (distanceX, distanceY) {
                    var axisX = this._chart.axisX, axisY = this._chart.axisY, sg = this._seriesGroup.querySelector('g');

                    distanceX = (Math.abs(distanceX)) < this._threadHold ? 0 : distanceX;
                    distanceY = (Math.abs(distanceY)) < this._threadHold ? 0 : distanceY;

                    if (this._interactiveAxes === 0 /* X */) {
                        distanceY = 0;
                    }

                    if (this._interactiveAxes === 1 /* Y */) {
                        distanceX = 0;
                    }

                    // check x axis range
                    if (distanceX > 0 && axisX.actualMin.valueOf() === this._minX) {
                        distanceX = 0;
                    }
                    if (distanceX < 0 && axisX.actualMax.valueOf() === this._maxX) {
                        distanceX = 0;
                    }

                    // check y axis range
                    if (distanceY > 0 && axisY.actualMax.valueOf() === this._maxY) {
                        distanceY = 0;
                    }
                    if (distanceY < 0 && axisY.actualMin.valueOf() === this._minY) {
                        distanceY = 0;
                    }

                    if (sg) {
                        sg.setAttribute('transform', 'translate(' + distanceX + ',' + distanceY + ')');
                    }
                };

                ChartGestures.prototype._pannedChart = function (distanceX, distanceY) {
                    var changeX, changeY;

                    if (this._interactiveAxes === 0 /* X */ || this._interactiveAxes === 2 /* XY */) {
                        this._updateAxisByDistance(true, distanceX);
                    }

                    if (this._interactiveAxes === 1 /* Y */ || this._interactiveAxes === 2 /* XY */) {
                        this._updateAxisByDistance(false, -distanceY);
                    }

                    this._chart.invalidate();
                    this._fireRangeChanged();
                };

                ChartGestures.prototype._scalingChart = function (scale, offset) {
                    var axisX = this._chart.axisX, axisY = this._chart.axisY, seriesGroup = this._seriesGroup.querySelector('g'), offsetX = offset.x !== undefined ? offset.x : 0, offsetY = offset.y !== undefined ? offset.y : 0, scaleX, scaleY;

                    if (!scale) {
                        return;
                    }

                    //check x axis range
                    if (scale.x !== undefined) {
                        if (scale.x < 1) {
                            if (axisX.actualMin.valueOf() === this._minX && axisX.actualMax.valueOf() === this._maxX) {
                                scale.x = 1;
                                offsetX = 0;
                            }
                        }
                    }

                    //check y axis range
                    if (scale.y !== undefined) {
                        if (scale.y < 1) {
                            if (axisY.actualMin.valueOf() === this._minY && axisY.actualMax.valueOf() === this._maxY) {
                                scale.y = 1;
                                offsetY = 0;
                            }
                        }
                    }

                    scaleX = scale.x !== undefined ? scale.x : 1;
                    scaleY = scale.y !== undefined ? scale.y : 1;

                    if (seriesGroup) {
                        seriesGroup.setAttribute('transform', 'translate(' + offsetX + ', ' + offsetY + ') ' + 'scale(' + scaleX + ', ' + scaleY + ')');
                    }
                };

                ChartGestures.prototype._scaledChart = function (e) {
                    var min, max, rangChged = false, chart = this._chart, axisX = chart.axisX, axisY = chart.axisY;

                    if (!this._clip) {
                        return;
                    }

                    if (this._interactiveAxes !== 1 /* Y */) {
                        if (this._clip['x'] !== undefined) {
                            min = Math.max(this._minX, axisX.convertBack(this._clip['x']));
                            max = Math.min(this._maxX, axisX.convertBack(this._clip['x'] + this._selection['w']));
                            if (min - max !== 0) {
                                axisX.min = min;
                                axisX.max = max;
                            }
                            rangChged = true;
                        }
                    }

                    if (this._interactiveAxes !== 0 /* X */) {
                        if (this._clip['y'] !== undefined) {
                            max = Math.min(this._maxY, axisY.convertBack(this._clip['y']));
                            min = Math.max(this._minY, axisY.convertBack(this._clip['y'] + this._selection['h']));
                            if (min - max !== 0) {
                                axisY.min = min;
                                axisY.max = max;
                            }
                            rangChged = true;
                        }
                    }
                    if (rangChged) {
                        this._chart.invalidate();
                        this._fireRangeChanged();
                    }
                };

                //help method
                ChartGestures.prototype._updateAxisByDistance = function (isX, distance) {
                    var axis = isX ? this._chart.axisX : this._chart.axisY, oriMin = isX ? this._minX : this._minY, oriMax = isX ? this._maxX : this._maxY, min = axis.actualMin.valueOf(), max = axis.actualMax.valueOf(), change;

                    if (distance === 0) {
                        return;
                    }
                    if ((distance > 0 && oriMin === min) || (distance < 0 && oriMax === max)) {
                        this._chart.invalidate();
                        return;
                    }
                    change = distance / (isX ? this._plotBox.width : this._plotBox.height);
                    this._updateAxisByChg(isX, -change, -change);
                };

                ChartGestures.prototype._updateAxisByChg = function (isX, chgMin, chgMax) {
                    var axis = isX ? this._chart.axisX : this._chart.axisY, oriMin = isX ? this._minX : this._minY, oriMax = isX ? this._maxX : this._maxY, min = axis.actualMin.valueOf(), max = axis.actualMax.valueOf(), range = max - min, minRange = isX ? this._minXRange : this._minYRange, tMin, tMax;

                    if (isNaN(chgMin) || isNaN(chgMax)) {
                        return;
                    }

                    if (this._panning) {
                        if (chgMin < 0) {
                            tMin = min + chgMin * range;
                            if (tMin < oriMin) {
                                tMin = oriMin;
                                tMax = tMin + range;
                            } else {
                                tMax = max + chgMax * range;
                            }
                        } else {
                            tMax = max + chgMax * range;
                            if (tMax > oriMax) {
                                tMax = oriMax;
                                tMin = tMax - range;
                            } else {
                                tMin = min + chgMin * range;
                            }
                        }
                    } else if (this._scaling) {
                        //scaling: control the range
                        tMin = min + chgMin * range;
                        tMax = max + chgMax * range;
                        if (tMin < oriMin) {
                            tMin = oriMin;
                        }
                        if (tMax > oriMax) {
                            tMax = oriMax;
                        }
                        if ((tMax - tMin) < minRange) {
                            tMin = tMax - minRange;
                        }
                    }

                    axis.min = tMin;
                    axis.max = tMax;
                };

                ChartGestures.prototype._reset = function () {
                    this._scaling = false;
                    this._panning = false;
                    this._startDistance = 0;
                    this._startFirstPt = null;
                    this._pinchStartEvents = [];
                    this._startPointers = [];
                    this._mvPointers = [];
                    this._endPoint = null;
                    this._clip = {};
                    this._selection = {};
                };

                ChartGestures.prototype._fireRangeChanged = function () {
                    var axisX = this._chart.axisX, axisY = this._chart.axisY;
                    if ((axisX.min && this._minX !== axisX.min.valueOf()) || (axisX.max && this._maxX !== axisX.max.valueOf()) || (axisY.min && this._minY !== axisY.min.valueOf()) || (axisY.max && this._maxY !== axisY.max.valueOf())) {
                        this.onRangeChanged();
                    }
                };

                ChartGestures.prototype._getPoint = function (e) {
                    return e instanceof MouseEvent ? new wijmo.Point(e.pageX, e.pageY) : new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
                };

                ChartGestures.prototype._getTouchPair = function (event) {
                    var touches = [];

                    // array of touches is supplied
                    if (wijmo.isArray(event)) {
                        touches[0] = event[0];
                        touches[1] = event[1];
                    } else {
                        if (event.type === 'touchend') {
                            if (event.touches.length === 1) {
                                touches[0] = event.touches[0];
                                touches[1] = event.changedTouches[0];
                            } else if (event.touches.length === 0) {
                                touches[0] = event.changedTouches[0];
                                touches[1] = event.changedTouches[1];
                            }
                        } else {
                            touches[0] = event.touches[0];
                            touches[1] = event.touches[1];
                        }
                    }

                    return touches;
                };

                ChartGestures.prototype._touchDistance = function (event) {
                    var touches = this._getTouchPair(event), dx = 0, dy = 0;
                    if (touches[0] && touches[0]['pageX'] !== undefined && touches[1] && touches[1]['pageX'] !== undefined) {
                        dx = touches[0]['pageX'] - touches[1]['pageX'];
                    }

                    if (touches[0] && touches[0]['pageY'] !== undefined && touches[1] && touches[1]['pageY'] !== undefined) {
                        dy = touches[0]['pageY'] - touches[1]['pageY'];
                    }

                    return { x: dx, y: dy };
                };
                ChartGestures._CSS_ZOOM = 'wj-zoom';
                ChartGestures._CSS_ZOOM_OVERLAY = 'wj-zoom-overlay';
                ChartGestures._CSS_PANABLE = 'wj-panable';
                return ChartGestures;
            })();
            interaction.ChartGestures = ChartGestures;
        })(_chart.interaction || (_chart.interaction = {}));
        var interaction = _chart.interaction;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ChartGestures.js.map
