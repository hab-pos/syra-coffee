import { Component, OnInit,HostListener, AfterViewInit,ViewChild } from '@angular/core';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import {APIServices} from "../APIServices/api-services"
import{CommonService} from "../common.service"
export interface DiscountUsage {
  number: Number
  user: String
  commentry: String
  imported: Number
}

export interface vat_report {
  color: string
  title: String
  price: Number
}
export interface user_report {
  color: string
  name: String
  price: Number
}
@Component({
  selector: 'app-control-report',
  templateUrl: './control-report.component.html',
  styleUrls: ['./control-report.component.scss']
})
export class ControlReportComponent implements OnInit,AfterViewInit {

  constructor(private commonServices : CommonService, private apiService : APIServices) { }
  datesSelected : any = null
  branchSelected : any = null

  isLoadingVat = false
  isLoadingPayout = false
  isLoadingUsage = false
  isLoadingComparsion = false
  faArrowDown = faArrowDown
  discountUsage: any = []
  vat_report_table_data: any= []
  user_report_data: any= []
  compariosn : any = null
  display_coloumns = ["number", "user", "commentry", "imported"]
  display_headers = ["NOMBRE", "USUARIO", "COMENTARIO", "IMPORTE"]
  display_col_vat = ["color_name", "price"]
  barista_color : Object =  'barista_info.color'
  discount_color : Object = 'discount_info.color'
  tooltipSettings = Object()
  tooltipUsers = Object()
  @ViewChild("table") table : any
  @ViewChild("loader",{ static: false }) loader : any
  ngAfterViewInit(){
    this.loader.nativeElement.style.width = this.table.nativeElement.clientWidth + 'px'
    let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.branchSelected =  branch_list?.map(function(element : any){ return element._id })
    this.branchSelected = this.branchSelected?.length == 0 ? null : this.branchSelected   

    this.datesSelected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    this.get_discounts_grouped(this.branchSelected,this.datesSelected)
    this.commonServices.choose_date.subscribe((selectedDates : any) => {
      this.datesSelected = selectedDates
      this.get_discounts_grouped(this.branchSelected,this.datesSelected)
    })
    this.commonServices.select_branch.subscribe((selectedBranch : any) => {
      let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
      this.branchSelected =  branch_list?.map(function(element : any){ return element._id })
      this.branchSelected = this.branchSelected?.length == 0 ? null : this.branchSelected   
      this.get_discounts_grouped(this.branchSelected,this.datesSelected)
    })

  }

  ngOnInit(): void {
    this.tooltipSettings = {
      enable: true,
      format: '${point.x} : <b>${point.y}€</b>'
    }

    this.tooltipUsers = {
      enable: true,
      format: '${point.x} <b>${point.y}€</b>'
    }
    this.Pagewidth = window.innerWidth
  }

  get_discounts_grouped(branch : any,dates : any){
    this.userFiltered(branch,dates)
    this.discountFilterd(branch,dates)
    this.userAndDiscountFiltered(branch,dates)
    this.getComparison(branch,dates)
  }
  userFiltered(branch : any,dates : any){
    this.isLoadingPayout= true
    this.apiService.get_discount_report_user({branch : branch,dates : dates}).subscribe((response) => {
      this.isLoadingPayout = false
      this.user_report_data = response.data
      this.user_report_data.forEach((element :any) => {
        element.total_discount = element.total_discount.toFixed(2)
      });
    })
  }
  discountFilterd(branch : any,dates : any){
    this.isLoadingVat = true
    this.apiService.get_discount_report_coupon({branch : branch,dates : dates}).subscribe((response) => {
      this.vat_report_table_data = response.data
      this.isLoadingVat = false
      this.vat_report_table_data.forEach((element :any) => {
        element.total_discount = element.total_discount.toFixed(2)
      });
    })
  }
  userAndDiscountFiltered(branch : any,dates : any){
    this.isLoadingUsage = true
    this.apiService.get_discount_report_user_coupon({branch : branch,dates : dates}).subscribe((response) => {
      this.isLoadingUsage = false
      this.discountUsage = response.data
    })
  }
  getComparison(branch : any,dates : any){
    this.isLoadingComparsion = true
    this.apiService.get_discount_comparison({branch : branch,dates : dates}).subscribe((response) => {
      this.isLoadingComparsion = false
      this.compariosn = response.data
    })
  }
  Pagewidth : number = 0;
  @HostListener('window:resize', ['$event'])
  onResize(event :any) {
    this.Pagewidth = window.innerWidth;
  }

  getTotalCost(isVat : Boolean = true) {
    var ans = 0
    ans = isVat ? this.vat_report_table_data.map((t : any) => Number(t.total_discount)).reduce((acc : any, value : any) => acc + value, 0) : this.user_report_data.map((t : any) => Number(t.total_discount)).reduce((acc : any, value : any) => Number(acc) + Number(value), 0)
    return ans
  }
}
