import { Component, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router"
import { faPencilAlt, faPlusCircle, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { APIServices } from "../APIServices/api-services"
import { CommonService } from '../common.service'

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements AfterViewInit {

  constructor(private router: Router, private activeRoute: ActivatedRoute, private apiServices: APIServices, private commonService: CommonService) {
    this.Pagewidth = window.innerWidth

    this.getCategoryList()
    this.getModifierList()
    this.getProductsList()

    this.commonService.UserCategorySuccess.subscribe((_: any) => {
      this.getCategoryList()
    })
    this.commonService.ModifierSuccess.subscribe((_: any) => {
      this.getModifierList()
    })

    this.commonService.UserproductSuccess.subscribe((_:any)  => {
      console.log("consoleing")
      this.getProductsList()
    })
  }
  @ViewChild('table') table: MatTable<any>
  @ViewChild('products_table') ProductsTable: MatTable<any>
  @ViewChild('sidenav') sidenav: any;
  @ViewChild('tablerow') tablerow: any;



  Pagewidth: number = 0
  faPlusCircle = faPlusCircle
  faPencilAlt = faPencilAlt
  faArrowsAlt = faArrowsAlt
  field: string = '';
  action: string = '';
  selectedRow: any = -1
  selectedCategoryRow = -1
  category: any = []
  selectedRowToHighLight = -1
  sideMenuOpend = false
  modifiers: any = []
  products: any = [
    // { product_name : "Espresso"},
    // { product_name : "Cartado"},
    // { product_name : "Latte/cappucino"},
    // { product_name : "Flat White"},
    // { product_name : "Brownie"},
    // { product_name : "Banana Bread"},
    // { product_name : "Ginger Bread"},
    // { product_name : "Apple Pie"},
    // { product_name : "Banana pudding"},
  ]
  sideMenuClosing = true
  isChangingStatus = true
  allProducts: any = [] //for filtering purpose
  isLoadingProduct = false
  isLoadingCategory = false
  isLoadingModifiers = false
  display_col_category = ["name_color", "action"]

  paramsFromParent: ParamMap
  masterFilterId: any = null
  changingStatus = false
  ngAfterViewInit() {
    console.log("success")
  }

  getCategoryList(){
    this.isLoadingCategory = true
    this.apiServices.getUserCategories().subscribe(response => {
      this.category = response.data?.category != null ? JSON.parse(JSON.stringify(response.data?.category)) : []
      console.log(this.category)
      this.isLoadingCategory = false
    })
  }

  getModifierList(){
    this.isLoadingModifiers = true
    this.apiServices.getModifiers({}).subscribe(response => {
      this.modifiers = response.data != null ? JSON.parse(JSON.stringify(response.data)) : []
      this.isLoadingModifiers = false
    })
  }
  backup_products : any = []
  getProductsList(){
    this.isLoadingProduct = true
    this.apiServices.getUserProducts().subscribe(response => {
      this.products = response.data != null ? JSON.parse(JSON.stringify(response.data)) : []
      this.backup_products = this.products
      this.isLoadingProduct = false
    })
  }
  onCategoryStatusChange(row: any) {
    this.changingStatus = true
    this.isLoadingCategory = true
    this.apiServices.updateOnlineStatus({_id : this.category[row]._id,is_Active : !this.category[row].is_Active}).subscribe((response:any) => {
      this.isLoadingCategory = false
      this.category[row].is_Active = !this.category[row].is_Active
      this.commonService.showAlert(response.message)
    })
  }

  onModifierStatusChange(row: any){
    this.changingStatus = true
    this.isLoadingModifiers = true
    this.apiServices.updateModifierStatus({_id : this.modifiers[row]._id,is_Active : !this.modifiers[row].is_Active}).subscribe((response:any) => {
      this.isLoadingModifiers = false
      this.modifiers[row].is_Active = !this.modifiers[row].is_Active
      this.commonService.showAlert(response.message)
    })
  }
  onProductStatusChange(row: any) {
    this.changingStatus = true
    this.isLoadingProduct = true
    this.apiServices.updateProductsOnlineStatus({_id : this.products[row]._id,is_Active : !this.products[row].is_Active}).subscribe((response:any) => {
      this.isLoadingProduct = false
      this.products[row].is_Active = !this.products[row].is_Active
      this.commonService.showAlert(response.message)
    })  }

  dropTable(event: CdkDragDrop<any>) {
      const prevIndex = this.category.findIndex((d: any) => d === event.item.data);
      moveItemInArray(this.category, prevIndex, event.currentIndex);
      this.table.renderRows();
    
      for (let index = 0; index < this.category.length; index++) {
        this.category[index].order = index        
      }
      this.selectedRowToHighLight = -1
      this.updateCategoryOrders()
  }

  updateCategoryOrders(){
    this.isLoadingCategory = true
    this.apiServices.reOrderUserCategory({ list : this.category}).subscribe((response:any) => {
      this.isLoadingCategory = false
      this.commonService.showAlert(response.message)
    })
  }
  dropProducts(event: CdkDragDrop<any>) {
      const index = this.products.findIndex((d: any) => d === event.item.data);
      moveItemInArray(this.products, index, event.currentIndex);
      this.ProductsTable.renderRows()
      for (let index = 0; index < this.products.length; index++) {
        this.products[index].order = index        
      }
      this.updateProductOrders()
  }
  updateProductOrders(){
    this.isLoadingProduct = true
    this.apiServices.reOrderUserProducts({ list : this.products}).subscribe((response:any) => {
      this.isLoadingProduct = false
      this.commonService.showAlert(response.message)
    })
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.Pagewidth = window.innerWidth;
  }
  openSideBar(field: string, action: string, row: number = -1) {
    this.isChangingStatus = true
    this.sideMenuOpend = true
    this.field = field;
    this.action = action;
    this.selectedRow = row
    this.sidenav.toggle()
  }
  push() {
    if (this.field == 'category') {
      console.log("success",this.category[this.selectedRow],this.selectedRow)
      this.commonService.UserCategorypopUpopend.emit(this.action == 'edit' ? this.category[this.selectedRow] : null)
    }
    else if(this.field == 'modifier'){
      console.log(this.selectedRow,"tsttow")
      this.commonService.ModifierCategorypopUpopend.emit(this.action == 'edit' ? this.modifiers[this.selectedRow] : null)
    }
    else {
      this.commonService.UserProductpopUpopend.emit(this.action == 'edit' ? this.products[this.selectedRow] : null)
    }
  }

  loadProductForSpecificCategory(row: any, event: any) {
    if(this.changingStatus == false && this.sideMenuOpend == false){
      event?.preventDefault()
      event?.stopPropagation()
      this.selectedRowToHighLight = this.selectedRowToHighLight == row ? this.sideMenuOpend ? row : -1 : row
      if(this.selectedRowToHighLight != -1){
        let category_list = this.category
        let selected_cat_row = this.selectedRowToHighLight
        this.products = this.backup_products.filter(function(item : any)
        {
         return item.category == category_list[selected_cat_row]._id;
        });
      }
      else{
        this.products =  this.backup_products
      }
      console.log("Will work")
    }
    else{
      console.log("Willnot work")
    }
    this.changingStatus = false    
  }
  close() {
    this.sideMenuClosing = true
    this.sideMenuOpend = false
    this.commonService.resetForms.emit()
  }
}
