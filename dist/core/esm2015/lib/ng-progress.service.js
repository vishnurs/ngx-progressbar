/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable, Inject, Optional } from '@angular/core';
import { NgProgressRef } from './ng-progress-ref';
import { EMPTY } from 'rxjs';
import { CONFIG } from './ng-progress.token';
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
const /** @type {?} */ defaultConfig = {
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
export class NgProgress {
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
        return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].started : EMPTY;
    }
    /**
     * @param {?=} id
     * @return {?}
     */
    completed(id = 'root') {
        return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].completed : EMPTY;
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
function NgProgress_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    NgProgress.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    NgProgress.ctorParameters;
    /**
     * Stores NgProgressRef instances
     * @type {?}
     */
    NgProgress.prototype._instances;
    /**
     * Global config
     * @type {?}
     */
    NgProgress.prototype.config;
}
export { ɵ0 };
//# sourceMappingURL=ng-progress.service.js.map
