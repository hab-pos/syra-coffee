"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TimeTrackingComponent = exports.count = exports.pallets = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var moment = require("moment");
var kendo_drawing_1 = require("@progress/kendo-drawing");
var kendo_drawing_2 = require("@progress/kendo-drawing");
exports.pallets = [];
exports.count = 0;
function createColumn(rect, color) {
    // let color = pallets[count % pallets.length]
    // count++
    var origin = rect.origin;
    var center = rect.center();
    var bottomRight = rect.bottomRight();
    var radiusX = rect.width() / 2;
    var radiusY = rect.width() / 2;
    var gradient = new kendo_drawing_1.LinearGradient({
        stops: [
            {
                offset: 0,
                color: color,
                options: null
            },
            {
                offset: 0.5,
                color: color,
                options: null
            },
            {
                offset: 0.5,
                color: color,
                options: null
            },
            {
                offset: 1,
                color: color,
                options: null
            }
        ]
    });
    var path = new kendo_drawing_1.Path({
        fill: gradient,
        stroke: {
            color: color
        }
    })
        .moveTo(origin.x, origin.y)
        .lineTo(origin.x, bottomRight.y)
        .arc(180, 0, radiusX, radiusY, true)
        .lineTo(bottomRight.x, origin.y)
        .arc(0, 180, radiusX, radiusY);
    var topArcGeometry = new kendo_drawing_2.geometry.Arc([center.x, origin.y], {
        startAngle: 0,
        endAngle: 360,
        radiusX: radiusX,
        radiusY: radiusY
    });
    var topArc = new kendo_drawing_2.Arc(topArcGeometry, {
        fill: {
            color: color
        },
        stroke: {
            color: color
        }
    });
    var group = new kendo_drawing_1.Group();
    group.append(path, topArc);
    return group;
}
var TimeTrackingComponent = /** @class */ (function () {
    function TimeTrackingComponent(renderer, api_services, common_service) {
        var _this = this;
        this.renderer = renderer;
        this.api_services = api_services;
        this.common_service = common_service;
        this.isLoadingGrpah = false;
        this.isLoadingUsers = false;
        this.valueAxis = {
            line: { visible: false },
            majorTicks: { visible: false },
            majorGridLines: { dashType: 'dash' },
            majorUnit: 60 * 60 * 24,
            min: 0,
            max: 0,
            labels: {
                font: 'CerebriSans-Bold',
                rotation: 'auto',
                template: "#= kendo.toString(new Date(value), 'HH:mm') #"
            }
        };
        this.seriesDefaults = null;
        this.selected_barista_list = [];
        this.barista_list = [];
        this.barista_list_backup = [];
        this.faChevronDown = free_solid_svg_icons_1.faChevronDown;
        this.faArrowDown = free_solid_svg_icons_1.faArrowDown;
        this.isBaristasCheckable = false;
        this.users = [];
        this.attendance = [];
        this.branches = [];
        this.chart_data = [];
        this.branch_selected = null;
        this.dates_selected = null;
        this.attendance_backup = null;
        this.graphData = null;
        this.branches_graph = null;
        this.gpDataBackup = null;
        this.UserFilterTitle = "All Users";
        this.renderHeight = "100%";
        this.common_service.choose_date.subscribe(function (selectedDates) {
            exports.pallets = [];
            exports.count = 0;
            _this.get_report();
            _this.getGraph();
        });
        this.common_service.select_branch.subscribe(function (selectedBranch) {
            exports.pallets = [];
            exports.count = 0;
            _this.get_report();
            _this.getGraph();
        });
    }
    TimeTrackingComponent.prototype.getDate = function (value) {
        console.log(value);
        return moment(value).format("DD/MM");
    };
    TimeTrackingComponent.prototype.get = function (val) {
        return JSON.stringify(val);
    };
    TimeTrackingComponent.prototype.get_users = function () {
        var _this = this;
        if (this.barista_list_backup.length == 0) {
            this.api_services.get_all_barista().subscribe(function (res) {
                _this.isLoadingUsers = false;
                var array = [];
                if (res.success) {
                    var barista_name_list = _this.graphData.baristas;
                    for (var index = 0; index < res.data.barista_details.length; index++) {
                        var element = res.data.barista_details[index];
                        if (barista_name_list.includes(element._id)) {
                            array.push(element);
                        }
                    }
                    _this.barista_list = array;
                    _this.barista_list_backup = array;
                }
                else {
                    _this.common_service.showAlert(res.message);
                }
            });
        }
    };
    TimeTrackingComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.redrawCells();
        setTimeout(function () {
            _this.redrawCells();
        }, 1);
        exports.pallets = [];
        exports.count = 0;
        this.barista_list_backup = [];
        this.get_report();
        this.getGraph();
    };
    TimeTrackingComponent.prototype.get_report = function () {
        var _this = this;
        var _a;
        var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.branch_selected = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
        this.branch_selected = ((_a = this.branch_selected) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : this.branch_selected;
        this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        // this.branch_selected = this.branch_selected == "syra-all" ? null : this.branch_selected
        this.api_services.getAttendance_report({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(function (response) {
            _this.attendance = response.data;
            _this.attendance_backup = response.data;
        });
    };
    TimeTrackingComponent.prototype.getGraph = function () {
        var _this = this;
        var _a, _b;
        this.isLoadingGrpah = true;
        this.isLoadingUsers = true;
        this.selected_barista_list = [];
        this.barista_list_backup = [];
        exports.pallets = [];
        exports.count = 0;
        this.valueAxis.min = this.dates_selected == null ? moment().startOf('day').unix() : moment(this.dates_selected.start).startOf('day').unix();
        this.valueAxis.max = this.dates_selected == null ? moment().endOf('day').unix() : ((_a = this.dates_selected) === null || _a === void 0 ? void 0 : _a.end) != null ? moment(this.dates_selected.end).endOf('day').unix() : moment(this.dates_selected.start).endOf('day').unix();
        var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.branch_selected = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
        this.branch_selected = ((_b = this.branch_selected) === null || _b === void 0 ? void 0 : _b.length) == 0 ? null : this.branch_selected;
        this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        this.api_services.getAttendance_report_graph({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(function (response) {
            _this.isLoadingGrpah = false;
            _this.graphData = JSON.parse(JSON.stringify(response.data));
            _this.gpDataBackup = JSON.parse(JSON.stringify(response.data));
            _this.get_users();
            // pallets = response.data.colors
            _this.seriesDefaults = {
                type: 'column',
                stack: true,
                visual: function (e) {
                    return createColumn(e.rect, e.series.color);
                },
                highlight: {
                    toggle: function (e) {
                        // Do not create a highlight overlay,
                        // the approach will modify the existing visual instead.
                        e.preventDefault();
                        var visual = e.visual;
                        var opacity = e.show ? 0.7 : 1;
                        visual.opacity(opacity);
                    }
                }
            };
            if (_this.branches_graph == null || _this.branches_graph.length < response.data.branches.length) {
                _this.get_branches();
            }
        });
    };
    TimeTrackingComponent.prototype.get_branches = function () {
        var _this = this;
        this.api_services.get_branch({}).subscribe(function (res) {
            _this.branches_graph = res.data.branch_list.map(function (element) { return element.branch_name; });
            _this.branches_graph.pop();
        });
    };
    TimeTrackingComponent.prototype.toggleAction = function () {
        var _this = this;
        var icon = document.getElementById("icon");
        if (this.isBaristasCheckable) {
            icon.className = 'fa fa-arrow-down';
        }
        else {
            icon.className = 'fa fa-arrow-down open';
        }
        this.UserFilterTitle = this.selected_barista_list.length == this.users.length ? "All Users" : "Filtered";
        if (this.isBaristasCheckable) {
            if (this.selected_barista_list.length == 0) {
                this.barista_list = this.barista_list_backup;
            }
            else {
                this.barista_list = this.barista_list_backup.filter(function (barista) {
                    return _this.selected_barista_list.includes(barista._id);
                });
            }
        }
        else {
            this.barista_list = this.barista_list_backup;
        }
        if (this.isBaristasCheckable) {
            this.filterGraph();
        }
        this.filter();
        this.isBaristasCheckable = !this.isBaristasCheckable;
    };
    TimeTrackingComponent.prototype.filterGraph = function () {
        var _a, _b;
        var array = [];
        var branches = [];
        var color = [];
        if (this.selected_barista_list.length == 0) {
            this.graphData = JSON.parse(JSON.stringify(this.gpDataBackup));
            exports.pallets = this.graphData.colors;
            exports.count = 0;
        }
        else {
            for (var index = 0; index < ((_b = (_a = this.gpDataBackup) === null || _a === void 0 ? void 0 : _a.response) === null || _b === void 0 ? void 0 : _b.length); index++) {
                var element = this.gpDataBackup.response[index][0];
                if (this.selected_barista_list.includes(element.barista_id)) {
                    if (branches.indexOf(element.branch) < 0) {
                        branches.push(element.branch);
                    }
                    color.push(element.color);
                    array.push([element]);
                }
            }
            this.graphData.response = array;
            this.graphData.baristas = this.selected_barista_list;
            this.graphData.branches = branches;
            this.graphData.colors = color;
            exports.pallets = this.graphData.colors;
            exports.count = 0;
            console.log(this.selected_barista_list, this.graphData, this.gpDataBackup);
        }
        // this.seriesDefaults = {
        //   type: 'column',
        //   stack: true,
        //   visual: function (e: any) {
        //     return createColumn(e.rect);
        //   },
        //   highlight: {
        //     toggle: function (e: any) {
        //       // Do not create a highlight overlay,
        //       // the approach will modify the existing visual instead.
        //       e.preventDefault();
        //       const visual = e.visual;
        //       const opacity = e.show ? 0.7 : 1;
        //       visual.opacity(opacity);
        //     },
        //   },
        // }
        // if (this.branches_graph == null || this.branches_graph.length < this.graphData.branches.length) {
        //   this.branches_graph = this.graphData.data.branches
        // }
    };
    TimeTrackingComponent.prototype.filter = function () {
        var _this = this;
        if (this.selected_barista_list.length == 0) {
            this.attendance = this.attendance_backup;
        }
        else {
            this.attendance = this.attendance_backup.filter(function (attendee) {
                return _this.selected_barista_list.includes(attendee.barista_id);
            });
        }
    };
    TimeTrackingComponent.prototype.redrawCells = function () {
        var _a;
        this.renderHeight = ((_a = this.rightdiv) === null || _a === void 0 ? void 0 : _a.nativeElement.offsetHeight) + 'px';
    };
    TimeTrackingComponent.prototype.handleSelection = function (checked, id, name) {
        if (checked) {
            this.selected_barista_list.push(id);
        }
        else {
            var index = this.selected_barista_list.indexOf(id);
            this.selected_barista_list.splice(index, 1);
        }
    };
    TimeTrackingComponent.prototype.onResize = function (event) {
        this.Pagewidth = window.innerWidth;
        this.redrawCells();
    };
    __decorate([
        core_1.ViewChild("leftdiv")
    ], TimeTrackingComponent.prototype, "leftdiv");
    __decorate([
        core_1.ViewChild("rightdiv")
    ], TimeTrackingComponent.prototype, "rightdiv");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], TimeTrackingComponent.prototype, "onResize");
    TimeTrackingComponent = __decorate([
        core_1.Component({
            selector: 'app-time-tracking',
            templateUrl: './time-tracking.component.html',
            styleUrls: ['./time-tracking.component.scss']
        })
    ], TimeTrackingComponent);
    return TimeTrackingComponent;
}());
exports.TimeTrackingComponent = TimeTrackingComponent;
