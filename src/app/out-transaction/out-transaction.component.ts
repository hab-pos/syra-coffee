import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import {APIServices} from "../APIServices/api-services"
import {CommonService} from "../common.service"

@Component({
  selector: 'app-out-transaction',
  templateUrl: './out-transaction.component.html',
  styleUrls: ['./out-transaction.component.scss']
})
export class OutTransactionComponent implements OnInit,AfterViewInit {
  datesSelected : any = null
  branchSelected : any = null
  
  constructor(private apiService : APIServices,private commonServices : CommonService) { 

    this.commonServices.choose_date.subscribe((selectedDates : any) => {
      this.datesSelected = selectedDates
      this.search(this.datesSelected,this.branchSelected)
    })
    this.commonServices.select_branch.subscribe((selectedBranch : any) => {
      this.branchSelected = selectedBranch
      this.search(this.datesSelected,this.branchSelected)
    })
  }

  current = 1;
  totalPages = 1;
  pages: any
  endPage = 1;
  startPage = 1;
  isLoading = false
  tableData : any = []
  @ViewChild("table") table : any
  @ViewChild("loader",{ static: false }) loader : any

  
  displayed_coloumns = ["date","reason","user","vat","total","payment_mode","invoice_number"]
  ngOnInit(): void {
    this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(i => this.startPage + i);
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
      this.get_out_txns()
    }
  }
  get_transactions(page : Number){
    console.log(page);
  }

  search(selectedDate : any,selectedBranch : any)
  {
    let branch =  selectedBranch != null && selectedBranch != undefined && selectedBranch.length > 0 ? selectedBranch?.map(function (element: any) { return element._id }) : null
    this.isLoading = true
    console.log({branch : branch, dates : selectedDate})
    this.apiService.filter_transactions({branch : branch, dates : selectedDate}).subscribe(res => {
      this.tableData = res.data
      this.isLoading = false
    })
  }
  get_out_txns(){
    this.isLoading = true
    this.apiService.get_out_transactions(null).subscribe(res => {
      this.tableData = res.data.transaction
      this.isLoading = false
    })
  }
}
