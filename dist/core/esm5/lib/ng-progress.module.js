/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgProgressComponent } from './ng-progress.component';
import { NgProgress } from './ng-progress.service';
import { CONFIG } from './ng-progress.token';
/**
 * @param {?} config
 * @return {?}
 */
export function NgProgressFactory(config) {
    return new NgProgress(config);
}
var NgProgressModule = /** @class */ (function () {
    function NgProgressModule() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    NgProgressModule.forRoot = function (config) {
        return {
            ngModule: NgProgressModule,
            providers: [
                { provide: CONFIG, useValue: config },
                {
                    provide: NgProgress,
                    useFactory: NgProgressFactory,
                    deps: [CONFIG]
                }
            ]
        };
    };
    return NgProgressModule;
}());
export { NgProgressModule };
NgProgressModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgProgressComponent],
                exports: [NgProgressComponent],
                imports: [CommonModule]
            },] },
];
function NgProgressModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    NgProgressModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    NgProgressModule.ctorParameters;
}
//# sourceMappingURL=ng-progress.module.js.map
