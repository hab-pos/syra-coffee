"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.faLine = exports.faMeterialDashboard = exports.SideBarComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var sweetalert2_1 = require("sweetalert2");
var SideBarComponent = /** @class */ (function () {
    function SideBarComponent(common_service, router, apiService) {
        var _this = this;
        this.common_service = common_service;
        this.router = router;
        this.apiService = apiService;
        this.faMeterialDashboard = exports.faMeterialDashboard;
        this.faExchangeAlt = free_solid_svg_icons_1.faExchangeAlt;
        this.faChartLine = free_solid_svg_icons_1.faChartLine;
        this.faShoppingBasket = free_solid_svg_icons_1.faShoppingBasket;
        this.faCog = free_solid_svg_icons_1.faCog;
        this.faLine = exports.faLine;
        this.faUser = free_solid_svg_icons_1.faUser;
        this.faGripLines = free_solid_svg_icons_1.faGripLinesVertical;
        this.faChevronDown = free_solid_svg_icons_1.faChevronDown;
        this.faChevronUp = free_solid_svg_icons_1.faChevronUp;
        this.faSignOutAlt = free_solid_svg_icons_1.faSignOutAlt;
        this.faCircle = free_solid_svg_icons_1.faCircle;
        this.current_url = [];
        this.faTh = free_solid_svg_icons_1.faTh;
        this.selectedSection = "";
        this.sideMenuOptions = [
            {
                "mainMenu": "REPORTS",
                "subMenu": [
                    { title: "SALES", route: "/reports/sales" },
                    { title: "ACCOUNTING", route: "/reports/accounting" },
                    { title: "TIME TRACKING", route: "/reports/time-tracking" },
                    { title: "CONTROL", route: "/reports/control" }
                ],
                "icon": free_solid_svg_icons_1.faChartLine
            },
            {
                "mainMenu": "TRANSACTIONS",
                "subMenu": [
                    { title: "IN", route: "/transactions/in" },
                    { title: "OUT", route: "/transactions/out" }
                ],
                "icon": free_solid_svg_icons_1.faExchangeAlt
            },
            {
                "mainMenu": "PRODUCTS",
                "subMenu": [
                    { title: "POS", route: "/products/pos" },
                    { title: "INVENTORY ORDERS", route: "/products/inventory-orders" },
                    { title: "INVENTORY REPORTS", route: "/products/inventory-reports" }
                ],
                "icon": free_solid_svg_icons_1.faShoppingBasket
            },
            {
                "mainMenu": "APP CONTROL",
                "subMenu": [
                    { title: "STORE", route: "/app-control/store" },
                    { title: "HOME CONTENT", route: "/app-control/home-content" },
                ],
                "icon": free_solid_svg_icons_1.faTh
            },
            {
                "mainMenu": "CONFIGURATIONS",
                "subMenu": [
                    { title: "ESTABLISHMENT", route: "/configurations/establishment" },
                    { title: "ACCOUNTS", route: "/configurations/accounts" },
                    { title: "CATALOUGE", route: "/configurations/catalouge" },
                    { title: "SETUP", route: "/configurations/setup" }
                ],
                "icon": free_solid_svg_icons_1.faCog
            },
        ];
        common_service.url_updated.subscribe(function (value) {
            _this.current_url = value;
            _this.getSelectedSection();
        });
        this.innerWidth = window.innerWidth;
    }
    SideBarComponent.prototype.ngOnInit = function () {
        //this.admin_user = JSON.parse(localStorage.getItem('adminUsers'));
    };
    SideBarComponent.prototype.getSelectedSection = function () {
        var _this = this;
        var row = 0;
        this.sideMenuOptions.forEach(function (menu) {
            menu.subMenu.forEach(function (subMenu) {
                if (subMenu.title.toLowerCase().replace(" ", "-") == _this.current_url[2]) {
                    _this.selectedSection = "ngb-panel-" + row;
                }
            });
            row += 1;
        });
        console.log(this.selectedSection);
    };
    SideBarComponent.prototype.setSelectedMenu = function (menu) {
        this.selectedMenu = menu;
        if (menu == "logout") {
            this.openAlert();
        }
    };
    SideBarComponent.prototype.beforeChange = function ($event) {
        // to avoid selection of two tabs in accordian while clicking logout
        this.selectedMenu = $event.panelId;
        var index = Number($event.panelId.split("-")[2]);
        var value = this.sideMenuOptions[index].subMenu[0].route;
        this.router.navigateByUrl(value);
    };
    SideBarComponent.prototype.openAlert = function () {
        var _this = this;
        var swalWithBootstrapButtons = sweetalert2_1["default"].mixin({
            customClass: {
                confirmButton: 'btn  alert-yes',
                cancelButton: 'btn  alert-no'
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: 'Logout',
            text: "Are you surely want to logout?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true
        }).then(function (result) {
            var _a;
            if (result.isConfirmed) {
                var parse_data = JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "");
                _this.apiService.logout({ id: parse_data.data['_id'] }).subscribe(function (log_out) {
                    localStorage.removeItem('syra_admin');
                    localStorage.clear();
                    log_out.success == true ? _this.router.navigateByUrl('/login') : "";
                });
            }
            else if (result.dismiss === sweetalert2_1["default"].DismissReason.cancel) {
                _this.selectedMenu = _this.current_url.join("/");
            }
        });
    };
    SideBarComponent.prototype.toggleSidebar = function () {
        this.common_service.set_sidebar_toggle("sidebar");
    };
    SideBarComponent = __decorate([
        core_1.Component({
            selector: 'app-side-bar',
            templateUrl: './side-bar.component.html',
            styleUrls: ['./side-bar.component.scss']
        })
    ], SideBarComponent);
    return SideBarComponent;
}());
exports.SideBarComponent = SideBarComponent;
exports.faMeterialDashboard = {
    prefix: 'fa',
    iconName: 'meterialDashboard',
    icon: [
        512,
        512,
        [],
        'U+E002',
        "M0,285.8h226.2V3H0V285.8z M0,512h226.2V342.3H0V512z M282.8,512H509V229.2H282.8V512z M282.8,3v169.7H509V3H282.8z",
    ]
};
exports.faLine = {
    prefix: 'fa',
    iconName: 'line',
    icon: [
        512,
        512,
        [],
        '',
        "M392.533,187.733H17.067C7.641,187.733,0,195.374,0,204.8s7.641,17.067,17.067,17.067h375.467\n    c9.426,0,17.067-7.641,17.067-17.067S401.959,187.733,392.533,187.733z",
    ]
};
