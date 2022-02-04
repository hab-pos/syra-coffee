"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InTransactionComponent = void 0;
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var InTransactionComponent = /** @class */ (function () {
    function InTransactionComponent(apiServices, commonServices) {
        this.apiServices = apiServices;
        this.commonServices = commonServices;
        this.current = 1;
        this.totalPages = 1;
        this.endPage = 1;
        this.startPage = 1;
        this.datesSelected = null;
        this.branchSelected = null;
        this.tableData = [];
        this.display_coloumns = ["_id", "date_of_transaction", "hour", "time_elapsed", "barista_id", "status", "total_amount"];
        this.display_headers = ["#", "FECHA", "HORA", "TIEMPO TRANSCURRIDO", "USARIO", "ESTADO", "SUMA TOTAL"];
        this.faChevronDown = free_solid_svg_icons_1.faChevronDown;
        this.faChevronUp = free_solid_svg_icons_1.faChevronUp;
        this.isLoading = false;
    }
    InTransactionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(function (i) { return _this.startPage + i; });
    };
    InTransactionComponent.prototype.get_transactions = function (page) {
        console.log(page);
    };
    InTransactionComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.loader.nativeElement.style.width = this.table.nativeElement.clientWidth + 'px';
        this.branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.datesSelected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        if (this.branchSelected != null || this.datesSelected != null) {
            this.search(this.datesSelected, this.branchSelected);
        }
        else {
            this.get_intxns();
        }
        this.commonServices.choose_date.subscribe(function (selectedDates) {
            _this.datesSelected = selectedDates;
            _this.search(_this.datesSelected, _this.branchSelected);
        });
        this.commonServices.select_branch.subscribe(function (selectedBranch) {
            _this.branchSelected = selectedBranch;
            _this.search(_this.datesSelected, _this.branchSelected);
        });
    };
    InTransactionComponent.prototype.generateToolTip = function (name, price, type, have_discount) {
        if (have_discount == 1) {
            var sign = type == "euro" ? "€" : "%";
            return name + " : " + price + " " + sign;
        }
        else {
            return null;
        }
    };
    InTransactionComponent.prototype.search = function (selectedDate, selectedBranch) {
        var _this = this;
        var branch = selectedBranch != null && selectedBranch != undefined && selectedBranch.length > 0 ? selectedBranch === null || selectedBranch === void 0 ? void 0 : selectedBranch.map(function (element) { return element._id; }) : null;
        this.isLoading = true;
        this.apiServices.filter_in_transactions({ branch: branch, dates: selectedDate }).subscribe(function (res) {
            _this.tableData = res.data;
            _this.isLoading = false;
        });
    };
    InTransactionComponent.prototype.get_intxns = function (branch_id) {
        var _this = this;
        var _a;
        if (branch_id === void 0) { branch_id = null; }
        this.isLoading = true;
        var branch = this.branchSelected != null && this.branchSelected != undefined && this.branchSelected.length > 0 ? (_a = this.branchSelected) === null || _a === void 0 ? void 0 : _a.map(function (element) { return element._id; }) : null;
        this.apiServices.getTxnIn({ branch_id: branch }).subscribe(function (txns) {
            _this.isLoading = false;
            if (txns.success) {
                _this.tableData = txns.data;
            }
            else {
                _this.commonServices.showAlert(txns.message);
            }
        });
    };
    InTransactionComponent.prototype.calculatePrice = function (qty, price, iva) {
        var pricePerQty = Number(qty) * Number(price);
        return pricePerQty;
    };
    InTransactionComponent.prototype.showDiscount = function (total_price, discount_data) {
        var couponAmount = 0;
        discount_data.forEach(function (element) {
            if (element.type == "euro") {
                couponAmount += Number(element.amount);
            }
            else {
                couponAmount += (Number(total_price) * Number(element.amount) / 100);
            }
        });
        return total_price < couponAmount ? total_price : couponAmount.toFixed(2);
    };
    InTransactionComponent.prototype.showDiscountFormat = function (data) {
        var sign = (data.discount_type == "euro") ? "€" : "%";
        return "(" + data.discount_price + sign + ")";
    };
    __decorate([
        core_1.ViewChild("table")
    ], InTransactionComponent.prototype, "table");
    __decorate([
        core_1.ViewChild("loader", { static: false })
    ], InTransactionComponent.prototype, "loader");
    InTransactionComponent = __decorate([
        core_1.Component({
            selector: 'app-in-transaction',
            templateUrl: './in-transaction.component.html',
            styleUrls: ['./in-transaction.component.scss'],
            animations: [
                animations_1.trigger('detailExpand', [
                    animations_1.state('collapsed', animations_1.style({ height: '0px', minHeight: '0' })),
                    animations_1.state('expanded', animations_1.style({ height: '*' })),
                    animations_1.transition('expanded <=> collapsed', animations_1.animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                ]),
            ]
        })
    ], InTransactionComponent);
    return InTransactionComponent;
}());
exports.InTransactionComponent = InTransactionComponent;
