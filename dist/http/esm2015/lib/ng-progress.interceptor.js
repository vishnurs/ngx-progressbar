/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable, Optional, Inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NgProgress } from '@ngx-progressbar/core';
import { CONFIG } from './ng-progress-http.token';
export class NgProgressInterceptor {
    /**
     * @param {?} _ngProgress
     * @param {?=} _config
     */
    constructor(_ngProgress, _config) {
        this._ngProgress = _ngProgress;
        this._config = _config;
        this._inProgressCount = 0;
    }
    /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    intercept(req, next) {
        // Ignore silent api requests
        if (this.checkUrl(req)) {
            return next.handle(req);
        }
        this._inProgressCount++;
        if (!this._ngProgress.ref('root').isStarted) {
            this._ngProgress.start();
        }
        return next.handle(req).pipe(finalize(() => {
            this._inProgressCount--;
            if (this._inProgressCount === 0) {
                this._ngProgress.complete();
            }
        }));
    }
    /**
     * Check if request is silent.
     * @param {?} req request
     * @return {?}
     */
    checkUrl(req) {
        const /** @type {?} */ url = req.url.toLowerCase();
        const /** @type {?} */ found = this._config.silentApis.find((u) => url.startsWith(u));
        return !!found;
    }
}
NgProgressInterceptor.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NgProgressInterceptor.ctorParameters = () => [
    { type: NgProgress, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CONFIG,] },] },
];
function NgProgressInterceptor_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    NgProgressInterceptor.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    NgProgressInterceptor.ctorParameters;
    /** @type {?} */
    NgProgressInterceptor.prototype._inProgressCount;
    /** @type {?} */
    NgProgressInterceptor.prototype._ngProgress;
    /** @type {?} */
    NgProgressInterceptor.prototype._config;
}
//# sourceMappingURL=ng-progress.interceptor.js.map
