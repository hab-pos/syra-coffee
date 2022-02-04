"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginPageComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var LoginPageComponent = /** @class */ (function () {
    function LoginPageComponent(router, apiService, _snackBar, commonServices) {
        this.router = router;
        this.apiService = apiService;
        this._snackBar = _snackBar;
        this.commonServices = commonServices;
        this.url_logo = "";
        this.errorMessage = "Valid form";
        this.showLoader = "hidden";
        this.loginform = new forms_1.FormGroup({
            email: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{1,4}$")]),
            password: new forms_1.FormControl('', forms_1.Validators.required)
        });
    }
    LoginPageComponent.prototype.ngOnInit = function () {
        this.url_logo = this.apiService.url("/assets/logos/logo-admin.png");
    };
    LoginPageComponent.prototype.btnClick = function () {
        var _this = this;
        var _a, _b;
        if (this.loginform.valid) {
            this.openLoader();
            this.apiService.admin_login({ email_id: this.loginform.controls['email'].value, password: this.loginform.controls['password'].value }).subscribe(function (data) {
                _this.hideLoader();
                if (data.success) {
                    var dataToStore = JSON.stringify(data);
                    localStorage.setItem('syra_admin', dataToStore);
                    _this.router.navigateByUrl('/dashboard');
                }
                else {
                    _this.commonServices.showAlert(data.message);
                }
            });
        }
        else {
            this.isInvalidEmail ?
                ((_b = (_a = this.loginform.get('email')) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b.pattern) ?
                    this.commonServices.showAlert("Invalid email id / user name.") : this.commonServices.showAlert("Email id / User name is mandatory.") :
                this.commonServices.showAlert("Password is madatory.");
        }
    };
    ;
    Object.defineProperty(LoginPageComponent.prototype, "isInvalidEmail", {
        get: function () {
            var _a;
            return (_a = this.loginform.get('email')) === null || _a === void 0 ? void 0 : _a.invalid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LoginPageComponent.prototype, "isInvalidPassword", {
        get: function () {
            var _a;
            return (_a = this.loginform.get('password')) === null || _a === void 0 ? void 0 : _a.invalid;
        },
        enumerable: false,
        configurable: true
    });
    LoginPageComponent.prototype.openLoader = function () {
        this.submitLoader.nativeElement.classList.remove('hideLoader');
    };
    LoginPageComponent.prototype.hideLoader = function () {
        this.submitLoader.nativeElement.classList.remove('hideLoader');
        this.submitLoader.nativeElement.classList.add('hideLoader');
    };
    __decorate([
        core_1.ViewChild('SubmitBtn')
    ], LoginPageComponent.prototype, "SubmitBtn");
    __decorate([
        core_1.ViewChild('submitLoader')
    ], LoginPageComponent.prototype, "submitLoader");
    LoginPageComponent = __decorate([
        core_1.Component({
            selector: 'app-login-page',
            templateUrl: './login-page.component.html',
            styleUrls: ['./login-page.component.scss']
        })
    ], LoginPageComponent);
    return LoginPageComponent;
}());
exports.LoginPageComponent = LoginPageComponent;
