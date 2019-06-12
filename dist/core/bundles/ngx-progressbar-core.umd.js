(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('rxjs'), require('rxjs/operators'), require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@ngx-progressbar/core', ['exports', 'tslib', 'rxjs', 'rxjs/operators', '@angular/core', '@angular/common'], factory) :
    (factory((global['ngx-progressbar'] = global['ngx-progressbar'] || {}, global['ngx-progressbar'].core = {}),global.tslib,global.rxjs,global.Rx.Observable.prototype,global.ng.core,global.ng.common));
}(this, (function (exports,tslib,rxjs,operators,core,common) { 'use strict';

    var NgProgressRef = (function () {
        /**
         * @param {?} customConfig
         */
        function NgProgressRef(customConfig) {
            var _this = this;
            this._state = { active: false, value: 0 };
            /**
             * Stream that increments and updates progress state
             */
            this._trickling$ = new rxjs.Subject();
            /**
             * Stream that emits when progress state is changed
             */
            this.state$ = new rxjs.BehaviorSubject(this._state);
            /**
             * Stream that emits when config is changed
             */
            this.config$ = new rxjs.Subject();
            rxjs.combineLatest(this._trickling$, this.config$).pipe(operators.debounce(function (_a) {
                var _b = tslib.__read(_a, 2), start = _b[0], config = _b[1];
                return rxjs.timer(start ? _this._config.debounceTime : 0);
            }), operators.switchMap(function (_a) {
                var _b = tslib.__read(_a, 2), start = _b[0], config = _b[1];
                return start ? _this._trickling(config) : _this._complete(config);
            })).subscribe();
            this.setConfig(customConfig);
        }
        Object.defineProperty(NgProgressRef.prototype, "isStarted", {
            /**
             * @return {?}
             */
            get: function () {
                return this._state.active;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgProgressRef.prototype, "started", {
            /**
             * Progress start event
             * @return {?}
             */
            get: function () {
                return this.state$.pipe(operators.map(function (state) { return state.active; }), operators.distinctUntilChanged(), operators.filter(function (active) { return active; }));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgProgressRef.prototype, "completed", {
            /**
             * Progress ended event
             * @return {?}
             */
            get: function () {
                return this.state$.pipe(operators.map(function (state) { return state.active; }), operators.distinctUntilChanged(), operators.filter(function (active) { return !active; }), operators.skip(1));
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        NgProgressRef.prototype.start = function () {
            this._trickling$.next(true);
        };
        /**
         * @return {?}
         */
        NgProgressRef.prototype.complete = function () {
            this._trickling$.next(false);
        };
        /**
         * @param {?=} amount
         * @return {?}
         */
        NgProgressRef.prototype.inc = function (amount) {
            var /** @type {?} */ n = this._state.value;
            if (!this.isStarted) {
                this.start();
            }
            else {
                if (typeof amount !== 'number') {
                    amount = this._config.trickleFunc(n);
                }
                this.set(n + amount);
            }
        };
        /**
         * @param {?} n
         * @return {?}
         */
        NgProgressRef.prototype.set = function (n) {
            this._setState({ value: this._clamp(n), active: true });
        };
        /**
         * @param {?} config
         * @return {?}
         */
        NgProgressRef.prototype.setConfig = function (config) {
            this._config = Object.assign({}, this._config, config);
            this.config$.next(this._config);
        };
        /**
         * Meant to be used internally and not by user directly
         * Users should use NgProgressManager.destroy(id) instead
         * @return {?}
         */
        NgProgressRef.prototype.destroy = function () {
            this._trickling$.complete();
            this.state$.complete();
            this.config$.complete();
        };
        /**
         * @param {?} state
         * @return {?}
         */
        NgProgressRef.prototype._setState = function (state) {
            this._state = Object.assign({}, this._state, state);
            this.state$.next(this._state);
        };
        /**
         * Clamps a value to be between min and max
         * @param {?} n
         * @return {?}
         */
        NgProgressRef.prototype._clamp = function (n) {
            return Math.max(this._config.min, Math.min(this._config.max, n));
        };
        /**
         * Keeps incrementing the progress
         * @param {?} config
         * @return {?}
         */
        NgProgressRef.prototype._trickling = function (config) {
            var _this = this;
            if (!this.isStarted) {
                this.set(this._config.min);
            }
            return rxjs.timer(0, config.trickleSpeed).pipe(operators.tap(function () { return _this.inc(); }));
        };
        /**
         * Completes then resets the progress
         * @param {?} config
         * @return {?}
         */
        NgProgressRef.prototype._complete = function (config) {
            var _this = this;
            return !this.isStarted ? rxjs.of({}) : rxjs.of({}).pipe(
            // Completes the progress
            operators.tap(function () { return _this._setState({ value: 100 }); }), 
            // Hides the progress bar after a tiny delay
            operators.delay(config.speed * 1.7), operators.tap(function () { return _this._setState({ active: false }); }), 
            // Resets the progress state
            operators.delay(config.speed), operators.tap(function () { return _this._setState({ value: 0 }); }));
        };
        return NgProgressRef;
    }());
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var /** @type {?} */ CONFIG = new core.InjectionToken('config');
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var ɵ0 = function (n) {
        if (n >= 0 && n < 20)
            return 10;
        if (n >= 20 && n < 50)
            return 4;
        if (n >= 50 && n < 80)
            return 2;
        if (n >= 80 && n < 99)
            return 0.5;
        return 0;
    };
    var /** @type {?} */ defaultConfig = {
        meteor: true,
        spinner: true,
        thick: false,
        ease: 'linear',
        spinnerPosition: 'right',
        direction: 'ltr+',
        color: '#1B95E0',
        max: 100,
        min: 8,
        speed: 200,
        trickleSpeed: 300,
        debounceTime: 0,
        trickleFunc: ɵ0
    };
    var NgProgress = (function () {
        /**
         * @param {?} config
         */
        function NgProgress(config) {
            /**
             * Stores NgProgressRef instances
             */
            this._instances = {};
            this.config = Object.assign({}, defaultConfig, config);
        }
        /**
         * Returns NgProgressRef by ID
         * @param {?=} id
         * @param {?=} config
         * @return {?}
         */
        NgProgress.prototype.ref = function (id, config) {
            if (id === void 0) {
                id = 'root';
            }
            if (this._instances[id] instanceof NgProgressRef) {
                return this._instances[id];
            }
            else {
                config = Object.assign({}, this.config, config);
                return this._instances[id] = new NgProgressRef(config);
            }
        };
        /**
         * @param {?} config
         * @param {?=} id
         * @return {?}
         */
        NgProgress.prototype.setConfig = function (config, id) {
            if (id === void 0) {
                id = 'root';
            }
            if (this._instances[id] instanceof NgProgressRef) {
                this._instances[id].setConfig(config);
            }
        };
        /**
         * @param {?=} id
         * @return {?}
         */
        NgProgress.prototype.start = function (id) {
            if (id === void 0) {
                id = 'root';
            }
            if (this._instances[id] instanceof NgProgressRef) {
                this._instances[id].start();
            }
        };
        /**
         * @param {?} n
         * @param {?=} id
         * @return {?}
         */
        NgProgress.prototype.set = function (n, id) {
            if (id === void 0) {
                id = 'root';
            }
            if (this._instances[id] instanceof NgProgressRef) {
                this._instances[id].set(n);
            }
        };
        /**
         * @param {?=} n
         * @param {?=} id
         * @return {?}
         */
        NgProgress.prototype.inc = function (n, id) {
            if (id === void 0) {
                id = 'root';
            }
            if (this._instances[id] instanceof NgProgressRef) {
                this._instances[id].inc(n);
            }
        };
        /**
         * @param {?=} id
         * @return {?}
         */
        NgProgress.prototype.complete = function (id) {
            if (id === void 0) {
                id = 'root';
            }
            if (this._instances[id] instanceof NgProgressRef) {
                this._instances[id].complete();
            }
        };
        /**
         * @param {?=} id
         * @return {?}
         */
        NgProgress.prototype.isStarted = function (id) {
            if (id === void 0) {
                id = 'root';
            }
            return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].isStarted : false;
        };
        /**
         * @param {?=} id
         * @return {?}
         */
        NgProgress.prototype.started = function (id) {
            if (id === void 0) {
                id = 'root';
            }
            return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].started : rxjs.EMPTY;
        };
        /**
         * @param {?=} id
         * @return {?}
         */
        NgProgress.prototype.completed = function (id) {
            if (id === void 0) {
                id = 'root';
            }
            return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].completed : rxjs.EMPTY;
        };
        /**
         * @param {?=} id
         * @return {?}
         */
        NgProgress.prototype.destroy = function (id) {
            if (id === void 0) {
                id = 'root';
            }
            if (this._instances[id] instanceof NgProgressRef) {
                this._instances[id].destroy();
                this._instances[id] = null;
            }
        };
        /**
         * @return {?}
         */
        NgProgress.prototype.destroyAll = function () {
            var _this = this;
            Object.keys(this._instances).map(function (key) {
                _this._instances[key].destroy();
                _this._instances[key] = null;
            });
        };
        return NgProgress;
    }());
    NgProgress.decorators = [
        { type: core.Injectable },
    ];
    /** @nocollapse */
    NgProgress.ctorParameters = function () {
        return [
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [CONFIG,] },] },
        ];
    };
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var NgProgressComponent = (function () {
        /**
         * @param {?} _ngProgress
         */
        function NgProgressComponent(_ngProgress) {
            this._ngProgress = _ngProgress;
            /**
             * Creates a new instance if id is not already exists
             */
            this.id = 'root';
            /**
             * Initializes inputs from the global config
             */
            this.spinnerPosition = this._ngProgress.config.spinnerPosition;
            this.direction = this._ngProgress.config.direction;
            this.ease = this._ngProgress.config.ease;
            this.color = this._ngProgress.config.color;
            this.meteor = this._ngProgress.config.meteor;
            this.spinner = this._ngProgress.config.spinner;
            this.thick = this._ngProgress.config.thick;
            this.max = this._ngProgress.config.max;
            this.min = this._ngProgress.config.min;
            this.speed = this._ngProgress.config.speed;
            this.trickleSpeed = this._ngProgress.config.trickleSpeed;
            this.trickleFunc = this._ngProgress.config.trickleFunc;
            this.debounceTime = this._ngProgress.config.debounceTime;
            this.started = new core.EventEmitter();
            this.completed = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        NgProgressComponent.prototype.ngOnChanges = function () {
            if (this.progressRef instanceof NgProgressRef) {
                // Update progress bar config when inputs change
                this.progressRef.setConfig({
                    max: (this.max > 0 && this.max <= 100) ? this.max : 100,
                    min: (this.min < 100 && this.min >= 0) ? this.min : 0,
                    speed: this.speed,
                    trickleSpeed: this.trickleSpeed,
                    trickleFunc: this.trickleFunc,
                    debounceTime: this.debounceTime
                });
            }
        };
        /**
         * @return {?}
         */
        NgProgressComponent.prototype.ngOnInit = function () {
            var _this = this;
            // Get progress bar service instance
            this.progressRef = this._ngProgress.ref(this.id, {
                max: this.max,
                min: this.min,
                speed: this.speed,
                trickleSpeed: this.trickleSpeed,
                debounceTime: this.debounceTime
            });
            this.state$ = this.progressRef.state$.pipe(operators.map(function (state) {
                return ({
                    active: state.active,
                    transform: "translate3d(" + state.value + "%,0,0)"
                });
            }));
            /** Subscribes to started and completed events when user used them */
            if (this.started.observers.length) {
                this._started$ = this.progressRef.started.subscribe(function () { return _this.started.emit(); });
            }
            if (this.completed.observers.length) {
                this._completed$ = this.progressRef.completed.subscribe(function () { return _this.completed.emit(); });
            }
        };
        /**
         * @return {?}
         */
        NgProgressComponent.prototype.ngOnDestroy = function () {
            if (this._started$) {
                this._started$.unsubscribe();
            }
            if (this._completed$) {
                this._completed$.unsubscribe();
            }
            this._ngProgress.destroy(this.id);
        };
        /**
         * @return {?}
         */
        NgProgressComponent.prototype.start = function () {
            this.progressRef.start();
        };
        /**
         * @return {?}
         */
        NgProgressComponent.prototype.complete = function () {
            this.progressRef.complete();
        };
        /**
         * @param {?=} n
         * @return {?}
         */
        NgProgressComponent.prototype.inc = function (n) {
            this.progressRef.inc(n);
        };
        /**
         * @param {?} n
         * @return {?}
         */
        NgProgressComponent.prototype.set = function (n) {
            this.progressRef.set(n);
        };
        Object.defineProperty(NgProgressComponent.prototype, "isStarted", {
            /**
             * @return {?}
             */
            get: function () {
                return this.progressRef.isStarted;
            },
            enumerable: true,
            configurable: true
        });
        return NgProgressComponent;
    }());
    NgProgressComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'ng-progress',
                    host: {
                        'role': 'progressbar',
                        '[attr.spinnerPosition]': 'spinnerPosition',
                        '[attr.dir]': 'direction',
                        '[attr.thick]': 'thick'
                    },
                    template: "\n    <ng-container *ngIf=\"state$ | async; let state\">\n      <div class=\"ng-progress-bar\"\n            [class.-active]=\"state.active\"\n            [style.transition]=\"'opacity ' + speed + 'ms ' + ease\">\n        <div class=\"ng-bar-placeholder\">\n          <div class=\"ng-bar\"\n                [style.transform]=\"state.transform\"\n                [style.backgroundColor]=\"color\"\n                [style.transition]=\"state.active ? 'all ' + speed + 'ms ' + ease : 'none'\">\n            <div *ngIf=\"meteor\" class=\"ng-meteor\" [style.boxShadow]=\"'0 0 10px '+ color + ', 0 0 5px ' + color\"></div>\n          </div>\n        </div>\n        <div *ngIf=\"spinner\" class=\"ng-spinner\">\n          <div class=\"ng-spinner-icon\"\n                [style.borderTopColor]=\"color\"\n                [style.borderLeftColor]=\"color\"></div>\n        </div>\n      </div>\n    </ng-container>\n  ",
                    styles: ["ng-progress{z-index:999999;pointer-events:none;position:relative}.ng-progress-bar{z-index:999999;top:0;left:0;width:100%;position:fixed;zoom:1;opacity:0}.ng-progress-bar.-active{opacity:1;transition:none}.ng-bar-placeholder{position:absolute;height:2px;width:100%}.ng-bar{width:100%;height:100%;-webkit-transform:translate(-100%,0,0);transform:translate(-100%,0,0)}.ng-meteor{display:block;position:absolute;width:100px;height:100%;opacity:1}.ng-spinner{display:block;position:fixed;z-index:1031;top:15px}.ng-spinner-icon{width:18px;height:18px;box-sizing:border-box;-webkit-animation:.4s linear infinite spinner-animation;animation:.4s linear infinite spinner-animation;border:2px solid transparent;border-radius:50%}[dir='ltr+'] .ng-meteor,[dir=ltr-] .ng-meteor{-webkit-transform:rotate(3deg);transform:rotate(3deg)}[dir='ltr+'][thick=true] .ng-meteor,[dir=ltr-][thick=true] .ng-meteor{-webkit-transform:rotate(4deg);transform:rotate(4deg)}[dir='ltr+'] .ng-bar,[dir='rtl+'] .ng-bar{margin-left:-100%}[dir='ltr+'] .ng-meteor,[dir='rtl+'] .ng-meteor{right:0}[dir='ltr+'] .ng-meteor,[dir=rtl-] .ng-meteor{top:-3px}[dir='ltr+'][thick=true] .ng-meteor,[dir=rtl-][thick=true] .ng-meteor{top:-4px}[dir='rtl+'] .ng-meteor,[dir=ltr-] .ng-meteor{bottom:-3px}[dir='rtl+'][thick=true] .ng-meteor,[dir=ltr-][thick=true] .ng-meteor{bottom:-4px}[dir='rtl+'] .ng-bar-placeholder,[dir=ltr-] .ng-bar-placeholder{-webkit-transform:rotate(180deg);transform:rotate(180deg)}[dir='rtl+'] .ng-spinner-icon,[dir=ltr-] .ng-spinner-icon{animation-direction:reverse}[dir='rtl+'] .ng-meteor,[dir=rtl-] .ng-meteor{-webkit-transform:rotate(-3deg);transform:rotate(-3deg)}[dir='rtl+'][thick=true] .ng-meteor,[dir=rtl-][thick=true] .ng-meteor{-webkit-transform:rotate(-4deg);transform:rotate(-4deg)}[thick=true] .ng-spinner-icon{width:24px;height:24px;border-width:3px}[thick=true] .ng-bar-placeholder{height:3px}[spinnerPosition=left] .ng-spinner{left:15px;right:unset}[spinnerPosition=right] .ng-spinner{right:15px}@-webkit-keyframes spinner-animation{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spinner-animation{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}"],
                    encapsulation: core.ViewEncapsulation.None,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false
                },] },
    ];
    /** @nocollapse */
    NgProgressComponent.ctorParameters = function () {
        return [
            { type: NgProgress, },
        ];
    };
    NgProgressComponent.propDecorators = {
        "id": [{ type: core.Input },],
        "spinnerPosition": [{ type: core.Input },],
        "direction": [{ type: core.Input },],
        "ease": [{ type: core.Input },],
        "color": [{ type: core.Input },],
        "meteor": [{ type: core.Input },],
        "spinner": [{ type: core.Input },],
        "thick": [{ type: core.Input },],
        "max": [{ type: core.Input },],
        "min": [{ type: core.Input },],
        "speed": [{ type: core.Input },],
        "trickleSpeed": [{ type: core.Input },],
        "trickleFunc": [{ type: core.Input },],
        "debounceTime": [{ type: core.Input },],
        "started": [{ type: core.Output },],
        "completed": [{ type: core.Output },],
    };
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * @param {?} config
     * @return {?}
     */
    function NgProgressFactory(config) {
        return new NgProgress(config);
    }
    var NgProgressModule = (function () {
        function NgProgressModule() {
        }
        /**
         * @param {?=} config
         * @return {?}
         */
        NgProgressModule.forRoot = function (config) {
            return {
                ngModule: NgProgressModule,
                providers: [
                    { provide: CONFIG, useValue: config },
                    {
                        provide: NgProgress,
                        useFactory: NgProgressFactory,
                        deps: [CONFIG]
                    }
                ]
            };
        };
        return NgProgressModule;
    }());
    NgProgressModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [NgProgressComponent],
                    exports: [NgProgressComponent],
                    imports: [common.CommonModule]
                },] },
    ];

    exports.NgProgressFactory = NgProgressFactory;
    exports.NgProgressModule = NgProgressModule;
    exports.NgProgressComponent = NgProgressComponent;
    exports.NgProgressRef = NgProgressRef;
    exports.NgProgress = NgProgress;
    exports.ɵa = CONFIG;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-progressbar-core.umd.js.map
