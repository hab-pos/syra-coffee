"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OutTransactionComponent = void 0;
var core_1 = require("@angular/core");
var OutTransactionComponent = /** @class */ (function () {
    function OutTransactionComponent(apiService, commonServices) {
        var _this = this;
        this.apiService = apiService;
        this.commonServices = commonServices;
        this.datesSelected = null;
        this.branchSelected = null;
        this.current = 1;
        this.totalPages = 1;
        this.endPage = 1;
        this.startPage = 1;
        this.isLoading = false;
        this.tableData = [];
        this.displayed_coloumns = ["date", "reason", "user", "vat", "total", "payment_mode", "invoice_number"];
        this.commonServices.choose_date.subscribe(function (selectedDates) {
            _this.datesSelected = selectedDates;
            _this.search(_this.datesSelected, _this.branchSelected);
        });
        this.commonServices.select_branch.subscribe(function (selectedBranch) {
            _this.branchSelected = selectedBranch;
            _this.search(_this.datesSelected, _this.branchSelected);
        });
    }
    OutTransactionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(function (i) { return _this.startPage + i; });
    };
    OutTransactionComponent.prototype.ngAfterViewInit = function () {
        this.loader.nativeElement.style.width = this.table.nativeElement.clientWidth + 'px';
        this.branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.datesSelected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        if (this.branchSelected != null || this.datesSelected != null) {
            this.search(this.datesSelected, this.branchSelected);
        }
        else {
            this.get_out_txns();
        }
    };
    OutTransactionComponent.prototype.get_transactions = function (page) {
        console.log(page);
    };
    OutTransactionComponent.prototype.search = function (selectedDate, selectedBranch) {
        var _this = this;
        var branch = selectedBranch != null && selectedBranch != undefined && selectedBranch.length > 0 ? selectedBranch === null || selectedBranch === void 0 ? void 0 : selectedBranch.map(function (element) { return element._id; }) : null;
        this.isLoading = true;
        console.log({ branch: branch, dates: selectedDate });
        this.apiService.filter_transactions({ branch: branch, dates: selectedDate }).subscribe(function (res) {
            _this.tableData = res.data;
            _this.isLoading = false;
        });
    };
    OutTransactionComponent.prototype.get_out_txns = function () {
        var _this = this;
        this.isLoading = true;
        this.apiService.get_out_transactions(null).subscribe(function (res) {
            _this.tableData = res.data.transaction;
            _this.isLoading = false;
        });
    };
    __decorate([
        core_1.ViewChild("table")
    ], OutTransactionComponent.prototype, "table");
    __decorate([
        core_1.ViewChild("loader", { static: false })
    ], OutTransactionComponent.prototype, "loader");
    OutTransactionComponent = __decorate([
        core_1.Component({
            selector: 'app-out-transaction',
            templateUrl: './out-transaction.component.html',
            styleUrls: ['./out-transaction.component.scss']
        })
    ], OutTransactionComponent);
    return OutTransactionComponent;
}());
exports.OutTransactionComponent = OutTransactionComponent;
