/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgProgress } from '@ngx-progressbar/core';
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
export { NgProgressRouterModule };
NgProgressRouterModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
NgProgressRouterModule.ctorParameters = function () { return [
    { type: NgProgress, },
    { type: Router, },
]; };
function NgProgressRouterModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    NgProgressRouterModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    NgProgressRouterModule.ctorParameters;
}
//# sourceMappingURL=ng-progress-router.module.js.map
