"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AccountingReportComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var FileSaver = require('file-saver');
var confirm_component_1 = require("../shared/components/confirm/confirm.component");
var AccountingReportComponent = /** @class */ (function () {
    function AccountingReportComponent(commonService, apiService, modalService) {
        var _this = this;
        var _a;
        this.commonService = commonService;
        this.apiService = apiService;
        this.modalService = modalService;
        this.faList = free_solid_svg_icons_1.faList;
        this.faPaperPlane = free_solid_svg_icons_1.faPaperPlane;
        this.isLoadingVat = false;
        this.isLoadingpayout = false;
        this.iva_data = [];
        this.payment_data = [];
        this.display_coloumns_iva = ["percent", "vat_recovered", "bill_before_tax", "bill_after_tax"];
        this.display_headers_iva = ["IVA", "IVA RECUPERTIDO", "FACTURACION ANTES DE IMPUESTOS", "FACTURACION DESPUES DE IMPUESTOS"];
        this.display_coloumns_payment = ["mode", "number", "turn_over", "imported"];
        this.display_headers_payment = ["METODOS DE PAGO", "NUMERO", "PORCENTAJE DE FACTURACION", "IMPORTE"];
        this.map = 'color';
        this.tooltip = Object();
        this.tootip_payout = Object();
        this.selected_branch = null;
        this.selectedDates = null;
        this.loadingSendMail = false;
        this.url_loading = "";
        this.url = [];
        this.total_Txn = 0;
        var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.selected_branch = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
        this.selected_branch = ((_a = this.selected_branch) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : this.selected_branch;
        this.selectedDates = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        // this.selected_branch = this.selected_branch == "syra-all" ? null : this.selected_branch
        this.get_vat_report();
        this.get_payment_report();
        this.commonService.exportClicked.subscribe(function () {
            if (_this.url[1] == "reports" && _this.url[2] == "accounting") {
                _this.exportAction();
            }
        });
        this.commonService.select_branch.subscribe(function (branch) {
            var _a;
            _this.selected_branch = branch === null || branch === void 0 ? void 0 : branch.map(function (element) { return element._id; });
            _this.selected_branch = ((_a = _this.selected_branch) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : _this.selected_branch;
            _this.get_vat_report();
            _this.get_payment_report();
        });
        this.commonService.sendMail.subscribe(function (email) {
            _this.exportAction(true, email.email);
        });
        this.commonService.choose_date.subscribe(function (dates) {
            _this.selectedDates = dates;
            _this.get_vat_report();
            _this.get_payment_report();
        });
        this.commonService.url_updated.subscribe(function (url) {
            _this.url = url;
        });
    }
    AccountingReportComponent.prototype.sendReport = function () {
        this.modalService.open(confirm_component_1.ConfirmComponent);
    };
    AccountingReportComponent.prototype.exportAction = function (sendMAil, email) {
        var _this = this;
        if (sendMAil === void 0) { sendMAil = false; }
        if (email === void 0) { email = null; }
        var req = null;
        var branch = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        if (sendMAil) {
            req = { branch: branch, dates: this.selectedDates, iva_report: this.iva_data, cash_report: this.payment_data, total_cost: this.total_Txn, email: email };
        }
        else {
            req = { branch: branch, dates: this.selectedDates, iva_report: this.iva_data, cash_report: this.payment_data, total_cost: this.total_Txn };
        }
        this.loadingSendMail = sendMAil == true ? true : false;
        this.apiService.generate_accounting_report(req).subscribe(function (report) {
            if (report.success) {
                if (sendMAil) {
                    _this.loadingSendMail = false;
                    _this.commonService.showAlert("Mail sent Successfully");
                }
                else {
                    var url = report.data.url;
                    console.log(url);
                    FileSaver.saveAs(url, "report.pdf");
                    _this.commonService.export_success.emit();
                }
            }
            else {
                _this.commonService.showAlert(report.message);
            }
        });
    };
    AccountingReportComponent.prototype.ngOnInit = function () {
        this.tooltip = {
            enable: true,
            format: '${point.x}% : <b>${point.y}€</b>'
        };
        this.tootip_payout = {
            enable: true,
            format: '${point.x} : <b>${point.y}€</b>'
        };
        this.url_loading = this.apiService.url("/assets/logos/loading.gif");
    };
    AccountingReportComponent.prototype.get_vat_report = function () {
        var _this = this;
        this.isLoadingVat = true;
        this.apiService.get_vat_reports({ branch: this.selected_branch, dates: this.selectedDates }).subscribe(function (report) {
            _this.isLoadingVat = false;
            if (report.success) {
                _this.iva_data = report.data;
                //this.vatChart.widget.redraw();
            }
            else {
                _this.commonService.showAlert(report.message);
            }
        });
    };
    AccountingReportComponent.prototype.get_payment_report = function () {
        var _this = this;
        this.isLoadingpayout = true;
        this.apiService.get_payment_mode_based_report({ branch: this.selected_branch, dates: this.selectedDates }).subscribe(function (report) {
            _this.isLoadingpayout = false;
            if (report.success) {
                report.data.list.forEach(function (element) {
                    if (element.Payment_method == "CASH") {
                        element.color = "#ff80e4";
                        element.Payment_method = "EFFECTIVO";
                    }
                    else if (element.Payment_method == "CARD") {
                        element.color = "#54A790";
                        element.Payment_method = "TARJETA";
                    }
                    else {
                        element.color = "#F18B70";
                    }
                    element.total_payable_str = element.total_payable.toFixed(2);
                });
                _this.total_Txn = report.data.entiremount.EntireTxnThisMonth;
                _this.payment_data = report.data.list;
                //this.Payoutchart.widget.redraw();
            }
            else {
                _this.commonService.showAlert(report.message);
            }
        });
    };
    AccountingReportComponent.prototype.getTotalCost = function (option, ispayment) {
        var _this = this;
        if (ispayment === void 0) { ispayment = true; }
        var ans = 0;
        switch (option) {
            case 'number':
                ans = ispayment ? this.payment_data.map(function (t) { return t.count; }).reduce(function (acc, value) { return acc + value; }, 0) : this.iva_data.map(function (t) { return Number(t.tax_amount); }).reduce(function (acc, value) { return Number(acc) + Number(value); }, 0);
                break;
            case 'turnover':
                ans = ispayment ? this.payment_data.map(function (t) { return (t.total_payable / _this.total_Txn * 100); }).reduce(function (acc, value) { return acc + value; }, 0) : this.iva_data.map(function (t) { return Number(t.total_without_tax); }).reduce(function (acc, value) { return acc + value; }, 0);
                break;
            case 'imported':
                ans = ispayment ? this.payment_data.map(function (t) { return t.total_payable; }).reduce(function (acc, value) { return acc + value; }, 0) : this.iva_data.map(function (t) { return Number(t.total_with_tax); }).reduce(function (acc, value) { return acc + value; }, 0);
                break;
            default:
                break;
        }
        return ans;
    };
    __decorate([
        core_1.ViewChild('vatChart')
    ], AccountingReportComponent.prototype, "vatChart");
    __decorate([
        core_1.ViewChild('Payoutchart')
    ], AccountingReportComponent.prototype, "Payoutchart");
    AccountingReportComponent = __decorate([
        core_1.Component({
            selector: 'app-accounting-report',
            templateUrl: './accounting-report.component.html',
            styleUrls: ['./accounting-report.component.scss']
        })
    ], AccountingReportComponent);
    return AccountingReportComponent;
}());
exports.AccountingReportComponent = AccountingReportComponent;
