"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomeControlComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var HomeControlComponent = /** @class */ (function () {
    function HomeControlComponent(commonService, apiService, modalService) {
        var _this = this;
        this.commonService = commonService;
        this.apiService = apiService;
        this.modalService = modalService;
        this.events = [];
        this.stories = [
        // {
        //   id: 1,
        //   name: "STORY FROM COLOMBIA",
        // },
        // {
        //   id: 2,
        //   name: "AEROSPRESS TRADE SECRETS",
        // },
        // {
        //   id: 3,
        //   name: "STORIES FROM KENYA",
        // },
        ];
        this.featured_pdts = [
        // {
        //   id: 1,
        //   name: "ADADO NATURAL",
        // },
        // {
        //   id: 2,
        //   name: "ESPRESSO",
        // },
        // {
        //   id: 3,
        //   name: "FLAT WHITE",
        // },
        // {
        //   id: 4,
        //   name: "SLOPES OF 8",
        // },
        ];
        this.display_col = ["name", "icon"];
        this.Pagewidth = 0;
        this.faTimes = free_solid_svg_icons_1.faTimes;
        this.faArrowsAlt = free_solid_svg_icons_1.faArrowsAlt;
        this.faPlusCircle = free_solid_svg_icons_1.faPlusCircle;
        this.field = '';
        this.action = '';
        this.isLoadingEvents = false;
        this.isLoadingStories = false;
        this.isLoadingFeaturedPdts = false;
        this.selectedRow = -1;
        this.commonService.featuredProdcutSuccess.subscribe(function (_) {
            _this.getFeaturedProducts();
        });
        this.commonService.EventSuccess.subscribe(function (_) {
            _this.getEventlist();
        });
        this.commonService.storySuccess.subscribe(function (_) {
            _this.getStoryList();
        });
    }
    HomeControlComponent.prototype.ngOnInit = function () {
        this.Pagewidth = window.innerWidth;
        this.getFeaturedProducts();
        this.getEventlist();
        this.getStoryList();
    };
    HomeControlComponent.prototype.getFeaturedProducts = function () {
        var _this = this;
        this.isLoadingFeaturedPdts = true;
        this.apiService.get_featured_products().subscribe(function (response) {
            _this.featured_pdts = response.data != null ? JSON.parse(JSON.stringify(response.data)) : [];
            _this.isLoadingFeaturedPdts = false;
        });
    };
    HomeControlComponent.prototype.getEventlist = function () {
        var _this = this;
        this.isLoadingEvents = true;
        this.apiService.get_events().subscribe(function (response) {
            _this.events = response.data != null ? JSON.parse(JSON.stringify(response.data)) : [];
            _this.isLoadingEvents = false;
        });
    };
    HomeControlComponent.prototype.getStoryList = function () {
        var _this = this;
        this.isLoadingStories = true;
        this.apiService.getStories({}).subscribe(function (response) {
            _this.stories = response.data != null ? JSON.parse(JSON.stringify(response.data)) : [];
            _this.isLoadingStories = false;
        });
    };
    HomeControlComponent.prototype.onResize = function (event) {
        this.Pagewidth = window.innerWidth;
    };
    HomeControlComponent.prototype.openSideBar = function (field, action, row) {
        if (row === void 0) { row = -1; }
        this.field = field;
        this.selectedRow = row;
        this.action = action;
        this.sidenav.toggle();
    };
    HomeControlComponent.prototype.push = function () {
        switch (this.field) {
            case "featured_pdts":
                this.commonService.featuredProductopUpopend.emit(this.action == 'edit' ? this.featured_pdts[this.selectedRow] : null);
                break;
            case "event":
                this.commonService.eventFormOpend.emit(this.action == 'edit' ? this.events[this.selectedRow] : null);
                break;
            default:
                this.commonService.storyPopupOpened.emit(this.action == 'edit' ? this.stories[this.selectedRow] : null);
                break;
        }
    };
    HomeControlComponent.prototype.closed = function () {
        this.commonService.resetForms.emit();
    };
    __decorate([
        core_1.ViewChild('sidenav')
    ], HomeControlComponent.prototype, "sidenav");
    __decorate([
        core_1.ViewChild('table')
    ], HomeControlComponent.prototype, "table");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], HomeControlComponent.prototype, "onResize");
    HomeControlComponent = __decorate([
        core_1.Component({
            selector: 'app-home-control',
            templateUrl: './home-control.component.html',
            styleUrls: ['./home-control.component.scss']
        })
    ], HomeControlComponent);
    return HomeControlComponent;
}());
exports.HomeControlComponent = HomeControlComponent;
