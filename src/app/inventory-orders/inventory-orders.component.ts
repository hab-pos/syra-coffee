import { Component, OnInit, HostListener, ViewChild, AfterViewInit, Input,ChangeDetectorRef } from '@angular/core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { APIServices } from '../APIServices/api-services';
import { CommonService } from '../common.service';
import * as _ from "lodash";
import * as XLSX from "xlsx";
import * as moment from 'moment';
export var subscription: any = null

export interface InventoryOrders {
  date_time: String;
  order_source: String;
  ordered_by: String;
  recieved_by: String;
  date_delivered: String;
  product_ordered: String;
  status: String;
}
@Component({
  selector: 'app-inventory-orders',
  templateUrl: './inventory-orders.component.html',
  styleUrls: ['./inventory-orders.component.scss']
})
export class InventoryOrdersComponent implements OnInit,AfterViewInit {
  @ViewChild("table") table: any
  @ViewChild("loader", { static: false }) loader: any
  current = 1;
  totalPages = 1;
  pages: any
  endPage = 1;
  startPage = 1;
  row: number;
  status: String = '';
  isLoading = false
  field: string = '';
  show_product_popup: any
  close_pop_up: any
  public innerWidth: any;
  @ViewChild('sidenav') sidenav: any;
  createOrder : Boolean = false
  dates: any = null
  subscribtion: any = null
  loadsh = _
  orderInfoByPopUp : any = null
  reorder : boolean = false
  currentTime : any
  data:any=10
  orderedProductsFromAddInventory : any = []
  ngAfterViewInit() {
    this.loader.nativeElement.style.width = this.table.nativeElement.clientWidth + 'px'
    this.enableSubscription()
  }
  url_array: any = []
  constructor(private common_service: CommonService, private apiServices: APIServices,private ref : ChangeDetectorRef) {
  }

enableSubscription(){
  this.common_service.reOrderSuccess.subscribe(( reorder :any) =>{
    if(reorder ==  true){
      this.initalize(reorder)
    }
  })
  this.common_service.commonEmitter.subscribe((_: any) => {
    this.currentTime = moment().format("HH:mm:ss")
    console.log(this.currentTime)
    this.data = 20
    let idList: any = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    let masterFilterId = (idList?.length || 0) == 0 ? null : idList?.map(function (element: any) { return element._id })
    masterFilterId = idList?.length == 0 ? null : masterFilterId
    let masterFilteDate = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null

    if (masterFilterId != null && masterFilteDate != null) {
      this.filter_order_dates_branch(masterFilteDate, masterFilterId)
    }
    else {

      if (masterFilterId == null && masterFilteDate == null) {
        this.get_orders()
      }
      else if (masterFilteDate == null) {
        this.filter_orders_branches(masterFilterId)
      }
      else {
        this.filter_order_dates(masterFilteDate)
      }
    }
  })
    this.common_service.choose_date.subscribe((res: any) => {
      this.selectedRowsForReport = []
      let idList: any = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
      let masterFilterId = idList?.map(function (element: any) { return element._id })
      masterFilterId = idList?.length == 0 ? null : masterFilterId

      this.dates = res
      if (masterFilterId?.length == 0) {
        this.filter_order_dates(res)
      }
      else {
        this.filter_order_dates_branch(res, masterFilterId)
      }
    })

    this.common_service.url_updated.subscribe((date: any) => {
      this.url_array = date
    })

    this.common_service.exportClicked.subscribe((_: any) => {
      if (this.url_array[1] == "products" && this.url_array[2] == "inventory-orders") {
        let data = this.loadsh.map(this.inventory_orders, (o: any) => this.loadsh.pick(o, ['created_date', 'branch_info.branch_name', 'ordered_by_details.barista_name', 'recieved_by_details.barista_name', 'delivered_date', 'number_of_products', 'status']));
        this.downloadFile(data)
      }

    })

    this.common_service.select_branch.subscribe((value: any) => {
      this.selectedRowsForReport = []
      let idList: any = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
      let masterFilterId = idList?.map(function (element: any) { return element._id })
      masterFilterId = idList.length == 0 ? null : masterFilterId
      this.dates = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null

      console.log(this.dates,masterFilterId)
      if (this.dates != null && this.dates != undefined) {
        if (masterFilterId?.length == 0) {
          this.filter_order_dates(this.dates)
        }
        else {
          this.filter_order_dates_branch(this.dates, masterFilterId)
        }
      }
      else {
        if (masterFilterId.length == 0) {
          this.get_orders()
        }
        else {
          this.filter_orders_branches(masterFilterId)
        }
      }
    })
  console.log(this.currentTime,"outside")
  this.common_service.openInventoryForm.subscribe((order_data: any) => {
    this.orderInfoByPopUp = order_data
    this.show_product_popup = true;
    console.log(this.show_product_popup)
  })
  this.common_service.closeInventoryForm.subscribe((_: any) => {
    this.close_pop_up = true;
    this.show_product_popup = false;
    console.log(this.close_pop_up)
  })
  this.common_service.updateSyningCountEmitter.subscribe((data : any) => {
    this.orderedProductsFromAddInventory = data
  })
}
  filter_orders_branches(value: any,reOrder : boolean = false) {
    this.isLoading = true
    // if (value?._id == null) {
    //   this.get_orders()
    // }
    // else {
    //   this.apiServices.get_branch_inventory_orders({ branch_id: value }).subscribe(res => {
    //     this.inventory_orders = res.data.order_details
    //     this.isLoading = false
    //     if(reOrder){
    //       this.push()
    //     }
    //   })
    // }
    this.apiServices.get_branch_inventory_orders({ branch_id: value }).subscribe(res => {
      this.inventory_orders = res.data.order_details
      this.isLoading = false
      if(reOrder){
        this.push()
      }
    })
  }
  addOrder(){
    this.createOrder = true
    this.sidenav.toggle()
  }
  filter_order_dates(value: any,reOrder : boolean = false) {
    this.isLoading = true
    this.apiServices.get_branch_inventory_orders({ start: value.start, end: value.end }).subscribe(res => {
      this.inventory_orders = res.data.order_details
      this.isLoading = false
      if(reOrder){
        this.push()
      }
    })
  }

