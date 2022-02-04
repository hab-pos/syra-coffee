import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { faMinus, faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { close } from '../../account-configurations/account-from/account-from.component';
import { CommonService } from '../../common.service';
import {APIServices} from '../../APIServices/api-services'
declare var require: any
var FileSaver = require('file-saver');
@Component({
  selector: 'app-inventory-order-form',
  templateUrl: './inventory-order-form.component.html',
  styleUrls: ['./inventory-order-form.component.scss']
})
export class InventoryOrderFormComponent implements OnInit {
 
  @ViewChild("textarea") textarea : any

  close = close
  plus = plus
  minuss = minuss
  faPlusCircle = faPlus
  faMinusCircle = faMinus  
  
  @Input() sidenav: any;
  @Input() field: any;
  @Input() status: any;
  @Input() row: any;
  quantity: number
  isLoadingAccept = false
  isLoadingDecline = false
  isLoadingSavePdf = false
  isMarkDeliverdLoding = false
  table: object[] = [
    {
      refer_name: 'string',
      product_name: 'string',
      quantity: 'number',
      unit: 'string',
    }
  ]
  @ViewChild('tableView') tableView: any;

  order_info : any = new Object()
  products  : any = []

  totalQty = 0
  constructor(public common_service: CommonService,private apiServices : APIServices) { }

  ngOnInit(): void {
    this.common_service.closedSideNav.subscribe((_ : any) => {      
      this.order_info = null
      this.products =  []
      this.totalQty = 0

    })
    this.common_service.inventoryOrder.subscribe((response : any) => {
      this.totalQty = 0
      this.order_info = response
      this.products =  this.order_info?.ordered_items
      this.products?.forEach((element : any) => {
        this.totalQty += element.qty
      });
    })

    this.common_service.updateInventoryOrderFrom.subscribe((data : any) => {
      this.order_info.ordered_items = data
      this.totalQty = 0
      this.products = data
      this.products?.forEach((element : any) => {
        this.totalQty += element.qty
      });
    })
  }
  add(row: number) {
    if(this.order_info.status != "approved" && this.order_info.status != "delivered"){
      this.products[row].qty += 1
      this.totalQty += 1
    }
  }
  minus(row: number) {
    if(this.order_info.status != "approved" && this.order_info.status != "delivered"){
      if (this.products[row].qty > 0) {
        if(this.products[row].qty == 1)
        {
          if(this.products.length > 1)
          {
            this.products.splice(row,1)
            this.totalQty -= 1
          }
          else{
            this.common_service.showAlert("You should have atleaset one product!")
          }
        }
        else{
          this.products[row].qty -= 1
          this.totalQty -= 1
        }
      }
    }
  }
  declineAction(){
    this.isLoadingDecline = true
    let request : any = new Object()
    request.id = this.order_info._id
    request.status = "declined"
    request.admin_msg = this.textarea.nativeElement.value

    this.apiServices.updateInventoryOrder(request).subscribe((res : any) => {
      this.isLoadingDecline = false
      this.common_service.showAlert(res.message)
      if(res.success)
      {
        this.common_service.commonEmitter.emit()
        this.sidenav.close()
      }
    })
  }
  acceptAction(){
    if(this.products.length == 0){
      this.common_service.showAlert("Please choose products!")
    }
    else{
      this.isLoadingAccept = true
      let request : any = new Object()
      request.id = this.order_info._id
      request.status = "approved"
      request.ordered_items = this.products
      request.admin_msg = this.textarea.nativeElement.value
  
      this.apiServices.updateInventoryOrder(request).subscribe((res : any) => {
        this.isLoadingAccept = false
        this.common_service.showAlert(res.message)
        if(res.success)
        {
          this.common_service.commonEmitter.emit()
          this.sidenav.close()
        }
      })
    }
  }
  savePdf(){
    this.isLoadingSavePdf = true
    this.apiServices.downloadInventoryOrder({orderInfo : this.order_info,products : this.products}).subscribe((res: any) => {
      this.isLoadingSavePdf = false
      let url = res.data.url
      console.log(url)
      FileSaver.saveAs(url, res.data.title+".pdf");
    })
  }
  closeSidenav(){
    this.order_info = null
    this.products = null
    this.sidenav.close()
  }
  open_new_nav() {
    this.sidenav.toggle()
  }
  sidenavnew_open(){
  this.common_service.openInventoryForm.emit({data : this.order_info})
  console.log("emitted")
  }
  updateOrderAsDelivered(){
    this.isMarkDeliverdLoding = true
    let reqObj = {
      "id" : this.order_info._id,
      "received_by" : null,
      "reason" : null,
      "mode_of_payment" : "cash",
      "invoice_number" : "",
      "status" : "delivered",
      "ordered_items" : this.order_info?.ordered_items,
    }
    this.apiServices.updateInventoryOrder(reqObj).subscribe(res => {
      this.common_service.showAlert(res.message)
      this.isMarkDeliverdLoding = false
      if(res.success){
        this.sidenav.toggle()
        this.common_service.commonEmitter.emit()
      }
    })
  }
}

export const plus: IconDefinition = {
  prefix: 'fa',
  iconName: 'line',
  icon: [
    512, // SVG view box width
    512, // SVG view box height
    [],
    '', // probably not important for SVG and JS approach
    `M0 0h24v24H0z M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z`,
  ],
} as any;
export const minuss: IconDefinition = {
  prefix: 'fa',
  iconName: 'line',
  icon: [
    512, // SVG view box width
    512, // SVG view box height
    [],
    '', // probably not important for SVG and JS approach
    `M0 0h24v24H0z M19 13H5v-2h14v2z`,
  ],
} as any;
