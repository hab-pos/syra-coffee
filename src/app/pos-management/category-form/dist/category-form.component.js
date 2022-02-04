"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CategoryFormComponent = void 0;
var core_1 = require("@angular/core");
var account_from_component_1 = require("../../account-configurations/account-from/account-from.component");
var forms_1 = require("@angular/forms");
var delete_component_1 = require("../../shared/components/delete/delete.component");
var CategoryFormComponent = /** @class */ (function () {
    //constructor
    function CategoryFormComponent(router, activatedRoute, apiServices, commonService, modalService) {
        var _this = this;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.apiServices = apiServices;
        this.commonService = commonService;
        this.modalService = modalService;
        this.isLoadingDelete = false;
        this.isLoadingSave = false;
        this.branches = [];
        this.allComplete = false;
        this.selectedValue = "10.00%";
        this.isLoading = true;
        this.categoryForm = new forms_1.FormGroup({
            category: new forms_1.FormControl('', forms_1.Validators.required)
        });
        //initalization
        this.close = account_from_component_1.close;
        this.category_id = "";
        this.selectedColorIndex = 0;
        this.colors = [
            { color: "#4751c9" },
            { color: "#45a9ea" },
            { color: "#cc6ae3" },
            { color: "#dea766" },
            { color: "#7c52cb" },
            { color: "#16a186" },
        ];
        this.commonService.resetForms.subscribe(function () {
            _this.initPopup(null);
        });
    }
    //Init
    CategoryFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.parentParams = this.activatedRoute.snapshot.paramMap;
        this.commonService.categoryEmitter.subscribe(function (category_id) {
            if (_this.parentParams.get("category")) {
                _this.initQueryParams();
            }
            else {
                _this.initPopup(category_id);
            }
        });
        this.get_branches();
    };
    //update achecked status of individal branches => to get selected branches
    CategoryFormComponent.prototype.updateAllComplete = function (row, checked) {
        this.branches[row].is_active = checked;
        this.allComplete = this.branches != null && this.branches.every(function (t) { return t.is_active; });
    };
    //parent function to init entire pop up for both actions (add and edit categoried)
    CategoryFormComponent.prototype.initPopup = function (category_id) {
        this.category_id = category_id;
        if (category_id) {
            this.getCategoryDetails();
        }
        else {
            this.categoryForm.setValue({ category: "" });
            this.selectedColorIndex = 0;
            this.init_branches();
        }
    };
    //to get category detials while comming to edit option to fill form 
    CategoryFormComponent.prototype.getCategoryDetails = function () {
        var _this = this;
        this.isLoading = true;
        this.apiServices.getCategories({ id: this.category_id }).subscribe(function (response) {
            var _a, _b;
            _this.isLoading = false;
            _this.categoryForm.setValue({ category: (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b.category_name });
            _this.selectedColorIndex = _this.colors.findIndex(function (x) { return x.color === response.data.category.color; });
            _this.init_branches();
            response.data.category.available_branches.forEach(function (element) {
                var index = _this.branches.findIndex(function (x) { return x._id === element; });
                _this.branches[index].is_active = true;
            });
            _this.isLoading = false;
        });
    };
    //to get all brnaches
    CategoryFormComponent.prototype.get_branches = function () {
        var _this = this;
        this.apiServices.get_branch({}).subscribe(function (res) {
            if (res.success) {
                _this.branches = res.data.branch_list;
                _this.branches.forEach(function (element) {
                    element["is_active"] = false;
                });
            }
            else {
                _this.commonService.showAlert(res.message);
            }
        });
    };
    //save category function
    CategoryFormComponent.prototype.saveAction = function () {
        if (this.categoryForm.valid) {
            if (!this.commonService.isAnyBranchSelected(this.branches)) {
                this.commonService.showAlert("select atleast any one branch");
            }
            else {
                this.saveCategory();
            }
        }
        else {
            this.commonService.showAlert("Category name is mandatory");
        }
    };
    //to add category API
    CategoryFormComponent.prototype.saveCategory = function () {
        var _this = this;
        this.isLoadingSave = true;
        var request = this.generateObject();
        this.apiServices.addCategory(request).subscribe(function (response) {
            _this.isLoadingSave = false;
            if (response.success) {
                if (_this.parentParams.get("category") != null) {
                    _this.redirectToCatelouge();
                }
                else {
                    _this.commonService.showAlert(response.message);
                    _this.commonService.commonEmitter.emit();
                    _this.sidenav.close();
                }
            }
            else {
                _this.commonService.showAlert(response.message);
            }
        });
    };
    //to edit category
    CategoryFormComponent.prototype.editAction = function () {
        var _this = this;
        this.isLoadingSave = true;
        var req = this.generateObject();
        req.id = this.category_id;
        this.apiServices.updateCategory(req).subscribe(function (response) {
            _this.commonService.showAlert(response.message);
            _this.isLoadingSave = false;
            if (response.success) {
                _this.sidenav.close();
                _this.commonService.commonEmitter.emit();
            }
        });
    };
    //to delete category
    CategoryFormComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.isLoadingDelete = true;
            _this.apiServices.deleteCategory({ id: _this.category_id }).subscribe(function (response) {
                _this.commonService.showAlert(response.message);
                _this.isLoadingDelete = false;
                if (response.success) {
                    _this.sidenav.close();
                    _this.commonService.commonEmitter.emit();
                }
            });
        }, function () {
        });
    };
    // to get all branch ids when checked
    CategoryFormComponent.prototype.getSelectedBranches = function () {
        var selected = [];
        this.branches.forEach(function (element) {
            if (element.is_active) {
                selected.push(element._id);
            }
        });
        return selected;
    };
    //to change category the color index
    CategoryFormComponent.prototype.ChangeColor = function (row) {
        this.selectedColorIndex = row;
    };
    //to generate input object
    CategoryFormComponent.prototype.generateObject = function () {
        var _a;
        var request = Object();
        request.color = this.colors[this.selectedColorIndex].color;
        request.category_name = this.categoryForm.controls['category'].value;
        request.available_branches = this.getSelectedBranches().join(",");
        request.is_Active = true;
        request.created_by = JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "")["data"]["_id"];
        return request;
    };
    //redirect to catelouge page with created category data
    CategoryFormComponent.prototype.redirectToCatelouge = function () {
        var params = this.getAllParams();
        this.router.navigate(["/configurations/catalouge", params]);
    };
    //to get all params returned from inventory page
    CategoryFormComponent.prototype.getAllParams = function () {
        var _a, _b;
        var data;
        (_b = (_a = this.activatedRoute) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.params.subscribe(function (params) {
            data = params;
        });
        return data;
    };
    // to set all branches un selected
    CategoryFormComponent.prototype.init_branches = function () {
        this.branches.forEach(function (element) {
            element.is_active = false;
        });
        this.isLoading = false;
    };
    //to initialize while comming from inventory page
    CategoryFormComponent.prototype.initQueryParams = function () {
        console.log(this.parentParams);
        this.categoryForm.setValue({ category: this.parentParams.get("category") });
    };
    __decorate([
        core_1.ViewChild('category')
    ], CategoryFormComponent.prototype, "categoryName");
    __decorate([
        core_1.Input()
    ], CategoryFormComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], CategoryFormComponent.prototype, "field");
    __decorate([
        core_1.Input()
    ], CategoryFormComponent.prototype, "action");
    __decorate([
        core_1.Input()
    ], CategoryFormComponent.prototype, "parentParams");
    CategoryFormComponent = __decorate([
        core_1.Component({
            selector: 'app-category-form',
            templateUrl: './category-form.component.html',
            styleUrls: ['./category-form.component.scss']
        })
    ], CategoryFormComponent);
    return CategoryFormComponent;
}());
exports.CategoryFormComponent = CategoryFormComponent;
