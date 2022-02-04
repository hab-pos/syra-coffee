"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.close = exports.CatelougeFormComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var forms_1 = require("@angular/forms");
var delete_component_1 = require("../../shared/components/delete/delete.component");
var CatelougeFormComponent = /** @class */ (function () {
    function CatelougeFormComponent(apiServices, router, commonService, activatedRoute, modalService) {
        var _this = this;
        this.apiServices = apiServices;
        this.router = router;
        this.commonService = commonService;
        this.activatedRoute = activatedRoute;
        this.modalService = modalService;
        this.faTimesCircle = free_solid_svg_icons_1.faTimesCircle;
        this.close = exports.close;
        this.selectedValue = "10.00%";
        this.faEuroSign = free_solid_svg_icons_1.faEuroSign;
        this.faCaretDown = free_solid_svg_icons_1.faCaretDown;
        this.faPlus = free_solid_svg_icons_1.faPlus;
        this.catelougeForm = new forms_1.FormGroup({
            product_name: new forms_1.FormControl('', forms_1.Validators.required),
            refernce: new forms_1.FormControl('', forms_1.Validators.required),
            units: new forms_1.FormControl('', forms_1.Validators.required),
            price: new forms_1.FormControl('', forms_1.Validators.required),
            category: new forms_1.FormControl('', forms_1.Validators.required)
        });
        this.isLoadingAdd = false;
        this.isLoadingDelete = false;
        this.branches = [];
        this.categories = [];
        this.units = [];
        this.options = [];
        this.inventory = new Object();
        this.requests = new Object();
        this.indexTobeMined = -1;
        this.parentParams = null;
        var obj = this.apiServices.units;
        obj.forEach(function (element) {
            _this.units.push(element.name);
        });
        this.filtered_units = this.units;
        this.filteredOptions = this.options;
        this.commonService.resetForms.subscribe(function () {
            _this.catelougeForm = new forms_1.FormGroup({
                product_name: new forms_1.FormControl('', forms_1.Validators.required),
                refernce: new forms_1.FormControl('', forms_1.Validators.required),
                units: new forms_1.FormControl('', forms_1.Validators.required),
                price: new forms_1.FormControl('', forms_1.Validators.required),
                category: new forms_1.FormControl('', forms_1.Validators.required)
            });
            _this.init_branches();
        });
    }
    CatelougeFormComponent.prototype.updateAllComplete = function (row, checked) {
        this.branches[row].is_active = checked;
    };
    CatelougeFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_branches();
        this.get_categories();
        this.commonService.catelougeEmitter.subscribe(function (value) {
            var _a, _b;
            _this.parentParams = _this.activatedRoute.snapshot.paramMap;
            if (_this.field != "addinv") {
                _this.indexTobeMined = value.index;
                _this.inventory = value.data[value.index];
                _this.init_branches();
                _this.catelougeForm.setValue({
                    product_name: _this.inventory.inventory_name,
                    refernce: _this.inventory.reference,
                    units: _this.inventory.unit,
                    price: _this.inventory.price,
                    category: _this.inventory.category_id
                });
                var branches = _this.inventory.available_branches;
                branches.forEach(function (element) {
                    var index = _this.branches.findIndex(function (x) { return x._id === element; });
                    _this.branches[index].is_active = true;
                });
            }
            else {
                if ((_a = _this.parentParams) === null || _a === void 0 ? void 0 : _a.get("category")) {
                    _this.catelougeForm.setValue({
                        product_name: _this.parentParams.get("inventory_name"),
                        refernce: _this.parentParams.get("reference"),
                        units: _this.parentParams.get("unit"),
                        price: _this.parentParams.get("price"),
                        category: _this.parentParams.get("category")
                    });
                    var branches = ((_b = _this.parentParams.get("available_branches")) === null || _b === void 0 ? void 0 : _b.split(",")) || [];
                    branches.forEach(function (element) {
                        var index = _this.branches.findIndex(function (x) { return x._id === element; });
                        _this.branches[index].is_active = true;
                    });
                }
                else {
                    _this.catelougeForm.setValue({
                        product_name: "",
                        refernce: "",
                        units: "",
                        price: "",
                        category: ""
                    });
                    _this.init_branches();
                }
            }
        });
    };
    CatelougeFormComponent.prototype.init_branches = function () {
        this.branches.forEach(function (element) {
            element.is_active = false;
        });
    };
    CatelougeFormComponent.prototype.get_categories = function () {
        var _this = this;
        this.apiServices.getCategories().subscribe(function (response) {
            if (response.success) {
                _this.categories = response.data.category;
                response.data.category.forEach(function (element) {
                    _this.options.push(element.category_name);
                });
            }
            else {
                _this.commonService.showAlert(response.message);
            }
        });
    };
    CatelougeFormComponent.prototype.filter = function (value) {
        var filterValue = value.toLowerCase();
        this.filteredOptions = this.options.filter(function (option) { return option.toLowerCase().includes(filterValue); });
    };
    CatelougeFormComponent.prototype.filter_units = function (value) {
        var filterValue = value.toLowerCase();
        this.filtered_units = this.units.filter(function (option) { return option.toLowerCase().includes(filterValue); });
    };
    CatelougeFormComponent.prototype.saveAction = function () {
        if (this.catelougeForm.valid) {
            if (this.filtered_units.length == 0) {
                this.commonService.showAlert("There is no unit named : " + this.catelougeForm.controls["units"].value + " please add and continue");
            }
            else if (this.filteredOptions.length == 0) {
                this.commonService.showAlert("There is no category named : " + this.catelougeForm.controls["category"].value + " please add and continue");
            }
            else if (!this.commonService.isAnyBranchSelected(this.branches)) {
                this.commonService.showAlert("select atleast any one branch");
            }
            else {
                this.addCatelouge();
            }
        }
        else {
            this.commonService.getFormValidationErrors(this.catelougeForm);
        }
    };
    CatelougeFormComponent.prototype.editAction = function () {
        if (this.catelougeForm.valid) {
            if (this.filtered_units.length == 0) {
                this.commonService.showAlert("There is no unit named : " + this.catelougeForm.controls["units"].value + " please add and continue");
            }
            else if (this.filteredOptions.length == 0) {
                this.commonService.showAlert("There is no category named : " + this.catelougeForm.controls["category"].value + " please add and continue");
            }
            else if (!this.commonService.isAnyBranchSelected(this.branches)) {
                this.commonService.showAlert("select atleast any one branch");
            }
            else {
                this.editCatelouge();
            }
        }
        else {
            this.commonService.getFormValidationErrors(this.catelougeForm);
        }
    };
    CatelougeFormComponent.prototype.editCatelouge = function () {
        var _this = this;
        this.isLoadingAdd = true;
        this.getInputs();
        this.requests.id = this.inventory._id;
        this.requests._id = this.inventory._id;
        this.apiServices.updateCatelouge(this.requests).subscribe(function (res) {
            _this.commonService.showAlert(res.message);
            _this.isLoadingAdd = false;
            if (res.success) {
                if (_this.parentParams) {
                    _this.parentParams = null;
                    _this.router.navigateByUrl('/configurations/catalouge');
                }
                _this.sidenav.close();
                setTimeout(function () { _this.commonService.commonEmitter.emit(); }, 2000);
            }
        });
    };
    CatelougeFormComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.isLoadingDelete = true;
            _this.apiServices.deleteCatelouge({ id: _this.inventory._id }).subscribe(function (res) {
                _this.commonService.showAlert(res.message);
                _this.isLoadingDelete = false;
                if (res.success) {
                    _this.sidenav.close();
                    _this.commonService.commonEmitter.emit();
                }
            });
        }, function () {
        });
    };
    CatelougeFormComponent.prototype.get_branches = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apiServices.get_branch({}).subscribe(function (res) {
                            if (res.success) {
                                _this.branches = res.data.branch_list;
                                _this.branches.forEach(function (element) {
                                    element["is_active"] = false;
                                });
                            }
                            else {
                                _this.commonService.showAlert(res.message);
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CatelougeFormComponent.prototype.addCatelouge = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.isLoadingAdd = true;
                this.getInputs();
                this.apiServices.addCatelouge(this.requests).subscribe(function (response) {
                    _this.isLoadingAdd = false;
                    _this.commonService.showAlert(response.message);
                    if (response.success) {
                        if (_this.parentParams) {
                            _this.parentParams = null;
                            _this.router.navigateByUrl('/configurations/catalouge');
                        }
                        setTimeout(function () { _this.commonService.commonEmitter.emit(); }, 2000);
                        _this.sidenav.close();
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    CatelougeFormComponent.prototype.navigateCategory = function () {
        this.getInputs();
        var data = this.requests;
        data.toAddCategory = true;
        data.field = this.field;
        data.category = this.catelougeForm.controls["category"].value;
        data.index = this.indexTobeMined;
        this.router.navigate(["/products/pos", data]);
    };
    CatelougeFormComponent.prototype.getInputs = function () {
        var _a;
        var selected_branches = [];
        this.requests = new Object();
        this.requests.inventory_name = this.product.nativeElement.value;
        this.requests.reference = this.refernce_name.nativeElement.value;
        this.requests.unit = this.units_field.nativeElement.value;
        this.requests.price = this.price.nativeElement.value;
        this.requests.category_id = this.category.nativeElement.value;
        this.requests.created_by = JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "")["data"]["_id"];
        selected_branches = [];
        this.branches.forEach(function (element) {
            if (element.is_active) {
                selected_branches.push(element._id);
            }
        });
        this.requests.available_branches = selected_branches.join(",");
    };
    __decorate([
        core_1.Input()
    ], CatelougeFormComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], CatelougeFormComponent.prototype, "field");
    __decorate([
        core_1.ViewChild("product_name")
    ], CatelougeFormComponent.prototype, "product");
    __decorate([
        core_1.ViewChild("refernce_name")
    ], CatelougeFormComponent.prototype, "refernce_name");
    __decorate([
        core_1.ViewChild("units")
    ], CatelougeFormComponent.prototype, "units_field");
    __decorate([
        core_1.ViewChild("price")
    ], CatelougeFormComponent.prototype, "price");
    __decorate([
        core_1.ViewChild("category")
    ], CatelougeFormComponent.prototype, "category");
    CatelougeFormComponent = __decorate([
        core_1.Component({
            selector: 'app-catelouge-form',
            templateUrl: './catelouge-form.component.html',
            styleUrls: ['./catelouge-form.component.scss']
        })
    ], CatelougeFormComponent);
    return CatelougeFormComponent;
}());
exports.CatelougeFormComponent = CatelougeFormComponent;
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
