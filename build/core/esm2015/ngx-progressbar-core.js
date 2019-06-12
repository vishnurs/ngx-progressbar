import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { timer } from 'rxjs/observable/timer';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';
import { skip } from 'rxjs/operators/skip';
import { delay } from 'rxjs/operators/delay';
import { filter } from 'rxjs/operators/filter';
import { debounce } from 'rxjs/operators/debounce';
import { switchMap } from 'rxjs/operators/switchMap';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { InjectionToken, Injectable, Inject, Optional, Component, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewEncapsulation, NgModule } from '@angular/core';
import { empty } from 'rxjs/observable/empty';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgProgressRef {
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
        /**
             * Trickling stream starts the timer that increment the progress bar continuously
             * This stream makes it possible to use latest config values while incrementing
             */
        this._trickling$.pipe(debounce((start) => timer(start ? this._config.debounceTime : 0)), combineLatest(this.config$), switchMap(([start, config]) => start ? this._trickling(config) : this._complete(config))).subscribe();
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const CONFIG = new InjectionToken('config');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const ɵ0 = (n) => {
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
const defaultConfig = {
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
class NgProgress {
    /**
     * @param {?} config
     */
    constructor(config) {
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
    ref(id = 'root', config) {
        if (this._instances[id] instanceof NgProgressRef) {
            return this._instances[id];
        }
        else {
            config = Object.assign({}, this.config, config);
            return this._instances[id] = new NgProgressRef(config);
        }
    }
    /**
     * @param {?} config
     * @param {?=} id
     * @return {?}
     */
    setConfig(config, id = 'root') {
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].setConfig(config);
        }
    }
    /**
     * @param {?=} id
     * @return {?}
     */
    start(id = 'root') {
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].start();
        }
    }
    /**
     * @param {?} n
     * @param {?=} id
     * @return {?}
     */
    set(n, id = 'root') {
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].set(n);
        }
    }
    /**
     * @param {?=} n
     * @param {?=} id
     * @return {?}
     */
    inc(n, id = 'root') {
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].inc(n);
        }
    }
    /**
     * @param {?=} id
     * @return {?}
     */
    complete(id = 'root') {
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].complete();
        }
    }
    /**
     * @param {?=} id
     * @return {?}
     */
    isStarted(id = 'root') {
        return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].isStarted : false;
    }
    /**
     * @param {?=} id
     * @return {?}
     */
    started(id = 'root') {
        return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].started : empty();
    }
    /**
     * @param {?=} id
     * @return {?}
     */
    completed(id = 'root') {
        return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].ended : empty();
    }
    /**
     * @param {?=} id
     * @return {?}
     */
    destroy(id = 'root') {
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].destroy();
            this._instances[id] = null;
        }
    }
    /**
     * @return {?}
     */
    destroyAll() {
        Object.keys(this._instances).map((key) => {
            this._instances[key].destroy();
            this._instances[key] = null;
        });
    }
}
NgProgress.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NgProgress.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CONFIG,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright ngx-progressbar All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/MurhafSousli/ngx-progressbar/blob/master/LICENSE
 */