  filter_order_dates_branch(value: any, branch: any,reOrder : boolean = false) {
    this.isLoading = true
    this.apiServices.get_branch_inventory_orders({ start: value.start, end: value.end, branch_id: branch }).subscribe(res => {
      this.inventory_orders = res.data.order_details
      this.isLoading = false
      if(reOrder){
        this.push()
      }
    })
  }
  faPencilAlt = faPencilAlt
  inventory_orders: any = []
  selectedRowsForReport: any = []
  display_coloums = ["date_time", "order_source", "ordered_by", "recieved_by", "date_delivered", "product_ordered", "status", "check", "action"]

  handleSelection(checked: any, index: any) {
    if (checked) {
      this.selectedRowsForReport.push(this.inventory_orders[index])
    }
    else {
      this.selectedRowsForReport.splice(this.selectedRowsForReport.findIndex((item: any) => item._id == this.inventory_orders[index]._id), 1)
    }
    console.log(this.selectedRowsForReport)
  }
  ngOnInit(): void {
    this.initalize()
    this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(i => this.startPage + i);
  }

  initalize(reOrder : any = false){
    this.innerWidth = window.innerWidth;
    let idList: any = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    let masterFilterId: any
    // console.log(idList?._id, "testidlist")
    if (idList?._id) {
      localStorage.setItem('selectedBranch', JSON.stringify([]));
      masterFilterId = null
    }
    else {
      masterFilterId = idList?.map(function (element: any) { return element._id })
      masterFilterId = idList?.length == 0 ? null : masterFilterId
    }
    let masterFilteDate = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null

    // console.log(masterFilterId, "masterFilterId")
    if (masterFilterId != null && masterFilteDate != null) {
      this.filter_order_dates_branch(masterFilteDate, masterFilterId,reOrder)
    }
    else {

      if (masterFilterId == null && masterFilteDate == null) {
        this.get_orders(reOrder)
      }
      else if (masterFilteDate == null) {
        this.filter_orders_branches(masterFilterId,reOrder)
      }
      else {
        this.filter_order_dates(masterFilteDate,reOrder)
      }
    }
  }
  get_orders(reOrder : boolean = false) {
    this.isLoading = true
    this.apiServices.getInventoryOrders(null).subscribe(res => {
      this.inventory_orders = res.data.order_details
      this.isLoading = false
      if(reOrder){
        this.push()
      }
    })
  }
  getIntventoryOrders(page: Number = 1) {
    console.log(page);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }
  openSideBar(field: string, row: number, status: String) {
    this.createOrder = false
    this.field = field;
    this.status = this.inventory_orders[row].status;
    this.row = row;
    this.sidenav.toggle()
  }
  push() {
    this.common_service.inventoryOrder.emit(this.inventory_orders[this.row])
  }
  closed() {
    this.common_service.closedSideNav.emit()
    this.show_product_popup = false
  }

  async downloadFile(data: any) {

    console.log(this.selectedRowsForReport)
    let totalQty = 0
    let totalPrice = 0
    this.selectedRowsForReport = this.selectedRowsForReport.length > 0 ? this.selectedRowsForReport : this.inventory_orders
    let jsonData: any = []
    let branchNameArray: any = []
    jsonData.push({
      Reference: "REFERENCE",
      Name_of_product: "NAME OF PRODUCT",
      Quantity: "QUANTITY",
      Unit: "UNIT",
      Unit_price: "PRICE",
      Total_price: "TOTAL PRICE"
    })
    this.selectedRowsForReport.forEach((element: any, index: any) => {
      element.ordered_items?.forEach((element_json: any) => {
        let data = {
          Reference: element_json.refernce,
          Name_of_product: element_json.inventory_name,
          Quantity: element_json.qty,
          Unit: element_json.unit,
          Unit_price: element_json.price,
          Total_price: element_json.qty * Number(element_json.price),
        }
        let array = jsonData.map(function (e: any) { return e.Reference; })
        totalQty += element_json.qty
        totalPrice += (element_json.qty * Number(element_json.price))
        if (array.includes(element_json.refernce)) {
          let index = array.indexOf(element_json.refernce);
          jsonData[index].Quantity += element_json.qty
          jsonData[index].Total_price += (element_json.qty * Number(element_json.price))
        }
        else {
          jsonData.push(data)
        }
        if (!branchNameArray.includes(element.branch_info.branch_name)) {
          branchNameArray.push(element.branch_info.branch_name)
        }
      });
    });
    jsonData.push({
      Reference: "",
      Name_of_product: "",
      Quantity: "",
      Unit: "",
      Unit_price: "",
      Total_price: ""
    })
    jsonData.push({
      Reference: "TOTAL",
      Name_of_product: "",
      Quantity: totalQty,
      Unit: "",
      Unit_price: "",
      Total_price: totalPrice
    })

    let branchName = branchNameArray.join(',')

    console.log(jsonData, branchName);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData)

    XLSX.utils.book_append_sheet(wb, ws, "SYRA__INVENTORY_REPORT");
    XLSX.utils.sheet_add_aoa(ws, [
      [branchName, "", "", "", "", ""]
    ], { origin: 0 });

    XLSX.writeFile(wb, branchName + "INVENTORY-REPORT_" + moment().format("DD-MM-YYYY") + ".xls");

    this.common_service.export_success.emit()
  }
}
