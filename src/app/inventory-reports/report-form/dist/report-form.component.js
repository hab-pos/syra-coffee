"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReportFormComponent = void 0;
var core_1 = require("@angular/core");
var account_from_component_1 = require("../../account-configurations/account-from/account-from.component");
var forms_1 = require("@angular/forms");
var delete_component_1 = require("../../shared/components/delete/delete.component");
var ReportFormComponent = /** @class */ (function () {
    //constructor
    function ReportFormComponent(router, activatedRoute, apiServices, commonService, modalService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.apiServices = apiServices;
        this.commonService = commonService;
        this.modalService = modalService;
        this.isLoadingDelete = false;
        this.isLoadingSave = false;
        this.isLoading = false;
        this.entryForm = new forms_1.FormGroup({
            weekly_shipping: new forms_1.FormControl('', forms_1.Validators.required),
            final_remaining: new forms_1.FormControl('', forms_1.Validators.required)
        });
        //initalization
        this.close = account_from_component_1.close;
    }
    //Init
    ReportFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.commonService.EditReport.subscribe(function (_) {
            _this.entryForm = new forms_1.FormGroup({
                weekly_shipping: new forms_1.FormControl(_this.dataToGetPassed.weekly_shipped == -1 ? '-' : _this.dataToGetPassed.weekly_shipped, forms_1.Validators.required),
                final_remaining: new forms_1.FormControl(_this.dataToGetPassed.final_remaining == -1 ? '-' : _this.dataToGetPassed.final_remaining, forms_1.Validators.required)
            });
        });
    };
    //save category function
    ReportFormComponent.prototype.saveAction = function () {
        var request = new Object();
        request._id = this.dataToGetPassed._id;
        if (this.entryForm.valid) {
            request.final_remaining = this.entryForm.controls["final_remaining"].value;
            request.weekly_shipping = this.entryForm.controls["weekly_shipping"].value;
            this.callAPI(request);
        }
        else {
            if (this.entryForm.controls["weekly_shipping"].value == null) {
                this.commonService.showAlert("Invalid weekly shiping");
            }
            else {
                this.commonService.showAlert("Invalid Final remaining");
            }
        }
    };
    ReportFormComponent.prototype.callAPI = function (request) {
        var _this = this;
        this.isLoadingSave = true;
        this.apiServices.updateCoffeeReportEntry(request).subscribe(function (res) {
            _this.isLoadingSave = false;
            _this.commonService.showAlert(res.message);
            _this.commonService.SuccessEditCoffeeCount.emit();
            _this.sidenav.close();
        });
    };
    //to delete category
    ReportFormComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.isLoadingDelete = true;
            _this.apiServices.deleteCoffeeReportEntry({ _id: _this.dataToGetPassed._id }).subscribe(function (res) {
                _this.isLoadingDelete = false;
                _this.commonService.showAlert("deleted successfully");
                _this.commonService.SuccessEditCoffeeCount.emit();
                _this.sidenav.close();
            });
        }, function () {
        });
    };
    __decorate([
        core_1.Input()
    ], ReportFormComponent.prototype, "dataToGetPassed");
    __decorate([
        core_1.Input()
    ], ReportFormComponent.prototype, "sidenav");
    ReportFormComponent = __decorate([
        core_1.Component({
            selector: 'app-report-form',
            templateUrl: './report-form.component.html',
            styleUrls: ['./report-form.component.scss']
        })
    ], ReportFormComponent);
    return ReportFormComponent;
}());
exports.ReportFormComponent = ReportFormComponent;
