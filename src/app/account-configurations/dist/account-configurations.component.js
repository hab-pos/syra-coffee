"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AccountConfigurationsComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var AccountConfigurationsComponent = /** @class */ (function () {
    function AccountConfigurationsComponent(apiService, common_service, _snackBar) {
        var _this = this;
        this.apiService = apiService;
        this.common_service = common_service;
        this._snackBar = _snackBar;
        this.faEdit = free_solid_svg_icons_1.faEdit;
        this.faPlusCircle = free_solid_svg_icons_1.faPlusCircle;
        this.current = 1;
        this.totalPages = 1;
        this.endPage = 1;
        this.startPage = 1;
        this.isLoadingAdmim = false;
        this.isLoadingBranch = false;
        this.isLoadingusers = false;
        this.displayColumsUser = ["user_name", "password", "icon"];
        this.displayedColumns = ["branch_name", "device_id", "icon"];
        this.field = '';
        this.action = '';
        this.common_service.passing_res_branch.subscribe(function (_) {
            _this.get_branches();
        });
        this.common_service.passing_res_admin.subscribe(function (_) {
            _this.get_admin();
        });
        this.common_service.passing_res_user.subscribe(function (_) {
            _this.get_users();
        });
    }
    AccountConfigurationsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.innerWidth = window.innerWidth;
        this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(function (i) { return _this.startPage + i; });
        this.get_branches();
        this.get_admin();
        this.get_users();
    };
    AccountConfigurationsComponent.prototype.get_branches = function () {
        var _this = this;
        this.isLoadingBranch = true;
        this.apiService.get_branch({}).subscribe(function (res) {
            _this.isLoadingBranch = false;
            if (res.success) {
                _this.tableData = res.data.branch_list;
            }
            else {
                _this.common_service.showAlert(res.message);
            }
        });
    };
    AccountConfigurationsComponent.prototype.get_admin = function () {
        var _this = this;
        var _a;
        this.isLoadingAdmim = true;
        var parse_data = JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "");
        this.apiService.get_admin_details_by_id({ id: parse_data.data['_id'] }).subscribe(function (res) {
            _this.isLoadingAdmim = false;
            if (res.success) {
                _this.admin = res.data.admin_details;
            }
            else {
                _this.common_service.showAlert(res.message);
            }
        });
    };
    AccountConfigurationsComponent.prototype.get_users = function () {
        var _this = this;
        this.isLoadingusers = true;
        this.apiService.get_all_barista().subscribe(function (res) {
            _this.isLoadingusers = false;
            if (res.success) {
                _this.userData = res.data.barista_details;
            }
            else {
                _this.common_service.showAlert(res.message);
            }
        });
    };
    AccountConfigurationsComponent.prototype.push = function () {
        if (this.field == "main") {
            this.common_service.admin_edit(this.admin);
        }
        else if (this.field == "branch") {
            this.common_service.branch_edit(this.tableData[this.tableIndex]);
        }
        else {
            this.common_service.userEmitter.emit(this.userData[this.tableIndex]);
        }
    };
    AccountConfigurationsComponent.prototype.openSideBar = function (field, action, tableIndex) {
        if (tableIndex === void 0) { tableIndex = -1; }
        this.field = field;
        this.action = action;
        this.tableIndex = tableIndex; // to pass associated object in data source
        this.sidenav.toggle();
    };
    AccountConfigurationsComponent.prototype.getBranches = function (page) {
        if (page === void 0) { page = 1; }
        console.log(page);
    };
    AccountConfigurationsComponent.prototype.onResize = function (event) {
        this.innerWidth = window.innerWidth;
    };
    AccountConfigurationsComponent.prototype.closed = function () {
        this.common_service.resetForms.emit();
    };
    __decorate([
        core_1.ViewChild('sidenav')
    ], AccountConfigurationsComponent.prototype, "sidenav");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], AccountConfigurationsComponent.prototype, "onResize");
    AccountConfigurationsComponent = __decorate([
        core_1.Component({
            selector: 'app-account-configurations',
            templateUrl: './account-configurations.component.html',
            styleUrls: ['./account-configurations.component.scss']
        })
    ], AccountConfigurationsComponent);
    return AccountConfigurationsComponent;
}());
exports.AccountConfigurationsComponent = AccountConfigurationsComponent;
