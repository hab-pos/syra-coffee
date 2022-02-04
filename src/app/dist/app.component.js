"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var AppComponent = /** @class */ (function () {
    function AppComponent(router, common_service, spinner) {
        var _this = this;
        this.router = router;
        this.common_service = common_service;
        this.spinner = spinner;
        this.current_url = [];
        this.sidebar_opened = false;
        this.is_logged_in = false;
        this.isMobile = false;
        this.title = 'syra-coffee';
        //to get subscribed on Routing options
        this.router.events.subscribe(function (evt) {
            if (evt instanceof router_1.NavigationStart) {
                _this.spinner.show();
                if (_this.isMobile) {
                    _this.closeNav();
                }
            }
            if (evt instanceof router_1.NavigationEnd) {
                _this.spinner.hide();
                _this.current_url = evt.url.split('/');
                if (_this.current_url[2] == "login" || typeof _this.current_url[2] == "undefined") {
                    _this.closeNav();
                }
                if (localStorage.getItem("syra_admin") != null || localStorage.getItem("syra_admin") != undefined) {
                    _this.is_logged_in = true;
                }
                else {
                    _this.is_logged_in = false;
                }
                (typeof _this.current_url[2] == 'undefined') ? _this.current_url[2] = '' : '';
                setTimeout(function () {
                    _this.common_service.set_current_url(_this.current_url);
                }, 10);
            }
            if (!(evt instanceof router_1.NavigationEnd)) {
                return;
            }
        });
        //To get subscribed on Sidebar toggle movement
        this.common_service.toggle_sidebar.subscribe(function (value) {
            if (_this.current_url[1] != "login") {
                if (value == "sidebar") {
                    if (_this.isMobile) {
                        (_this.sidebar_opened) ? _this.closeNav() : _this.openNav();
                    }
                }
                else {
                    (_this.sidebar_opened) ? _this.closeNav() : _this.openNav();
                }
            }
        });
    }
    AppComponent.prototype.openNav = function () {
        var _a, _b;
        if (this.current_url[1] != "login") {
            this.sidebar_opened = true;
            if (!this.isMobile) {
                (_a = document.getElementById("hamburger_btn")) === null || _a === void 0 ? void 0 : _a.classList.add("d-none");
            }
            (_b = document.getElementById("sidebar")) === null || _b === void 0 ? void 0 : _b.classList.add("active_sidebar");
        }
    };
    AppComponent.prototype.closeNav = function () {
        var _a, _b;
        this.sidebar_opened = false;
        if (this.isMobile) {
            (_a = document.getElementById("hamburger_btn")) === null || _a === void 0 ? void 0 : _a.classList.remove("d-none");
            (_b = document.getElementById("sidebar")) === null || _b === void 0 ? void 0 : _b.classList.remove("active_sidebar");
        }
    };
    AppComponent.prototype.set_mobile_config = function () {
        var _this = this;
        this.isMobile = true;
        setTimeout(function () {
            _this.closeNav();
        }, 100);
    };
    AppComponent.prototype.remove_mobile_config = function () {
        var _this = this;
        this.isMobile = false;
        setTimeout(function () {
            _this.openNav();
        }, 100);
    };
    AppComponent.prototype.ngOnInit = function () {
        this.set_config();
        console.log(this.is_logged_in);
    };
    AppComponent.prototype.set_config = function () {
        this.innerWidth = window.innerWidth;
        if (this.innerWidth <= 1024) {
            this.set_mobile_config();
        }
        else {
            this.remove_mobile_config();
        }
    };
    AppComponent.prototype.onOrientationChange = function (event) {
        this.set_config();
    };
    AppComponent.prototype.onResize = function (event) {
        this.set_config();
    };
    __decorate([
        core_1.HostListener('window:orientationchange', ['$event'])
    ], AppComponent.prototype, "onOrientationChange");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], AppComponent.prototype, "onResize");
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
