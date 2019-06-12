import { InjectionToken, Injectable, Optional, Inject, NgModule } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NgProgress } from '@ngx-progressbar/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ CONFIG = new InjectionToken('config');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
NgProgressInterceptor.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NgProgressInterceptor.ctorParameters = function () { return [
    { type: NgProgress, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CONFIG,] },] },
]; };

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ defaultConfig = {
    silentApis: []
};
var NgProgressHttpModule = /** @class */ (function () {
    function NgProgressHttpModule() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    NgProgressHttpModule.forRoot = function (config) {
        config = Object.assign({}, defaultConfig, config);
        return {
            ngModule: NgProgressHttpModule,
            providers: [
                { provide: CONFIG, useValue: config },
                { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }
            ]
        };
    };
    return NgProgressHttpModule;
}());
NgProgressHttpModule.decorators = [
    { type: NgModule, args: [{},] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { NgProgressHttpModule };
//# sourceMappingURL=ngx-progressbar-http.js.map
