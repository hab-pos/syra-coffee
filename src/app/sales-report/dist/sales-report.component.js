"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SalesReportComponent = exports.subscription = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var keycodes_1 = require("@angular/cdk/keycodes");
var sort_1 = require("@angular/material/sort");
var table_1 = require("@angular/material/table");
var _ = require("lodash");
var forms_1 = require("@angular/forms");
var XLSX = require("xlsx");
var moment = require("moment");
exports.subscription = null;
var SalesReportComponent = /** @class */ (function () {
    function SalesReportComponent(apiService, commonService) {
        this.apiService = apiService;
        this.commonService = commonService;
        this.is_loading_billing = false;
        this.is_loading_category = false;
        this.is_loading_product = false;
        this.is_loading_category_list = false;
        this.selectedIndex = 0;
        this.categories = [];
        this.allComplete = false;
        this.best_category = [
            { color: "#3f9f97", name: "Coffee", earned: 316.87 },
            { color: "#8cbeba", name: "Cappuccino", earned: 218.87 },
        ];
        this.worstCategories = [
            { color: "#de7c84", name: "Coffee", earned: 316.87 },
            { color: "#de7c6f", name: "Coffee", earned: 100.87 }
        ];
        this.graphData_category = [];
        this.graphData_product = [];
        this.backup = [];
        this.loadsh = _;
        this.Pagewidth = 0;
        this.display_coloumns = ["name", "count", "price_without_iva", "price_with_iva"];
        this.display_headers = [];
        this.primaryXAxis = null;
        this.primaryXAxisCategory = null;
        this.yesterday_XAxis = null;
        this.primaryYAxis = {
            valueType: 'Double',
            majorGridLines: {
                visible: false
            },
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 }
        };
        this.zoomSettings = {
            mode: 'X',
            enableMouseWheelZooming: false,
            enablePinchZooming: false,
            enableSelectionZooming: false,
            enableScrollbar: true,
            toolbarItems: ['Zoom', 'Pan']
        };
        this.chartArea = {
            border: {
                width: 0
            },
            lineStyle: { width: 0 }
        };
        this.yesterday_yAxis = {
            valueType: 'Double',
            isInversed: true,
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 }
        };
        this.radius = { bottomLeft: 7, bottomRight: 7, topLeft: 7, topRight: 7 };
        this.pallets = [];
        this.faSearch = free_solid_svg_icons_1.faSearch;
        this.faSort = free_solid_svg_icons_1.faSort;
        this.searchProductsKeys = [];
        this.visible = true;
        this.selectable = false;
        this.removable = true;
        this.addOnBlur = true;
        this.separatorKeysCodes = [keycodes_1.ENTER, keycodes_1.COMMA];
        this.inputField = new forms_1.FormControl('');
        this.totCount = 0;
        this.totPriceWoVAT = 0;
        this.totWVAT = 0;
        this.category_graph_Data = [];
        this.backup_products = [];
        this.best_products = [];
        this.worst_products = [];
        this.product_graph_Data = [];
        this.palletsPdt = [];
        this.url_array = [];
        this.searchKeys = [];
        this.salesStats = null;
        this.dates_selected = null;
        this.branch_selected = null;
        this.tooltipGlobal = {
            enable: true,
            format: '${point.x} : <b>${point.y}€</b>'
        };
        this.resizeGraph();
    }
    SalesReportComponent.prototype.resizeGraph = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this.primaryXAxis = {
            valueType: 'Category',
            majorGridLines: {
                width: 0
            },
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 },
            interval: 1,
            zoomFactor: (this.dates_selected != null && ((_a = this.dates_selected) === null || _a === void 0 ? void 0 : _a.start) != ((_b = this.dates_selected) === null || _b === void 0 ? void 0 : _b.end) && ((_c = this.dates_selected) === null || _c === void 0 ? void 0 : _c.end) != null) && ((_e = (_d = this.salesStats) === null || _d === void 0 ? void 0 : _d.sales_sorted) === null || _e === void 0 ? void 0 : _e.length) > 15 ? 0.55 : 1
        };
        this.yesterday_XAxis = {
            valueType: 'Category',
            majorGridLines: {
                width: 0
            },
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 },
            interval: 1,
            zoomFactor: (this.dates_selected != null && ((_f = this.dates_selected) === null || _f === void 0 ? void 0 : _f.start) != ((_g = this.dates_selected) === null || _g === void 0 ? void 0 : _g.end) && ((_h = this.dates_selected) === null || _h === void 0 ? void 0 : _h.end) != null) && ((_k = (_j = this.salesStats) === null || _j === void 0 ? void 0 : _j.previous_sales_sorted) === null || _k === void 0 ? void 0 : _k.length) > 15 ? 0.55 : 1
        };
        var maximumValue = 0;
        for (var index = 0; index < this.graphData_category.length; index++) {
            var element = this.graphData_category[index];
            if (maximumValue < element.length) {
                maximumValue = element.length;
            }
        }
        this.primaryXAxisCategory = {
            valueType: 'Category',
            majorGridLines: {
                width: 0
            },
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 },
            interval: 1,
            zoomFactor: (this.dates_selected != null && ((_l = this.dates_selected) === null || _l === void 0 ? void 0 : _l.start) != ((_m = this.dates_selected) === null || _m === void 0 ? void 0 : _m.end) && ((_o = this.dates_selected) === null || _o === void 0 ? void 0 : _o.end) != null) && maximumValue > 10 ? 0.55 : 1
        };
        var maximumValuePdt = 0;
        for (var index = 0; index < this.graphData_product.length; index++) {
            var element = this.graphData_product[index];
            if (maximumValuePdt < element.length) {
                maximumValuePdt = element.length;
            }
        }
        this.primaryXAxisCategory = {
            valueType: 'Category',
            majorGridLines: {
                width: 0
            },
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 },
            interval: 1,
            zoomFactor: (this.dates_selected != null && ((_p = this.dates_selected) === null || _p === void 0 ? void 0 : _p.start) != ((_q = this.dates_selected) === null || _q === void 0 ? void 0 : _q.end) && ((_r = this.dates_selected) === null || _r === void 0 ? void 0 : _r.end) != null) && maximumValuePdt > 10 ? 0.55 : 1
        };
    };
    SalesReportComponent.prototype.load = function (args) {
        args.chart.zoomModule.isZoomed = true;
    };
    ;
    SalesReportComponent.prototype.ngOnInit = function () {
        this.Pagewidth = window.innerWidth;
    };
    SalesReportComponent.prototype.getCategorySales = function () {
        var _this = this;
        var _a;
        this.is_loading_category = true;
        var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.branch_selected = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
        this.branch_selected = ((_a = this.branch_selected) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : this.branch_selected;
        this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        this.branch_selected = this.branch_selected == "syra-all" ? null : this.branch_selected;
        this.apiService.generateCategorysalesReport({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(function (response) {
            _this.backup = response.data.category_grouped;
            _this.is_loading_category = false;
            _this.totCount = 0;
            _this.totPriceWoVAT = 0;
            _this.totWVAT = 0;
            _this.backup.forEach(function (element) {
                element.name = element.category_info.category_name;
                _this.totCount += Number(element.count);
                _this.totPriceWoVAT += Number(element.price_without_iva);
                _this.totWVAT += Number(element.price_with_iva);
            });
            _this.dataSourceCategory = new table_1.MatTableDataSource(_this.backup);
            _this.dataSourceCategory.sort = _this.sort;
            _this.best_category = response.data.best_categories;
            _this.worstCategories = response.data.worst_categories;
            _this.category_graph_Data = _this.best_category.concat(_this.worstCategories);
            setTimeout(function () {
                _this.loadGraph();
            }, 1);
            _this.loadGraph();
        });
    };
    SalesReportComponent.prototype.getNumber = function (theNumber) {
        if (theNumber > 0) {
            return "+" + theNumber.toFixed(2);
        }
        else {
            return theNumber.toFixed(2);
        }
    };
    SalesReportComponent.prototype.getProductSales = function () {
        var _this = this;
        var _a;
        this.is_loading_product = true;
        var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.branch_selected = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
        this.branch_selected = ((_a = this.branch_selected) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : this.branch_selected;
        this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        this.branch_selected = this.branch_selected == "syra-all" ? null : this.branch_selected;
        this.apiService.generateProductSalesReport({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(function (response) {
            _this.backup_products = response.data.product_grouped;
            _this.is_loading_product = false;
            _this.totCount = 0;
            _this.totPriceWoVAT = 0;
            _this.totWVAT = 0;
            _this.backup_products.forEach(function (element) {
                element.name = element.product_info.product_name;
                _this.totCount += Number(element.count);
                _this.totPriceWoVAT += Number(element.price_without_iva);
                _this.totWVAT += Number(element.price_with_iva);
            });
            _this.dataSourceProduct = new table_1.MatTableDataSource(_this.backup_products);
            _this.dataSourceProduct.sort = _this.sort;
            _this.best_products = response.data.best_products;
            _this.worst_products = response.data.worst_products;
            _this.product_graph_Data = _this.best_products.concat(_this.worst_products);
            setTimeout(function () {
                _this.loadGraphPdt();
            }, 1);
            _this.loadGraphPdt();
        });
    };
    SalesReportComponent.prototype.loadGraphPdt = function (gpData) {
        var _this = this;
        var _a;
        if (gpData === void 0) { gpData = []; }
        this.palletsPdt = [];
        var data_toPush = [];
        var data_to_be_casted = gpData;
        var backupComparision = this.searchProductsKeys.length == 0 ? this.product_graph_Data : data_to_be_casted;
        if (this.dates_selected == null || this.dates_selected.end == null || this.dates_selected.start == this.dates_selected.end) {
            backupComparision = _.map(backupComparision, function filterate(n) {
                return n.HourBased;
            });
        }
        else {
            backupComparision = _.map(backupComparision, function filterate(n) {
                return n.DateBased;
            });
        }
        backupComparision.forEach(function (category, index) {
            var array = [];
            var value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            if (_this.searchProductsKeys.length == 0) {
                _this.palletsPdt = ["#8cbeba", "#3f9f97", "#de7c84", "#de7c64"];
            }
            else {
                _this.palletsPdt.push(category[0].product_info.color);
            }
            if (_this.dates_selected == null || _this.dates_selected.end == null || _this.dates_selected.start == _this.dates_selected.end) {
                category.forEach(function (item, index) {
                    value[Number(item.time_slot) + 2] = item.price_with_iva;
                });
                value.forEach(function (element, index) {
                    var obj = { hour: index, amount: element };
                    array.push(obj);
                });
                data_toPush.push(array);
            }
            else {
                var TimeLine = [];
                for (var m = moment(_this.dates_selected.start); m.diff(_this.dates_selected.end, 'days') <= 0; m.add(1, 'days')) {
                    TimeLine.push(m.format('DD/MM'));
                }
                // category.forEach((item: any, index: any) => {
                //   if (!TimeLine.includes(item.time_slot)) {
                //     TimeLine.push(item.time_slot)
                //   }
                // })
                TimeLine.forEach(function (element) {
                    var match_found = false;
                    category.forEach(function (item, index) {
                        if (element == item.time_slot) {
                            match_found = true;
                            var obj = { hour: element, amount: item.price_with_iva };
                            array.push(obj);
                        }
                    });
                    if (match_found == false) {
                        var obj = { hour: element, amount: 0 };
                        array.push(obj);
                    }
                });
                var arraySorted = _.sortBy(array, function (data, index) {
                    return data.hour;
                });
                data_toPush.push(arraySorted);
            }
        });
        this.graphData_product = data_toPush;
        this.chartProduct.series.forEach(function (element, index) {
            console.log(element);
            _this.chartProduct.series[index].dataSource = data_toPush[index];
        });
        (_a = this.chartProduct) === null || _a === void 0 ? void 0 : _a.refresh();
        this.refreshGraphs();
        this.resizeGraph();
    };
    SalesReportComponent.prototype.loadGraph = function (gpData) {
        var _this = this;
        if (gpData === void 0) { gpData = []; }
        this.pallets = [];
        var data_toPush = [];
        var data_to_be_casted = gpData.length > 0 ? gpData : this.dataSourceCategory.data;
        var backupComparision = this.getCheckBoxStatus() == false ? this.category_graph_Data : data_to_be_casted;
        if (this.dates_selected == null || this.dates_selected.end == null || this.dates_selected.start == this.dates_selected.end) {
            backupComparision = _.map(backupComparision, function filterate(n) {
                return n.HourBased;
            });
        }
        else {
            backupComparision = _.map(backupComparision, function filterate(n) {
                return n.DateBased;
            });
        }
        this.pallets = [];
        backupComparision.forEach(function (category, index) {
            var array = [];
            var value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            if (_this.getCheckBoxStatus() == false) {
                _this.pallets = ["#8cbeba", "#3f9f97", "#de7c84", "#de7c64"];
            }
            else {
                _this.pallets.push(category[0].category_info.color);
            }
            if (_this.dates_selected == null || _this.dates_selected.end == null || _this.dates_selected.start == _this.dates_selected.end) {
                category.forEach(function (item, index) {
                    value[Number(item.time_slot) + 2] = item.price_with_iva;
                });
                value.forEach(function (element, index) {
                    var obj = { hour: index, amount: element };
                    array.push(obj);
                });
                data_toPush.push(array);
            }
            else {
                var TimeLine = [];
                for (var m = moment(_this.dates_selected.start); m.diff(_this.dates_selected.end, 'days') <= 0; m.add(1, 'days')) {
                    TimeLine.push(m.format('DD/MM'));
                }
                // category.forEach((item: any, index: any) => {
                //   if (!TimeLine.includes(item.time_slot)) {
                //     TimeLine.push(item.time_slot)
                //   }
                // })
                TimeLine.forEach(function (element) {
                    var match_found = false;
                    category.forEach(function (item, index) {
                        if (element == item.time_slot) {
                            match_found = true;
                            var obj = { hour: element, amount: item.price_with_iva };
                            array.push(obj);
                        }
                    });
                    if (match_found == false) {
                        var obj = { hour: element, amount: 0 };
                        array.push(obj);
                    }
                });
                var arraySorted = _.sortBy(array, function (data, index) {
                    return data.hour;
                });
                data_toPush.push(arraySorted);
            }
        });
        this.graphData_category = data_toPush;
        this.refreshGraphs();
        this.resizeGraph();
    };
    SalesReportComponent.prototype.getFooter = function (col) {
        switch (col) {
            case "name":
                return "Total";
            case "count":
                return this.totCount;
            case "price_without_iva":
                return this.totPriceWoVAT.toFixed(2) + "€";
            default:
                return this.totWVAT.toFixed(2) + "€";
        }
    };
    SalesReportComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.loadHeader();
        this.getGlobalSalesReport();
        this.getCategorySales();
        this.get_categories();
        this.getProductSales();
        if (exports.subscription == null) {
            exports.subscription = this.commonService.exportClicked.subscribe(function (res) {
                if (_this.url_array[1] == "reports" && _this.url_array[2] == "sales") {
                    var branch_list_1 = JSON.parse(localStorage.getItem('branch_list') || "");
                    var array_doc_1 = [];
                    var row_title_header_1 = ["Products"];
                    var date_1 = [""];
                    branch_list_1.forEach(function (element) {
                        row_title_header_1.push(element.branch_name);
                        date_1.push("");
                    });
                    row_title_header_1.push("Total");
                    var product_sorted_1 = _.sortBy(_this.dataSourceProduct.data, function (data, index) {
                        return data.product_info.product_name;
                    });
                    _this.dataSourceCategory.data.forEach(function (element) {
                        var wb = XLSX.utils.book_new();
                        if (_this.dates_selected == null) {
                            date_1[Math.round(date_1.length / 2)] = moment().format("DD/MM/YYYY");
                        }
                        else if (_this.dates_selected.start != null && _this.dates_selected.end != null) {
                            date_1[Math.round(date_1.length / 2)] = moment(_this.dates_selected.start).format("DD/MM/YYYY") + "-" + moment(_this.dates_selected.end).format("DD/MM/YYYY");
                        }
                        else {
                            date_1[Math.round(date_1.length / 2)] = moment(_this.dates_selected.start).format("DD/MM/YYYY");
                        }
                        array_doc_1.push(date_1);
                        array_doc_1.push(row_title_header_1);
                        product_sorted_1.forEach(function (element_product) {
                            if (element_product.product_info.categories.includes(element.category_id)) {
                                var row_1 = [element_product.product_info.product_name];
                                branch_list_1.forEach(function (element_branch, index_branch) {
                                    row_1.push(0);
                                });
                                var total_pdts_sold = 0;
                                for (var index_branch = 0; index_branch < branch_list_1.length; index_branch++) {
                                    var element_branch = branch_list_1[index_branch];
                                    for (var index_branch_products = 0; index_branch_products < element_product.info.length; index_branch_products++) {
                                        var element_branch_products = element_product.info[index_branch_products];
                                        if (element_branch._id == element_branch_products.branch_id) {
                                            row_1[index_branch + 1] = element_branch_products.count;
                                            total_pdts_sold += Number(element_branch_products.count);
                                        }
                                    }
                                }
                                row_1.push(total_pdts_sold);
                                array_doc_1.push(row_1);
                                total_pdts_sold = 0;
                            }
                        });
                        var row_footer = ["TOTAL"];
                        for (var index = 2; index < array_doc_1.length; index++) {
                            var element_row = array_doc_1[index];
                            for (var index_j = 1; index_j < element_row.length; index_j++) {
                                var element_col = element_row[index_j];
                                if (row_footer[index_j]) {
                                    row_footer[index_j] += element_col;
                                }
                                else {
                                    row_footer[index_j] = element_col;
                                }
                            }
                        }
                        array_doc_1.push(row_footer);
                        var ws = XLSX.utils.aoa_to_sheet(array_doc_1);
                        var merge = [
                            { s: { r: 0, c: 0 }, e: { r: 0, c: row_title_header_1.length - 1 } },
                        ];
                        ws["!merges"] = merge;
                        XLSX.utils.sheet_add_aoa(ws, [
                            [date_1[Math.round(date_1.length / 2)]]
                        ], { origin: 0 });
                        XLSX.utils.book_append_sheet(wb, ws, element.category_info.category_name);
                        XLSX.writeFile(wb, element.category_info.category_name.toUpperCase() + ".xls");
                        array_doc_1 = [];
                    });
                    _this.commonService.export_success.emit();
                }
            });
            this.commonService.choose_date.subscribe(function (selectedDates) {
                _this.dataSourceProduct.data = [];
                _this.dataSourceCategory.data = [];
                _this.best_products = [];
                _this.worst_products = [];
                _this.setAll(false);
                _this.getGlobalSalesReport();
                _this.getCategorySales();
                _this.getProductSales();
            });
            this.commonService.select_branch.subscribe(function (selectedBranch) {
                _this.dataSourceProduct.data = [];
                _this.dataSourceCategory.data = [];
                _this.best_products = [];
                _this.worst_products = [];
                _this.setAll(false);
                _this.getGlobalSalesReport();
                _this.getCategorySales();
                _this.getProductSales();
            });
            this.commonService.url_updated.subscribe(function (date) {
                _this.url_array = date;
            });
        }
    };
    SalesReportComponent.prototype.refreshGraphs = function () {
        var _a, _b, _c, _d;
        if (this.selectedIndex == 0) {
            (_a = this.todayBillingChart) === null || _a === void 0 ? void 0 : _a.refresh();
            (_b = this.yesterdayBillingChart) === null || _b === void 0 ? void 0 : _b.refresh();
        }
        else if (this.selectedIndex == 1) {
            (_c = this.chartCategory) === null || _c === void 0 ? void 0 : _c.refresh();
        }
        else {
            (_d = this.chartProduct) === null || _d === void 0 ? void 0 : _d.refresh();
        }
    };
    SalesReportComponent.prototype.add = function (event) {
        var input = event.input;
        var value = event.value;
        var index = this.searchKeys.indexOf(value.trim());
        if (!(index >= 0)) {
            if ((value || '').trim()) {
                this.searchProductsKeys.push({ id: "", name: value.toLowerCase() });
                this.searchKeys.push(value.trim().toLowerCase());
            }
            if (input) {
                input.value = '';
            }
        }
        this.search(this.searchKeys);
    };
    SalesReportComponent.prototype.remove = function (fruit) {
        var index = this.searchProductsKeys.indexOf(fruit);
        if (index >= 0) {
            this.searchProductsKeys.splice(index, 1);
            this.searchKeys.splice(index, 1);
        }
        this.search(this.searchKeys);
    };
    SalesReportComponent.prototype.search = function (keys) {
        var _this = this;
        if (keys.length == 0) {
            if (this.category_selected.length > 0) {
                var array = [];
                for (var index = 0; index < this.backup_products.length; index++) {
                    var element = this.backup_products[index];
                    for (var indexCategory = 0; indexCategory < element.product_info.categories.length; indexCategory++) {
                        var element_category = element.product_info.categories[indexCategory];
                        if (this.categoryId_Selected.includes(element_category)) {
                            array.push(element);
                        }
                    }
                }
                this.dataSourceProduct.data = array;
            }
            else {
                this.dataSourceProduct.data = this.backup_products;
            }
        }
        else {
            this.dataSourceProduct.data = this.backup_products.filter(function (t) { return keys.includes(t.name.trim().toLowerCase()); });
        }
        this.totCount = 0;
        this.totPriceWoVAT = 0;
        this.totWVAT = 0;
        this.dataSourceProduct.data.forEach(function (element) {
            _this.totCount += Number(element.count);
            _this.totPriceWoVAT += Number(element.price_without_iva);
            _this.totWVAT += Number(element.price_with_iva);
        });
        setTimeout(function () {
            _this.loadGraphPdt(_this.dataSourceProduct.data);
        }, 1);
        this.loadGraphPdt(this.dataSourceProduct.data);
    };
    SalesReportComponent.prototype.updateAllComplete = function (row, checked) {
        this.categories[row].is_active = checked;
        this.allComplete = this.categories != null && this.categories.every(function (t) { return t.is_active; });
        var filtered = this.categories.filter(function (t) { return t.is_active; });
        this.compare(filtered);
    };
    SalesReportComponent.prototype.compare = function (selectedCategories) {
        var _this = this;
        var CategoryArray = selectedCategories.map(function (obj, index) {
            return obj.category_name;
        });
        var CategoryIdArray = selectedCategories.map(function (obj, index) {
            return obj._id;
        });
        this.category_selected = CategoryArray;
        this.categoryId_Selected = CategoryIdArray;
        if (CategoryArray.length == 0) {
            this.dataSourceCategory.data = this.backup;
            this.dataSourceProduct.data = this.backup_products;
        }
        else {
            this.dataSourceCategory.data = this.backup.filter(function (t) { return CategoryArray.includes(t.name); });
            var array = [];
            for (var index = 0; index < this.backup_products.length; index++) {
                var element = this.backup_products[index];
                for (var indexCategory = 0; indexCategory < element.product_info.categories.length; indexCategory++) {
                    var element_category = element.product_info.categories[indexCategory];
                    if (CategoryIdArray.includes(element_category)) {
                        array.push(element);
                    }
                }
            }
            this.dataSourceProduct.data = array;
        }
        this.searchProductsKeys = [];
        this.searchKeys = [];
        //clear category selection api call when on pdcts tab
        this.worst_products = JSON.parse(JSON.stringify(this.dataSourceProduct.data.slice(0, 2)));
        this.best_products = JSON.parse(JSON.stringify(this.dataSourceProduct.data.slice(-2)));
        if (this.best_products.length > 0) {
            this.best_products[0].color = "#3f9f97";
            this.best_products[1].color = "#8cbeba";
        }
        if (this.worst_products.length > 0) {
            this.worst_products[0].color = "#de7c84";
            this.worst_products[1].color = "#de7c64";
        }
        this.totCount = 0;
        this.totPriceWoVAT = 0;
        this.totWVAT = 0;
        this.dataSourceCategory.data.forEach(function (element) {
            _this.totCount += Number(element.count);
            _this.totPriceWoVAT += Number(element.price_without_iva);
            _this.totWVAT += Number(element.price_with_iva);
        });
        var gpData = this.backup.filter(function (t) { return CategoryArray.includes(t.name); });
        this.product_graph_Data = this.best_products.concat(this.worst_products);
        setTimeout(function () {
            _this.loadGraph(gpData);
        }, 1);
        this.loadGraph(gpData);
        this.loadGraphPdt();
    };
    SalesReportComponent.prototype.someComplete = function () {
        if (this.categories == null) {
            return false;
        }
        return this.categories.filter(function (t) { return t.is_active; }).length > 0 && !this.allComplete;
    };
    SalesReportComponent.prototype.getCheckBoxStatus = function () {
        return this.categories.filter(function (t) { return t.is_active; }).length > 0;
    };
    SalesReportComponent.prototype.setAll = function (completed) {
        this.allComplete = completed;
        if (this.categories == null) {
            return;
        }
        this.categories.forEach(function (t) {
            t.is_active = completed;
        });
        this.compare(this.categories);
    };
    SalesReportComponent.prototype.tabChanged = function (tabChangeEvent) {
        this.selectedIndex = tabChangeEvent.index;
        this.loadHeader();
        this.refreshGraphs();
    };
    SalesReportComponent.prototype.getGlobalSalesReport = function () {
        var _this = this;
        var _a;
        var data_toPush = [];
        var value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.is_loading_billing = true;
        var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.branch_selected = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
        this.branch_selected = ((_a = this.branch_selected) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : this.branch_selected;
        this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        this.branch_selected = this.branch_selected == "syra-all" ? null : this.branch_selected;
        this.apiService.generateGlobalsalesReport({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(function (response) {
            _this.salesStats = response.data;
            _this.is_loading_billing = false;
            if (_this.dates_selected == null || _this.dates_selected.end == null || (_this.dates_selected.end == _this.dates_selected.start)) {
                response.data.sales_sorted.forEach(function (element, index) {
                    value[Number(element.hour)] = element.amount;
                });
                value.forEach(function (element, index) {
                    var obj = { hour: index, amount: element };
                    data_toPush.push(obj);
                });
                _this.salesStats.sales_sorted = response.data.sales_sorted.length > 0 ? data_toPush : [];
                value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                data_toPush = [];
                response.data.previous_sales_sorted.forEach(function (element, index) {
                    value[Number(element.hour)] = element.amount;
                });
                value.forEach(function (element, index) {
                    var obj = { hour: index, amount: element };
                    data_toPush.push(obj);
                });
                _this.salesStats.previous_sales_sorted = response.data.previous_sales_sorted.length > 0 ? data_toPush : [];
            }
            _this.resizeGraph();
        });
    };
    SalesReportComponent.prototype.get_categories = function () {
        var _this = this;
        this.is_loading_category_list = true;
        this.apiService.getCategories().subscribe(function (response) {
            if (response.success) {
                _this.categories = response.data.category;
                _this.is_loading_category_list = false;
            }
            else {
                _this.commonService.showAlert(response.message);
            }
        });
    };
    SalesReportComponent.prototype.onResize = function (event) {
        this.Pagewidth = window.innerWidth;
    };
    SalesReportComponent.prototype.loadHeader = function () {
        if (this.selectedIndex == 1) {
            this.display_headers = ["CATEGORY", "UNITS SOLD", "TOTAL SIN IVA", "TOTAL CON IVA"];
        }
        else {
            this.display_headers = ["PRODUCTS", "UNITS SOLD", "TOTAL SIN IVA", "TOTAL CON IVA"];
        }
    };
    __decorate([
        core_1.ViewChild('todayBilling')
    ], SalesReportComponent.prototype, "todayBillingChart");
    __decorate([
        core_1.ViewChild('yesterdayBilling')
    ], SalesReportComponent.prototype, "yesterdayBillingChart");
    __decorate([
        core_1.ViewChild('chart_category')
    ], SalesReportComponent.prototype, "chartCategory");
    __decorate([
        core_1.ViewChild('chart_product')
    ], SalesReportComponent.prototype, "chartProduct");
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], SalesReportComponent.prototype, "sort");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], SalesReportComponent.prototype, "onResize");
    SalesReportComponent = __decorate([
        core_1.Component({
            selector: 'app-sales-report',
            templateUrl: './sales-report.component.html',
            styleUrls: ['./sales-report.component.scss']
        })
    ], SalesReportComponent);
    return SalesReportComponent;
}());
exports.SalesReportComponent = SalesReportComponent;
