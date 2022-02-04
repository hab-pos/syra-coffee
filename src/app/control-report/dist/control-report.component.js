"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ControlReportComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var ControlReportComponent = /** @class */ (function () {
    function ControlReportComponent(commonServices, apiService) {
        this.commonServices = commonServices;
        this.apiService = apiService;
        this.datesSelected = null;
        this.branchSelected = null;
        this.isLoadingVat = false;
        this.isLoadingPayout = false;
        this.isLoadingUsage = false;
        this.isLoadingComparsion = false;
        this.faArrowDown = free_solid_svg_icons_1.faArrowDown;
        this.discountUsage = [];
        this.vat_report_table_data = [];
        this.user_report_data = [];
        this.compariosn = null;
        this.display_coloumns = ["number", "user", "commentry", "imported"];
        this.display_headers = ["NOMBRE", "USUARIO", "COMENTARIO", "IMPORTE"];
        this.display_col_vat = ["color_name", "price"];
        this.barista_color = 'barista_info.color';
        this.discount_color = 'discount_info.color';
        this.tooltipSettings = Object();
        this.tooltipUsers = Object();
        this.Pagewidth = 0;
    }
    ControlReportComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var _a;
        this.loader.nativeElement.style.width = this.table.nativeElement.clientWidth + 'px';
        var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.branchSelected = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
        this.branchSelected = ((_a = this.branchSelected) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : this.branchSelected;
        this.datesSelected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        this.get_discounts_grouped(this.branchSelected, this.datesSelected);
        this.commonServices.choose_date.subscribe(function (selectedDates) {
            _this.datesSelected = selectedDates;
            _this.get_discounts_grouped(_this.branchSelected, _this.datesSelected);
        });
        this.commonServices.select_branch.subscribe(function (selectedBranch) {
            var _a;
            var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
            _this.branchSelected = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
            _this.branchSelected = ((_a = _this.branchSelected) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : _this.branchSelected;
            _this.get_discounts_grouped(_this.branchSelected, _this.datesSelected);
        });
    };
    ControlReportComponent.prototype.ngOnInit = function () {
        this.tooltipSettings = {
            enable: true,
            format: '${point.x} : <b>${point.y}€</b>'
        };
        this.tooltipUsers = {
            enable: true,
            format: '${point.x} <b>${point.y}€</b>'
        };
        this.Pagewidth = window.innerWidth;
    };
    ControlReportComponent.prototype.get_discounts_grouped = function (branch, dates) {
        this.userFiltered(branch, dates);
        this.discountFilterd(branch, dates);
        this.userAndDiscountFiltered(branch, dates);
        this.getComparison(branch, dates);
    };
    ControlReportComponent.prototype.userFiltered = function (branch, dates) {
        var _this = this;
        this.isLoadingPayout = true;
        this.apiService.get_discount_report_user({ branch: branch, dates: dates }).subscribe(function (response) {
            _this.isLoadingPayout = false;
            _this.user_report_data = response.data;
            _this.user_report_data.forEach(function (element) {
                element.total_discount = element.total_discount.toFixed(2);
            });
        });
    };
    ControlReportComponent.prototype.discountFilterd = function (branch, dates) {
        var _this = this;
        this.isLoadingVat = true;
        this.apiService.get_discount_report_coupon({ branch: branch, dates: dates }).subscribe(function (response) {
            _this.vat_report_table_data = response.data;
            _this.isLoadingVat = false;
            _this.vat_report_table_data.forEach(function (element) {
                element.total_discount = element.total_discount.toFixed(2);
            });
        });
    };
    ControlReportComponent.prototype.userAndDiscountFiltered = function (branch, dates) {
        var _this = this;
        this.isLoadingUsage = true;
        this.apiService.get_discount_report_user_coupon({ branch: branch, dates: dates }).subscribe(function (response) {
            _this.isLoadingUsage = false;
            _this.discountUsage = response.data;
        });
    };
    ControlReportComponent.prototype.getComparison = function (branch, dates) {
        var _this = this;
        this.isLoadingComparsion = true;
        this.apiService.get_discount_comparison({ branch: branch, dates: dates }).subscribe(function (response) {
            _this.isLoadingComparsion = false;
            _this.compariosn = response.data;
        });
    };
    ControlReportComponent.prototype.onResize = function (event) {
        this.Pagewidth = window.innerWidth;
    };
    ControlReportComponent.prototype.getTotalCost = function (isVat) {
        if (isVat === void 0) { isVat = true; }
        var ans = 0;
        ans = isVat ? this.vat_report_table_data.map(function (t) { return Number(t.total_discount); }).reduce(function (acc, value) { return acc + value; }, 0) : this.user_report_data.map(function (t) { return Number(t.total_discount); }).reduce(function (acc, value) { return Number(acc) + Number(value); }, 0);
        return ans;
    };
    __decorate([
        core_1.ViewChild("table")
    ], ControlReportComponent.prototype, "table");
    __decorate([
        core_1.ViewChild("loader", { static: false })
    ], ControlReportComponent.prototype, "loader");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], ControlReportComponent.prototype, "onResize");
    ControlReportComponent = __decorate([
        core_1.Component({
            selector: 'app-control-report',
            templateUrl: './control-report.component.html',
            styleUrls: ['./control-report.component.scss']
        })
    ], ControlReportComponent);
    return ControlReportComponent;
}());
exports.ControlReportComponent = ControlReportComponent;
