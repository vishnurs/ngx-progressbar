import { __read } from 'tslib';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { timer } from 'rxjs/observable/timer';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';
import { skip } from 'rxjs/operators/skip';
import { delay } from 'rxjs/operators/delay';
import { filter } from 'rxjs/operators/filter';
import { debounce } from 'rxjs/operators/debounce';
import { switchMap } from 'rxjs/operators/switchMap';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { InjectionToken, Injectable, Inject, Optional, Component, Input, Output, ChangeDetectionStrategy, EventEmitter, ViewEncapsulation, NgModule } from '@angular/core';
import { empty } from 'rxjs/observable/empty';
import { CommonModule } from '@angular/common';

var NgProgressRef = (function () {
    function NgProgressRef(customConfig) {
        var _this = this;
        this._state = { active: false, value: 0 };
        this._trickling$ = new Subject();
        this.state$ = new BehaviorSubject(this._state);
        this.config$ = new Subject();
        this._trickling$.pipe(debounce(function (start) { return timer(start ? _this._config.debounceTime : 0); }), combineLatest(this.config$), switchMap(function (_a) {
            var _b = __read(_a, 2), start = _b[0], config = _b[1];
            return start ? _this._trickling(config) : _this._complete(config);
        })).subscribe();
        this.setConfig(customConfig);
    }
    Object.defineProperty(NgProgressRef.prototype, "isStarted", {
        get: function () {
            return this._state.active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgProgressRef.prototype, "started", {
        get: function () {
            return this.state$.pipe(map(function (state) { return state.active; }), distinctUntilChanged(), filter(function (active) { return active; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgProgressRef.prototype, "completed", {
        get: function () {
            return this.state$.pipe(map(function (state) { return state.active; }), distinctUntilChanged(), filter(function (active) { return !active; }), skip(1));
        },
        enumerable: true,
        configurable: true
    });
    NgProgressRef.prototype.start = function () {
        this._trickling$.next(true);
    };
    NgProgressRef.prototype.complete = function () {
        this._trickling$.next(false);
    };
    NgProgressRef.prototype.inc = function (amount) {
        var n = this._state.value;
        if (!this.isStarted) {
            this.start();
        }
        else {
            if (typeof amount !== 'number') {
                amount = this._config.trickleFunc(n);
            }
            this.set(n + amount);
        }
    };
    NgProgressRef.prototype.set = function (n) {
        this._setState({ value: this._clamp(n), active: true });
    };
    NgProgressRef.prototype.setConfig = function (config) {
        this._config = Object.assign({}, this._config, config);
        this.config$.next(this._config);
    };
    NgProgressRef.prototype.destroy = function () {
        this._trickling$.complete();
        this.state$.complete();
        this.config$.complete();
    };
    NgProgressRef.prototype._setState = function (state) {
        this._state = Object.assign({}, this._state, state);
        this.state$.next(this._state);
    };
    NgProgressRef.prototype._clamp = function (n) {
        return Math.max(this._config.min, Math.min(this._config.max, n));
    };
    NgProgressRef.prototype._trickling = function (config) {
        var _this = this;
        if (!this.isStarted) {
            this.set(this._config.min);
        }
        return timer(0, config.trickleSpeed).pipe(tap(function () { return _this.inc(); }));
    };
    NgProgressRef.prototype._complete = function (config) {
        var _this = this;
        return !this.isStarted ? of({}) : of({}).pipe(tap(function () { return _this._setState({ value: 100 }); }), delay(config.speed * 1.7), tap(function () { return _this._setState({ active: false }); }), delay(config.speed), tap(function () { return _this._setState({ value: 0 }); }));
    };
    return NgProgressRef;
}());
var CONFIG = new InjectionToken('config');
var ɵ0 = function (n) {
    if (n >= 0 && n < 20)
        return 10;
    if (n >= 20 && n < 50)
        return 4;
    if (n >= 50 && n < 80)
        return 2;
    if (n >= 80 && n < 99)
        return 0.5;
    return 0;
};
var defaultConfig = {
    meteor: true,
    spinner: true,
    thick: false,
    ease: 'linear',
    spinnerPosition: 'right',
    direction: 'ltr+',
    color: '#1B95E0',
    max: 100,
    min: 8,
    speed: 200,
    trickleSpeed: 300,
    debounceTime: 0,
    trickleFunc: ɵ0
};
var NgProgress = (function () {
    function NgProgress(config) {
        this._instances = {};
        this.config = Object.assign({}, defaultConfig, config);
    }
    NgProgress.prototype.ref = function (id, config) {
        if (id === void 0) { id = 'root'; }
        if (this._instances[id] instanceof NgProgressRef) {
            return this._instances[id];
        }
        else {
            config = Object.assign({}, this.config, config);
            return this._instances[id] = new NgProgressRef(config);
        }
    };
    NgProgress.prototype.setConfig = function (config, id) {
        if (id === void 0) { id = 'root'; }
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].setConfig(config);
        }
    };
    NgProgress.prototype.start = function (id) {
        if (id === void 0) { id = 'root'; }
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].start();
        }
    };
    NgProgress.prototype.set = function (n, id) {
        if (id === void 0) { id = 'root'; }
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].set(n);
        }
    };
    NgProgress.prototype.inc = function (n, id) {
        if (id === void 0) { id = 'root'; }
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].inc(n);
        }
    };
    NgProgress.prototype.complete = function (id) {
        if (id === void 0) { id = 'root'; }
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].complete();
        }
    };
    NgProgress.prototype.isStarted = function (id) {
        if (id === void 0) { id = 'root'; }
        return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].isStarted : false;
    };
    NgProgress.prototype.started = function (id) {
        if (id === void 0) { id = 'root'; }
        return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].started : empty();
    };
    NgProgress.prototype.completed = function (id) {
        if (id === void 0) { id = 'root'; }
        return (this._instances[id] instanceof NgProgressRef) ? this._instances[id].ended : empty();
    };
    NgProgress.prototype.destroy = function (id) {
        if (id === void 0) { id = 'root'; }
        if (this._instances[id] instanceof NgProgressRef) {
            this._instances[id].destroy();
            this._instances[id] = null;
        }
    };
    NgProgress.prototype.destroyAll = function () {
        var _this = this;
        Object.keys(this._instances).map(function (key) {
            _this._instances[key].destroy();
            _this._instances[key] = null;
        });
    };
    return NgProgress;
}());
NgProgress.decorators = [
    { type: Injectable },
];
NgProgress.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CONFIG,] },] },
]; };
/**
 * @license
 * Copyright ngx-progressbar All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/MurhafSousli/ngx-progressbar/blob/master/LICENSE
 */
