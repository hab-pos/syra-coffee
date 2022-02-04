"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InventoryReportsComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var InventoryReportsComponent = /** @class */ (function () {
    function InventoryReportsComponent(commonService, apiService) {
        var _this = this;
        this.commonService = commonService;
        this.apiService = apiService;
        this.faEdit = free_solid_svg_icons_1.faEdit;
        this.Pagewidth = 0;
        this.selectedIndex = 0;
        this.tableData = [];
        this.masterFilterId = "";
        this.isLoading = false;
        this.selected_dates = null;
        this.display_coloumns = ["week", "weekly_shippling", "week_start", "total_stock", "final_remaining", "total_consumption", "edit"];
        this.Pagewidth = window.innerWidth;
        this.commonService.select_branch.subscribe(function (_) {
            _this.initBranchList();
        });
        this.commonService.choose_date.subscribe(function (dates) {
            _this.selected_dates = dates;
            _this.initBranchList();
        });
        this.commonService.SuccessEditCoffeeCount.subscribe(function () {
            _this.getAllRecords();
        });
    }
    InventoryReportsComponent.prototype.push = function () {
        console.log("opened");
        this.commonService.EditReport.emit();
    };
    InventoryReportsComponent.prototype.close = function () {
        console.log("closed");
    };
    InventoryReportsComponent.prototype.openSidebar = function (row) {
        this.selectedIndex = row;
        this.sidenav.toggle();
    };
    InventoryReportsComponent.prototype.onResize = function (event) {
        this.Pagewidth = window.innerWidth;
    };
    InventoryReportsComponent.prototype.ngOnInit = function () {
    };
    InventoryReportsComponent.prototype.ngAfterViewInit = function () {
        this.loader.nativeElement.style.width = this.table.nativeElement.clientWidth + 'px';
        this.initBranchList();
    };
    InventoryReportsComponent.prototype.initBranchList = function () {
        console.log(localStorage.getItem('selectedBranch'));
        var id = localStorage.getItem('selectedBranch') != undefined && localStorage.getItem('selectedBranch') != null ? JSON.parse(localStorage.getItem('selectedBranch') || "")._id : "syra-all";
        this.selected_dates = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        this.masterFilterId = id == "syra-all" ? null : id;
        console.log(this.masterFilterId, "one more final");
        if (this.masterFilterId == null) {
            this.tableData = [];
        }
        else {
            if (this.selected_dates != null) {
                this.get_filtered_records();
            }
            else {
                this.getAllRecords();
            }
        }
    };
    InventoryReportsComponent.prototype.getAllRecords = function () {
        var _this = this;
        this.isLoading = true;
        this.apiService.get_inventory_reports({ branch_id: this.masterFilterId }).subscribe(function (res) {
            _this.isLoading = false;
            _this.tableData = res.data || [];
            console.log(res.data);
        });
    };
    InventoryReportsComponent.prototype.get_filtered_records = function () {
        var _this = this;
        this.isLoading = true;
        this.apiService.ger_inventory_reports_filtered({ selected_date: this.selected_dates, branch_id: this.masterFilterId }).subscribe(function (res) {
            _this.isLoading = false;
            _this.tableData = res.data || [];
            console.log(res.data);
        });
    };
    InventoryReportsComponent.prototype.getInventoryReports = function (page) {
        console.log(page);
    };
    __decorate([
        core_1.ViewChild('sidenav')
    ], InventoryReportsComponent.prototype, "sidenav");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], InventoryReportsComponent.prototype, "onResize");
    __decorate([
        core_1.ViewChild("table")
    ], InventoryReportsComponent.prototype, "table");
    __decorate([
        core_1.ViewChild("loader", { static: false })
    ], InventoryReportsComponent.prototype, "loader");
    InventoryReportsComponent = __decorate([
        core_1.Component({
            selector: 'app-inventory-reports',
            templateUrl: './inventory-reports.component.html',
            styleUrls: ['./inventory-reports.component.scss']
        })
    ], InventoryReportsComponent);
    return InventoryReportsComponent;
}());
exports.InventoryReportsComponent = InventoryReportsComponent;
