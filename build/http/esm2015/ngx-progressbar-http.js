import { InjectionToken, Injectable, Optional, Inject, NgModule } from '@angular/core';
import { finalize } from 'rxjs/operators/finalize';
import { NgProgress } from '@ngx-progressbar/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const CONFIG = new InjectionToken('config');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgProgressInterceptor {
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
     * @param {?} req
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgProgressHttpModule {
}
NgProgressHttpModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }
                ],
            },] },
];
/** @nocollapse */
NgProgressHttpModule.ctorParameters = () => [];

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

export { NgProgressHttpModule, CONFIG as ɵb, NgProgressInterceptor as ɵa };
//# sourceMappingURL=ngx-progressbar-http.js.map
