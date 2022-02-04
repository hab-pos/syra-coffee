"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.APIServices = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var httpOptions = {
    headers: new http_1.HttpHeaders({
        'Access-Control-Allow-Origin': '*'
    })
};
var APIServices = /** @class */ (function () {
    function APIServices(httpClient) {
        this.httpClient = httpClient;
        this.units = [
            {
                code: "bag(s)",
                name: "Bag(s)"
            },
            {
                code: "kilo(s)",
                name: "Kilo(s)"
            },
            {
                code: "litro(s)",
                name: "Litro(s)"
            },
            {
                code: "box(s)",
                name: "Box(s)"
            },
            {
                code: "unit(s)",
                name: "Unit(s)"
            }
        ];
    }
    APIServices.prototype.url = function (path) {
        // var url = 'https://us-central1-syra-sharafa.cloudfunctions.net/api'
        var url = 'http://192.168.0.24:5001/syra-sharafa/us-central1/api';
        // var url = 'http://192.168.43.191:5001/syra-sharafa/us-central1/api'
        // var url = 'http://localhost:5001/syra-sharafa/us-central1/api'
        url = "" + url + path;
        return url;
    };
    APIServices.prototype.admin_login = function (data) {
        return this.httpClient.post(this.url("/admin/login"), data);
    };
    APIServices.prototype.get_admin_details_by_id = function (admindetails) {
        return this.httpClient.post(this.url("/admin/get_admin_details"), admindetails);
    };
    APIServices.prototype.logout = function (log_out) {
        return this.httpClient.post(this.url("/admin/logout"), log_out);
    };
    APIServices.prototype.update_admin_details = function (adminupdate) {
        return this.httpClient.post(this.url("/admin/update_admin_details"), adminupdate);
    };
    APIServices.prototype.get_branch = function (branchlist) {
        return this.httpClient.post(this.url("/branches/get_branches"), branchlist);
    };
    APIServices.prototype.update_branch = function (branch) {
        return this.httpClient.post(this.url("/branches/update_branch"), branch);
    };
    APIServices.prototype.add_branch = function (branch) {
        return this.httpClient.post(this.url("/branches/add_branch"), branch);
    };
    APIServices.prototype.get_all_barista = function () {
        return this.httpClient.post(this.url("/barista/get_all_barista"), {});
    };
    APIServices.prototype.addBarista = function (barista) {
        return this.httpClient.post(this.url("/barista/add_barista"), barista);
    };
    APIServices.prototype.update_barista_password = function (barista) {
        return this.httpClient.post(this.url("/barista/update_password"), barista);
    };
    APIServices.prototype.get_settings = function () {
        return this.httpClient.post(this.url("/settings/get_settings"), null);
    };
    APIServices.prototype.update_admin_message = function (id, admin_message) {
        return this.httpClient.post(this.url("/admin/update_admin_details"), { id: id, admin_recipt_message: admin_message });
    };
    APIServices.prototype.update_settings = function (settings) {
        return this.httpClient.post(this.url("/settings/update_settings"), { request_array: settings });
    };
    APIServices.prototype.upload_logo = function (files) {
        var formData = new FormData();
        formData.append("file", files, files.name);
        return this.upload(formData, null);
    };
    APIServices.prototype.addUserCategory = function (params) {
        var url = this.url("/user_categories/add_category");
        return this.httpClient.post(url, params);
    };
    APIServices.prototype.uploadCategoryImage = function (file) {
        var formData = new FormData();
        formData.append("category_image", file);
        var url = this.url("/user_categories/upload_image");
        return this.httpClient.post(url, formData);
    };
    //User Categories
    APIServices.prototype.getUserCategories = function () {
        return this.httpClient.post(this.url("/user_categories/get_categories"), null);
    };
    APIServices.prototype.UpdateUserCategory = function (data) {
        return this.httpClient.post(this.url("/user_categories/update_category"), data);
    };
    APIServices.prototype.reOrderUserCategory = function (data) {
        return this.httpClient.post(this.url("/user_categories/re_order"), data);
    };
    APIServices.prototype.updateOnlineStatus = function (data) {
        return this.httpClient.post(this.url("/user_categories/updateOnlineStatus"), data);
    };
    APIServices.prototype.deleteUserCategory = function (data) {
        return this.httpClient.post(this.url("/user_categories/delete_category"), data);
    };
    //Modifiers
    APIServices.prototype.addModifiers = function (data) {
        return this.httpClient.post(this.url("/modifiers/add_modifier"), data);
    };
    APIServices.prototype.getModifiers = function (data) {
        return this.httpClient.post(this.url("/modifiers/get_modifer"), data);
    };
    APIServices.prototype.updateModifiers = function (data) {
        return this.httpClient.post(this.url("/modifiers/update_modifier"), data);
    };
    APIServices.prototype.deleteModifiers = function (data) {
        return this.httpClient.post(this.url("/modifiers/delete_modifers"), data);
    };
    APIServices.prototype.updateModifierStatus = function (data) {
        return this.httpClient.post(this.url("/modifiers/update_online_status"), data);
    };
    //Modifiers
    APIServices.prototype.addStory = function (data) {
        return this.httpClient.post(this.url("/story/add_story"), data);
    };
    APIServices.prototype.getStories = function (data) {
        return this.httpClient.post(this.url("/story/get_story "), data);
    };
    APIServices.prototype.updateStories = function (data) {
        return this.httpClient.post(this.url("/story/update_story"), data);
    };
    APIServices.prototype.deleteStories = function (data) {
        return this.httpClient.post(this.url("/story/delete_story"), data);
    };
    APIServices.prototype.uploadStoryImage = function (file) {
        var formData = new FormData();
        formData.append("storyImage", file);
        var url = this.url("/story/upload_image");
        return this.httpClient.post(url, formData);
    };
    //User Categories
    APIServices.prototype.addUserProduct = function (params) {
        var url = this.url("/user-products/add_product");
        return this.httpClient.post(url, params);
    };
    APIServices.prototype.getUserProducts = function () {
        return this.httpClient.post(this.url("/user-products/get_product"), null);
    };
    APIServices.prototype.get_featured_products = function () {
        return this.httpClient.post(this.url("/user-products/get_featured"), null);
    };
    APIServices.prototype.UpdateUserProducts = function (data) {
        return this.httpClient.post(this.url("/user-products/update_product"), data);
    };
    APIServices.prototype.reOrderUserProducts = function (data) {
        return this.httpClient.post(this.url("/user-products/re_order"), data);
    };
    APIServices.prototype.updateProductsOnlineStatus = function (data) {
        return this.httpClient.post(this.url("/user-products/updateOnlineStatus"), data);
    };
    APIServices.prototype.deleteUserProducts = function (data) {
        return this.httpClient.post(this.url("/user-products/delete_product"), data);
    };
    APIServices.prototype.getUserGroupedProducts = function (data) {
        return this.httpClient.post(this.url("/user-products/get-all-products"), data);
    };
    APIServices.prototype.uploadProductsImage = function (file) {
        var formData = new FormData();
        formData.append("product_image", file);
        var url = this.url("/user-products/upload_image");
        return this.httpClient.post(url, formData);
    };
    APIServices.prototype.get_logo = function () {
        return this.httpClient.post(this.url("/settings/get_logo"), null);
    };
    APIServices.prototype.upload = function (formData, params) {
        formData.append('params', JSON.stringify(params));
        var url = this.url("/settings/upload_logo");
        return this.httpClient.post(url, formData, httpOptions);
    };
    APIServices.prototype.addCategory = function (category) {
        return this.httpClient.post(this.url("/categories/add_category"), category);
    };
    APIServices.prototype.updateCategory = function (category) {
        return this.httpClient.post(this.url("/categories/update_category"), category);
    };
    APIServices.prototype.getCategories = function (data) {
        if (data === void 0) { data = null; }
        return this.httpClient.post(this.url("/categories/get_categories"), data);
    };
    APIServices.prototype.deleteCategory = function (req) {
        return this.httpClient.post(this.url("/categories/delete_category"), req);
    };
    APIServices.prototype.update_category_order = function (orders) {
        return this.httpClient.post(this.url("/categories/update_order"), orders);
    };
    APIServices.prototype.addCatelouge = function (category) {
        return this.httpClient.post(this.url("/catelouge/add_catelouge"), category);
    };
    APIServices.prototype.updateCatelouge = function (category) {
        return this.httpClient.post(this.url("/catelouge/update_catelouge"), category);
    };
    APIServices.prototype.getCatelouge = function (data) {
        if (data === void 0) { data = null; }
        return this.httpClient.post(this.url("/catelouge/get_inventories_sorted"), data);
    };
    APIServices.prototype.deleteCatelouge = function (req) {
        return this.httpClient.post(this.url("/catelouge/delete_catelouge"), req);
    };
    APIServices.prototype.searchCatelouge = function (req) {
        return this.httpClient.post(this.url("/catelouge/search_catelouge"), req);
    };
    APIServices.prototype.addIVA = function (iva) {
        return this.httpClient.post(this.url("/setup/add_iva"), iva);
    };
    APIServices.prototype.getIVA = function (iva) {
        if (iva === void 0) { iva = null; }
        return this.httpClient.post(this.url("/setup/get_iva"), iva);
    };
    APIServices.prototype.deleteIVA = function (iva) {
        return this.httpClient.post(this.url("/setup/delete_iva"), iva);
    };
    APIServices.prototype.addExpense = function (expense) {
        return this.httpClient.post(this.url("/setup/add_expense"), expense);
    };
    APIServices.prototype.getExpense = function (expense) {
        if (expense === void 0) { expense = null; }
        return this.httpClient.post(this.url("/setup/get_expense"), expense);
    };
    APIServices.prototype.deleteExpense = function (expense) {
        return this.httpClient.post(this.url("/setup/delete_expense"), expense);
    };
    APIServices.prototype.addDiscount = function (discount) {
        return this.httpClient.post(this.url("/setup/add_discount"), discount);
    };
    APIServices.prototype.getDiscount = function (discount) {
        if (discount === void 0) { discount = null; }
        return this.httpClient.post(this.url("/setup/get_discount"), discount);
    };
    APIServices.prototype.deleteDiscount = function (discount) {
        return this.httpClient.post(this.url("/setup/delete_discount"), discount);
    };
    APIServices.prototype.orderDiscounts = function (discount) {
        return this.httpClient.post(this.url("/setup/arrange_discounts"), discount);
    };
    APIServices.prototype.addProduct = function (product) {
        return this.httpClient.post(this.url("/products/add_product"), product);
    };
    APIServices.prototype.updateProduct = function (product) {
        return this.httpClient.post(this.url("/products/update_product"), product);
    };
    APIServices.prototype.getProducts = function (product) {
        if (product === void 0) { product = null; }
        return this.httpClient.post(this.url("/products/get_products"), product);
    };
    APIServices.prototype.deleteproduct = function (product) {
        return this.httpClient.post(this.url("/products/delete_product"), product);
    };
    APIServices.prototype.update_product_order = function (orders) {
        return this.httpClient.post(this.url("/products/update_order"), orders);
    };
    APIServices.prototype.get_branch_products = function (category) {
        return this.httpClient.post(this.url("/products/branch_products"), category);
    };
    APIServices.prototype.get_branch_category = function (category) {
        return this.httpClient.post(this.url("/categories/branch_category"), category);
    };
    APIServices.prototype.createInventoryOrder = function (order) {
        return this.httpClient.post(this.url("/inventory-order/create_order"), order);
    };
    APIServices.prototype.reOrderInventory = function (order) {
        return this.httpClient.post(this.url("/inventory-order/reorder"), order);
    };
    APIServices.prototype.updateInventoryOrder = function (order) {
        return this.httpClient.post(this.url("/inventory-order/update_order"), order);
    };
    APIServices.prototype.getInventoryOrders = function (order) {
        return this.httpClient.post(this.url("/inventory-order/get_orders"), order);
    };
    APIServices.prototype.get_branch_inventory_orders = function (order) {
        return this.httpClient.post(this.url("/inventory-order/branch_orders"), order);
    };
    APIServices.prototype.get_out_transactions = function (order) {
        return this.httpClient.post(this.url("/transactionOut/get_txns"), order);
    };
    APIServices.prototype.filter_transactions = function (request) {
        return this.httpClient.post(this.url("/transactionOut/filter"), request);
    };
    APIServices.prototype.get_inventory_reports = function (request) {
        return this.httpClient.post(this.url("/inventory-report/get_reports"), request);
    };
    APIServices.prototype.ger_inventory_reports_filtered = function (req) {
        return this.httpClient.post(this.url("/inventory-report/filter_reports"), req);
    };
    APIServices.prototype.getTxnIn = function (req) {
        return this.httpClient.post(this.url("/orders/transactionIn"), req);
    };
    APIServices.prototype.filter_in_transactions = function (request) {
        return this.httpClient.post(this.url("/orders/filter"), request);
    };
    APIServices.prototype.get_vat_reports = function (request) {
        return this.httpClient.post(this.url("/orders/get_vat_report"), request);
    };
    APIServices.prototype.get_payment_mode_based_report = function (request) {
        return this.httpClient.post(this.url("/orders/get_report_with_payment_mode"), request);
    };
    APIServices.prototype.get_discount_comparison = function (request) {
        return this.httpClient.post(this.url("/orders/get_discount_comparsion"), request);
    };
    APIServices.prototype.get_discount_report_user_coupon = function (request) {
        return this.httpClient.post(this.url("/orders/get_discount_report"), request);
    };
    APIServices.prototype.get_discount_report_user = function (request) {
        return this.httpClient.post(this.url("/orders/get_barista_grouped_discount"), request);
    };
    APIServices.prototype.get_discount_report_coupon = function (request) {
        return this.httpClient.post(this.url("/orders/get_applied_discounts_grouped"), request);
    };
    //report Generation
    //1.Accounting Report PDF
    APIServices.prototype.generate_accounting_report = function (request) {
        return this.httpClient.post(this.url("/orders/accounting-report"), request);
    };
    APIServices.prototype.generateGlobalsalesReport = function (request) {
        return this.httpClient.post(this.url("/orders/global-sales"), request);
    };
    APIServices.prototype.generateCategorysalesReport = function (request) {
        return this.httpClient.post(this.url("/orders/category-sales"), request);
    };
    APIServices.prototype.generateProductSalesReport = function (request) {
        return this.httpClient.post(this.url("/orders/product-sales"), request);
    };
    APIServices.prototype.getDashBoard = function (request) {
        return this.httpClient.post(this.url("/orders/get-dashboard"), request);
    };
    APIServices.prototype.downloadInventoryOrder = function (request) {
        return this.httpClient.post(this.url("/inventory-order/print"), request);
    };
    APIServices.prototype.getAttendance_report = function (request) {
        return this.httpClient.post(this.url("/barista/get_report"), request);
    };
    APIServices.prototype.getAttendance_report_graph = function (request) {
        return this.httpClient.post(this.url("/barista/get_report_graph"), request);
    };
    APIServices.prototype.getDashBoardGraph = function (request) {
        return this.httpClient.post(this.url("/orders/get-dashboard-branch-graph"), request);
    };
    APIServices.prototype.getDashReportGraph = function (request) {
        return this.httpClient.post(this.url("/orders/get-dashboard-report-graph"), request);
    };
    APIServices.prototype.updateCoffeeReportEntry = function (request) {
        return this.httpClient.post(this.url("/inventory-report/update"), request);
    };
    APIServices.prototype.deleteCoffeeReportEntry = function (request) {
        return this.httpClient.post(this.url("/inventory-report/delete"), request);
    };
    APIServices.prototype.addEvent = function (request) {
        return this.httpClient.post(this.url("/events/add_event"), request);
    };
    APIServices.prototype.uploadEventImage = function (file) {
        var formData = new FormData();
        formData.append("Event_image", file);
        var url = this.url("/events/upload_event");
        return this.httpClient.post(url, formData);
    };
    APIServices.prototype.get_events = function () {
        return this.httpClient.post(this.url("/events/get_events"), null);
    };
    APIServices.prototype.UpdateEvent = function (data) {
        return this.httpClient.post(this.url("/events/update_events"), data);
    };
    APIServices.prototype.deleteEvent = function (data) {
        return this.httpClient.post(this.url("/events/delete_event"), data);
    };
    APIServices.prototype.deleteBarista = function (data) {
        return this.httpClient.post(this.url("/barista/delete_barista"), data);
    };
    APIServices = __decorate([
        core_1.Injectable()
    ], APIServices);
    return APIServices;
}());
exports.APIServices = APIServices;
