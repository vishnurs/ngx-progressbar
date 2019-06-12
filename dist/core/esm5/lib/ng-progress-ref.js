import * as tslib_1 from "tslib";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Subject, BehaviorSubject, timer, of, combineLatest } from 'rxjs';
import { tap, map, skip, delay, filter, debounce, switchMap, distinctUntilChanged } from 'rxjs/operators';
var NgProgressRef = /** @class */ (function () {
    /**
     * @param {?} customConfig
     */
    function NgProgressRef(customConfig) {
        var _this = this;
        this._state = { active: false, value: 0 };
        /**
         * Stream that increments and updates progress state
         */
        this._trickling$ = new Subject();
        /**
         * Stream that emits when progress state is changed
         */
        this.state$ = new BehaviorSubject(this._state);
        /**
         * Stream that emits when config is changed
         */
        this.config$ = new Subject();
        combineLatest(this._trickling$, this.config$).pipe(debounce(function (_a) {
            var _b = tslib_1.__read(_a, 2), start = _b[0], config = _b[1];
            return timer(start ? _this._config.debounceTime : 0);
        }), switchMap(function (_a) {
            var _b = tslib_1.__read(_a, 2), start = _b[0], config = _b[1];
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
            return this.state$.pipe(map(function (state) { return state.active; }), distinctUntilChanged(), filter(function (active) { return active; }));
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
            return this.state$.pipe(map(function (state) { return state.active; }), distinctUntilChanged(), filter(function (active) { return !active; }), skip(1));
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
        return timer(0, config.trickleSpeed).pipe(tap(function () { return _this.inc(); }));
    };
    /**
     * Completes then resets the progress
     * @param {?} config
     * @return {?}
     */
    NgProgressRef.prototype._complete = function (config) {
        var _this = this;
        return !this.isStarted ? of({}) : of({}).pipe(
        // Completes the progress
        tap(function () { return _this._setState({ value: 100 }); }), 
        // Hides the progress bar after a tiny delay
        delay(config.speed * 1.7), tap(function () { return _this._setState({ active: false }); }), 
        // Resets the progress state
        delay(config.speed), tap(function () { return _this._setState({ value: 0 }); }));
    };
    return NgProgressRef;
}());
export { NgProgressRef };
function NgProgressRef_tsickle_Closure_declarations() {
    /** @type {?} */
    NgProgressRef.prototype._state;
    /** @type {?} */
    NgProgressRef.prototype._config;
    /**
     * Stream that increments and updates progress state
     * @type {?}
     */
    NgProgressRef.prototype._trickling$;
    /**
     * Stream that emits when progress state is changed
     * @type {?}
     */
    NgProgressRef.prototype.state$;
    /**
     * Stream that emits when config is changed
     * @type {?}
     */
    NgProgressRef.prototype.config$;
}
//# sourceMappingURL=ng-progress-ref.js.map
