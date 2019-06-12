(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/operators/finalize'), require('@ngx-progressbar/core'), require('@angular/common/http')) :
	typeof define === 'function' && define.amd ? define('@ngx-progressbar/http', ['exports', '@angular/core', 'rxjs/operators/finalize', '@ngx-progressbar/core', '@angular/common/http'], factory) :
	(factory((global['ngx-progressbar'] = global['ngx-progressbar'] || {}, global['ngx-progressbar'].http = {}),global.ng.core,global.Rx.Observable.prototype,global.core$1,global.ng.common.http));
}(this, (function (exports,core,finalize,core$1,http) { 'use strict';

var CONFIG = new core.InjectionToken('config');
var NgProgressInterceptor = (function () {
    function NgProgressInterceptor(_ngProgress, _config) {
        this._ngProgress = _ngProgress;
        this._config = _config;
        this._inProgressCount = 0;
    }
    NgProgressInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        if (this.checkUrl(req)) {
            return next.handle(req);
        }
        this._inProgressCount++;
        if (!this._ngProgress.ref('root').isStarted) {
            this._ngProgress.start();
        }
        return next.handle(req).pipe(finalize.finalize(function () {
            _this._inProgressCount--;
            if (_this._inProgressCount === 0) {
                _this._ngProgress.complete();
            }
        }));
    };
    NgProgressInterceptor.prototype.checkUrl = function (req) {
        var url = req.url.toLowerCase();
        var found = this._config.silentApis.find(function (u) { return url.startsWith(u); });
        return !!found;
    };
    return NgProgressInterceptor;
}());
NgProgressInterceptor.decorators = [
    { type: core.Injectable },
];
NgProgressInterceptor.ctorParameters = function () { return [
    { type: core$1.NgProgress, },
    { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [CONFIG,] },] },
]; };
var NgProgressHttpModule = (function () {
    function NgProgressHttpModule() {
    }
    return NgProgressHttpModule;
}());
NgProgressHttpModule.decorators = [
    { type: core.NgModule, args: [{
                providers: [
                    { provide: http.HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }
                ],
            },] },
];
NgProgressHttpModule.ctorParameters = function () { return []; };

exports.NgProgressHttpModule = NgProgressHttpModule;
exports.ɵb = CONFIG;
exports.ɵa = NgProgressInterceptor;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-progressbar-http.umd.js.map
