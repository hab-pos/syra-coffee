"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CatelougeConfigurationsComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var _ = require("lodash");
var XLSX = require("xlsx");
var CatelougeConfigurationsComponent = /** @class */ (function () {
    function CatelougeConfigurationsComponent(router, activeRoute, commonServices, apiServices) {
        var _this = this;
        this.router = router;
        this.activeRoute = activeRoute;
        this.commonServices = commonServices;
        this.apiServices = apiServices;
        this.loadsh = _;
        this.current = 1;
        this.totalPages = 1;
        this.endPage = 1;
        this.startPage = 1;
        this.faEdit = free_solid_svg_icons_1.faEdit;
        this.faSortRef = free_solid_svg_icons_1.faSort;
        this.faSortProd = free_solid_svg_icons_1.faSort;
        this.faSearch = free_solid_svg_icons_1.faSearch;
        this.faPlusCircle = free_solid_svg_icons_1.faPlusCircle;
        this.field = '';
        this.isLoading = false;
        this.sortType = null;
        this.avilableBranches = [];
        this.sortField = null;
        this.tableData = [];
        this.backup = [];
        this.displayedColumns = ["refernce", "product_name", "unit", "price", "category", "available_for", "available_for1", "action"];
        this.url_array = [];
        this.commonServices.commonEmitter.subscribe(function (res) {
            _this.get_catelouges();
        });
        this.commonServices.select_branch.subscribe(function (branch_info) {
            var array = branch_info.map(function (element) { return element._id; });
            _this.get_catelouges(null, array);
        });
        this.commonServices.url_updated.subscribe(function (date) {
            _this.url_array = date;
        });
        this.subscribtion = this.commonServices.exportClicked.subscribe(function (_) {
            if (_this.url_array[1] == "configurations" && _this.url_array[2] == "catalouge") {
                var data = _this.loadsh.map(_this.tableData, function (o) { return _this.loadsh.pick(o, ['reference', 'inventory_name', 'unit', 'price', 'category_id', 'branch_name_array']); });
                _this.downloadFile(data);
            }
        });
    }
    CatelougeConfigurationsComponent.prototype.ngAfterViewInit = function () {
        this.paramsFromParent = this.activeRoute.snapshot.paramMap;
        if (this.paramsFromParent.get("toAddCategory")) {
            this.openSideBar(this.paramsFromParent.get("field") || "");
        }
        this.get_branches();
        this.get_catelouges();
    };
    CatelougeConfigurationsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.innerWidth = window.innerWidth;
        this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(function (i) { return _this.startPage + i; });
    };
    CatelougeConfigurationsComponent.prototype.sort = function (field) {
        if (this.sortField != field) {
            this.sortType = null;
            if (field == 'reference') {
                this.faSortRef = free_solid_svg_icons_1.faSortAlphaUp;
                this.faSortProd = free_solid_svg_icons_1.faSort;
            }
            else {
                this.faSortRef = free_solid_svg_icons_1.faSort;
                this.faSortProd = free_solid_svg_icons_1.faSortAlphaUp;
            }
        }
        this.sortField = field;
        if (this.sortType == null) {
            var sorted = _.sortBy(this.tableData, function (data) {
                return field == 'reference' ? data.reference : data.inventory_name;
            });
            this.tableData = sorted;
            this.sortType = "asc";
            if (field == 'reference') {
                this.faSortRef = free_solid_svg_icons_1.faSortAlphaUp;
                this.faSortProd = free_solid_svg_icons_1.faSort;
            }
            else {
                this.faSortRef = free_solid_svg_icons_1.faSort;
                this.faSortProd = free_solid_svg_icons_1.faSortAlphaUp;
            }
        }
        else if (this.sortType == 'asc') {
            var sorted = _.sortBy(this.tableData, function (data) {
                return field == 'reference' ? data.reference : data.inventory_name;
            });
            this.tableData = sorted.reverse();
            this.sortType = "desc";
            if (field == 'reference') {
                this.faSortRef = free_solid_svg_icons_1.faSortAlphaDown;
                this.faSortProd = free_solid_svg_icons_1.faSort;
            }
            else {
                this.faSortRef = free_solid_svg_icons_1.faSort;
                this.faSortProd = free_solid_svg_icons_1.faSortAlphaDown;
            }
        }
        else {
            this.tableData = this.backup;
            this.sortType = null;
            this.faSortRef = free_solid_svg_icons_1.faSort;
            this.faSortProd = free_solid_svg_icons_1.faSort;
        }
    };
    CatelougeConfigurationsComponent.prototype.get_catelouges = function (device_id, list) {
        var _this = this;
        if (device_id === void 0) { device_id = null; }
        if (list === void 0) { list = null; }
        this.isLoading = true;
        this.apiServices.getCatelouge({ branch_list: list }).subscribe(function (response) {
            if (response.success) {
                console.log(response);
                _this.isLoading = false;
                _this.tableData = response.data.inventories;
                _this.backup = _this.tableData;
                _this.sortType = _this.sortType == 'asc' ? null : _this.sortType == 'desc' ? 'asc' : null;
                _this.sort(_this.sortField);
            }
            else {
                _this.commonServices.showAlert(response.message);
            }
        });
    };
    CatelougeConfigurationsComponent.prototype.get_branches = function () {
        var _this = this;
        this.apiServices.get_branch({}).subscribe(function (res) {
            if (res.success) {
                _this.avilableBranches = res.data.branch_list;
            }
            else {
                _this.commonServices.showAlert(res.message);
            }
        });
    };
    CatelougeConfigurationsComponent.prototype.getCatelougs = function (page) {
        if (page === void 0) { page = 1; }
        console.log(page);
    };
    CatelougeConfigurationsComponent.prototype.onResize = function (event) {
        this.innerWidth = window.innerWidth;
    };
    CatelougeConfigurationsComponent.prototype.openSideBar = function (field, row) {
        if (row === void 0) { row = -1; }
        this.field = field;
        this.indexSelected = row;
        this.sidenav.toggle();
    };
    CatelougeConfigurationsComponent.prototype.search = function (value) {
        var _this = this;
        this.apiServices.searchCatelouge({ search_string: value }).subscribe(function (res) {
            _this.tableData = res.data;
        });
    };
    CatelougeConfigurationsComponent.prototype.push = function () {
        if (this.field == "addinv") {
            this.commonServices.catelougeEmitter.emit(null);
        }
        else {
            if (this.paramsFromParent.get("category") != null) {
                this.commonServices.catelougeEmitter.emit({ data: this.tableData, index: this.paramsFromParent.get("index") });
            }
            else {
                this.commonServices.catelougeEmitter.emit({ data: this.tableData, index: this.indexSelected });
            }
        }
    };
    CatelougeConfigurationsComponent.prototype.closed = function () {
        this.commonServices.resetForms.emit();
    };
    CatelougeConfigurationsComponent.prototype.downloadFile = function (data) {
        console.log(this.tableView);
        var ws = XLSX.utils.table_to_sheet(this.tableView.nativeElement);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        /* save to file */
        XLSX.writeFile(wb, "catelouge.xls");
        this.subscribtion.unsubscribe();
        this.commonServices.export_success.emit();
    };
    __decorate([
        core_1.ViewChild('sidenav')
    ], CatelougeConfigurationsComponent.prototype, "sidenav");
    __decorate([
        core_1.ViewChild('tableView')
    ], CatelougeConfigurationsComponent.prototype, "tableView");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], CatelougeConfigurationsComponent.prototype, "onResize");
    CatelougeConfigurationsComponent = __decorate([
        core_1.Component({
            selector: 'app-catelouge-configurations',
            templateUrl: './catelouge-configurations.component.html',
            styleUrls: ['./catelouge-configurations.component.scss']
        })
    ], CatelougeConfigurationsComponent);
    return CatelougeConfigurationsComponent;
}());
exports.CatelougeConfigurationsComponent = CatelougeConfigurationsComponent;
