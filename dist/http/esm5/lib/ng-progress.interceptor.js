/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable, Optional, Inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NgProgress } from '@ngx-progressbar/core';
import { CONFIG } from './ng-progress-http.token';
var NgProgressInterceptor = /** @class */ (function () {
    /**
     * @param {?} _ngProgress
     * @param {?=} _config
     */
    function NgProgressInterceptor(_ngProgress, _config) {
        this._ngProgress = _ngProgress;
        this._config = _config;
        this._inProgressCount = 0;
    }
    /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    NgProgressInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        // Ignore silent api requests
        if (this.checkUrl(req)) {
            return next.handle(req);
        }
        this._inProgressCount++;
        if (!this._ngProgress.ref('root').isStarted) {
            this._ngProgress.start();
        }
        return next.handle(req).pipe(finalize(function () {
            _this._inProgressCount--;
            if (_this._inProgressCount === 0) {
                _this._ngProgress.complete();
            }
        }));
    };
    /**
     * Check if request is silent.
     * @param {?} req request
     * @return {?}
     */
    NgProgressInterceptor.prototype.checkUrl = function (req) {
        var /** @type {?} */ url = req.url.toLowerCase();
        var /** @type {?} */ found = this._config.silentApis.find(function (u) { return url.startsWith(u); });
        return !!found;
    };
    return NgProgressInterceptor;
}());
export { NgProgressInterceptor };
NgProgressInterceptor.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NgProgressInterceptor.ctorParameters = function () { return [
    { type: NgProgress, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CONFIG,] },] },
]; };
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
