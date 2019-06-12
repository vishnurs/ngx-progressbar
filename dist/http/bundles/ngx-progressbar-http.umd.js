(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/operators'), require('@ngx-progressbar/core'), require('@angular/common/http')) :
    typeof define === 'function' && define.amd ? define('@ngx-progressbar/http', ['exports', '@angular/core', 'rxjs/operators', '@ngx-progressbar/core', '@angular/common/http'], factory) :
    (factory((global['ngx-progressbar'] = global['ngx-progressbar'] || {}, global['ngx-progressbar'].http = {}),global.ng.core,global.Rx.Observable.prototype,global.core$1,global.ng.common.http));
}(this, (function (exports,core,operators,core$1,http) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var /** @type {?} */ CONFIG = new core.InjectionToken('config');
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var NgProgressInterceptor = (function () {
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
            return next.handle(req).pipe(operators.finalize(function () {
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
        { type: core.Injectable },
    ];
    /** @nocollapse */
    NgProgressInterceptor.ctorParameters = function () {
        return [
            { type: core$1.NgProgress, },
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [CONFIG,] },] },
        ];
    };
    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var /** @type {?} */ defaultConfig = {
        silentApis: []
    };
    var NgProgressHttpModule = (function () {
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
                    { provide: http.HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }
                ]
            };
        };
        return NgProgressHttpModule;
    }());
    NgProgressHttpModule.decorators = [
        { type: core.NgModule, args: [{},] },
    ];

    exports.NgProgressHttpModule = NgProgressHttpModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-progressbar-http.umd.js.map
