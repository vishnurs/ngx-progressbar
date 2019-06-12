import { NgModule } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgProgress } from '@ngx-progressbar/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgProgressRouterModule = /** @class */ (function () {
    /**
     * @param {?} progress
     * @param {?} router
     */
    function NgProgressRouterModule(progress, router) {
        router.events.subscribe(function (event) {
            if (event instanceof NavigationStart) {
                progress.start();
            }
            if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
                progress.complete();
            }
        });
    }
    return NgProgressRouterModule;
}());
NgProgressRouterModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
NgProgressRouterModule.ctorParameters = function () { return [
    { type: NgProgress, },
    { type: Router, },
]; };

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { NgProgressRouterModule };
//# sourceMappingURL=ngx-progressbar-router.js.map
