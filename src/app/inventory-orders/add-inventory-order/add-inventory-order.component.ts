import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { close } from '../../account-configurations/account-from/account-from.component';
import { faPlus,faMapMarkerAlt,faChevronDown,faMinus } from '@fortawesome/free-solid-svg-icons';
import { CommonService } from 'src/app/common.service';
import * as moment from 'moment';
import { APIServices } from 'src/app/APIServices/api-services';
@Component({
  selector: 'app-add-inventory-order',
  templateUrl: './add-inventory-order.component.html',
  styleUrls: ['./add-inventory-order.component.scss']
})
export class AddInventoryOrderComponent implements OnInit {
  faPlus = faPlus
  faMapMarkerAlt = faMapMarkerAlt
  faChevronDown = faChevronDown
  faMinus = faMinus
  selected_branch = ""
  createOrderNessaryData : any = null
  branch_list: any = []
  @ViewChild('dropDown') dd: any;
  selectedRow = -1
  constructor(private common_service : CommonService,private apiService : APIServices) { 
    this.common_service.CreateInvOrderFromAdminDataFetcher.subscribe((data : any) => {
      this.products = data.products.filter((data : any) => {
        return Number(data.qty) != 0
      })
      console.log(this.products)
      this.totalQty = this.products.map((item : any) => Number(item?.qty)).reduce(function(previousValue : any, currentValue : any){
        return Number(previousValue) + Number(currentValue);
      }, 0);

      this.common_service.updateSyningCountEmitter.emit(this.products)
    })
  }
  @Input() sidenav: any;
  isLoading : Boolean = false
  close = close
  products : any = []
  totalQty : any = 0
  today : String =  moment().format("DD-MM-YYYY - HH : mm")
  branches : any = []
  selectedValue : any = null

  @ViewChild('textarea') textarea: any;

  ngOnInit(): void {
    this.get_Branches()
    this.common_service.closedSideNav.subscribe((_ : any) => {      
      this.branch_list = []
      this.products =  []
      this.totalQty = 0
      this.dd.options.forEach((item: any) => item.deselect());
    })
  }
  get_Branches() {
    this.apiService.get_branch({}).subscribe(res => {
      this.branches = res.data.branch_list
      let item: any = { branch_name: "All branches", device_id: "", _id: "syra-all" }
      this.branches.unshift(item)
      this.selectedValue = []
    })
  }
  createOrder(){
    console.log("success", this.branch_list)
    let selected_beanch_ids = this.branch_list.map((data : any) => data._id)
    if(selected_beanch_ids.length == 0){
      this.common_service.showAlert("Please select the branch")  
    }
    else if(this.products.length == 0){
      this.common_service.showAlert("Please choose the products")  
    }
    else{
      let reqObj = {
        branch_list : selected_beanch_ids,
        admin_msg : this.textarea.nativeElement.value,
        data : this.products,
        number_of_products : this.products.length
      }
      this.isLoading = true
      this.apiService.reOrderInventory(reqObj).subscribe(res => {
        this.isLoading = false
        if(res.success){
          this.common_service.reOrderSuccess.emit(true)
          this.sidenav.toggle()
        }
        else{
          this.common_service.showAlert(res.message)
        }
      })
    }
  }
  closeSidenav(){
    this.sidenav.toggle()
  }
  select_branch(row: any) {

    this.selectedRow = row
    console.log(this.branches[row]._id, this.branch_list.length);

    if (this.branches[row]._id == "syra-all") {
      if (this.branch_list.length == 0) {
        this.branch_list = this.branches.map(function (element: any) { return element })
        this.branch_list.splice(0, 1) //to remove all-branches obj in list
      }
      else {
        if (this.branch_list.length == this.branches.length - 1) {
          this.branch_list = []
        }
        else {
          this.branch_list = this.branches.map(function (element: any) { return element })
          this.branch_list.splice(0, 1) //to remove all-branches obj in list
        }
      }
      this.toggleAllSelection()
    }
    else {
      let index = this.branch_list.map(function (element: any) { return element._id; }).indexOf(this.branches[row]._id);
      if (index >= 0) {
        this.branch_list.splice(index, 1);
      }
      else {
        this.branch_list.push(this.branches[row])
      }

      if (this.branch_list.length < this.branches.length - 1) {
        this.dd.options.forEach((item: any, index: any) => {
          if (index == 0) {
            item.deselect()
          }
        })
      }
      if (this.branch_list.length == this.branches.length - 1) {
        this.dd.options.forEach((item: any, index: any) => {
          if (index == 0) {
            item.select()
          }
        })
      }
    }

    console.log(this.branch_list)
  }

  allSelected = true
  toggleAllSelection() {
    this.allSelected = this.branch_list.length == this.branches.length - 1 // to control select-unselect
    console.log(this.dd, 123)
    if (this.allSelected) {
      this.dd.options.forEach((item: any) => item.select());
    } else {
      this.dd.options.forEach((item: any) => { item.deselect() });
    }
  }
  add(row: number) {
    this.products[row].qty += 1
    this.totalQty += 1
    this.common_service.syncProductQuantity.emit(this.products[row])
  }
  minus(row: number) {
    if (this.products[row].qty > 0) {
      this.products[row].qty -= 1
      this.totalQty -= 1
      this.common_service.syncProductQuantity.emit(this.products[row])
    }

    if(this.products[row].qty == 0){
      this.products.splice(row,1)
    }
  }
  sidenavnew_open(){
    this.createOrderNessaryData = {
      branch_id : this.selected_branch,
      admin_msg : this.textarea.nativeElement.value,
    }
    this.common_service.openInventoryForm.emit(null)
    // this.common_service.updateSyningCountEmitter.emit(this.products)
    console.log("emitted")
  }  
}