class NgProgressComponent {
    /**
     * @param {?} _ngProgress
     */
    constructor(_ngProgress) {
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
        this.started = new EventEmitter();
        this.completed = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
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
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // Get progress bar service instance
        this.progressRef = this._ngProgress.ref(this.id, {
            max: this.max,
            min: this.min,
            speed: this.speed,
            trickleSpeed: this.trickleSpeed,
            debounceTime: this.debounceTime
        });
        this.state$ = this.progressRef.state$.pipe(map((state) => ({
            active: state.active,
            transform: `translate3d(${state.value}%,0,0)`
        })));
        /** Subscribes to started and completed events when user used them */
        if (this.started.observers.length) {
            this._started$ = this.progressRef.started.subscribe(() => this.started.emit());
        }
        if (this.completed.observers.length) {
            this._completed$ = this.progressRef.completed.subscribe(() => this.completed.emit());
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._started$) {
            this._started$.unsubscribe();
        }
        if (this._completed$) {
            this._completed$.unsubscribe();
        }
        this._ngProgress.destroy(this.id);
    }
    /**
     * @return {?}
     */
    start() {
        this.progressRef.start();
    }
    /**
     * @return {?}
     */
    complete() {
        this.progressRef.complete();
    }
    /**
     * @param {?=} n
     * @return {?}
     */
    inc(n) {
        this.progressRef.inc(n);
    }
    /**
     * @param {?} n
     * @return {?}
     */
    set(n) {
        this.progressRef.set(n);
    }
    /**
     * @return {?}
     */
    get isStarted() {
        return this.progressRef.isStarted;
    }
}
NgProgressComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-progress',
                host: {
                    'role': 'progressbar',
                    '[attr.spinnerPosition]': 'spinnerPosition',
                    '[attr.dir]': 'direction',
                    '[attr.thick]': 'thick'
                },
                template: `
    <ng-container *ngIf="state$ | async; let state">
      <div class="ng-progress-bar"
            [class.-active]="state.active"
            [style.transition]="'opacity ' + speed + 'ms ' + ease">
        <div class="ng-bar-placeholder">
          <div class="ng-bar"
                [style.transform]="state.transform"
                [style.backgroundColor]="color"
                [style.transition]="state.active ? 'all ' + speed + 'ms ' + ease : 'none'">
            <div *ngIf="meteor" class="ng-meteor" [style.boxShadow]="'0 0 10px '+ color + ', 0 0 5px ' + color"></div>
          </div>
        </div>
        <div *ngIf="spinner" class="ng-spinner">
          <div class="ng-spinner-icon"
                [style.borderTopColor]="color"
                [style.borderLeftColor]="color"></div>
        </div>
      </div>
    </ng-container>
  `,
                styles: [`ng-progress{z-index:999999;pointer-events:none;position:relative}.ng-progress-bar{z-index:999999;top:0;left:0;width:100%;position:fixed;zoom:1;opacity:0}.ng-progress-bar.-active{opacity:1;-webkit-transition:none;transition:none}.ng-bar-placeholder{position:absolute;height:2px;width:100%}.ng-bar{width:100%;height:100%;-webkit-transform:translate(-100%,0,0);transform:translate(-100%,0,0)}.ng-meteor{display:block;position:absolute;width:100px;height:100%;opacity:1}.ng-spinner{display:block;position:fixed;z-index:1031;top:15px}.ng-spinner-icon{width:18px;height:18px;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-animation:.4s linear infinite spinner-animation;animation:.4s linear infinite spinner-animation;border:2px solid transparent;border-radius:50%}[dir='ltr+'] .ng-meteor,[dir=ltr-] .ng-meteor{-webkit-transform:rotate(3deg);transform:rotate(3deg)}[dir='ltr+'][thick=true] .ng-meteor,[dir=ltr-][thick=true] .ng-meteor{-webkit-transform:rotate(4deg);transform:rotate(4deg)}[dir='ltr+'] .ng-bar,[dir='rtl+'] .ng-bar{margin-left:-100%}[dir='ltr+'] .ng-meteor,[dir='rtl+'] .ng-meteor{right:0}[dir='ltr+'] .ng-meteor,[dir=rtl-] .ng-meteor{top:-3px}[dir='ltr+'][thick=true] .ng-meteor,[dir=rtl-][thick=true] .ng-meteor{top:-4px}[dir='rtl+'] .ng-meteor,[dir=ltr-] .ng-meteor{bottom:-3px}[dir='rtl+'][thick=true] .ng-meteor,[dir=ltr-][thick=true] .ng-meteor{bottom:-4px}[dir='rtl+'] .ng-bar-placeholder,[dir=ltr-] .ng-bar-placeholder{-webkit-transform:rotate(180deg);transform:rotate(180deg)}[dir='rtl+'] .ng-spinner-icon,[dir=ltr-] .ng-spinner-icon{animation-direction:reverse}[dir='rtl+'] .ng-meteor,[dir=rtl-] .ng-meteor{-webkit-transform:rotate(-3deg);transform:rotate(-3deg)}[dir='rtl+'][thick=true] .ng-meteor,[dir=rtl-][thick=true] .ng-meteor{-webkit-transform:rotate(-4deg);transform:rotate(-4deg)}[thick=true] .ng-spinner-icon{width:24px;height:24px;border-width:3px}[thick=true] .ng-bar-placeholder{height:3px}[spinnerPosition=left] .ng-spinner{left:15px;right:unset}[spinnerPosition=right] .ng-spinner{right:15px}@-webkit-keyframes spinner-animation{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spinner-animation{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}`],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false
            },] },
];
/** @nocollapse */
NgProgressComponent.ctorParameters = () => [
    { type: NgProgress, },
];
NgProgressComponent.propDecorators = {
    "id": [{ type: Input },],
    "spinnerPosition": [{ type: Input },],
    "direction": [{ type: Input },],
    "ease": [{ type: Input },],
    "color": [{ type: Input },],
    "meteor": [{ type: Input },],
    "spinner": [{ type: Input },],
    "thick": [{ type: Input },],
    "max": [{ type: Input },],
    "min": [{ type: Input },],
    "speed": [{ type: Input },],
    "trickleSpeed": [{ type: Input },],
    "trickleFunc": [{ type: Input },],
    "debounceTime": [{ type: Input },],
    "started": [{ type: Output },],
    "completed": [{ type: Output },],
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
class NgProgressModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
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
    }
}
NgProgressModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgProgressComponent],
                exports: [NgProgressComponent],
                imports: [CommonModule]
            },] },
];
/** @nocollapse */
NgProgressModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { NgProgressFactory, NgProgressModule, NgProgressComponent, NgProgressRef, NgProgress, CONFIG as ɵa };
//# sourceMappingURL=ngx-progressbar-core.js.map
