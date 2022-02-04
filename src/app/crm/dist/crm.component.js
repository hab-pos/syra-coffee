"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CrmComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var _ = require("lodash");
// import { Loader } from "@googlemaps/js-api-loader"
var sort_1 = require("@angular/material/sort");
var table_1 = require("@angular/material/table");
// const loader = new Loader({
//   apiKey: "AIzaSyAzbQF8oEP1TPqdFSC9GPphUAHzZVH0vXg",
//   version: "weekly",
// });
var CrmComponent = /** @class */ (function () {
    function CrmComponent(common_service, apiServices) {
        this.common_service = common_service;
        this.apiServices = apiServices;
        this.faSort = free_solid_svg_icons_1.faSort;
        this.faFilter = free_solid_svg_icons_1.faAdjust;
        this.faArrowDown = free_solid_svg_icons_1.faArrowDown;
        this.toDate = "";
        this.loadsh = _;
        this.isLoadingGrpah = false;
        this.isLoadingReport = false;
        this.is_online_cheked = true;
        this.is_offline_checked = true;
        this.branch_sales = [];
        this.isFilterChecked = false;
        this.filterIconUrl = "";
        this.chartArea = {
            border: {
                width: 0
            }
        };
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
            labelIntersectAction: "Rotate45"
        };
        this.primary_stacked_col_y_price = {
            valueType: 'Double',
            labelFormat: '{value}€',
            visible: true,
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 }
        };
        this.primary_stacked_col_y_qty = {
            valueType: 'Double',
            visible: true,
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 }
        };
        this.tooltipGlobal = {
            enable: true,
            format: '${point.x} : <b>${point.y}€</b>'
        };
        this.groupe_mode_of_sales = ["POS", "APP", "ECOMMERCE"];
        this.pallets = ["#47545E", "#4D9E96", "#DF7C84"];
        this.graphData = [
            [
                { hour: 20, amount: 30 },
                { hour: 21, amount: 45 },
                { hour: 22, amount: 55 },
                { hour: 24, amount: 30 },
                { hour: 25, amount: 50 },
                { hour: 26, amount: 25 },
                { hour: 27, amount: 40 },
            ],
            [
                { hour: 20, amount: 30 },
                { hour: 21, amount: 45 },
                { hour: 22, amount: 55 },
                { hour: 24, amount: 30 },
                { hour: 25, amount: 50 },
                { hour: 26, amount: 25 },
                { hour: 27, amount: 40 },
            ],
            [
                { hour: 20, amount: 30 },
                { hour: 21, amount: 45 },
                { hour: 22, amount: 55 },
                { hour: 24, amount: 30 },
                { hour: 25, amount: 50 },
                { hour: 26, amount: 25 },
                { hour: 27, amount: 40 },
            ],
        ];
        this.graphData_per_branch = [
            [
                { hour: 20, amount: 30 },
                { hour: 21, amount: 45 },
                { hour: 22, amount: 55 },
                { hour: 24, amount: 30 },
                { hour: 25, amount: 50 },
                { hour: 26, amount: 25 },
                { hour: 27, amount: 40 },
            ],
            [
                { hour: 20, amount: 30 },
                { hour: 21, amount: 45 },
                { hour: 22, amount: 55 },
                { hour: 24, amount: 30 },
                { hour: 25, amount: 50 },
                { hour: 26, amount: 25 },
                { hour: 27, amount: 40 },
            ],
            [
                { hour: 20, amount: 30 },
                { hour: 21, amount: 45 },
                { hour: 22, amount: 55 },
                { hour: 24, amount: 30 },
                { hour: 25, amount: 50 },
                { hour: 26, amount: 25 },
                { hour: 27, amount: 40 },
            ],
            [
                { hour: 20, amount: 30 },
                { hour: 21, amount: 45 },
                { hour: 22, amount: 55 },
                { hour: 24, amount: 30 },
                { hour: 25, amount: 50 },
                { hour: 26, amount: 25 },
                { hour: 27, amount: 40 },
            ]
        ];
        this.branches = ["Gracia", "Diputacio", "Poplenou", "Parel-lel", "Passing San Juan", "Ecommerce"];
        this.pallets_branches = ["#47545E", "#449F97", "#DF7C84", "#EDBC83", "#7596D5", "#A678CE"];
        this.citymap_offline = {
            diputacio: {
                center: { lat: 41.3843936, lng: 2.1588444 },
                population: 100
            },
            pobloune: {
                center: { lat: 41.3965511, lng: 2.1941618 },
                population: 152
            },
            Gracia: {
                center: { lat: 41.4015125, lng: 2.1595149 },
                population: 120
            },
            londres: {
                center: { lat: 41.3939109, lng: 2.1493482 },
                population: 227
            },
            maria_cubi: {
                center: { lat: 41.3987376, lng: 2.1481485 },
                population: 280
            },
            vig_agusta: {
                center: { lat: 41.3887844, lng: 2.1534999 },
                population: 124
            },
            bercelona: {
                center: { lat: 41.4190362, lng: 2.1574323 },
                population: 98
            },
            sants: {
                center: { lat: 41.4252481, lng: 2.2145278 },
                population: 176
            },
            gervasi: {
                center: { lat: 41.4166567, lng: 2.1874287 },
                population: 300
            }
        };
        this.citymap_online = {
            la_saraga: {
                center: { lat: 41.4216956, lng: 2.1812312 },
                population: 100
            },
            la_verneda: {
                center: { lat: 41.4236281, lng: 2.1946037 },
                population: 152
            },
            el_besosi: {
                center: { lat: 41.4147627, lng: 2.2085157 },
                population: 120
            },
            pobeloune: {
                center: { lat: 41.3995667, lng: 2.1935128 },
                population: 227
            },
            maria_cubi: {
                center: { lat: 41.3900306, lng: 2.1875947 },
                population: 107
            },
            gervasi: {
                center: { lat: 41.4121091, lng: 2.1929161 },
                population: 300
            }
        };
        this.bounds = null;
        this.markers = [];
        this.user_buisness_data = [
            { user_id: "B12345", first_name: "Maher", last_name: "Mansour", email: "mm@gmail.com", phone: "+31 6565656566", address: "R Dos Bragas", city: "Porto", country: "Portugal", date_of_birth: "10-12-1988", created: "10-10-20", Active: "YES", channel: "Online", top_store: "Ecommerce", store_visited: "2", top_prod1: "Cappucino", top_prod2: "Cartado", top_prod3: "Cookie", transactions_online: 15, transaction_offline: 0, amount_spent_online: 500, amount_spent_offline: 0, total_transactions: 15, total_amount: 500, last_transaction: "10-10-2020", beans_generated: 50, beans_used: 10, bean_balenced: 40, gift_shared: 2 },
            { user_id: "B12345", first_name: "Maher", last_name: "Mansour", email: "mm@gmail.com", phone: "+31 6565656566", address: "R Dos Bragas", city: "Porto", country: "Portugal", date_of_birth: "10-12-1988", created: "10-10-20", Active: "YES", channel: "Online", top_store: "Ecommerce", store_visited: "2", top_prod1: "Cappucino", top_prod2: "Cartado", top_prod3: "Cookie", transactions_online: 15, transaction_offline: 0, amount_spent_online: 500, amount_spent_offline: 0, total_transactions: 15, total_amount: 500, last_transaction: "10-10-2020", beans_generated: 50, beans_used: 10, bean_balenced: 40, gift_shared: 2 },
            { user_id: "B12345", first_name: "Maher", last_name: "Mansour", email: "mm@gmail.com", phone: "+31 6565656566", address: "R Dos Bragas", city: "Porto", country: "Portugal", date_of_birth: "10-12-1988", created: "10-10-20", Active: "YES", channel: "Online", top_store: "Ecommerce", store_visited: "2", top_prod1: "Cappucino", top_prod2: "Cartado", top_prod3: "Cookie", transactions_online: 15, transaction_offline: 0, amount_spent_online: 500, amount_spent_offline: 0, total_transactions: 15, total_amount: 500, last_transaction: "10-10-2020", beans_generated: 50, beans_used: 10, bean_balenced: 40, gift_shared: 2 },
            { user_id: "B12345", first_name: "Maher", last_name: "Mansour", email: "mm@gmail.com", phone: "+31 6565656566", address: "R Dos Bragas", city: "Porto", country: "Portugal", date_of_birth: "10-12-1988", created: "10-10-20", Active: "YES", channel: "Online", top_store: "Ecommerce", store_visited: "2", top_prod1: "Cappucino", top_prod2: "Cartado", top_prod3: "Cookie", transactions_online: 15, transaction_offline: 0, amount_spent_online: 500, amount_spent_offline: 0, total_transactions: 15, total_amount: 500, last_transaction: "10-10-2020", beans_generated: 50, beans_used: 10, bean_balenced: 40, gift_shared: 2 },
            { user_id: "B12345", first_name: "Maher", last_name: "Mansour", email: "mm@gmail.com", phone: "+31 6565656566", address: "R Dos Bragas", city: "Porto", country: "Portugal", date_of_birth: "10-12-1988", created: "10-10-20", Active: "YES", channel: "Online", top_store: "Ecommerce", store_visited: "2", top_prod1: "Cappucino", top_prod2: "Cartado", top_prod3: "Cookie", transactions_online: 15, transaction_offline: 0, amount_spent_online: 500, amount_spent_offline: 0, total_transactions: 15, total_amount: 500, last_transaction: "10-10-2020", beans_generated: 50, beans_used: 10, bean_balenced: 40, gift_shared: 2 },
            { user_id: "B12345", first_name: "Maher", last_name: "Mansour", email: "mm@gmail.com", phone: "+31 6565656566", address: "R Dos Bragas", city: "Porto", country: "Portugal", date_of_birth: "10-12-1988", created: "10-10-20", Active: "YES", channel: "Online", top_store: "Ecommerce", store_visited: "2", top_prod1: "Cappucino", top_prod2: "Cartado", top_prod3: "Cookie", transactions_online: 15, transaction_offline: 0, amount_spent_online: 500, amount_spent_offline: 0, total_transactions: 15, total_amount: 500, last_transaction: "10-10-2020", beans_generated: 50, beans_used: 10, bean_balenced: 40, gift_shared: 2 },
            { user_id: "B12345", first_name: "Maher", last_name: "Mansour", email: "mm@gmail.com", phone: "+31 6565656566", address: "R Dos Bragas", city: "Porto", country: "Portugal", date_of_birth: "10-12-1988", created: "10-10-20", Active: "YES", channel: "Online", top_store: "Ecommerce", store_visited: "2", top_prod1: "Cappucino", top_prod2: "Cartado", top_prod3: "Cookie", transactions_online: 15, transaction_offline: 0, amount_spent_online: 500, amount_spent_offline: 0, total_transactions: 15, total_amount: 500, last_transaction: "10-10-2020", beans_generated: 50, beans_used: 10, bean_balenced: 40, gift_shared: 2 },
            { user_id: "B12345", first_name: "Maher", last_name: "Mansour", email: "mm@gmail.com", phone: "+31 6565656566", address: "R Dos Bragas", city: "Porto", country: "Portugal", date_of_birth: "10-12-1988", created: "10-10-20", Active: "YES", channel: "Online", top_store: "Ecommerce", store_visited: "2", top_prod1: "Cappucino", top_prod2: "Cartado", top_prod3: "Cookie", transactions_online: 15, transaction_offline: 0, amount_spent_online: 500, amount_spent_offline: 0, total_transactions: 15, total_amount: 500, last_transaction: "10-10-2020", beans_generated: 50, beans_used: 10, bean_balenced: 40, gift_shared: 2 },
            { user_id: "B12345", first_name: "Maher", last_name: "Mansour", email: "mm@gmail.com", phone: "+31 6565656566", address: "R Dos Bragas", city: "Porto", country: "Portugal", date_of_birth: "10-12-1988", created: "10-10-20", Active: "YES", channel: "Online", top_store: "Ecommerce", store_visited: "2", top_prod1: "Cappucino", top_prod2: "Cartado", top_prod3: "Cookie", transactions_online: 15, transaction_offline: 0, amount_spent_online: 500, amount_spent_offline: 0, total_transactions: 15, total_amount: 500, last_transaction: "10-10-2020", beans_generated: 50, beans_used: 10, bean_balenced: 40, gift_shared: 2 },
            { user_id: "B12345", first_name: "Maher", last_name: "Mansour", email: "mm@gmail.com", phone: "+31 6565656566", address: "R Dos Bragas", city: "Porto", country: "Portugal", date_of_birth: "10-12-1988", created: "10-10-20", Active: "YES", channel: "Online", top_store: "Ecommerce", store_visited: "2", top_prod1: "Cappucino", top_prod2: "Cartado", top_prod3: "Cookie", transactions_online: 15, transaction_offline: 0, amount_spent_online: 500, amount_spent_offline: 0, total_transactions: 15, total_amount: 500, last_transaction: "10-10-2020", beans_generated: 50, beans_used: 10, bean_balenced: 40, gift_shared: 2 }
        ];
        this.headers_json = [
            { header_id: "user_id", header_title: "USER ID", header_Spans: 8 },
            { header_id: "first_name", header_title: "FIRST NAME", header_Spans: 8 },
            { header_id: "last_name", header_title: "LAST NAME", header_Spans: 8 },
            { header_id: "email", header_title: "EMAIL", header_Spans: 8 },
            { header_id: "phone", header_title: "PHONE", header_Spans: 8 },
            { header_id: "address", header_title: "ADDRESS", header_Spans: 8 },
            { header_id: "city", header_title: "CITY", header_Spans: 8 },
            { header_id: "country", header_title: "COUNTRY", header_Spans: 8 },
            { header_id: "date_of_birth", header_title: "DATE OF BIRTH", header_Spans: 8 },
            { header_id: "created", header_title: "CREATED", header_Spans: 10 },
            { header_id: "Active", header_title: "ACTIVE", header_Spans: 10 },
            { header_id: "channel", header_title: "CHANNEL", header_Spans: 13 },
            { header_id: "top_store", header_title: "TOP STORE", header_Spans: 13 },
            { header_id: "store_visited", header_title: "STORES VISITED", header_Spans: 13 },
            { header_id: "top_prod1", header_title: "TOP PRODUCT - 1", header_Spans: 16 },
            { header_id: "top_prod2", header_title: "TOP PRODUCT - 2", header_Spans: 16 },
            { header_id: "top_prod3", header_title: "TOP PRODUCT - 3", header_Spans: 16 },
            { header_id: "transactions_online", header_title: "# TRANSACTIONS ONLINE", header_Spans: 22 },
            { header_id: "amount_spent_online", header_title: "AMOUNT SPENT ONLINE", header_Spans: 22 },
            { header_id: "transaction_offline", header_title: "# TRANSACTIONS OFFLINE", header_Spans: 22 },
            { header_id: "amount_spent_offline", header_title: "AMOUNT SPENT OFFLINE", header_Spans: 22 },
            { header_id: "total_transactions", header_title: "# TRANSACTIONS TOTAL", header_Spans: 22 },
            { header_id: "total_amount", header_title: "AMOUNT SPENT TOTAL", header_Spans: 22 },
            { header_id: "last_transaction", header_title: "LAST TRANSACTION", header_Spans: 27 },
            { header_id: "beans_generated", header_title: "BEANS GENERATED", header_Spans: 27 },
            { header_id: "beans_used", header_title: "BEANS USED", header_Spans: 27 },
            { header_id: "bean_balenced", header_title: "BEANS BALANCE", header_Spans: 27 },
            { header_id: "gift_shared", header_title: "GIFT SHARED", header_Spans: 27 },
        ];
        this.header_Sections_json = [
            { id: "empty", title: "", checked: true, span: 1 },
            { id: "personal_info", title: "PERSONAL INFO", checked: true, span: 8 },
            { id: "membersip", title: "MEMBERSHIP", checked: true, span: 2 },
            { id: "channel1", title: "CHANNEL", checked: true, span: 3 },
            { id: "products", title: "PRODUCTS", checked: true, span: 3 },
            { id: "transaction", title: "TRANSACTIONS", checked: true, span: 6 },
            { id: "engagement", title: "ENGAGEMENT", checked: true, span: 5 },
        ];
        this.header_sections_json_backup = [];
        this.headers_json_backup = [];
        this.donut_data = [{
                store: 'Gracia', amount: 10, color: "#47545E"
            }, {
                store: 'Diputacio', amount: 40, color: "#449F97"
            }, {
                store: 'Poplenou', amount: 15, color: "#EDBC83"
            }, {
                store: 'Parel-lel', amount: 15, color: "#DF7C84"
            }, {
                store: 'Passing San Juan', amount: 12, color: "#7596D5"
            }, {
                store: 'Ecommerce', amount: 8, color: "#A678CE"
            }];
    }
    CrmComponent.prototype.ngOnInit = function () {
        // loader.load().then(() => {
        // });
    };
    CrmComponent.prototype.ngAfterViewInit = function () {
        this.header_sections_json_backup = this.header_Sections_json;
        this.dataSource = new table_1.MatTableDataSource(this.user_buisness_data);
        this.dataSource.sort = this.sort;
        this.filterIconUrl = this.apiServices.url("/assets/icons/filterIcon.webp");
        this.initMap();
    };
    CrmComponent.prototype.get_coloumns_user_table = function () {
        var _a;
        return (_a = this.headers_json) === null || _a === void 0 ? void 0 : _a.map(function (element) { return element.header_id; });
    };
    CrmComponent.prototype.get_section_user_table = function () {
        var _a;
        return (_a = this.header_Sections_json) === null || _a === void 0 ? void 0 : _a.map(function (element) { return element.id; });
    };
    CrmComponent.prototype.initMap = function () {
        var options = {
            center: { lat: 41.3820048, lng: 2.1741849 },
            zoom: 14,
            scaleControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            mapId: "e61e42b27c7f7597",
            disableDefaultUI: true
        };
        this.map = new google.maps.Map(document.getElementById("map_area"), options);
        this.bounds = new google.maps.LatLngBounds();
        this.is_offline_checked ? this.loadCitySalesMarkers(this.map, this.citymap_offline, "#FF0000") : '';
        this.is_online_cheked ? this.loadCitySalesMarkers(this.map, this.citymap_online, "#E5DD48") : '';
    };
    CrmComponent.prototype.loadCitySalesMarkers = function (map, citymap, color) {
        var maximum_value = 0;
        for (var city in citymap) {
            // Add the circle for this city to the map.
            if (citymap[city].population > maximum_value) {
                maximum_value = citymap[city].population;
            }
            var loc = new google.maps.LatLng(citymap[city].center.lat, citymap[city].center.lng);
            this.bounds.extend(loc);
        }
        map.fitBounds(this.bounds);
        map.panToBounds(this.bounds);
        for (var city in citymap) {
            // Add the circle for this city to the map.
            var cityCircle = new google.maps.Circle({
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 0,
                fillColor: color,
                fillOpacity: 0.5,
                map: map,
                center: citymap[city].center,
                radius: citymap[city].population / maximum_value * 500
            });
            this.markers.push(cityCircle);
        }
    };
    CrmComponent.prototype.resetMarkers = function () {
        for (var index = 0; index < this.markers.length; index++) {
            var element = this.markers[index];
            element.setMap(null);
        }
        this.is_offline_checked == true ? this.loadCitySalesMarkers(this.map, this.citymap_offline, "#FF0000") : '';
        this.is_online_cheked == true ? this.loadCitySalesMarkers(this.map, this.citymap_online, "#E5DD48") : '';
    };
    CrmComponent.prototype.online_clicked = function (checked) {
        this.is_online_cheked = checked;
        this.resetMarkers();
    };
    CrmComponent.prototype.offline_clicked = function (checked) {
        this.is_offline_checked = checked;
        this.resetMarkers();
    };
    CrmComponent.prototype.labelContent = function (e) {
        return e.value + "%";
    };
    CrmComponent.prototype.onClickFilter = function () {
        console.log(this.isFilterChecked);
        this.isFilterChecked = !this.isFilterChecked;
    };
    CrmComponent.prototype.chooseSections = function (i, checked) {
        this.header_sections_json_backup[i].checked = checked;
        console.log(this.header_Sections_json);
        this.header_Sections_json = this.header_sections_json_backup.filter(function (item) {
            return item.checked;
        });
    };
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], CrmComponent.prototype, "sort");
    CrmComponent = __decorate([
        core_1.Component({
            selector: 'app-crm',
            templateUrl: './crm.component.html',
            styleUrls: ['./crm.component.scss']
        })
    ], CrmComponent);
    return CrmComponent;
}());
exports.CrmComponent = CrmComponent;
