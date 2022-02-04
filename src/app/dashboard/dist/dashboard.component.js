"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DashboardComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var moment = require("moment");
var _ = require("lodash");
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(common_service, apiServices) {
        var _a;
        this.common_service = common_service;
        this.apiServices = apiServices;
        this.faArrowDown = free_solid_svg_icons_1.faArrowDown;
        this.toDate = "";
        this.loadsh = _;
        this.isLoadingGrpah = false;
        this.isLoadingReport = false;
        this.branch_sales = [
        // {
        //   branch: "Gracia",
        //   color: "#47545d",
        //   clientInfo: { count: "78", financial_stmt: "loss", percent: 20.41 },
        //   expenses: { amount: "55,21", financial_stmt: "loss", percent: 3.80 },
        //   avg_tkt_without_tax: { amount: "5,08", financial_stmt: "profit", percent: 22.31 },
        //   avg_tkt_wit_tax: { amount: "396,58", financial_stmt: "profit", percent: 22.31 },
        //   net_profit: { amount: "355,21", financial_stmt: "loss", percent: 3.08 }
        // },
        // {
        //   branch: "Diputacio",
        //   color: "#3f9f97",
        //   clientInfo: { count: "78", financial_stmt: "loss", percent: 20.41 },
        //   expenses: { amount: "55,21", financial_stmt: "loss", percent: 3.80 },
        //   avg_tkt_without_tax: { amount: "5,08", financial_stmt: "profit", percent: 22.31 },
        //   avg_tkt_wit_tax: { amount: "396,58", financial_stmt: "profit", percent: 22.31 },
        //   net_profit: { amount: "355,21", financial_stmt: "loss", percent: 3.08 }
        // },
        // {
        //   branch: "Poblenoou",
        //   color: "#edbc83",
        //   clientInfo: { count: "78", financial_stmt: "loss", percent: 20.41 },
        //   expenses: { amount: "55,21", financial_stmt: "loss", percent: 3.80 },
        //   avg_tkt_without_tax: { amount: "5,08", financial_stmt: "profit", percent: 22.31 },
        //   avg_tkt_wit_tax: { amount: "396,58", financial_stmt: "profit", percent: 22.31 },
        //   net_profit: { amount: "355,21", financial_stmt: "loss", percent: 3.08 }
        // },
        // {
        //   branch: "Paral-lel",
        //   color: "#de7c84",
        //   clientInfo: { count: "78", financial_stmt: "loss", percent: 20.41 },
        //   expenses: { amount: "55,21", financial_stmt: "loss", percent: 3.80 },
        //   avg_tkt_without_tax: { amount: "5,08", financial_stmt: "profit", percent: 22.31 },
        //   avg_tkt_wit_tax: { amount: "396,58", financial_stmt: "profit", percent: 22.31 },
        //   net_profit: { amount: "355,21", financial_stmt: "loss", percent: 3.08 }
        // },
        // {
        //   branch: "San Juan",
        //   color: "#7a84d3",
        //   clientInfo: { count: "78", financial_stmt: "loss", percent: 20.41 },
        //   expenses: { amount: "55,21", financial_stmt: "loss", percent: 3.80 },
        //   avg_tkt_without_tax: { amount: "5,08", financial_stmt: "profit", percent: 22.31 },
        //   avg_tkt_wit_tax: { amount: "396,58", financial_stmt: "profit", percent: 22.31 },
        //   net_profit: { amount: "355,21", financial_stmt: "loss", percent: 3.08 }
        // }
        ];
        this.billing = {
            title: "Billing",
            amount: "0.00",
            info: { percent: "0.00", financial_stmt: "profit", prev_amount: "0.00" }
        };
        this.transaction = {
            title: "Number of Transaction",
            amount: "0.00",
            info: { percent: "0.00", financial_stmt: "profit", prev_amount: "0.00" }
        };
        this.tickets = {
            title: "Average Ticket",
            amount: "0.00",
            info: { percent: "0.00", financial_stmt: "profit", prev_amount: "0.00" }
        };
        this.chartArea = {
            border: {
                width: 0
            }
        };
        this.zoomSettings = {
            mode: 'X',
            enableMouseWheelZooming: false,
            enablePinchZooming: false,
            enableSelectionZooming: false,
            enableScrollbar: true,
            toolbarItems: ['Zoom', 'Pan']
        };
        this.primaryXAxis = null;
        this.primaryXAxisCummulative = {
            valueType: 'Category',
            majorGridLines: {
                width: 0
            },
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 },
            interval: 1,
            zoomFactor: 1,
            labelPlacement: "onTicks",
            edgeLabelPlacement: "Shift",
            labelIntersectAction: "Rotate45",
            plotOffsetLeft: -8,
            plotOffsetRight: -7
        };
        this.primaryYAxis = {
            valueType: 'Double',
            visible: false
        };
        this.primary_stacked_col_y = null;
        this.billing_graph_Data = [];
        this.admin_info = JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "");
        this.dates_selected = null;
        this.branch_selected = null;
        this.tableData = [];
        this.tableDataPrev = [];
        this.graphData = [];
        this.pallets = [];
        this.tooltipGlobal = {
            enable: true,
            format: '${point.x} : <b>${point.y}€</b>'
        };
        this.WithIvaSelected = true;
    }
    DashboardComponent.prototype.load = function (args) {
        args.chart.zoomModule.isZoomed = true;
    };
    ;
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.toDate = moment().format("MMM DD, YYYY");
        this.getDashBoard();
        this.getDashBoardGraph();
        this.getDashReportGraph();
        this.common_service.select_branch.subscribe(function (value) {
            _this.getDashBoard();
            _this.getDashBoardGraph();
            _this.getDashReportGraph();
        });
        this.common_service.choose_date.subscribe(function (value) {
            if (value.end != null) {
                _this.toDate = moment(value.start).format("MMM DD, YYYY") + " - " + moment(value.end).format("MMM DD, YYYY");
            }
            else {
                _this.toDate = moment(value.start).format("MMM DD, YYYY");
            }
            _this.getDashBoard();
            _this.getDashBoardGraph();
            _this.getDashReportGraph();
        });
    };
    DashboardComponent.prototype.getDashBoard = function () {
        var _this = this;
        var _a;
        this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.branch_selected = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
        this.branch_selected = ((_a = this.branch_selected) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : this.branch_selected;
        this.apiServices.getDashBoard({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(function (res) {
            _this.loadCommonReport(res.data.billing_info_current_json, res.data.billing_info_last_json);
            var reportSorted = _.sortBy(res.data.report, function (data, index) {
                return data.branch_id;
            });
            var reportPrevSorted = _.sortBy(res.data.report_last, function (data, index) {
                return data.branch_id;
            });
            var reportExpenseSorted = _.sortBy(res.data.expense, function (data, index) {
                return data.branch_id;
            });
            var reportExpenseLastSorted = _.sortBy(res.data.expense_last, function (data, index) {
                return data.branch_id;
            });
            if (reportPrevSorted.length < reportSorted.length) {
                for (var index = 0; index < reportPrevSorted.length; index++) {
                    var element = reportPrevSorted[index];
                    if (element.branch_id != reportSorted[index].branch_id) {
                        reportPrevSorted.splice(index, 0, null);
                        console.log(reportSorted.length, reportPrevSorted.length, index);
                    }
                }
            }
            _this.branch_sales = [];
            reportSorted.forEach(function (element, index) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
                var stmtClient = ((element === null || element === void 0 ? void 0 : element.count) || 0) > (((_a = reportPrevSorted[index]) === null || _a === void 0 ? void 0 : _a.count) || 0) ? "profit" : "loss";
                var amtClient = stmtClient == "loss" ? (((_b = reportPrevSorted[index]) === null || _b === void 0 ? void 0 : _b.count) || 0) - ((element === null || element === void 0 ? void 0 : element.count) || 0) / (((_c = reportPrevSorted[index]) === null || _c === void 0 ? void 0 : _c.count) || 1) * 100 : (((element === null || element === void 0 ? void 0 : element.count) || 0) - (((_d = reportPrevSorted[index]) === null || _d === void 0 ? void 0 : _d.count) || 0)) / ((element === null || element === void 0 ? void 0 : element.count) || 1) * 100;
                var stmtPrice = Number((element === null || element === void 0 ? void 0 : element.total_amount) || 0.00) > Number(((_e = reportPrevSorted[index]) === null || _e === void 0 ? void 0 : _e.total_amount) || 0.00) ? "profit" : "loss";
                var amtPrice = stmtPrice == "loss" ? (Number(((_f = reportPrevSorted[index]) === null || _f === void 0 ? void 0 : _f.total_amount) || 0.00) - Number((element === null || element === void 0 ? void 0 : element.total_amount) || 0.00)) / Number(((_g = reportPrevSorted[index]) === null || _g === void 0 ? void 0 : _g.total_amount) || 1.00) * 100 : (Number((element === null || element === void 0 ? void 0 : element.total_amount) || 0.00) - Number(((_h = reportPrevSorted[index]) === null || _h === void 0 ? void 0 : _h.total_amount) || 0.00)) / Number((element === null || element === void 0 ? void 0 : element.total_amount) || 1.00) * 100;
                var stmtExpense = Number(((_j = reportExpenseSorted[index]) === null || _j === void 0 ? void 0 : _j.total_amount) || 0.00) < Number(((_k = reportExpenseLastSorted[index]) === null || _k === void 0 ? void 0 : _k.total_amount) || 0.00) ? "profit" : "loss";
                var amtExpense = stmtExpense == "profit" ? (Number(((_l = reportExpenseLastSorted[index]) === null || _l === void 0 ? void 0 : _l.total_amount) || 0.00) - Number(((_m = reportExpenseSorted[index]) === null || _m === void 0 ? void 0 : _m.total_amount) || 0.00)) / Number(((_o = reportExpenseLastSorted[index]) === null || _o === void 0 ? void 0 : _o.total_amount) || 1.00) * 100 : (Number(((_p = reportExpenseSorted[index]) === null || _p === void 0 ? void 0 : _p.total_amount) || 0.00) - Number(((_q = reportExpenseLastSorted[index]) === null || _q === void 0 ? void 0 : _q.total_amount) || 0.00)) / Number(((_r = reportExpenseSorted[index]) === null || _r === void 0 ? void 0 : _r.total_amount) || 1.00) * 100;
                var tktCurrent = (Number((element === null || element === void 0 ? void 0 : element.total_amount) || 0.00) / Number((_s = element === null || element === void 0 ? void 0 : element.count) !== null && _s !== void 0 ? _s : 1));
                var tktlast = (Number(((_t = reportPrevSorted[index]) === null || _t === void 0 ? void 0 : _t.total_amount) || 0.00) / Number((_v = (_u = reportPrevSorted[index]) === null || _u === void 0 ? void 0 : _u.count) !== null && _v !== void 0 ? _v : 1));
                var stmtTkt = tktCurrent > tktlast ? "profit" : "loss";
                var amtTkt = stmtTkt == "loss" ? (tktlast - tktCurrent) / tktlast * 100 : (tktCurrent - tktlast) / tktCurrent * 100;
                // let tktprofit = (Number(element?.total_amount || 0.00) - Number(reportExpenseSorted[index]?.total_amount || 0.00))
                // let tktprofitlast = (Number(reportPrevSorted[index]?.total_amount || 0.00) - Number(reportExpenseLastSorted[index]?.total_amount || 0.00))
                var stmtprofit = Number(((_w = element === null || element === void 0 ? void 0 : element.order_info) === null || _w === void 0 ? void 0 : _w.total_amount) || 0.00) > Number(((_y = (_x = reportPrevSorted[index]) === null || _x === void 0 ? void 0 : _x.order_info) === null || _y === void 0 ? void 0 : _y.total_amount) || 0.00) ? "profit" : "loss";
                var amtprofit = stmtPrice == "loss" ? (Number(((_0 = (_z = reportPrevSorted[index]) === null || _z === void 0 ? void 0 : _z.order_info) === null || _0 === void 0 ? void 0 : _0.total_amount) || 0.00) - Number(((_1 = element === null || element === void 0 ? void 0 : element.order_info) === null || _1 === void 0 ? void 0 : _1.total_amount) || 0.00)) / Number(((_3 = (_2 = reportPrevSorted[index]) === null || _2 === void 0 ? void 0 : _2.order_info) === null || _3 === void 0 ? void 0 : _3.total_amount) || 1.00) * 100 : (Number(((_4 = element === null || element === void 0 ? void 0 : element.order_info) === null || _4 === void 0 ? void 0 : _4.total_amount) || 0.00) - Number(((_6 = (_5 = reportPrevSorted[index]) === null || _5 === void 0 ? void 0 : _5.order_info) === null || _6 === void 0 ? void 0 : _6.total_amount) || 0.00)) / Number(((_7 = element === null || element === void 0 ? void 0 : element.order_info) === null || _7 === void 0 ? void 0 : _7.total_amount) || 1.00) * 100;
                var colorString = _this.intToRGB(_this.hashCode(element.branch_info._id));
                var item = {
                    branch: element.branch_info.branch_name,
                    color: "#" + colorString,
                    clientInfo: { count: (element === null || element === void 0 ? void 0 : element.count) || 0, financial_stmt: stmtClient, percent: amtClient.toFixed(2) },
                    expenses: { amount: Number(((_8 = reportExpenseSorted[index]) === null || _8 === void 0 ? void 0 : _8.total_amount) || 0.00).toFixed(2), financial_stmt: stmtExpense, percent: amtExpense.toFixed(2) },
                    avg_tkt_without_tax: { amount: (Number((element === null || element === void 0 ? void 0 : element.total_amount) || 0.00) / Number((_9 = element === null || element === void 0 ? void 0 : element.count) !== null && _9 !== void 0 ? _9 : 1)).toFixed(2), financial_stmt: stmtTkt, percent: amtTkt.toFixed(2) },
                    avg_tkt_wit_tax: { amount: Number((element === null || element === void 0 ? void 0 : element.total_amount) || 0.00).toFixed(2), financial_stmt: stmtPrice, percent: amtPrice.toFixed(2) },
                    net_profit: { amount: Number(((_10 = element === null || element === void 0 ? void 0 : element.order_info) === null || _10 === void 0 ? void 0 : _10.total_amount) || 0.00).toFixed(2), financial_stmt: stmtprofit, percent: amtprofit.toFixed(2) }
                };
                _this.branch_sales.push(item);
            });
        });
    };
    DashboardComponent.prototype.getDashReportGraph = function () {
        var _this = this;
        var _a;
        this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.branch_selected = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
        this.branch_selected = ((_a = this.branch_selected) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : this.branch_selected;
        this.isLoadingReport = true;
        this.apiServices.getDashReportGraph({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(function (res) {
            var _a, _b, _c, _d, _e, _f;
            _this.billing_graph_Data = [];
            _this.isLoadingReport = false;
            if (_this.dates_selected == null || ((_a = _this.dates_selected) === null || _a === void 0 ? void 0 : _a.end) == null || ((_b = _this.dates_selected) === null || _b === void 0 ? void 0 : _b.start) == ((_c = _this.dates_selected) === null || _c === void 0 ? void 0 : _c.end)) {
                for (var index = 0; index < res.data.HourBased.length; index++) {
                    var element = res.data.HourBased[index];
                    var item = { time_slot: element.time_slot, total_price: element.total_price, count: element.count, ticket: Number(element.total_price) / Number(element.count) };
                    _this.billing_graph_Data.push(item);
                }
            }
            else {
                for (var index = 0; index < res.data.DateBased.length; index++) {
                    var element = res.data.DateBased[index];
                    var item = { time_slot: element.time_slot, total_price: element.total_price, count: element.count, ticket: Number(element.total_price) / Number(element.count) };
                    _this.billing_graph_Data.push(item);
                }
            }
            (_d = _this.chart_billings) === null || _d === void 0 ? void 0 : _d.refresh();
            (_e = _this.chart_transaction) === null || _e === void 0 ? void 0 : _e.refresh();
            (_f = _this.chart_tickets) === null || _f === void 0 ? void 0 : _f.refresh();
            _this.resizeGraph();
        });
    };
    DashboardComponent.prototype.getDashBoardGraph = function () {
        var _this = this;
        var _a;
        this.isLoadingGrpah = true;
        this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        var branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        this.branch_selected = branch_list === null || branch_list === void 0 ? void 0 : branch_list.map(function (element) { return element._id; });
        this.branch_selected = ((_a = this.branch_selected) === null || _a === void 0 ? void 0 : _a.length) == 0 ? null : this.branch_selected;
        this.apiServices.getDashBoardGraph({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(function (res) {
            _this.isLoadingGrpah = false;
            setTimeout(function () {
                _this.loadGraph(res.data);
            }, 1);
            _this.loadGraph(res.data);
        });
    };
    DashboardComponent.prototype.resizeGraph = function () {
        var _a, _b, _c, _d, _e, _f;
        var maximumValue = 0;
        for (var index = 0; index < this.graphData.length; index++) {
            var element = this.graphData[index];
            if (maximumValue < element.length) {
                maximumValue = element.length;
            }
        }
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
            labelIntersectAction: "Rotate45",
            zoomFactor: (this.dates_selected != null && ((_a = this.dates_selected) === null || _a === void 0 ? void 0 : _a.start) != ((_b = this.dates_selected) === null || _b === void 0 ? void 0 : _b.end) && ((_c = this.dates_selected) === null || _c === void 0 ? void 0 : _c.end) != null) && maximumValue > 15 ? 0.7 : 1
        };
        this.primaryXAxisCummulative = {
            valueType: 'Category',
            majorGridLines: {
                width: 0
            },
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 },
            interval: 1,
            zoomFactor: (this.dates_selected != null && ((_d = this.dates_selected) === null || _d === void 0 ? void 0 : _d.start) != ((_e = this.dates_selected) === null || _e === void 0 ? void 0 : _e.end) && ((_f = this.dates_selected) === null || _f === void 0 ? void 0 : _f.end) != null) && this.billing_graph_Data.length > 12 ? 0.7 : 1,
            labelPlacement: "onTicks",
            edgeLabelPlacement: "Shift",
            labelIntersectAction: "Rotate90",
            plotOffsetLeft: -6.6,
            plotOffsetRight: -6.6
        };
        this.primaryYAxis = {
            valueType: 'Double',
            visible: false
        };
        this.primary_stacked_col_y = {
            valueType: 'Double',
            visible: true,
            majorTickLines: {
                width: 0
            },
            lineStyle: { width: 0 }
        };
    };
    DashboardComponent.prototype.loadGraph = function (data) {
        var _this = this;
        var _a;
        var data_to_be_casted = [];
        var data_toPush = [];
        this.pallets = [];
        this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null;
        console.log(this.dates_selected, 123);
        data.forEach(function (element) {
            var _a, _b, _c;
            if (_this.dates_selected == null || ((_a = _this.dates_selected) === null || _a === void 0 ? void 0 : _a.end) == null || ((_b = _this.dates_selected) === null || _b === void 0 ? void 0 : _b.start) == ((_c = _this.dates_selected) === null || _c === void 0 ? void 0 : _c.end)) {
                data_to_be_casted.push(element.HourBased);
            }
            else {
                data_to_be_casted.push(element.DateBased);
            }
        });
        data_to_be_casted.forEach(function (category, index) {
            var array = [];
            var value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var colorString = _this.intToRGB(_this.hashCode(category[0].branch_info._id));
            _this.pallets.push("#" + colorString);
            if (_this.dates_selected == null || _this.dates_selected.end == null || _this.dates_selected.start == _this.dates_selected.end) {
                category.forEach(function (item, index) {
                    value[Number(item.time_slot)] = Number(item.total_price);
                });
                value.forEach(function (element, index) {
                    var obj = { hour: index, amount: element };
                    array.push(obj);
                });
                data_toPush.push(array);
            }
            else {
                var TimeLine_1 = [];
                category.forEach(function (item, index) {
                    if (!TimeLine_1.includes(item.time_slot)) {
                        TimeLine_1.push(item.time_slot);
                    }
                });
                TimeLine_1.forEach(function (element) {
                    var match_found = false;
                    category.forEach(function (item, index) {
                        if (element == item.time_slot) {
                            match_found = true;
                            var obj = { hour: element, amount: Number(item.total_price) };
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
        this.graphData = data_toPush;
        (_a = this.chart_cummulative) === null || _a === void 0 ? void 0 : _a.refresh();
        this.resizeGraph();
    };
    DashboardComponent.prototype.hashCode = function (str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };
    DashboardComponent.prototype.intToRGB = function (i) {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "00000".substring(0, 6 - c.length) + c;
    };
    DashboardComponent.prototype.loadCommonReport = function (current, previous) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        var stmt = (current === null || current === void 0 ? void 0 : current.total_amount) > (previous === null || previous === void 0 ? void 0 : previous.total_amount) ? "profit" : "loss";
        var amt = stmt == "loss" ? ((previous === null || previous === void 0 ? void 0 : previous.total_amount) - (current === null || current === void 0 ? void 0 : current.total_amount)) / (previous === null || previous === void 0 ? void 0 : previous.total_amount) * 100 : ((current === null || current === void 0 ? void 0 : current.total_amount) - (previous === null || previous === void 0 ? void 0 : previous.total_amount)) / (current === null || current === void 0 ? void 0 : current.total_amount) * 100;
        amt = (current === null || current === void 0 ? void 0 : current.order_info) == null ? 0.00 : amt;
        var stmt_wo_iva = (((_a = current === null || current === void 0 ? void 0 : current.order_info) === null || _a === void 0 ? void 0 : _a.total_amount) || 0) > (((_b = previous === null || previous === void 0 ? void 0 : previous.order_info) === null || _b === void 0 ? void 0 : _b.total_amount) || 0) ? "profit" : "loss";
        var amt_wo_iva = stmt_wo_iva == "loss" ? ((((_c = previous === null || previous === void 0 ? void 0 : previous.order_info) === null || _c === void 0 ? void 0 : _c.total_amount) || 0) - (((_d = current === null || current === void 0 ? void 0 : current.order_info) === null || _d === void 0 ? void 0 : _d.total_amount) || 0)) / (((_e = previous === null || previous === void 0 ? void 0 : previous.order_info) === null || _e === void 0 ? void 0 : _e.total_amount) || 0) * 100 : ((((_f = current === null || current === void 0 ? void 0 : current.order_info) === null || _f === void 0 ? void 0 : _f.total_amount) || 0) - (((_g = previous === null || previous === void 0 ? void 0 : previous.order_info) === null || _g === void 0 ? void 0 : _g.total_amount) || 0)) / (((_h = current === null || current === void 0 ? void 0 : current.order_info) === null || _h === void 0 ? void 0 : _h.total_amount) || 0) * 100;
        this.billing = {
            title: "Billing",
            amount: ((_j = current === null || current === void 0 ? void 0 : current.total_amount) === null || _j === void 0 ? void 0 : _j.toFixed(2)) || "0.00",
            amount_without_iva: Number(((_k = current.order_info) === null || _k === void 0 ? void 0 : _k.total_amount) || "0.00").toFixed(2),
            info: { percent: amt.toFixed(2), financial_stmt: stmt, prev_amount: ((_l = previous === null || previous === void 0 ? void 0 : previous.total_amount) === null || _l === void 0 ? void 0 : _l.toFixed(2)) || "0.00" },
            info_wo_iva: { percent: (amt_wo_iva === null || amt_wo_iva === void 0 ? void 0 : amt_wo_iva.toFixed(2)) || "0.00", financial_stmt: stmt_wo_iva, prev_amount: ((_m = previous === null || previous === void 0 ? void 0 : previous.order_info) === null || _m === void 0 ? void 0 : _m.total_amount.toFixed(2)) || "0.00" }
        };
        var stmtTrans = (current === null || current === void 0 ? void 0 : current.count) > (previous === null || previous === void 0 ? void 0 : previous.count) ? "profit" : "loss";
        var amtTrans = stmtTrans == "loss" ? ((previous === null || previous === void 0 ? void 0 : previous.count) - (current === null || current === void 0 ? void 0 : current.count)) / (previous === null || previous === void 0 ? void 0 : previous.count) * 100 : ((current === null || current === void 0 ? void 0 : current.count) - (previous === null || previous === void 0 ? void 0 : previous.count)) / (current === null || current === void 0 ? void 0 : current.count) * 100;
        this.transaction = {
            title: "Number of Transaction",
            amount: ((_o = current === null || current === void 0 ? void 0 : current.count) === null || _o === void 0 ? void 0 : _o.toFixed(2)) || "0.00",
            info: { percent: Number(amtTrans || "0").toFixed(2), financial_stmt: stmtTrans, prev_amount: ((_p = previous === null || previous === void 0 ? void 0 : previous.count) === null || _p === void 0 ? void 0 : _p.toFixed(2)) || "0.00" }
        };
        var stmtTkt = (current === null || current === void 0 ? void 0 : current.avgTkt) > (previous === null || previous === void 0 ? void 0 : previous.avgTkt) ? "profit" : "loss";
        var amtTkt = stmtTkt == "loss" ? ((previous === null || previous === void 0 ? void 0 : previous.avgTkt) - (current === null || current === void 0 ? void 0 : current.avgTkt)) / (previous === null || previous === void 0 ? void 0 : previous.avgTkt) * 100 : ((current === null || current === void 0 ? void 0 : current.avgTkt) - (previous === null || previous === void 0 ? void 0 : previous.avgTkt)) / (current === null || current === void 0 ? void 0 : current.avgTkt) * 100;
        var tktAmtCurrent = ((Number(((_q = current.order_info) === null || _q === void 0 ? void 0 : _q.total_amount) || "0.00") || 0.00) / (Number((current === null || current === void 0 ? void 0 : current.count) || "0") || 0.00));
        var tktAmtPrevious = ((Number(((_r = previous.order_info) === null || _r === void 0 ? void 0 : _r.total_amount) || "0.00") || 0.00) / (Number((previous === null || previous === void 0 ? void 0 : previous.count) || "0") || 0.00));
        tktAmtCurrent = isNaN(tktAmtCurrent) ? 0.0 : tktAmtCurrent;
        tktAmtPrevious = isNaN(tktAmtPrevious) ? 0.0 : tktAmtPrevious;
        var stmtTkt_wo_iva = (tktAmtCurrent) > (tktAmtPrevious) ? "profit" : "loss";
        var amtTkt_wo_iva = stmtTkt_wo_iva == "loss" ? ((tktAmtPrevious) - (tktAmtCurrent)) / (tktAmtPrevious) * 100 : ((tktAmtCurrent) - (tktAmtPrevious)) / (tktAmtCurrent) * 100;
        this.tickets = {
            title: "Average Ticket",
            amount: isNaN((_s = current === null || current === void 0 ? void 0 : current.avgTkt) === null || _s === void 0 ? void 0 : _s.toFixed(2)) ? "0.00" : ((_t = current === null || current === void 0 ? void 0 : current.avgTkt) === null || _t === void 0 ? void 0 : _t.toFixed(2)) || "0.00",
            amount_without_iva: ((_u = current.order_info) === null || _u === void 0 ? void 0 : _u.total_amount) ? (Number(((_v = current.order_info) === null || _v === void 0 ? void 0 : _v.total_amount) || "0.00") / Number((current === null || current === void 0 ? void 0 : current.count) || "0")).toFixed(2) : "0.00",
            info: { percent: (_w = Number(amtTkt || "0.0")) === null || _w === void 0 ? void 0 : _w.toFixed(2), financial_stmt: stmtTkt, prev_amount: ((_x = previous === null || previous === void 0 ? void 0 : previous.avgTkt) === null || _x === void 0 ? void 0 : _x.toFixed(2)) || "0.00" },
            info_wo_iva: { percent: (_y = Number(amtTkt_wo_iva || "0.00")) === null || _y === void 0 ? void 0 : _y.toFixed(2), financial_stmt: stmtTkt_wo_iva, prev_amount: isNaN(Number(tktAmtPrevious || 0.00)) ? "0.00" : ((_z = Number(tktAmtPrevious || 0.00)) === null || _z === void 0 ? void 0 : _z.toFixed(2)) || "0.00" }
        };
    };
    DashboardComponent.prototype.toggle = function (event) {
        this.WithIvaSelected = event.checked;
    };
    __decorate([
        core_1.ViewChild('chart_billings')
    ], DashboardComponent.prototype, "chart_billings");
    __decorate([
        core_1.ViewChild('chart_transaction')
    ], DashboardComponent.prototype, "chart_transaction");
    __decorate([
        core_1.ViewChild('chart_tickets')
    ], DashboardComponent.prototype, "chart_tickets");
    __decorate([
        core_1.ViewChild('chart_cummulative')
    ], DashboardComponent.prototype, "chart_cummulative");
    DashboardComponent = __decorate([
        core_1.Component({
            selector: 'app-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.scss']
        })
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
