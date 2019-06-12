import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NgProgressHttpConfig } from './ng-progress-http.interface';
import { NgProgress } from '@ngx-progressbar/core';
export declare class NgProgressInterceptor implements HttpInterceptor {
    private _ngProgress;
    private _config;
    private _inProgressCount;
    constructor(_ngProgress: NgProgress, _config?: NgProgressHttpConfig);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    private checkUrl(req);
}
