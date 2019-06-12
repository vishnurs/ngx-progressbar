import { NgModule } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgProgress } from '@ngx-progressbar/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgProgressRouterModule {
    /**
     * @param {?} progress
     * @param {?} router
     */
    constructor(progress, router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                progress.start();
            }
            if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
                progress.complete();
            }
        });
    }
}
NgProgressRouterModule.decorators = [
    { type: NgModule, args: [{},] },
];
/** @nocollapse */
NgProgressRouterModule.ctorParameters = () => [
    { type: NgProgress, },
    { type: Router, },
];

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

export { NgProgressRouterModule };
//# sourceMappingURL=ngx-progressbar-router.js.map
