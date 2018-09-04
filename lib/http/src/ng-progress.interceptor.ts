import { Injectable, Optional, Inject } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators/finalize';
import { NgProgress } from '@ngx-progressbar/core';
import { CONFIG } from './ng-progress-http.token';


@Injectable()
export class NgProgressInterceptor implements HttpInterceptor {

  private _inProgressCount = 0;

  constructor(private _ngProgress: NgProgress, @Optional() @Inject(CONFIG) private _config?) {
  }

  // Ignoring specific requests will be supported after this https://github.com/angular/angular/issues/18155
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.checkUrl(req)) {
      return next.handle(req);
    }
    this._inProgressCount++;
    if (!this._ngProgress.ref('root').isStarted) {
      this._ngProgress.start();
    }
    return next.handle(req).pipe(finalize(() => {
      this._inProgressCount--;
      if (this._inProgressCount === 0) {
        this._ngProgress.complete();
      }
    }));
  }

  private checkUrl(req: HttpRequest<any>) {
    const url = req.url.toLowerCase();
    const found = this._config.silentApis.find((u) => url.startsWith(u));
    return !!found;
  }
}
