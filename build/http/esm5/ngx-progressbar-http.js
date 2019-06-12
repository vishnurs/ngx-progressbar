import { InjectionToken, Injectable, Optional, Inject, NgModule } from '@angular/core';
import { finalize } from 'rxjs/operators/finalize';
import { NgProgress } from '@ngx-progressbar/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

var CONFIG = new InjectionToken('config');
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
        return next.handle(req).pipe(finalize(function () {
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
    { type: Injectable },
];
NgProgressInterceptor.ctorParameters = function () { return [
    { type: NgProgress, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CONFIG,] },] },
]; };
var NgProgressHttpModule = (function () {
    function NgProgressHttpModule() {
    }
    return NgProgressHttpModule;
}());
NgProgressHttpModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }
                ],
            },] },
];
NgProgressHttpModule.ctorParameters = function () { return []; };

export { NgProgressHttpModule, CONFIG as ɵb, NgProgressInterceptor as ɵa };
//# sourceMappingURL=ngx-progressbar-http.js.map
