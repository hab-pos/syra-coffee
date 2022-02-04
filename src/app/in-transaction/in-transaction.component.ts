import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { APIServices } from '../APIServices/api-services';
import {CommonService} from "../common.service"
export interface InTransaction {
  _id: String;
  date: String;
  time: String;
  time_elapsed: String;
  user: String;
  status: String;
  total: String
  items: { product: String, price: Number, qty: Number }[]
}

@Component({
  selector: 'app-in-transaction',
  templateUrl: './in-transaction.component.html',
  styleUrls: ['./in-transaction.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class InTransactionComponent implements OnInit,AfterViewInit {

  current = 1;
  totalPages = 1;
  pages: any
  endPage = 1;
  startPage = 1;

  datesSelected : any = null
  branchSelected : any = null

  expandedElement: any | null;
  tableData: any = []
  display_coloumns = ["_id", "date_of_transaction", "hour", "time_elapsed", "barista_id", "status", "total_amount"]
  display_headers = ["#", "FECHA", "HORA", "TIEMPO TRANSCURRIDO", "USARIO", "ESTADO", "SUMA TOTAL"]
  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
  isLoading = false
  @ViewChild("table") table : any
  @ViewChild("loader",{ static: false }) loader : any
  constructor(private apiServices : APIServices, private commonServices : CommonService) { }

  ngOnInit(): void {
    this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(i => this.startPage + i);
  }
  get_transactions(page: Number) {
    console.log(page);
  }

  ngAfterViewInit(){
    this.loader.nativeElement.style.width = this.table.nativeElement.clientWidth + 'px'
    this.branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.datesSelected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null

    if(this.branchSelected != null || this.datesSelected != null)
    {
      this.search(this.datesSelected,this.branchSelected)
    }
    else{
      this.get_intxns()
    }

    this.commonServices.choose_date.subscribe((selectedDates : any) => {
      this.datesSelected = selectedDates
      this.search(this.datesSelected,this.branchSelected)
    })
    this.commonServices.select_branch.subscribe((selectedBranch : any) => {
      this.branchSelected = selectedBranch
      this.search(this.datesSelected,this.branchSelected)
    })
  }

  generateToolTip(name : any,price : any,type : any,have_discount : any){
    if(have_discount == 1){
      let sign = type == "euro" ? "€" : "%"
      return name + " : "+ price + " "+ sign
    }
    else{
     
      return null
    }
   
  }
  search(selectedDate : any,selectedBranch : any)
  {
    let branch =  selectedBranch != null && selectedBranch != undefined && selectedBranch.length > 0 ? selectedBranch?.map(function (element: any) { return element._id }) : null
    this.isLoading = true
    this.apiServices.filter_in_transactions({branch : branch, dates : selectedDate}).subscribe(res => {
      this.tableData = res.data
      this.isLoading = false
    })
  }

  get_intxns(branch_id : any = null){
    this.isLoading = true
    let branch =  this.branchSelected != null && this.branchSelected != undefined && this.branchSelected.length > 0 ? this.branchSelected?.map(function (element: any) { return element._id }) : null

    this.apiServices.getTxnIn({branch_id : branch}).subscribe(txns => {
      this.isLoading = false
      if(txns.success)
      {
        this.tableData = txns.data
      }
      else{
        this.commonServices.showAlert(txns.message)
      }
    })
  }
  calculatePrice(qty : any,price : any,iva : any){
    let pricePerQty = Number(qty) * Number(price)
    return pricePerQty 
  }
  showDiscount(total_price : any,discount_data : any ){
    let couponAmount = 0

    discount_data.forEach((element : any) => {
      if(element.type == "euro")
      {
          couponAmount += Number(element.amount)
      }
      else{
          couponAmount += (Number(total_price) * Number(element.amount) / 100)
      }
    });     
    return total_price < couponAmount ? total_price : couponAmount.toFixed(2)
  }
  showDiscountFormat(data : any){
    let sign = (data.discount_type == "euro") ? "€" : "%"
    return "(" + data.discount_price + sign + ")"
  }

}