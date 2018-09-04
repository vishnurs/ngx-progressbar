import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgProgressInterceptor } from './ng-progress.interceptor';

import { CONFIG } from './ng-progress-http.token';

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }
  ],
})
const defaultConfig = {
  silentApis: []
}
export class NgProgressHttpModule {
  static forRoot(config?): ModuleWithProviders {
    config = {...defaultConfig, ...config};
    return {
      ngModule: NgProgressHttpModule,
      providers: [
        { provide: CONFIG, useValue: config },
        { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true }
      ]
    };
  }
}
