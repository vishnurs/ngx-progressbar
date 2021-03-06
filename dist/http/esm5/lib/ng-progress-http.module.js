/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressInterceptor } from './ng-progress.interceptor';
import { CONFIG } from './ng-progress-http.token';
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
export { NgProgressHttpModule };
NgProgressHttpModule.decorators = [
    { type: NgModule, args: [{},] },
];
function NgProgressHttpModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    NgProgressHttpModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    NgProgressHttpModule.ctorParameters;
}
//# sourceMappingURL=ng-progress-http.module.js.map