var NgProgressComponent = (function () {
    function NgProgressComponent(_ngProgress) {
        this._ngProgress = _ngProgress;
        this.id = 'root';
        this.spinnerPosition = this._ngProgress.config.spinnerPosition;
        this.direction = this._ngProgress.config.direction;
        this.ease = this._ngProgress.config.ease;
        this.color = this._ngProgress.config.color;
        this.meteor = this._ngProgress.config.meteor;
        this.spinner = this._ngProgress.config.spinner;
        this.thick = this._ngProgress.config.thick;
        this.max = this._ngProgress.config.max;
        this.min = this._ngProgress.config.min;
        this.speed = this._ngProgress.config.speed;
        this.trickleSpeed = this._ngProgress.config.trickleSpeed;
        this.trickleFunc = this._ngProgress.config.trickleFunc;
        this.debounceTime = this._ngProgress.config.debounceTime;
        this.started = new EventEmitter();
        this.completed = new EventEmitter();
    }
    NgProgressComponent.prototype.ngOnChanges = function () {
        if (this.progressRef instanceof NgProgressRef) {
            this.progressRef.setConfig({
                max: (this.max > 0 && this.max <= 100) ? this.max : 100,
                min: (this.min < 100 && this.min >= 0) ? this.min : 0,
                speed: this.speed,
                trickleSpeed: this.trickleSpeed,
                trickleFunc: this.trickleFunc,
                debounceTime: this.debounceTime
            });
        }
    };
    NgProgressComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.progressRef = this._ngProgress.ref(this.id, {
            max: this.max,
            min: this.min,
            speed: this.speed,
            trickleSpeed: this.trickleSpeed,
            debounceTime: this.debounceTime
        });
        this.state$ = this.progressRef.state$.pipe(map(function (state) { return ({
            active: state.active,
            transform: "translate3d(" + state.value + "%,0,0)"
        }); }));
        if (this.started.observers.length) {
            this._started$ = this.progressRef.started.subscribe(function () { return _this.started.emit(); });
        }
        if (this.completed.observers.length) {
            this._completed$ = this.progressRef.completed.subscribe(function () { return _this.completed.emit(); });
        }
    };
    NgProgressComponent.prototype.ngOnDestroy = function () {
        if (this._started$) {
            this._started$.unsubscribe();
        }
        if (this._completed$) {
            this._completed$.unsubscribe();
        }
        this._ngProgress.destroy(this.id);
    };
    NgProgressComponent.prototype.start = function () {
        this.progressRef.start();
    };
    NgProgressComponent.prototype.complete = function () {
        this.progressRef.complete();
    };
    NgProgressComponent.prototype.inc = function (n) {
        this.progressRef.inc(n);
    };
    NgProgressComponent.prototype.set = function (n) {
        this.progressRef.set(n);
    };
    Object.defineProperty(NgProgressComponent.prototype, "isStarted", {
        get: function () {
            return this.progressRef.isStarted;
        },
        enumerable: true,
        configurable: true
    });
    return NgProgressComponent;
}());
NgProgressComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-progress',
                host: {
                    'role': 'progressbar',
                    '[attr.spinnerPosition]': 'spinnerPosition',
                    '[attr.dir]': 'direction',
                    '[attr.thick]': 'thick'
                },
                template: "\n    <ng-container *ngIf=\"state$ | async; let state\">\n      <div class=\"ng-progress-bar\"\n            [class.-active]=\"state.active\"\n            [style.transition]=\"'opacity ' + speed + 'ms ' + ease\">\n        <div class=\"ng-bar-placeholder\">\n          <div class=\"ng-bar\"\n                [style.transform]=\"state.transform\"\n                [style.backgroundColor]=\"color\"\n                [style.transition]=\"state.active ? 'all ' + speed + 'ms ' + ease : 'none'\">\n            <div *ngIf=\"meteor\" class=\"ng-meteor\" [style.boxShadow]=\"'0 0 10px '+ color + ', 0 0 5px ' + color\"></div>\n          </div>\n        </div>\n        <div *ngIf=\"spinner\" class=\"ng-spinner\">\n          <div class=\"ng-spinner-icon\"\n                [style.borderTopColor]=\"color\"\n                [style.borderLeftColor]=\"color\"></div>\n        </div>\n      </div>\n    </ng-container>\n  ",
                styles: ["ng-progress{z-index:999999;pointer-events:none;position:relative}.ng-progress-bar{z-index:999999;top:0;left:0;width:100%;position:fixed;zoom:1;opacity:0}.ng-progress-bar.-active{opacity:1;-webkit-transition:none;transition:none}.ng-bar-placeholder{position:absolute;height:2px;width:100%}.ng-bar{width:100%;height:100%;-webkit-transform:translate(-100%,0,0);transform:translate(-100%,0,0)}.ng-meteor{display:block;position:absolute;width:100px;height:100%;opacity:1}.ng-spinner{display:block;position:fixed;z-index:1031;top:15px}.ng-spinner-icon{width:18px;height:18px;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-animation:.4s linear infinite spinner-animation;animation:.4s linear infinite spinner-animation;border:2px solid transparent;border-radius:50%}[dir='ltr+'] .ng-meteor,[dir=ltr-] .ng-meteor{-webkit-transform:rotate(3deg);transform:rotate(3deg)}[dir='ltr+'][thick=true] .ng-meteor,[dir=ltr-][thick=true] .ng-meteor{-webkit-transform:rotate(4deg);transform:rotate(4deg)}[dir='ltr+'] .ng-bar,[dir='rtl+'] .ng-bar{margin-left:-100%}[dir='ltr+'] .ng-meteor,[dir='rtl+'] .ng-meteor{right:0}[dir='ltr+'] .ng-meteor,[dir=rtl-] .ng-meteor{top:-3px}[dir='ltr+'][thick=true] .ng-meteor,[dir=rtl-][thick=true] .ng-meteor{top:-4px}[dir='rtl+'] .ng-meteor,[dir=ltr-] .ng-meteor{bottom:-3px}[dir='rtl+'][thick=true] .ng-meteor,[dir=ltr-][thick=true] .ng-meteor{bottom:-4px}[dir='rtl+'] .ng-bar-placeholder,[dir=ltr-] .ng-bar-placeholder{-webkit-transform:rotate(180deg);transform:rotate(180deg)}[dir='rtl+'] .ng-spinner-icon,[dir=ltr-] .ng-spinner-icon{animation-direction:reverse}[dir='rtl+'] .ng-meteor,[dir=rtl-] .ng-meteor{-webkit-transform:rotate(-3deg);transform:rotate(-3deg)}[dir='rtl+'][thick=true] .ng-meteor,[dir=rtl-][thick=true] .ng-meteor{-webkit-transform:rotate(-4deg);transform:rotate(-4deg)}[thick=true] .ng-spinner-icon{width:24px;height:24px;border-width:3px}[thick=true] .ng-bar-placeholder{height:3px}[spinnerPosition=left] .ng-spinner{left:15px;right:unset}[spinnerPosition=right] .ng-spinner{right:15px}@-webkit-keyframes spinner-animation{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spinner-animation{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}"],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false
            },] },
];
NgProgressComponent.ctorParameters = function () { return [
    { type: NgProgress, },
]; };
NgProgressComponent.propDecorators = {
    "id": [{ type: Input },],
    "spinnerPosition": [{ type: Input },],
    "direction": [{ type: Input },],
    "ease": [{ type: Input },],
    "color": [{ type: Input },],
    "meteor": [{ type: Input },],
    "spinner": [{ type: Input },],
    "thick": [{ type: Input },],
    "max": [{ type: Input },],
    "min": [{ type: Input },],
    "speed": [{ type: Input },],
    "trickleSpeed": [{ type: Input },],
    "trickleFunc": [{ type: Input },],
    "debounceTime": [{ type: Input },],
    "started": [{ type: Output },],
    "completed": [{ type: Output },],
};
function NgProgressFactory(config) {
    return new NgProgress(config);
}
var NgProgressModule = (function () {
    function NgProgressModule() {
    }
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
NgProgressModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgProgressComponent],
                exports: [NgProgressComponent],
                imports: [CommonModule]
            },] },
];
NgProgressModule.ctorParameters = function () { return []; };

export { NgProgressFactory, NgProgressModule, NgProgressComponent, NgProgressRef, NgProgress, CONFIG as ɵa };
//# sourceMappingURL=ngx-progressbar-core.js.map
