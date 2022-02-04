"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.fa_download = exports.AppHeaderComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var helpers_1 = require("../helpers");
var core_2 = require("@angular/material/core");
var moment = require("moment");
var FileSaver = require('file-saver');
var AppHeaderComponent = /** @class */ (function () {
    function AppHeaderComponent(common_service, apiService) {
        this.common_service = common_service;
        this.apiService = apiService;
        this.branch = '';
        this.range = new forms_1.FormGroup({
            start: new forms_1.FormControl(),
            end: new forms_1.FormControl()
        });
        this.branches = [];
        this.selectedValue = [];
        this.isMobileCalender = false;
        this.faCalendarDay = free_solid_svg_icons_1.faCalendarDay;
        this.faBars = free_solid_svg_icons_1.faBars;
        this.faMapMarkerAlt = free_solid_svg_icons_1.faMapMarkerAlt;
        this.fa_download = exports.fa_download;
        this.faTimes = free_solid_svg_icons_1.faTimesCircle;
        this.mobile = window.innerWidth;
        this.isLoading = false;
        this.url_logo = "";
        this.matLabelTitle = "Today";
        this.url_loading = "";
        this.url_array = [];
        this.branch_list = [];
        this.selectedRow = -1;
        this.selectedValueSingle = null;
        this.allSelected = true;
    }
    AppHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_Branches();
        localStorage.removeItem("selectedBranch");
        localStorage.removeItem("selectedDate");
        this.common_service.url_updated.subscribe(function (date) {
            _this.url_array = date;
            if (_this.url_array[1] == "products" && _this.url_array[2] == "inventory-reports" || _this.url_array[1] == "products" && _this.url_array[2] == "inventory-orders") {
                _this.selectedValueSingle = null;
                _this.selectedValue = [];
                _this.dd.options.forEach(function (item, index) {
                    item.deselect();
                });
                _this.branch_list = [];
            }
        });
    };
    AppHeaderComponent.prototype.getMultiEnable = function () {
        return !(this.url_array[1] == "products" && this.url_array[2] == "inventory-reports");
    };
    AppHeaderComponent.prototype.onOpen = function () {
        this.appendFooter();
    };
    AppHeaderComponent.prototype.resetDatePicker = function (e) {
        // if(this.range.get('start'))
        if (this.range.value.start != null) {
            this.range.reset();
            var date = { start: moment().toDate(), end: moment().toDate() };
            var dataToStore = JSON.stringify(date);
            localStorage.setItem('selectedDate', dataToStore);
            this.common_service.set_date(date);
            this.matLabelTitle = "Today";
        }
        e.stopPropagation();
        e.preventDefault();
    };
    AppHeaderComponent.prototype.today = function () {
        var date = { start: moment(), end: moment() };
        var dataToStore = JSON.stringify(date);
        localStorage.setItem('selectedDate', dataToStore);
        // this.common_service.set_date(date)
        this.selectedDate = date;
        this.picker.close();
        this.range.setValue({ start: moment().toDate(), end: moment().toDate() });
        this.matLabelTitle = "Today";
    };
    AppHeaderComponent.prototype.thisWeek = function () {
        console.log("this week");
        var date = { start: moment().startOf('week'), end: moment().endOf('week') };
        var dataToStore = JSON.stringify(date);
        localStorage.setItem('selectedDate', dataToStore);
        this.selectedDate = date;
        // this.common_service.set_date(date)
        this.picker.close();
        this.range.setValue({ start: moment().startOf('week').toDate(), end: moment().endOf('week').toDate() });
        this.matLabelTitle = "This week";
    };
    AppHeaderComponent.prototype.thisMonth = function () {
        var date = { start: moment().startOf('month'), end: moment().endOf('month') };
        var dataToStore = JSON.stringify(date);
        localStorage.setItem('selectedDate', dataToStore);
        this.selectedDate = date;
        // this.common_service.set_date(date)
        this.picker.close();
        this.range.setValue({ start: moment().startOf('month').toDate(), end: moment().endOf('month').toDate() });
        this.matLabelTitle = "This Month";
    };
    AppHeaderComponent.prototype.appendFooter = function () {
        var matCalendar = document.getElementsByClassName('mat-datepicker-content')[0];
        matCalendar.appendChild(this.datepickerFooter.nativeElement);
    };
    AppHeaderComponent.prototype.openSideBar = function () {
        this.common_service.set_sidebar_toggle("sidebar");
    };
    AppHeaderComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.url_logo = this.apiService.url("/assets/logos/logo-admin.png");
        this.url_loading = this.apiService.url("/assets/logos/loading.gif");
        this.common_service.export_success.subscribe(function () {
            _this.isLoading = false;
        });
    };
    AppHeaderComponent.prototype.addEvent = function () {
        this.selectedDate = this.range.value;
    };
    AppHeaderComponent.prototype.select_branch_single = function (row) {
        console.log(row, this.branches[row]);
        var item = JSON.stringify(this.branches[row]);
        localStorage.setItem('selectedBranch', item);
        this.common_service.set_branch(this.branches[row]);
    };
    AppHeaderComponent.prototype.select_branch = function (row) {
        this.selectedRow = row;
        console.log(this.branches[row]._id, this.branch_list.length);
        if (this.branches[row]._id == "syra-all") {
            if (this.branch_list.length == 0) {
                this.branch_list = this.branches.map(function (element) { return element; });
                this.branch_list.splice(0, 1); //to remove all-branches obj in list
            }
            else {
                if (this.branch_list.length == this.branches.length - 1) {
                    this.branch_list = [];
                }
                else {
                    this.branch_list = this.branches.map(function (element) { return element; });
                    this.branch_list.splice(0, 1); //to remove all-branches obj in list
                }
            }
            this.toggleAllSelection();
        }
        else {
            var index = this.branch_list.map(function (element) { return element._id; }).indexOf(this.branches[row]._id);
            if (index >= 0) {
                this.branch_list.splice(index, 1);
            }
            else {
                this.branch_list.push(this.branches[row]);
            }
            if (this.branch_list.length < this.branches.length - 1) {
                this.dd.options.forEach(function (item, index) {
                    if (index == 0) {
                        item.deselect();
                    }
                });
            }
            if (this.branch_list.length == this.branches.length - 1) {
                this.dd.options.forEach(function (item, index) {
                    if (index == 0) {
                        item.select();
                    }
                });
            }
        }
        console.log(this.branch_list);
    };
    AppHeaderComponent.prototype.toggleAllSelection = function () {
        this.allSelected = this.branch_list.length == this.branches.length - 1; // to control select-unselect
        console.log(this.dd, 123);
        if (this.allSelected) {
            this.dd.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.dd.options.forEach(function (item) { item.deselect(); });
        }
    };
    AppHeaderComponent.prototype.exportAct = function () {
        this.isLoading = true;
        if (this.url_array[1] == "reports" && this.url_array[2] == "sales" || this.url_array[1] == "reports" && this.url_array[2] == "accounting" || this.url_array[1] == "configurations" && this.url_array[2] == "catalouge" || this.url_array[1] == "products" && this.url_array[2] == "inventory-orders") {
            this.common_service.exportClicked.emit();
        }
        else {
            this.exportAction();
        }
    };
    AppHeaderComponent.prototype.exportAction = function () {
        var _this = this;
        var branch = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        var selectedDates = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        this.apiService.generate_accounting_report({ branch: branch, dates: selectedDates }).subscribe(function (report) {
            if (report.success) {
                _this.isLoading = false;
                var url = report.data.url;
                FileSaver.saveAs(url, report.data.title + ".pdf");
            }
            else {
                _this.common_service.showAlert(report.message);
            }
        });
    };
    AppHeaderComponent.prototype.get_Branches = function () {
        var _this = this;
        this.apiService.get_branch({}).subscribe(function (res) {
            _this.branches = res.data.branch_list;
            var item = { branch_name: "All branches", device_id: "", _id: "syra-all" };
            _this.branches.unshift(item);
            _this.selectedValue = _this.branches.map(function (element) { return element._id; });
            _this.branch_list = _this.branches.map(function (element) { return element; });
            _this.branch_list.splice(0, 1);
            _this.allSelected = false;
            _this.toggleAllSelection();
            localStorage.setItem('branch_list', JSON.stringify(_this.branch_list));
        });
    };
    AppHeaderComponent.prototype.closedAction = function () {
        var _a, _b;
        if (((_a = this.selectedDate) === null || _a === void 0 ? void 0 : _a.start) == null || ((_b = this.selectedDate) === null || _b === void 0 ? void 0 : _b.end) == null) {
            this.matLabelTitle = this.selectedDate.start == null ? moment(this.selectedDate.end).format("DD MMM YYYY") : moment(this.selectedDate.start).format("DD MMM YYYY");
            this.range.setValue({ start: '', end: '' });
        }
        if (this.selectedDate.start == null && this.selectedDate.end == null) {
            this.matLabelTitle = "Today";
        }
        var dataToStore = JSON.stringify(this.selectedDate);
        localStorage.setItem('selectedDate', dataToStore);
        this.common_service.set_date(this.selectedDate);
    };
    AppHeaderComponent.prototype.onOrientationChange = function (event) {
        this.mobile = window.innerWidth;
        this.isMobileCalender = (this.mobile > 1024) ? false : true;
        this.picker.close();
    };
    AppHeaderComponent.prototype.onResize = function (event) {
        this.mobile = window.innerWidth;
        this.isMobileCalender = (this.mobile > 1024) ? false : true;
        this.picker.close();
    };
    AppHeaderComponent.prototype.closed_branch = function () {
        if (this.getMultiEnable()) {
            var dataToStore = JSON.stringify(this.branch_list);
            localStorage.setItem('selectedBranch', dataToStore);
            this.common_service.set_branch(this.branch_list);
        }
        else {
            var dataToStore = JSON.stringify(this.branches[this.selectedRow]);
            localStorage.setItem('selectedBranch', dataToStore);
            this.common_service.set_branch(this.branches[this.selectedRow]);
            // this.selectedValue = this.branches.map(function (element: any) { return element._id })
        }
    };
    __decorate([
        core_1.ViewChild('picker')
    ], AppHeaderComponent.prototype, "picker");
    __decorate([
        core_1.ViewChild('dropDown')
    ], AppHeaderComponent.prototype, "dd");
    __decorate([
        core_1.ViewChild('datepickerFooter')
    ], AppHeaderComponent.prototype, "datepickerFooter");
    __decorate([
        core_1.HostListener('window:orientationchange', ['$event'])
    ], AppHeaderComponent.prototype, "onOrientationChange");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], AppHeaderComponent.prototype, "onResize");
    AppHeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-app-header',
            templateUrl: './app-header.component.html',
            styleUrls: ['./app-header.component.scss'],
            providers: [
                { provide: core_2.DateAdapter, useClass: helpers_1.AppDateAdapter },
                { provide: core_2.MAT_DATE_FORMATS, useValue: helpers_1.APP_DATE_FORMATS }
            ]
        })
    ], AppHeaderComponent);
    return AppHeaderComponent;
}());
exports.AppHeaderComponent = AppHeaderComponent;
exports.fa_download = {
    prefix: 'fa',
    iconName: 'line',
    icon: [
        512,
        512,
        [],
        '',
        "M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64\n    c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472\n    c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z",
    ]
};
