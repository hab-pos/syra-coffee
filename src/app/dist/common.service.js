"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CommonService = void 0;
var core_1 = require("@angular/core");
var CommonService = /** @class */ (function () {
    function CommonService(snackbar, errorClass) {
        this.snackbar = snackbar;
        this.errorClass = errorClass;
        this.url_updated = new core_1.EventEmitter();
        this.update_status = new core_1.EventEmitter();
        this.select_branch = new core_1.EventEmitter();
        this.parent_open = new core_1.EventEmitter();
        this.admin_open = new core_1.EventEmitter();
        this.choose_date = new core_1.EventEmitter();
        this.passing_res_branch = new core_1.EventEmitter();
        this.passing_res_user = new core_1.EventEmitter();
        this.passing_res_admin = new core_1.EventEmitter();
        this.toggle_sidebar = new core_1.EventEmitter();
        this.updateScreenType = new core_1.EventEmitter();
        this.getBranches = new core_1.EventEmitter();
        this.userEmitter = new core_1.EventEmitter();
        this.commonEmitter = new core_1.EventEmitter();
        this.categoryEmitter = new core_1.EventEmitter();
        this.productEmitter = new core_1.EventEmitter();
        this.inventoryOrder = new core_1.EventEmitter();
        this.catelougeEmitter = new core_1.EventEmitter();
        this.closedSideNav = new core_1.EventEmitter();
        this.setupEmitter = new core_1.EventEmitter();
        this.resetForms = new core_1.EventEmitter();
        this.exportClicked = new core_1.EventEmitter();
        this.export_success = new core_1.EventEmitter();
        this.reloadGrphEmitter = new core_1.EventEmitter();
        this.sendMail = new core_1.EventEmitter();
        this.EditReport = new core_1.EventEmitter();
        this.SuccessEditCoffeeCount = new core_1.EventEmitter();
        this.openInventoryForm = new core_1.EventEmitter();
        this.closeInventoryForm = new core_1.EventEmitter();
        this.reOrderSuccess = new core_1.EventEmitter();
        this.UserCategorySuccess = new core_1.EventEmitter();
        this.UserCategorypopUpopend = new core_1.EventEmitter();
        this.ModifierCategorypopUpopend = new core_1.EventEmitter();
        this.ModifierSuccess = new core_1.EventEmitter();
        this.UserproductSuccess = new core_1.EventEmitter();
        this.UserProductpopUpopend = new core_1.EventEmitter();
        this.featuredProdcutSuccess = new core_1.EventEmitter();
        this.featuredProductopUpopend = new core_1.EventEmitter();
        this.EventSuccess = new core_1.EventEmitter();
        this.eventFormOpend = new core_1.EventEmitter();
        this.storySuccess = new core_1.EventEmitter();
        this.storyPopupOpened = new core_1.EventEmitter();
        this.CreateInvOrderFromAdminDataFetcher = new core_1.EventEmitter();
        this.syncProductQuantity = new core_1.EventEmitter();
        this.updateInventoryOrderFrom = new core_1.EventEmitter();
        this.updateSyningCountEmitter = new core_1.EventEmitter();
    }
    CommonService.prototype.language_slot = function () {
        var language_slot = [];
        language_slot['en'] = "English";
        language_slot['es'] = "Spanish";
        return language_slot;
    };
    CommonService.prototype.set_current_url = function (value) {
        this.url_updated.emit(value);
    };
    CommonService.prototype.set_status = function (value) {
        this.update_status.emit(value);
    };
    CommonService.prototype.set_branch = function (value) {
        this.select_branch.emit(value);
    };
    CommonService.prototype.branch_edit = function (value) {
        this.parent_open.emit(value);
    };
    CommonService.prototype.admin_edit = function (value) {
        this.admin_open.emit(value);
    };
    CommonService.prototype.set_date = function (date) {
        this.choose_date.emit(date);
    };
    CommonService.prototype.push_data = function (value) {
        this.passing_res_branch.emit(value);
    };
    CommonService.prototype.push_user_data = function (value) {
        this.passing_res_user.emit(value);
    };
    CommonService.prototype.pass_data = function (value) {
        this.passing_res_admin.emit(value);
    };
    CommonService.prototype.set_sidebar_toggle = function (value) {
        if (value === void 0) { value = ""; }
        this.toggle_sidebar.emit(value);
    };
    CommonService.prototype.update_screen_type = function (value) {
        if (value === void 0) { value = ""; }
        this.toggle_sidebar.emit(value);
    };
    CommonService.prototype.showAlert = function (value) {
        console.log(value);
        this.snackbar.open(value.replace(/^./, value[0].toUpperCase()), "close", {
            duration: 2000
        });
    };
    CommonService.prototype.getFormValidationErrors = function (form) {
        var _this = this;
        var error = [];
        Object.keys(form.controls).forEach(function (key) {
            var _a;
            var controlErrors = (_a = form === null || form === void 0 ? void 0 : form.get(key)) === null || _a === void 0 ? void 0 : _a.errors;
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach(function (keyError) {
                    error.push(_this.errorClass.errors[key] + ' is ' + _this.errorClass.errorType[keyError]);
                });
            }
        });
        console.log(error[0]);
        this.showAlert(error[0]);
    };
    CommonService.prototype.isAnyBranchSelected = function (branches) {
        var success = false;
        branches.forEach(function (element) {
            if (element.is_active == true) {
                success = true;
            }
        });
        return success;
    };
    CommonService.prototype.isAnycategorySelected = function (category) {
        var success = false;
        category.forEach(function (element) {
            if (element.is_active == true) {
                success = true;
            }
        });
        return success;
    };
    CommonService.prototype.sort = function (ivalist) {
        return ivalist.sort(function (obj1, obj2) {
            if (Number(obj1.iva_percent) > Number(obj2.iva_percent)) {
                return 1;
            }
            if (Number(obj1.iva_percent) < Number(obj2.iva_percent)) {
                return -1;
            }
            return 0;
        });
    };
    CommonService.prototype.processPrice = function (amount) {
        return Number(amount).toFixed(2);
    };
    CommonService.prototype.findInvalidControls = function (controls_arg) {
        var invalid = [];
        var controls = controls_arg;
        for (var name in controls) {
            if (controls[name].invalid) {
                invalid.push(this.errorClass.errors[name]);
            }
        }
        return invalid;
    };
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "url_updated");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "update_status");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "select_branch");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "parent_open");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "admin_open");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "choose_date");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "passing_res_branch");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "passing_res_user");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "passing_res_admin");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "toggle_sidebar");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "updateScreenType");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "getBranches");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "userEmitter");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "commonEmitter");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "categoryEmitter");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "productEmitter");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "inventoryOrder");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "catelougeEmitter");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "closedSideNav");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "setupEmitter");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "resetForms");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "exportClicked");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "export_success");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "reloadGrphEmitter");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "sendMail");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "EditReport");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "SuccessEditCoffeeCount");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "openInventoryForm");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "closeInventoryForm");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "reOrderSuccess");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "UserCategorySuccess");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "UserCategorypopUpopend");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "ModifierCategorypopUpopend");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "ModifierSuccess");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "UserproductSuccess");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "UserProductpopUpopend");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "featuredProdcutSuccess");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "featuredProductopUpopend");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "EventSuccess");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "eventFormOpend");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "storySuccess");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "storyPopupOpened");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "CreateInvOrderFromAdminDataFetcher");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "syncProductQuantity");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "updateInventoryOrderFrom");
    __decorate([
        core_1.Output()
    ], CommonService.prototype, "updateSyningCountEmitter");
    CommonService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CommonService);
    return CommonService;
}());
exports.CommonService = CommonService;
