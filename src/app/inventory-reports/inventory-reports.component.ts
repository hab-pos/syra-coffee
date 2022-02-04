import { Component, OnInit,AfterViewInit,ViewChild ,HostListener} from '@angular/core';
import {APIServices} from "../APIServices/api-services"
import {CommonService} from "../common.service"
import { faEdit} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-inventory-reports',
  templateUrl: './inventory-reports.component.html',
  styleUrls: ['./inventory-reports.component.scss']
})
export class InventoryReportsComponent implements OnInit,AfterViewInit {
  faEdit = faEdit
  Pagewidth: number = 0
  selectedIndex = 0
  @ViewChild('sidenav') sidenav: any;

  constructor(private commonService : CommonService, private apiService : APIServices) { 
    this.Pagewidth = window.innerWidth
    this.commonService.select_branch.subscribe((_ : any) => {
      this.initBranchList()
    })
    this.commonService.choose_date.subscribe((dates : any) => {
      this.selected_dates = dates
      this.initBranchList()
    })
    this.commonService.SuccessEditCoffeeCount.subscribe(() => {
      this.getAllRecords()
    })
  }
  push(){
    console.log("opened");
    
    this.commonService.EditReport.emit()
  }
  close(){
    console.log("closed");
  }

  openSidebar(row : any){
    this.selectedIndex = row
    this.sidenav.toggle()
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.Pagewidth = window.innerWidth;
  }
  @ViewChild("table") table : any 
  @ViewChild("loader",{ static: false }) loader : any
  tableData : any[] = []
  masterFilterId = ""
  isLoading = false
  selected_dates : any = null
  display_coloumns = ["week","weekly_shippling","week_start","total_stock","final_remaining","total_consumption","edit"]
  ngOnInit(): void {
    
  }

  ngAfterViewInit(){
    this.loader.nativeElement.style.width = this.table.nativeElement.clientWidth + 'px'
    this.initBranchList()
  }
 

  initBranchList(){
    console.log(localStorage.getItem('selectedBranch'))
    let id = localStorage.getItem('selectedBranch') != undefined &&  localStorage.getItem('selectedBranch') != null ? JSON.parse(localStorage.getItem('selectedBranch') || "")._id : "syra-all"
    this.selected_dates = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    this.masterFilterId = id == "syra-all" ? null : id

    console.log(this.masterFilterId,"one more final");
    
    if(this.masterFilterId == null){
      this.tableData = []
    }
    else{
      if(this.selected_dates != null){
        this.get_filtered_records()
      }
      else{
        this.getAllRecords()
      }
    }
  }

  getAllRecords()
  {
    this.isLoading = true
    this.apiService.get_inventory_reports({branch_id : this.masterFilterId}).subscribe((res : any) => {
      this.isLoading = false
      this.tableData = res.data || []
      console.log(res.data)
    })
  }
  get_filtered_records(){
    this.isLoading = true
    this.apiService.ger_inventory_reports_filtered({selected_date : this.selected_dates,branch_id : this.masterFilterId}).subscribe((res : any) => {
      this.isLoading = false
      this.tableData = res.data || []
      console.log(res.data)
    })
  }
  getInventoryReports(page : Number){
    console.log(page);
  }
}
