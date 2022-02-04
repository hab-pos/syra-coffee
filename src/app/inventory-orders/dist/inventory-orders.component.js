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
exports.InventoryOrdersComponent = exports.subscription = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var _ = require("lodash");
var XLSX = require("xlsx");
var moment = require("moment");
exports.subscription = null;
var InventoryOrdersComponent = /** @class */ (function () {
    function InventoryOrdersComponent(common_service, apiServices, ref) {
        this.common_service = common_service;
        this.apiServices = apiServices;
        this.ref = ref;
        this.current = 1;
        this.totalPages = 1;
        this.endPage = 1;
        this.startPage = 1;
        this.status = '';
        this.isLoading = false;
        this.field = '';
        this.createOrder = false;
        this.dates = null;
        this.subscribtion = null;
        this.loadsh = _;
        this.orderInfoByPopUp = null;
        this.reorder = false;
        this.data = 10;
        this.orderedProductsFromAddInventory = [];
        this.url_array = [];
        this.faPencilAlt = free_solid_svg_icons_1.faPencilAlt;
        this.inventory_orders = [];
        this.selectedRowsForReport = [];
        this.display_coloums = ["date_time", "order_source", "ordered_by", "recieved_by", "date_delivered", "product_ordered", "status", "check", "action"];
    }
    InventoryOrdersComponent.prototype.ngAfterViewInit = function () {
        this.loader.nativeElement.style.width = this.table.nativeElement.clientWidth + 'px';
        this.enableSubscription();
    };
    InventoryOrdersComponent.prototype.enableSubscription = function () {
        var _this = this;
        this.common_service.reOrderSuccess.subscribe(function (reorder) {
            if (reorder == true) {
                _this.initalize(reorder);
            }
        });
        this.common_service.commonEmitter.subscribe(function (_) {
            _this.currentTime = moment().format("HH:mm:ss");
            console.log(_this.currentTime);
            _this.data = 20;
            var idList = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
            var masterFilterId = ((idList === null || idList === void 0 ? void 0 : idList.length) || 0) == 0 ? null : idList === null || idList === void 0 ? void 0 : idList.map(function (element) { return element._id; });
            masterFilterId = (idList === null || idList === void 0 ? void 0 : idList.length) == 0 ? null : masterFilterId;
            var masterFilteDate = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
            if (masterFilterId != null && masterFilteDate != null) {
                _this.filter_order_dates_branch(masterFilteDate, masterFilterId);
            }
            else {
                if (masterFilterId == null && masterFilteDate == null) {
                    _this.get_orders();
                }
                else if (masterFilteDate == null) {
                    _this.filter_orders_branches(masterFilterId);
                }
                else {
                    _this.filter_order_dates(masterFilteDate);
                }
            }
        });
        this.common_service.choose_date.subscribe(function (res) {
            _this.selectedRowsForReport = [];
            var idList = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
            var masterFilterId = idList === null || idList === void 0 ? void 0 : idList.map(function (element) { return element._id; });
            masterFilterId = (idList === null || idList === void 0 ? void 0 : idList.length) == 0 ? null : masterFilterId;
            _this.dates = res;
            if ((masterFilterId === null || masterFilterId === void 0 ? void 0 : masterFilterId.length) == 0) {
                _this.filter_order_dates(res);
            }
            else {
                _this.filter_order_dates_branch(res, masterFilterId);
            }
        });
        this.common_service.url_updated.subscribe(function (date) {
            _this.url_array = date;
        });
        this.common_service.exportClicked.subscribe(function (_) {
            if (_this.url_array[1] == "products" && _this.url_array[2] == "inventory-orders") {
                var data = _this.loadsh.map(_this.inventory_orders, function (o) { return _this.loadsh.pick(o, ['created_date', 'branch_info.branch_name', 'ordered_by_details.barista_name', 'recieved_by_details.barista_name', 'delivered_date', 'number_of_products', 'status']); });
                _this.downloadFile(data);
            }
        });
        this.common_service.select_branch.subscribe(function (value) {
            _this.selectedRowsForReport = [];
            var idList = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
            var masterFilterId = idList === null || idList === void 0 ? void 0 : idList.map(function (element) { return element._id; });
            masterFilterId = idList.length == 0 ? null : masterFilterId;
            _this.dates = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
            console.log(_this.dates, masterFilterId);
            if (_this.dates != null && _this.dates != undefined) {
                if ((masterFilterId === null || masterFilterId === void 0 ? void 0 : masterFilterId.length) == 0) {
                    _this.filter_order_dates(_this.dates);
                }
                else {
                    _this.filter_order_dates_branch(_this.dates, masterFilterId);
                }
            }
            else {
                if (masterFilterId.length == 0) {
                    _this.get_orders();
                }
                else {
                    _this.filter_orders_branches(masterFilterId);
                }
            }
        });
        console.log(this.currentTime, "outside");
        this.common_service.openInventoryForm.subscribe(function (order_data) {
            _this.orderInfoByPopUp = order_data;
            _this.show_product_popup = true;
            console.log(_this.show_product_popup);
        });
        this.common_service.closeInventoryForm.subscribe(function (_) {
            _this.close_pop_up = true;
            _this.show_product_popup = false;
            console.log(_this.close_pop_up);
        });
        this.common_service.updateSyningCountEmitter.subscribe(function (data) {
            _this.orderedProductsFromAddInventory = data;
        });
    };
    InventoryOrdersComponent.prototype.filter_orders_branches = function (value, reOrder) {
        var _this = this;
        if (reOrder === void 0) { reOrder = false; }
        this.isLoading = true;
        // if (value?._id == null) {
        //   this.get_orders()
        // }
        // else {
        //   this.apiServices.get_branch_inventory_orders({ branch_id: value }).subscribe(res => {
        //     this.inventory_orders = res.data.order_details
        //     this.isLoading = false
        //     if(reOrder){
        //       this.push()
        //     }
        //   })
        // }
        this.apiServices.get_branch_inventory_orders({ branch_id: value }).subscribe(function (res) {
            _this.inventory_orders = res.data.order_details;
            _this.isLoading = false;
            if (reOrder) {
                _this.push();
            }
        });
    };
    InventoryOrdersComponent.prototype.addOrder = function () {
        this.createOrder = true;
        this.sidenav.toggle();
    };
    InventoryOrdersComponent.prototype.filter_order_dates = function (value, reOrder) {
        var _this = this;
        if (reOrder === void 0) { reOrder = false; }
        this.isLoading = true;
        this.apiServices.get_branch_inventory_orders({ start: value.start, end: value.end }).subscribe(function (res) {
            _this.inventory_orders = res.data.order_details;
            _this.isLoading = false;
            if (reOrder) {
                _this.push();
            }
        });
    };
    InventoryOrdersComponent.prototype.filter_order_dates_branch = function (value, branch, reOrder) {
        var _this = this;
        if (reOrder === void 0) { reOrder = false; }
        this.isLoading = true;
        this.apiServices.get_branch_inventory_orders({ start: value.start, end: value.end, branch_id: branch }).subscribe(function (res) {
            _this.inventory_orders = res.data.order_details;
            _this.isLoading = false;
            if (reOrder) {
                _this.push();
            }
        });
    };
    InventoryOrdersComponent.prototype.handleSelection = function (checked, index) {
        var _this = this;
        if (checked) {
            this.selectedRowsForReport.push(this.inventory_orders[index]);
        }
        else {
            this.selectedRowsForReport.splice(this.selectedRowsForReport.findIndex(function (item) { return item._id == _this.inventory_orders[index]._id; }), 1);
        }
        console.log(this.selectedRowsForReport);
    };
    InventoryOrdersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.initalize();
        this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(function (i) { return _this.startPage + i; });
    };
    InventoryOrdersComponent.prototype.initalize = function (reOrder) {
        if (reOrder === void 0) { reOrder = false; }
        this.innerWidth = window.innerWidth;
        var idList = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        var masterFilterId;
        // console.log(idList?._id, "testidlist")
        if (idList === null || idList === void 0 ? void 0 : idList._id) {
            localStorage.setItem('selectedBranch', JSON.stringify([]));
            masterFilterId = null;
        }
        else {
            masterFilterId = idList === null || idList === void 0 ? void 0 : idList.map(function (element) { return element._id; });
            masterFilterId = (idList === null || idList === void 0 ? void 0 : idList.length) == 0 ? null : masterFilterId;
        }
        var masterFilteDate = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        // console.log(masterFilterId, "masterFilterId")
        if (masterFilterId != null && masterFilteDate != null) {
            this.filter_order_dates_branch(masterFilteDate, masterFilterId, reOrder);
        }
        else {
            if (masterFilterId == null && masterFilteDate == null) {
                this.get_orders(reOrder);
            }
            else if (masterFilteDate == null) {
                this.filter_orders_branches(masterFilterId, reOrder);
            }
            else {
                this.filter_order_dates(masterFilteDate, reOrder);
            }
        }
    };
    InventoryOrdersComponent.prototype.get_orders = function (reOrder) {
        var _this = this;
        if (reOrder === void 0) { reOrder = false; }
        this.isLoading = true;
        this.apiServices.getInventoryOrders(null).subscribe(function (res) {
            _this.inventory_orders = res.data.order_details;
            _this.isLoading = false;
            if (reOrder) {
                _this.push();
            }
        });
    };
    InventoryOrdersComponent.prototype.getIntventoryOrders = function (page) {
        if (page === void 0) { page = 1; }
        console.log(page);
    };
    InventoryOrdersComponent.prototype.onResize = function (event) {
        this.innerWidth = window.innerWidth;
    };
    InventoryOrdersComponent.prototype.openSideBar = function (field, row, status) {
        this.createOrder = false;
        this.field = field;
        this.status = this.inventory_orders[row].status;
        this.row = row;
        this.sidenav.toggle();
    };
    InventoryOrdersComponent.prototype.push = function () {
        this.common_service.inventoryOrder.emit(this.inventory_orders[this.row]);
    };
    InventoryOrdersComponent.prototype.closed = function () {
        this.common_service.closedSideNav.emit();
        this.show_product_popup = false;
    };
    InventoryOrdersComponent.prototype.downloadFile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var totalQty, totalPrice, jsonData, branchNameArray, branchName, wb, ws;
            return __generator(this, function (_a) {
                console.log(this.selectedRowsForReport);
                totalQty = 0;
                totalPrice = 0;
                this.selectedRowsForReport = this.selectedRowsForReport.length > 0 ? this.selectedRowsForReport : this.inventory_orders;
                jsonData = [];
                branchNameArray = [];
                jsonData.push({
                    Reference: "REFERENCE",
                    Name_of_product: "NAME OF PRODUCT",
                    Quantity: "QUANTITY",
                    Unit: "UNIT",
                    Unit_price: "PRICE",
                    Total_price: "TOTAL PRICE"
                });
                this.selectedRowsForReport.forEach(function (element, index) {
                    var _a;
                    (_a = element.ordered_items) === null || _a === void 0 ? void 0 : _a.forEach(function (element_json) {
                        var data = {
                            Reference: element_json.refernce,
                            Name_of_product: element_json.inventory_name,
                            Quantity: element_json.qty,
                            Unit: element_json.unit,
                            Unit_price: element_json.price,
                            Total_price: element_json.qty * Number(element_json.price)
                        };
                        var array = jsonData.map(function (e) { return e.Reference; });
                        totalQty += element_json.qty;
                        totalPrice += (element_json.qty * Number(element_json.price));
                        if (array.includes(element_json.refernce)) {
                            var index_1 = array.indexOf(element_json.refernce);
                            jsonData[index_1].Quantity += element_json.qty;
                            jsonData[index_1].Total_price += (element_json.qty * Number(element_json.price));
                        }
                        else {
                            jsonData.push(data);
                        }
                        if (!branchNameArray.includes(element.branch_info.branch_name)) {
                            branchNameArray.push(element.branch_info.branch_name);
                        }
                    });
                });
                jsonData.push({
                    Reference: "",
                    Name_of_product: "",
                    Quantity: "",
                    Unit: "",
                    Unit_price: "",
                    Total_price: ""
                });
                jsonData.push({
                    Reference: "TOTAL",
                    Name_of_product: "",
                    Quantity: totalQty,
                    Unit: "",
                    Unit_price: "",
                    Total_price: totalPrice
                });
                branchName = branchNameArray.join(',');
                console.log(jsonData, branchName);
                wb = XLSX.utils.book_new();
                ws = XLSX.utils.json_to_sheet(jsonData);
                XLSX.utils.book_append_sheet(wb, ws, "SYRA__INVENTORY_REPORT");
                XLSX.utils.sheet_add_aoa(ws, [
                    [branchName, "", "", "", "", ""]
                ], { origin: 0 });
                XLSX.writeFile(wb, branchName + "INVENTORY-REPORT_" + moment().format("DD-MM-YYYY") + ".xls");
                this.common_service.export_success.emit();
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        core_1.ViewChild("table")
    ], InventoryOrdersComponent.prototype, "table");
    __decorate([
        core_1.ViewChild("loader", { static: false })
    ], InventoryOrdersComponent.prototype, "loader");
    __decorate([
        core_1.ViewChild('sidenav')
    ], InventoryOrdersComponent.prototype, "sidenav");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], InventoryOrdersComponent.prototype, "onResize");
    InventoryOrdersComponent = __decorate([
        core_1.Component({
            selector: 'app-inventory-orders',
            templateUrl: './inventory-orders.component.html',
            styleUrls: ['./inventory-orders.component.scss']
        })
    ], InventoryOrdersComponent);
    return InventoryOrdersComponent;
}());
exports.InventoryOrdersComponent = InventoryOrdersComponent;
