/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Subject, BehaviorSubject, timer, of, combineLatest } from 'rxjs';
import { tap, map, skip, delay, filter, debounce, switchMap, distinctUntilChanged } from 'rxjs/operators';
export class NgProgressRef {
    /**
     * @param {?} customConfig
     */
    constructor(customConfig) {
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
        combineLatest(this._trickling$, this.config$).pipe(debounce(([start, config]) => timer(start ? this._config.debounceTime : 0)), switchMap(([start, config]) => start ? this._trickling(config) : this._complete(config))).subscribe();
        this.setConfig(customConfig);
    }
    /**
     * @return {?}
     */
    get isStarted() {
        return this._state.active;
    }
    /**
     * Progress start event
     * @return {?}
     */
    get started() {
        return this.state$.pipe(map((state) => state.active), distinctUntilChanged(), filter(active => active));
    }
    /**
     * Progress ended event
     * @return {?}
     */
    get completed() {
        return this.state$.pipe(map((state) => state.active), distinctUntilChanged(), filter(active => !active), skip(1));
    }
    /**
     * @return {?}
     */
    start() {
        this._trickling$.next(true);
    }
    /**
     * @return {?}
     */
    complete() {
        this._trickling$.next(false);
    }
    /**
     * @param {?=} amount
     * @return {?}
     */
    inc(amount) {
        const /** @type {?} */ n = this._state.value;
        if (!this.isStarted) {
            this.start();
        }
        else {
            if (typeof amount !== 'number') {
                amount = this._config.trickleFunc(n);
            }
            this.set(n + amount);
        }
    }
    /**
     * @param {?} n
     * @return {?}
     */
    set(n) {
        this._setState({ value: this._clamp(n), active: true });
    }
    /**
     * @param {?} config
     * @return {?}
     */
    setConfig(config) {
        this._config = Object.assign({}, this._config, config);
        this.config$.next(this._config);
    }
    /**
     * Meant to be used internally and not by user directly
     * Users should use NgProgressManager.destroy(id) instead
     * @return {?}
     */
    destroy() {
        this._trickling$.complete();
        this.state$.complete();
        this.config$.complete();
    }
    /**
     * @param {?} state
     * @return {?}
     */
    _setState(state) {
        this._state = Object.assign({}, this._state, state);
        this.state$.next(this._state);
    }
    /**
     * Clamps a value to be between min and max
     * @param {?} n
     * @return {?}
     */
    _clamp(n) {
        return Math.max(this._config.min, Math.min(this._config.max, n));
    }
    /**
     * Keeps incrementing the progress
     * @param {?} config
     * @return {?}
     */
    _trickling(config) {
        if (!this.isStarted) {
            this.set(this._config.min);
        }
        return timer(0, config.trickleSpeed).pipe(tap(() => this.inc()));
    }
    /**
     * Completes then resets the progress
     * @param {?} config
     * @return {?}
     */
    _complete(config) {
        return !this.isStarted ? of({}) : of({}).pipe(
        // Completes the progress
        tap(() => this._setState({ value: 100 })), 
        // Hides the progress bar after a tiny delay
        delay(config.speed * 1.7), tap(() => this._setState({ active: false })), 
        // Resets the progress state
        delay(config.speed), tap(() => this._setState({ value: 0 })));
    }
}
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
