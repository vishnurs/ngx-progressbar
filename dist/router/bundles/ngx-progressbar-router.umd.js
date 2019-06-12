(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/router'), require('@ngx-progressbar/core')) :
    typeof define === 'function' && define.amd ? define('@ngx-progressbar/router', ['exports', '@angular/core', '@angular/router', '@ngx-progressbar/core'], factory) :
    (factory((global['ngx-progressbar'] = global['ngx-progressbar'] || {}, global['ngx-progressbar'].router = {}),global.ng.core,global.ng.router,global.core$1));
}(this, (function (exports,core,router,core$1) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var NgProgressRouterModule = (function () {
        /**
         * @param {?} progress
         * @param {?} router
         */
        function NgProgressRouterModule(progress, router$$1) {
            router$$1.events.subscribe(function (event) {
                if (event instanceof router.NavigationStart) {
                    progress.start();
                }
                if (event instanceof router.NavigationEnd || event instanceof router.NavigationCancel || event instanceof router.NavigationError) {
                    progress.complete();
                }
            });
        }
        return NgProgressRouterModule;
    }());
    NgProgressRouterModule.decorators = [
        { type: core.NgModule, args: [{},] },
    ];
    /** @nocollapse */
    NgProgressRouterModule.ctorParameters = function () {
        return [
            { type: core$1.NgProgress, },
            { type: router.Router, },
        ];
    };

    exports.NgProgressRouterModule = NgProgressRouterModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-progressbar-router.umd.js.map
