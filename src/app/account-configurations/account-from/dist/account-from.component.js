"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.close = exports.AccountFromComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var delete_component_1 = require("../../shared/components/delete/delete.component");
var AccountFromComponent = /** @class */ (function () {
    function AccountFromComponent(apiService, common_service, _snackBar, modalService) {
        var _this = this;
        this.apiService = apiService;
        this.common_service = common_service;
        this._snackBar = _snackBar;
        this.modalService = modalService;
        this.faTimesCircle = free_solid_svg_icons_1.faTimesCircle;
        this.faEye = free_solid_svg_icons_1.faEye;
        this.faEyeSlash = free_solid_svg_icons_1.faEyeSlash;
        this.close = exports.close;
        this.password_type = "password";
        this.user_id = "";
        this.isLoading = false;
        this.is_location_checked = false;
        this.faChevronDown = free_solid_svg_icons_1.faChevronDown;
        this.selected_days = [];
        this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        this.branchform = new forms_1.FormGroup({
            branch_name: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
            device_id: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(5)]),
            lat: new forms_1.FormControl('', []),
            lng: new forms_1.FormControl('', []),
            espresso_report_day: new forms_1.FormControl('', [])
        });
        this.userform = new forms_1.FormGroup({
            user_name: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(1)]),
            password: new forms_1.FormControl('')
        });
        this.adminform = new forms_1.FormGroup({
            user_name: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(2)]),
            password: new forms_1.FormControl('')
        });
        this.isLoadingDelete = false;
        this.common_service.resetForms.subscribe(function () {
            _this.branchform.reset();
            _this.userform.setValue({ user_name: "", password: "" });
            _this.adminform.setValue({ user_name: "", password: "" });
        });
    }
    AccountFromComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.deleteBaristaAPI();
        }, function () {
        });
    };
    AccountFromComponent.prototype.checkAction = function (value) {
        this.is_location_checked = value;
    };
    AccountFromComponent.prototype.deleteBaristaAPI = function () {
        var _this = this;
        this.isLoadingDelete = true;
        this.apiService.deleteBarista({ id: this.user_id }).subscribe(function (res) {
            _this.common_service.showAlert(res.message);
            _this.isLoadingDelete = false;
            _this.sidenav.close();
            _this.common_service.passing_res_user.emit();
        });
    };
    AccountFromComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.common_service.parent_open.subscribe(function (result) {
            console.log(_this.action);
            if (_this.action == "edit") {
                var espressoReportDate = result.espresso_report_date.map(function (data) {
                    return _this.capitalizeFirstLetter(data);
                });
                _this.branchform.setValue({ branch_name: result.branch_name, device_id: result.device_id, lat: result.lat, lng: result.lng, espresso_report_day: espressoReportDate });
                _this.is_location_checked = result.show_on_app;
                _this.branch_id = result._id;
            }
            else {
                _this.branchform.setValue({ branch_name: "", device_id: "", lat: "", lng: "", espresso_report_day: "" });
            }
        });
        this.common_service.admin_open.subscribe(function (_) {
            _this.adminform.setValue({ user_name: _this.admin.email_id, password: "" });
        });
        this.common_service.userEmitter.subscribe(function (result) {
            var _a;
            if (_this.action == "edit") {
                _this.user_id = result._id;
                _this.userform.setValue({ user_name: (_a = result === null || result === void 0 ? void 0 : result.barista_name) !== null && _a !== void 0 ? _a : "", password: "" });
            }
            else {
                _this.userform.setValue({ user_name: "", password: "" });
            }
        });
    };
    AccountFromComponent.prototype.capitalizeFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    AccountFromComponent.prototype.edit_admin = function () {
        var _this = this;
        var _a;
        if (this.adminform.controls['user_name'].value != "") {
            var parse_data = JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "");
            var req = this.adminform.controls['password'].value != "" ?
                { id: parse_data.data['_id'], user_name: this.adminform.controls['user_name'].value, password: this.adminform.controls['password'].value }
                :
                    { id: parse_data.data['_id'], user_name: this.adminform.controls['user_name'].value };
            this.isLoading = true;
            this.apiService.update_admin_details(req).subscribe(function (res) {
                _this.common_service.showAlert(res.message);
                _this.isLoading = false;
                if (res.success) {
                    _this.sidenav.toggle();
                    _this.common_service.pass_data(res.data.admin_details);
                }
            });
        }
        else {
            this.common_service.showAlert("User Name is Mandatory");
        }
    };
    AccountFromComponent.prototype.add_branch = function () {
        var _this = this;
        var _a, _b;
        var espresso_report_days = (_a = this.branchform.get('espresso_report_day')) === null || _a === void 0 ? void 0 : _a.value.map(function (data) {
            return data.toLowerCase();
        }).join(",");
        if (this.branchform.valid) {
            this.isLoading = true;
            var parse_data = JSON.parse((_b = localStorage.getItem('syra_admin')) !== null && _b !== void 0 ? _b : "");
            this.apiService.add_branch({ created_by: parse_data.data['_id'], branch_name: this.branchform.controls['branch_name'].value, device_id: this.branchform.controls['device_id'].value, lat: this.branchform.controls['lat'].value, lng: this.branchform.controls['lng'].value, show_on_app: this.is_location_checked, espresso_report_date: espresso_report_days }).subscribe(function (res) {
                _this.common_service.showAlert(res.message);
                _this.isLoading = false;
                if (res.success) {
                    _this.sidenav.toggle();
                    _this.common_service.push_data(res.data);
                }
            });
        }
        else {
            if (this.branchform.controls['branch_name'].errors) {
                this.common_service.showAlert("Branch Name is Mandatory");
            }
            else {
                this.common_service.showAlert("Invalid Device Id");
            }
        }
    };
    AccountFromComponent.prototype.edit_branch = function () {
        var _this = this;
        var _a;
        if (this.branchform.valid) {
            this.isLoading = true;
            var espresso_report_days = (_a = this.branchform.get('espresso_report_day')) === null || _a === void 0 ? void 0 : _a.value.map(function (data) {
                return data.toLowerCase();
            }).join(",");
            this.apiService.update_branch({ id: this.branch_id, branch_name: this.branchform.controls['branch_name'].value, device_id: this.branchform.controls['device_id'].value, lat: this.branchform.controls['lat'].value, lng: this.branchform.controls['lng'].value, show_on_app: this.is_location_checked, espresso_report_date: espresso_report_days }).subscribe(function (res) {
                _this.isLoading = false;
                _this.common_service.showAlert(res.message);
                if (res.success) {
                    _this.sidenav.toggle();
                    _this.common_service.push_data(null);
                }
            });
        }
        else {
            if (this.branchform.controls['branch_name'].errors) {
                this.common_service.showAlert("Branch Name is Mandatory");
            }
            else {
                this.common_service.showAlert("Invalid Device Id");
            }
        }
    };
    AccountFromComponent.prototype.add_user = function () {
        var _this = this;
        var _a;
        if (this.userform.valid) {
            this.isLoading = true;
            var parse_data = JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "");
            this.apiService.addBarista({ created_by: parse_data.data['_id'], barista_name: this.userform.controls['user_name'].value, password: this.userform.controls['password'].value }).subscribe(function (res) {
                _this.isLoading = false;
                _this.common_service.showAlert(res.message);
                if (res.success) {
                    _this.sidenav.toggle();
                    _this.common_service.push_user_data(res.data.barista);
                }
            });
        }
        else {
            this.common_service.showAlert("user name field is mandatory");
        }
    };
    AccountFromComponent.prototype.edit_user = function () {
        var _this = this;
        if (this.userform.valid) {
            this.isLoading = true;
            this.apiService.update_barista_password({ _id: this.user_id, user_name: this.userform.controls['user_name'].value, password: this.userform.controls['password'].value }).subscribe(function (res) {
                _this.isLoading = false;
                _this.common_service.showAlert(res.message);
                if (res.success) {
                    _this.sidenav.toggle();
                    _this.common_service.push_user_data(res.data.barista);
                }
            });
        }
        else {
            this.common_service.showAlert("user name field is mandatory");
        }
    };
    __decorate([
        core_1.Input()
    ], AccountFromComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], AccountFromComponent.prototype, "field");
    __decorate([
        core_1.Input()
    ], AccountFromComponent.prototype, "action");
    __decorate([
        core_1.Input()
    ], AccountFromComponent.prototype, "admin");
    __decorate([
        core_1.ViewChild('dropDown')
    ], AccountFromComponent.prototype, "dd");
    AccountFromComponent = __decorate([
        core_1.Component({
            selector: 'app-account-from',
            templateUrl: './account-from.component.html',
            styleUrls: ['./account-from.component.scss']
        })
    ], AccountFromComponent);
    return AccountFromComponent;
}());
exports.AccountFromComponent = AccountFromComponent;
exports.close = {
    prefix: 'fa',
    iconName: 'line',
    icon: [
        512,
        512,
        [],
        '',
        "M437.126,74.939c-99.826-99.826-262.307-99.826-362.133,0C26.637,123.314,0,187.617,0,256.005\n\t\t\ts26.637,132.691,74.993,181.047c49.923,49.923,115.495,74.874,181.066,74.874s131.144-24.951,181.066-74.874\n\t\t\tC536.951,337.226,536.951,174.784,437.126,74.939z M409.08,409.006c-84.375,84.375-221.667,84.375-306.042,0\n\t\t\tc-40.858-40.858-63.37-95.204-63.37-153.001s22.512-112.143,63.37-153.021c84.375-84.375,221.667-84.355,306.042,0\n\t\t\tC493.435,187.359,493.435,324.651,409.08,409.006z M341.525,310.827l-56.151-56.071l56.151-56.071c7.735-7.735,7.735-20.29,0.02-28.046\n\t\t\tc-7.755-7.775-20.31-7.755-28.065-0.02l-56.19,56.111l-56.19-56.111c-7.755-7.735-20.31-7.755-28.065,0.02\n\t\t\tc-7.735,7.755-7.735,20.31,0.02,28.046l56.151,56.071l-56.151,56.071c-7.755,7.735-7.755,20.29-0.02,28.046\n\t\t\tc3.868,3.887,8.965,5.811,14.043,5.811s10.155-1.944,14.023-5.792l56.19-56.111l56.19,56.111\n\t\t\tc3.868,3.868,8.945,5.792,14.023,5.792c5.078,0,10.175-1.944,14.043-5.811C349.28,331.117,349.28,318.562,341.525,310.827z",
    ]
};
