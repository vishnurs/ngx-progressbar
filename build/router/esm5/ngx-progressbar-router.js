import { NgModule } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { NgProgress } from '@ngx-progressbar/core';

var NgProgressRouterModule = (function () {
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
NgProgressRouterModule.ctorParameters = function () { return [
    { type: NgProgress, },
    { type: Router, },
]; };

export { NgProgressRouterModule };
//# sourceMappingURL=ngx-progressbar-router.js.map
