import { Component, OnInit, ViewChild } from '@angular/core';
import { faList, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { CommonService } from "../common.service"
import { APIServices } from "../APIServices/api-services"
declare var require: any
var FileSaver = require('file-saver');
import { ConfirmComponent } from '../shared/components/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface iva_info {
  _id: String
  percent: number
  color: String
  vat_recovered: number
  bill_before_tax: number
  bill_after_tax: number
}

export interface payment_mode_grouped {
  _id: String
  mode: String
  color: String
  number: number
  turn_over: number
  imported: number
}
@Component({
  selector: 'app-accounting-report',
  templateUrl: './accounting-report.component.html',
  styleUrls: ['./accounting-report.component.scss']
})
export class AccountingReportComponent implements OnInit {

  faList = faList
  faPaperPlane = faPaperPlane
  isLoadingVat = false
  isLoadingpayout = false
  iva_data: any = []
  payment_data: any = []
  display_coloumns_iva = ["percent", "vat_recovered", "bill_before_tax", "bill_after_tax"]
  display_headers_iva = ["IVA", "IVA RECUPERTIDO", "FACTURACION ANTES DE IMPUESTOS", "FACTURACION DESPUES DE IMPUESTOS"]

  display_coloumns_payment = ["mode", "number", "turn_over", "imported"]
  display_headers_payment = ["METODOS DE PAGO", "NUMERO", "PORCENTAJE DE FACTURACION", "IMPORTE"]

  map: Object = 'color'
  tooltip = Object()
  tootip_payout = Object()
  selected_branch : any = null
  selectedDates : any = null
  @ViewChild('vatChart') vatChart: any;
  @ViewChild('Payoutchart') Payoutchart: any;
  loadingSendMail = false
  url_loading = ""
  url : any = []
  constructor(private commonService: CommonService, private apiService: APIServices,private modalService : NgbModal) {
    let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.selected_branch =  branch_list?.map(function(element : any){ return element._id })
    this.selected_branch = this.selected_branch?.length == 0 ? null : this.selected_branch
    this.selectedDates = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    // this.selected_branch = this.selected_branch == "syra-all" ? null : this.selected_branch
    this.get_vat_report()
    this.get_payment_report()

    this.commonService.exportClicked.subscribe(() => {
      if(this.url[1] == "reports" && this.url[2] == "accounting"){
        this.exportAction()
      }
    })
    this.commonService.select_branch.subscribe((branch: any) => {
      this.selected_branch =  branch?.map(function(element : any){ return element._id })
      this.selected_branch = this.selected_branch?.length == 0 ? null : this.selected_branch
      
      this.get_vat_report()
      this.get_payment_report()
    })
    this.commonService.sendMail.subscribe((email : any) => {
     this.exportAction(true,email.email)
    })

    this.commonService.choose_date.subscribe((dates: any) => {
      this.selectedDates = dates
      this.get_vat_report()
      this.get_payment_report()
    })
    this.commonService.url_updated.subscribe((url : any) => {
     this.url = url
    })
  }

  sendReport(){
    this.modalService.open(ConfirmComponent)
  }
  exportAction(sendMAil = false, email = null) {
    let req : any = null
    let branch = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null

    if(sendMAil){
      req = { branch: branch, dates: this.selectedDates, iva_report: this.iva_data, cash_report: this.payment_data, total_cost: this.total_Txn,email :email }
    }
    else{
     req =  { branch: branch, dates: this.selectedDates, iva_report: this.iva_data, cash_report: this.payment_data, total_cost: this.total_Txn }
    }
    this.loadingSendMail = sendMAil == true ?  true : false
    this.apiService.generate_accounting_report(req).subscribe((report: any) => {
      if (report.success) {
        if(sendMAil)
        {
          this.loadingSendMail = false
          this.commonService.showAlert("Mail sent Successfully")
        }
        else{
          let url = report.data.url
          console.log(url)
          FileSaver.saveAs(url, report.data.title+".pdf");
          this.commonService.export_success.emit()
        }
     }
      else {
        this.commonService.showAlert(report.message)
      }
    })
  }
  ngOnInit(): void {
    this.tooltip = {
      enable: true,
      format: '${point.x}% : <b>${point.y}€</b>'
    }
    this.tootip_payout = {
      enable: true,
      format: '${point.x} : <b>${point.y}€</b>'
    }
    this.url_loading = this.apiService.url("/assets/logos/loading.gif")
  }

  get_vat_report() {
    this.isLoadingVat = true
    this.apiService.get_vat_reports({ branch: this.selected_branch, dates: this.selectedDates }).subscribe((report: any) => {
      this.isLoadingVat = false
      if (report.success) {
        this.iva_data = report.data
        //this.vatChart.widget.redraw();
      }
      else {
        this.commonService.showAlert(report.message)
      }
    })
  }

  total_Txn = 0
  get_payment_report() {
    this.isLoadingpayout = true
    this.apiService.get_payment_mode_based_report({ branch: this.selected_branch, dates: this.selectedDates }).subscribe((report: any) => {
      this.isLoadingpayout = false
      if (report.success) {
        report.data.list.forEach((element: any) => {
          if (element.Payment_method == "CASH") {
            element.color = "#ff80e4"
            element.Payment_method = "EFFECTIVO"
          }
          else if (element.Payment_method == "CARD") {
            element.color = "#54A790"
            element.Payment_method = "TARJETA"
          }
          else {

            element.color = "#F18B70"
          }
          element.total_payable_str = element.total_payable.toFixed(2)
        });
        this.total_Txn = report.data.entiremount.EntireTxnThisMonth
        this.payment_data = report.data.list
        //this.Payoutchart.widget.redraw();
      }
      else {
        this.commonService.showAlert(report.message)
      }
    })
  }

  getTotalCost(option: String, ispayment: Boolean = true) {
    var ans = 0
    switch (option) {
      case 'number':
        ans = ispayment ? this.payment_data.map((t: any) => t.count).reduce((acc: any, value: any) => acc + value, 0) : this.iva_data.map((t: any) => Number(t.tax_amount)).reduce((acc: any, value: any) => Number(acc) + Number(value), 0)
        break
      case 'turnover':
        ans = ispayment ? this.payment_data.map((t: any) => (t.total_payable / this.total_Txn * 100)).reduce((acc: any, value: any) => acc + value, 0) : this.iva_data.map((t: any) => Number(t.total_without_tax)).reduce((acc: any, value: any) => acc + value, 0)
        break
      case 'imported':
        ans = ispayment ? this.payment_data.map((t: any) => t.total_payable).reduce((acc: any, value: any) => acc + value, 0) : this.iva_data.map((t: any) => Number(t.total_with_tax)).reduce((acc: any, value: any) => acc + value, 0)
        break
      default:
        break
    }
    return ans
  }
}
