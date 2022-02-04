
import { Component, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router"
import { faPencilAlt, faPlusCircle, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { APIServices } from "../APIServices/api-services"
import { Api_response } from "../APIServices/api_response"
import { CommonService } from '../common.service'
export interface category {
  _id: String;
  color: String;
  category_name: String;
  is_active: any;

}

export interface Products {
  _id: String;
  color: String;
  product_name: String;
  is_active: Boolean;
}

@Component({
  selector: 'app-pos-management',
  templateUrl: './pos-management.component.html',
  styleUrls: ['./pos-management.component.scss']
})

export class POSManagementComponent implements AfterViewInit {

  constructor(private router: Router, private activeRoute: ActivatedRoute, private apiServices: APIServices, private commonService: CommonService) {
    this.Pagewidth = window.innerWidth

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
  selectedId: String = ""
  selectedCategoryRow = -1
  category: any = [
  ]
  products: any = [

  ]
  sideMenuClosing = true
  isChangingStatus = false
  allProducts: any = [] //for filtering purpose
  isLoadingProduct = false
  isLoadingCatelogy = false
  display_col_category = ["name_color", "action"]

  paramsFromParent: ParamMap
  masterFilterId: any = null

  ngAfterViewInit() {
    this.paramsFromParent = this.activeRoute.snapshot.paramMap;
    if (this.paramsFromParent.get("toAddCategory")) {
      this.openSideBar('category', 'add')
    }

    this.listenCategory()


    let branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : []
    console.log(branchSelected)
    let selectedString = branchSelected?.map(function (element: any) { return element._id; })
    if(branchSelected?.length == 1){
      this.masterFilterId = branchSelected[0]?._id
    }
    else{
      this.masterFilterId = null
    }
    if (branchSelected == null || selectedString.length == 0) {
      this.get_categories()
      this.get_products()
    }
    else {
      this.get_branch_products(selectedString)
      this.get_branch_categories(selectedString)
    }
    this.commonService.select_branch.subscribe((response: any) => {
      console.log("response?.length == 1",response?.length == 1,"response?.length == 1", response);
      
      if(response?.length == 1){
        this.masterFilterId = response[0]?._id
      }
      else{
        this.masterFilterId = null
      }

      let array = response.map(function (element: any) { return element._id; })
      this.selectedCategoryRow = -1
      if (array.length == 0) {
        this.get_categories()
        this.get_products()
      }
      else {
        this.get_branch_products(array)
        this.get_branch_categories(array)
      }
    })
  }

  get_branch_products(branch_list: any) {
    this.isLoadingProduct = true
    this.apiServices.get_branch_products({ branch_list: branch_list }).subscribe((response: Api_response) => {
      this.isLoadingProduct = false
      if (response.success) {
        this.allProducts = response.data.products
        this.products = response.data.products
      }
      else {
        this.commonService.showAlert(response.message)
      }
    })
  }
  get_branch_categories(branch_list: any) {
    this.isLoadingCatelogy = true
    this.apiServices.get_branch_category({ branch_list: branch_list }).subscribe((response: Api_response) => {
      this.isLoadingCatelogy = false
      if (response.success) {
        this.category = response.data.category
      }
      else {
        this.commonService.showAlert(response.message)
      }
    })
  }
  listenCategory() {
    this.commonService.commonEmitter.subscribe((_: any) => {
      let branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
      let selectedString = branchSelected?.map(function (element: any) { return element._id; })

      if (branchSelected == null || selectedString.length == 0) {
        this.get_categories()
        this.get_products()
      }
      else {
        this.get_branch_products(selectedString)
        this.get_branch_categories(selectedString)
      }
    })
  }
  get_categories() {
    this.isLoadingCatelogy = true
    this.apiServices.getCategories().subscribe((response: Api_response) => {
      this.isLoadingCatelogy = false
      if (response.success) {
        this.category = response.data.category
      }
      else {
        this.commonService.showAlert(response.message)
      }
    })
  }

  get_products() {
    this.isLoadingProduct = true
    this.apiServices.getProducts().subscribe((response: Api_response) => {
      this.isLoadingProduct = false
      if (response.success) {
        console.log(this.selectedCategoryRow, "selected")
        if (this.selectedCategoryRow >= 0) {
          this.loadProductForSpecificCategory(this.selectedCategoryRow, null)
        }
        else {
          this.allProducts = response.data.products
          this.products = response.data.products
        }
      }
      else {
        this.commonService.showAlert(response.message)
      }
    })
  }
  onCategoryStatusChange(row: any) {
    this.isChangingStatus = true
    this.category[row].is_Active = !this.category[row].is_Active
    this.category[row].id = this.category[row]._id
    this.category[row].available_branches = Array.isArray(this.category[row].available_branches) ? this.category[row].available_branches?.join(",") : this.category[row].available_branches
    this.isLoadingCatelogy = true
    this.apiServices.updateCategory(this.category[row]).subscribe((res) => {
      this.isLoadingCatelogy = false
      this.commonService.showAlert(res.message)
    })
  }

  onProductStatusChange(row: any) {
    this.products[row].is_Active = !this.products[row].is_Active
    this.products[row].id = this.products[row]._id
    this.products[row].categories = Array.isArray(this.products[row].categories) ? this.products[row].categories?.join(",") : this.products[row].categories
    this.products[row].available_branches = Array.isArray(this.products[row].available_branches) ? this.products[row].available_branches?.join(",") : this.products[row].available_branches
    console.log(this.products[row])
    this.isLoadingProduct = true
    this.apiServices.updateProduct(this.products[row]).subscribe((res) => {
      this.isLoadingProduct = false
      this.commonService.showAlert(res.message)
    })
  }

  dropTable(event: CdkDragDrop<category[]>) {
    let branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    if (branchSelected?.length == 1) {
      const prevIndex = this.category.findIndex((d: any) => d === event.item.data);
      moveItemInArray(this.category, prevIndex, event.currentIndex);
      this.table.renderRows();
      let order: any = []
      this.category.forEach((element: any, index: any) => {
        let item: any = new Object()
        item.id = element._id
        item.order = index + 1
        order.push(item)
      });

      this.isLoadingCatelogy = true
      let b_id = branchSelected[0]._id
      b_id = b_id == "syra-all" ? null : b_id
      this.apiServices.update_category_order({ order: order, branch_id: b_id }).subscribe(res => {
        this.isLoadingCatelogy = false
        this.commonService.showAlert(res.message)
      })

      if (this.selectedCategoryRow == prevIndex) {
        this.selectedCategoryRow = event.currentIndex
      }
      console.log(this.selectedCategoryRow, "row")
    }
    else {
      this.commonService.showAlert("Choose the any one branch to reorder")
    }

  }

  dropProducts(event: CdkDragDrop<Products[]>) {
    let branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null

    if (branchSelected?.length == 1) {
      const index = this.products.findIndex((d: any) => d === event.item.data);
      moveItemInArray(this.products, index, event.currentIndex);
      this.ProductsTable.renderRows()
      let order: any = []
      this.products.forEach((element: any, index: any) => {
        let item: any = new Object()
        item.id = element._id
        item.name = element.product_name
        item.order = index + 1
        order.push(item)
      });

      this.isLoadingProduct = true
      let branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
      let b_id = branchSelected[0]._id
      b_id = b_id == "syra-all" ? null : b_id
      this.apiServices.update_product_order({ order: order, branch_id: b_id }).subscribe(res => {
        this.isLoadingProduct = false
        this.commonService.showAlert(res.message)
      })
    }
    else {
      this.commonService.showAlert("Choose any one branch to reorder")
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.Pagewidth = window.innerWidth;
  }
  openSideBar(field: string, action: string, row: number = -1) {
    this.isChangingStatus = true
    this.field = field;
    this.action = action;
    this.selectedId = field == "category" ? (row >= 0) ? this.category[row]._id : null : (row >= 0) ? this.products[row]._id : null
    this.sidenav.toggle()
  }
  push() {
    if (this.field == 'category') {
      let category_id = this.action == "edit" ? this.selectedId : null
      this.commonService.categoryEmitter.emit(category_id)
    }
    else {
      let product_id = this.action == "edit" ? this.selectedId : null
      this.commonService.productEmitter.emit(product_id)
    }
  }

  loadProductForSpecificCategory(row: any, event: any) {
    event?.preventDefault()
    event?.stopPropagation()
    if (!this.isChangingStatus) {

      if (this.selectedCategoryRow == row) {
        this.selectedCategoryRow = -1
        this.products = this.allProducts
      }
      else {
        this.selectedCategoryRow = row

        this.products = this.allProducts.filter((product: any) => {
          return product.categories.includes(this.category[row]._id)
        })

        console.log(this.products)
      }
    }
    this.isChangingStatus = false
  }

  // @HostListener('document:click', ['$event'])
  // clickout(event : any) {
  //   if(!this.sideMenuClosing){
  //     this.selectedCategoryRow = -1
  //     this.products = this.allProducts
  //     this.sideMenuClosing = false
  //   }
  // }

  close() {
    this.sideMenuClosing = true
    this.commonService.resetForms.emit()
  }
}
