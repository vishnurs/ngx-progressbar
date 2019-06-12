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
import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewEncapsulation } from '@angular/core';
import { NgProgress } from './ng-progress.service';
import { NgProgressRef } from './ng-progress-ref';
import { map } from 'rxjs/operators';
export class NgProgressComponent {
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
                styles: [`ng-progress{z-index:999999;pointer-events:none;position:relative}.ng-progress-bar{z-index:999999;top:0;left:0;width:100%;position:fixed;zoom:1;opacity:0}.ng-progress-bar.-active{opacity:1;transition:none}.ng-bar-placeholder{position:absolute;height:2px;width:100%}.ng-bar{width:100%;height:100%;-webkit-transform:translate(-100%,0,0);transform:translate(-100%,0,0)}.ng-meteor{display:block;position:absolute;width:100px;height:100%;opacity:1}.ng-spinner{display:block;position:fixed;z-index:1031;top:15px}.ng-spinner-icon{width:18px;height:18px;box-sizing:border-box;-webkit-animation:.4s linear infinite spinner-animation;animation:.4s linear infinite spinner-animation;border:2px solid transparent;border-radius:50%}[dir='ltr+'] .ng-meteor,[dir=ltr-] .ng-meteor{-webkit-transform:rotate(3deg);transform:rotate(3deg)}[dir='ltr+'][thick=true] .ng-meteor,[dir=ltr-][thick=true] .ng-meteor{-webkit-transform:rotate(4deg);transform:rotate(4deg)}[dir='ltr+'] .ng-bar,[dir='rtl+'] .ng-bar{margin-left:-100%}[dir='ltr+'] .ng-meteor,[dir='rtl+'] .ng-meteor{right:0}[dir='ltr+'] .ng-meteor,[dir=rtl-] .ng-meteor{top:-3px}[dir='ltr+'][thick=true] .ng-meteor,[dir=rtl-][thick=true] .ng-meteor{top:-4px}[dir='rtl+'] .ng-meteor,[dir=ltr-] .ng-meteor{bottom:-3px}[dir='rtl+'][thick=true] .ng-meteor,[dir=ltr-][thick=true] .ng-meteor{bottom:-4px}[dir='rtl+'] .ng-bar-placeholder,[dir=ltr-] .ng-bar-placeholder{-webkit-transform:rotate(180deg);transform:rotate(180deg)}[dir='rtl+'] .ng-spinner-icon,[dir=ltr-] .ng-spinner-icon{animation-direction:reverse}[dir='rtl+'] .ng-meteor,[dir=rtl-] .ng-meteor{-webkit-transform:rotate(-3deg);transform:rotate(-3deg)}[dir='rtl+'][thick=true] .ng-meteor,[dir=rtl-][thick=true] .ng-meteor{-webkit-transform:rotate(-4deg);transform:rotate(-4deg)}[thick=true] .ng-spinner-icon{width:24px;height:24px;border-width:3px}[thick=true] .ng-bar-placeholder{height:3px}[spinnerPosition=left] .ng-spinner{left:15px;right:unset}[spinnerPosition=right] .ng-spinner{right:15px}@-webkit-keyframes spinner-animation{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spinner-animation{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}`],
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
function NgProgressComponent_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    NgProgressComponent.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    NgProgressComponent.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    NgProgressComponent.propDecorators;
    /** @type {?} */
    NgProgressComponent.prototype._started$;
    /** @type {?} */
    NgProgressComponent.prototype._completed$;
    /**
     * Progress bar worker
     * @type {?}
     */
    NgProgressComponent.prototype.progressRef;
    /**
     * Progress state stream
     * @type {?}
     */
    NgProgressComponent.prototype.state$;
    /**
     * Creates a new instance if id is not already exists
     * @type {?}
     */
    NgProgressComponent.prototype.id;
    /**
     * Initializes inputs from the global config
     * @type {?}
     */
    NgProgressComponent.prototype.spinnerPosition;
    /** @type {?} */
    NgProgressComponent.prototype.direction;
    /** @type {?} */
    NgProgressComponent.prototype.ease;
    /** @type {?} */
    NgProgressComponent.prototype.color;
    /** @type {?} */
    NgProgressComponent.prototype.meteor;
    /** @type {?} */
    NgProgressComponent.prototype.spinner;
    /** @type {?} */
    NgProgressComponent.prototype.thick;
    /** @type {?} */
    NgProgressComponent.prototype.max;
    /** @type {?} */
    NgProgressComponent.prototype.min;
    /** @type {?} */
    NgProgressComponent.prototype.speed;
    /** @type {?} */
    NgProgressComponent.prototype.trickleSpeed;
    /** @type {?} */
    NgProgressComponent.prototype.trickleFunc;
    /** @type {?} */
    NgProgressComponent.prototype.debounceTime;
    /** @type {?} */
    NgProgressComponent.prototype.started;
    /** @type {?} */
    NgProgressComponent.prototype.completed;
    /** @type {?} */
    NgProgressComponent.prototype._ngProgress;
}
//# sourceMappingURL=ng-progress.component.js.map
