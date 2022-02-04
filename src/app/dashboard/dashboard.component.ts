import { Component, OnInit, ViewChild } from '@angular/core';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { CommonService } from '../common.service';
import * as moment from 'moment';
import { APIServices } from '../APIServices/api-services'
import * as _ from "lodash";
import { ILoadedEventArgs, Series } from '@syncfusion/ej2-angular-charts';
import { A } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  faArrowDown = faArrowDown
  toDate = ""
  loadsh = _
  isLoadingGrpah = false
  isLoadingReport = false

  branch_sales: Object[] = [
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
  ]

  @ViewChild('chart_billings') chart_billings: any
  @ViewChild('chart_transaction') chart_transaction: any
  @ViewChild('chart_tickets') chart_tickets: any
  @ViewChild('chart_cummulative') chart_cummulative: any
  public load(args: ILoadedEventArgs): void {
    args.chart.zoomModule.isZoomed = true;
  };

  billing: any = {
    title: "Billing",
    amount: "0.00",
    info: { percent: "0.00", financial_stmt: "profit", prev_amount: "0.00" },
  }
  transaction: any = {
    title: "Number of Transaction",
    amount: "0.00",
    info: { percent: "0.00", financial_stmt: "profit", prev_amount: "0.00" },
  }
  tickets: any = {
    title: "Average Ticket",
    amount: "0.00",
    info: { percent: "0.00", financial_stmt: "profit", prev_amount: "0.00" },
  }

  public chartArea: Object = {
    border: {
      width: 0
    },
  };
 
  public zoomSettings: Object = {
    mode: 'X',
    enableMouseWheelZooming: false,
    enablePinchZooming: false,
    enableSelectionZooming: false,
    enableScrollbar: true,
    toolbarItems: ['Zoom', 'Pan']
  };

  primaryXAxis : any = null;
  primaryXAxisCummulative : any = {
    valueType: 'Category',
    majorGridLines: {
      width: 0
    },
    majorTickLines: {
      width: 0,
    },
    lineStyle: { width: 0 },
    interval: 1,
    zoomFactor:1,
    labelPlacement : "onTicks",
    edgeLabelPlacement : "Shift",
    labelIntersectAction : "Rotate45",
    plotOffsetLeft : -8,
    plotOffsetRight : -7,
  }
  primaryYAxis : any = {
    valueType: 'Double',
    visible: false,
  };

  primary_stacked_col_y : any = null

  billing_graph_Data : any =[]
  
  admin_info = JSON.parse(localStorage.getItem('syra_admin') ?? "");

  constructor(private common_service: CommonService, private apiServices: APIServices) { }
  ngOnInit(): void {
    this.toDate = moment().format("MMM DD, YYYY")
    this.getDashBoard()
    this.getDashBoardGraph()
    this.getDashReportGraph()
    this.common_service.select_branch.subscribe((value: any) => {
      this.getDashBoard()
      this.getDashBoardGraph()
      this.getDashReportGraph()
    })

    this.common_service.choose_date.subscribe((value: any) => {
      if (value.end != null) {
        this.toDate = moment(value.start).format("MMM DD, YYYY") + " - " + moment(value.end).format("MMM DD, YYYY")
      }
      else {
        this.toDate = moment(value.start).format("MMM DD, YYYY")
      }
      this.getDashBoard()
      this.getDashBoardGraph()
      this.getDashReportGraph()
    })
  }
  dates_selected: any = null
  branch_selected: any = null
  tableData: any = []
  tableDataPrev: any = []
  
  getDashBoard() {
    this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.branch_selected = branch_list?.map(function (element: any) { return element._id })
    this.branch_selected = this.branch_selected?.length == 0 ? null : this.branch_selected

    this.apiServices.getDashBoard({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(res => {
      this.loadCommonReport(res.data.billing_info_current_json, res.data.billing_info_last_json)
      let reportSorted = _.sortBy(res.data.report, (data, index) => {
        return data.branch_id
      })
      let reportPrevSorted = _.sortBy(res.data.report_last, (data, index) => {
        return data.branch_id
      })
      let reportExpenseSorted = _.sortBy(res.data.expense, (data, index) => {
        return data.branch_id
      })
      let reportExpenseLastSorted = _.sortBy(res.data.expense_last, (data, index) => {
        return data.branch_id
      })


      if(reportPrevSorted.length < reportSorted.length){
        for (let index = 0; index < reportPrevSorted.length; index++) {
          const element = reportPrevSorted[index];
          if(element.branch_id != reportSorted[index].branch_id)
          {
            reportPrevSorted.splice(index, 0, null);
            console.log(reportSorted.length,reportPrevSorted.length,index)
          }
        }
      }

      this.branch_sales = []
      reportSorted.forEach((element: any, index: any) => {

        let stmtClient = (element?.count || 0) > (reportPrevSorted[index]?.count || 0) ? "profit" : "loss"
        let amtClient = stmtClient == "loss" ? (reportPrevSorted[index]?.count || 0) - (element?.count || 0) / (reportPrevSorted[index]?.count || 1) * 100 : ((element?.count || 0) - (reportPrevSorted[index]?.count || 0)) / (element?.count || 1) * 100

        let stmtPrice = Number(element?.total_amount || 0.00) > Number(reportPrevSorted[index]?.total_amount || 0.00) ? "profit" : "loss"
        let amtPrice = stmtPrice == "loss" ? (Number(reportPrevSorted[index]?.total_amount || 0.00) - Number(element?.total_amount || 0.00)) / Number(reportPrevSorted[index]?.total_amount || 1.00) * 100 : (Number(element?.total_amount || 0.00) - Number(reportPrevSorted[index]?.total_amount || 0.00)) / Number(element?.total_amount || 1.00) * 100

        let stmtExpense = Number(reportExpenseSorted[index]?.total_amount || 0.00) < Number(reportExpenseLastSorted[index]?.total_amount || 0.00) ? "profit" : "loss"
        let amtExpense = stmtExpense == "profit" ? (Number(reportExpenseLastSorted[index]?.total_amount || 0.00) - Number(reportExpenseSorted[index]?.total_amount || 0.00)) / Number(reportExpenseLastSorted[index]?.total_amount || 1.00) * 100 : (Number(reportExpenseSorted[index]?.total_amount || 0.00) - Number(reportExpenseLastSorted[index]?.total_amount || 0.00)) / Number(reportExpenseSorted[index]?.total_amount || 1.00) * 100


        let tktCurrent = (Number(element?.total_amount || 0.00) / Number(element?.count ?? 1))
        let tktlast = (Number(reportPrevSorted[index]?.total_amount || 0.00) / Number(reportPrevSorted[index]?.count ?? 1))

        let stmtTkt = tktCurrent > tktlast ? "profit" : "loss"
        let amtTkt = stmtTkt == "loss" ? (tktlast - tktCurrent) / tktlast * 100 : (tktCurrent - tktlast) / tktCurrent * 100

        // let tktprofit = (Number(element?.total_amount || 0.00) - Number(reportExpenseSorted[index]?.total_amount || 0.00))
        // let tktprofitlast = (Number(reportPrevSorted[index]?.total_amount || 0.00) - Number(reportExpenseLastSorted[index]?.total_amount || 0.00))

        let stmtprofit = Number(element?.order_info?.total_amount || 0.00) > Number(reportPrevSorted[index]?.order_info?.total_amount || 0.00) ? "profit" : "loss"
        let amtprofit = stmtPrice == "loss" ? (Number(reportPrevSorted[index]?.order_info?.total_amount || 0.00) - Number(element?.order_info?.total_amount || 0.00)) / Number(reportPrevSorted[index]?.order_info?.total_amount || 1.00) * 100 : (Number(element?.order_info?.total_amount || 0.00) - Number(reportPrevSorted[index]?.order_info?.total_amount || 0.00)) / Number(element?.order_info?.total_amount || 1.00) * 100

        let colorString = this.intToRGB(this.hashCode(element.branch_info._id))
        let item = {
          branch: element.branch_info.branch_name,
          color: "#" + colorString,
          clientInfo: { count: element?.count || 0, financial_stmt: stmtClient, percent: amtClient.toFixed(2) },
          expenses: { amount: Number(reportExpenseSorted[index]?.total_amount || 0.00).toFixed(2), financial_stmt: stmtExpense, percent: amtExpense.toFixed(2) },
          avg_tkt_without_tax: { amount: (Number(element?.total_amount || 0.00) / Number(element?.count ?? 1)).toFixed(2), financial_stmt: stmtTkt, percent: amtTkt.toFixed(2) },
          avg_tkt_wit_tax: { amount: Number(element?.total_amount || 0.00).toFixed(2), financial_stmt: stmtPrice, percent: amtPrice.toFixed(2) },
          net_profit: { amount: Number(element?.order_info?.total_amount || 0.00).toFixed(2), financial_stmt: stmtprofit, percent: amtprofit.toFixed(2) }
        }
        this.branch_sales.push(item)
      });
    })
  }
  getDashReportGraph() {
    this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.branch_selected = branch_list?.map(function (element: any) { return element._id })
    this.branch_selected = this.branch_selected?.length == 0 ? null : this.branch_selected
    this.isLoadingReport = true
    this.apiServices.getDashReportGraph({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(res => {
      this.billing_graph_Data = []
      this.isLoadingReport = false

      if(this.dates_selected == null || this.dates_selected?.end == null || this.dates_selected?.start == this.dates_selected?.end)
      {
        for (let index = 0; index < res.data.HourBased.length; index++) {
          const element = res.data.HourBased[index];
          let item = {time_slot : element.time_slot,total_price:element.total_price,count : element.count,ticket : Number(element.total_price) / Number(element.count)}
          this.billing_graph_Data.push(item)
        }
      }
      else{
        for (let index = 0; index < res.data.DateBased.length; index++) {
          const element = res.data.DateBased[index];
          let item = {time_slot : element.time_slot,total_price:element.total_price,count : element.count,ticket : Number(element.total_price) / Number(element.count)}
          this.billing_graph_Data.push(item)
        }
      }
      this.chart_billings?.refresh()
      this.chart_transaction?.refresh()
      this.chart_tickets?.refresh()
      this.resizeGraph()
    })
  }

graphData : any = []
  getDashBoardGraph() {
    this.isLoadingGrpah = true
    this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.branch_selected = branch_list?.map(function (element: any) { return element._id })
    this.branch_selected = this.branch_selected?.length == 0 ? null : this.branch_selected

    this.apiServices.getDashBoardGraph({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(res => {
      this.isLoadingGrpah = false
      setTimeout(() => {
        this.loadGraph(res.data) 
      }, 1);
      this.loadGraph(res.data) 
    })
  }
  pallets : any = []
  resizeGraph() {
    let maximumValue = 0
    for (let index = 0; index < this.graphData.length; index++) {
      const element = this.graphData[index];
      if (maximumValue < element.length) {
        maximumValue = element.length
      }
    }

    this.primaryXAxis = {
      valueType: 'Category',
      majorGridLines: {
        width: 0
      },
      majorTickLines: {
        width: 0,
      },
      lineStyle: { width: 0 },
      interval: 1,
      labelIntersectAction : "Rotate45",
      zoomFactor: (this.dates_selected != null && this.dates_selected?.start != this.dates_selected?.end && this.dates_selected?.end != null) && maximumValue > 15 ? 0.7 : 1,
    };
    this.primaryXAxisCummulative = {
      valueType: 'Category',
      majorGridLines: {
        width: 0
      },
      majorTickLines: {
        width: 0,
      },
      lineStyle: { width: 0 },
      interval: 1,
      zoomFactor:  (this.dates_selected != null && this.dates_selected?.start != this.dates_selected?.end && this.dates_selected?.end != null) && this.billing_graph_Data.length > 12 ? 0.7 : 1,
      labelPlacement : "onTicks",
      edgeLabelPlacement : "Shift",
      labelIntersectAction : "Rotate90",
      plotOffsetLeft : -6.6,
      plotOffsetRight : -6.6,
    };
    this.primaryYAxis = {
      valueType: 'Double',
      visible: false,
    };
  
    this.primary_stacked_col_y = {
      valueType: 'Double',
      visible: true,
      majorTickLines: {
        width: 0,
      },
      lineStyle: { width: 0 },
    }
  }
  tooltipGlobal = {
    enable: true,
    format: '${point.x} : <b>${point.y}€</b>'
  }

  loadGraph(data : any){
    let data_to_be_casted : any = []
    let data_toPush: any = []
    this.pallets = []
    this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    console.log(this.dates_selected,123)
    data.forEach((element : any) => {
      if(this.dates_selected == null || this.dates_selected?.end == null || this.dates_selected?.start == this.dates_selected?.end){
        data_to_be_casted.push(element.HourBased)
      }
      else{
        data_to_be_casted.push(element.DateBased)
      }
    });

    data_to_be_casted.forEach((category: any, index: any) => {
      let array: any = []
      let value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      let colorString = this.intToRGB(this.hashCode(category[0].branch_info._id))
      this.pallets.push("#"+colorString)

      if (this.dates_selected == null || this.dates_selected.end == null || this.dates_selected.start == this.dates_selected.end) {

        category.forEach((item: any, index: any) => {
          value[Number(item.time_slot)] = Number(item.total_price)
        })

        value.forEach((element: any, index: any) => {
          let obj: any = { hour: index, amount: element }
          array.push(obj)
        });
        data_toPush.push(array)
      }
      else {
        let TimeLine: any = []
        category.forEach((item: any, index: any) => {
          if (!TimeLine.includes(item.time_slot)) {
            TimeLine.push(item.time_slot)
          }
        })

        TimeLine.forEach((element: any) => {
          let match_found = false
          category.forEach((item: any, index: any) => {
            if (element == item.time_slot) {
              match_found = true
              let obj: any = { hour: element, amount: Number(item.total_price) }
              array.push(obj)
            }
          })
          if (match_found == false) {
            let obj: any = { hour: element, amount: 0 }
            array.push(obj)
          }
        });
        let arraySorted = _.sortBy(array, (data, index) => {
          return data.hour
        })
        data_toPush.push(arraySorted)
      }
    });

    this.graphData = data_toPush
    this.chart_cummulative?.refresh()
    this.resizeGraph()
  }
  hashCode(str: any) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToRGB(i: any) {
    var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }
  loadCommonReport(current: any, previous: any) {
    let stmt = current?.total_amount > previous?.total_amount ? "profit" : "loss"
    let amt = stmt == "loss" ? (previous?.total_amount - current?.total_amount) / previous?.total_amount * 100 : (current?.total_amount - previous?.total_amount) / current?.total_amount * 100
    amt = current?.order_info == null ? 0.00 : amt
    let stmt_wo_iva = (current?.order_info?.total_amount || 0) > (previous?.order_info?.total_amount || 0) ? "profit" : "loss"
    let amt_wo_iva = stmt_wo_iva == "loss" ? ((previous?.order_info?.total_amount || 0) - (current?.order_info?.total_amount || 0)) / (previous?.order_info?.total_amount || 0) * 100 : ((current?.order_info?.total_amount || 0) - (previous?.order_info?.total_amount || 0)) / (current?.order_info?.total_amount || 0) * 100
    this.billing = {
      title: "Billing",
      amount: current?.total_amount?.toFixed(2) || "0.00",
      amount_without_iva: Number(current.order_info?.total_amount || "0.00").toFixed(2),
      info: { percent: amt.toFixed(2), financial_stmt: stmt, prev_amount: previous?.total_amount?.toFixed(2) || "0.00" },
      info_wo_iva: { percent: amt_wo_iva?.toFixed(2) || "0.00", financial_stmt: stmt_wo_iva, prev_amount: previous?.order_info?.total_amount.toFixed(2) || "0.00" },
    }


    let stmtTrans = current?.count > previous?.count ? "profit" : "loss"
    let amtTrans = stmtTrans == "loss" ? (previous?.count - current?.count) / previous?.count * 100 : (current?.count - previous?.count) / current?.count * 100
    this.transaction = {
      title: "Number of Transaction",
      amount: current?.count?.toFixed(2) || "0.00",
      info: { percent: Number(amtTrans || "0").toFixed(2), financial_stmt: stmtTrans, prev_amount: previous?.count?.toFixed(2) || "0.00" },
    }

    let stmtTkt = current?.avgTkt > previous?.avgTkt ? "profit" : "loss"
    let amtTkt = stmtTkt == "loss" ? (previous?.avgTkt - current?.avgTkt) / previous?.avgTkt * 100 : (current?.avgTkt - previous?.avgTkt) / current?.avgTkt * 100

    let tktAmtCurrent = ((Number(current.order_info?.total_amount || "0.00") || 0.00) / (Number(current?.count || "0") || 0.00))
    let tktAmtPrevious = ((Number(previous.order_info?.total_amount || "0.00") || 0.00) / (Number(previous?.count || "0") || 0.00))

    tktAmtCurrent = isNaN(tktAmtCurrent) ? 0.0 : tktAmtCurrent
    tktAmtPrevious = isNaN(tktAmtPrevious) ? 0.0 : tktAmtPrevious

    let stmtTkt_wo_iva = (tktAmtCurrent) > (tktAmtPrevious) ? "profit" : "loss"
    let amtTkt_wo_iva = stmtTkt_wo_iva == "loss" ? ((tktAmtPrevious) - (tktAmtCurrent)) / (tktAmtPrevious) * 100 : ((tktAmtCurrent) - (tktAmtPrevious)) / (tktAmtCurrent) * 100

    this.tickets = {
      title: "Average Ticket",
      amount: isNaN(current?.avgTkt?.toFixed(2)) ? "0.00" : current?.avgTkt?.toFixed(2) || "0.00",
      amount_without_iva: current.order_info?.total_amount ? (Number(current.order_info?.total_amount || "0.00") / Number(current?.count || "0")).toFixed(2) : "0.00",
      info: { percent: Number(amtTkt || "0.0")?.toFixed(2), financial_stmt: stmtTkt, prev_amount: previous?.avgTkt?.toFixed(2) || "0.00" },
      info_wo_iva: { percent: Number(amtTkt_wo_iva || "0.00")?.toFixed(2), financial_stmt: stmtTkt_wo_iva, prev_amount: isNaN(Number(tktAmtPrevious || 0.00)) ? "0.00" : Number(tktAmtPrevious || 0.00)?.toFixed(2) || "0.00" },
    }

  }
  WithIvaSelected = true
  toggle(event: any) {
    this.WithIvaSelected = event.checked
  }
}
