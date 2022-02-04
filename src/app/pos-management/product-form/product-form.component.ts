import { Component, OnInit, Input } from '@angular/core';
import { close } from '../../account-configurations/account-from/account-from.component';
import { APIServices } from '../../APIServices/api-services'
import { CommonService } from "../../common.service"
import { faEuroSign,faBolt } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../../shared/components/delete/delete.component';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  close = close
  @Input() sidenav: any;
  @Input() field: any;
  @Input() action: any;
  branches: any = []
  colors: any = ["#4751c9", "#45a9ea", "#cc6ae3", "#dea766", "#7c52cb", "#16a186"]
  faEuroSign = faEuroSign
  faBolt  = faBolt
  selectedColorIndex = 0
  categories: any = []
  ivas: any = []
  product_id = ""
  selectedValue: String = "";
  dropDown: any;
  isLoadingSave = false
  isLoadingDelete = false
  isLoading = true

  ProductForm = new FormGroup(
    {
      product_name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      vat: new FormControl(this.selectedValue, Validators.required),
      beanValue : new FormControl('', Validators.required),
    }
  )

  constructor(private apiService: APIServices, private commonService: CommonService,private modalService : NgbModal) {
    this.commonService.resetForms.subscribe(() =>{
      this.initForm()
    })
   }
  ngOnInit(): void {
    this.get_iva()
    this.get_categories()
    this.get_Branches()
    this.commonService.productEmitter.subscribe((response: any) => {
      this.product_id = response
      console.log(this.product_id)
      if (this.product_id) {
        this.get_product_details()
      }
      else {
       this.initForm()
      }
    })
  }
  toggle() {
    this.sidenav.toggle()
  }
  ChangeColor(row: number) {
    this.selectedColorIndex = row
  }
  initForm(){
    this.selectedValue = this.ivas[0]?._id
    this.ProductForm.setValue({ product_name: "", price: "", vat: this.selectedValue || "" ,beanValue : ""})
    this.init_branches()
    this.init_categories()
    this.selectedColorIndex = 0
    this.isLoading = false
  }

  //to get category detials while comming to edit option to fill form 
  get_product_details() {
    this.isLoading = true
    this.apiService.getProducts({ id: this.product_id }).subscribe((response) => {
      this.selectedValue = response.data.products.iva
      this.ProductForm.setValue({ product_name: response.data.products.product_name, price: response.data.products.price, vat: this.selectedValue,beanValue : response.data.products.beanValue || "" })

      this.selectedColorIndex = this.colors.findIndex((x: any) => x === response.data.products.color)
      this.init_branches()
      this.init_categories()
      response.data.products.categories.forEach((element: any) => {
        let index = this.categories.findIndex((x: any) => x._id === element)
        this.categories[index].is_active = true;
      });

      response.data.products.available_branches.forEach((element: any) => {
        let index = this.branches.findIndex((x: any) => x._id === element)
        this.branches[index].is_active = true;
      });
      this.isLoading = false
    })
  }

  init_branches() {
    this.branches.forEach((element: any) => {
      element.is_active = false
    });
  }
  init_categories() {
    this.categories.forEach((element: any) => {
      element.is_active = false
    });
  }
  saveAction(edit: any = false) {
    let requestObj = this.createRequestObject()
    if (this.ProductForm.valid) {
      if (!this.commonService.isAnycategorySelected(this.categories)) {
        this.commonService.showAlert("select atleast any one category")
      }
      else if (!this.commonService.isAnyBranchSelected(this.branches)) {
        this.commonService.showAlert("select atleast any one branch")
      }
      else {
       edit ? this.edit_product(requestObj) : this.save_product(requestObj)
      }
    }
    else {
      this.commonService.showAlert("Product name, price and vat percentage is mandatory")
    }
  }
  deleteAction() {

    this.modalService.open(DeleteComponent)
    .result.then(
      () => {
        this.isLoadingDelete = true
        this.apiService.deleteproduct({ id: this.product_id }).subscribe(response => {
          this.isLoadingDelete = false
          this.commonService.showAlert(response.message)
          if (response.success) {
            this.commonService.commonEmitter.emit()
            this.sidenav.close()
          }
    
        })
      },
      () => {

      }
    )

   
  }

  save_product(requestObj: any) {
    this.isLoadingSave = true
    this.apiService.addProduct(requestObj).subscribe(response => {
      this.isLoadingSave = false
      if (response.success) {
        this.commonService.showAlert(response.message)
        this.commonService.commonEmitter.emit()
        this.sidenav.close()
      }
      else {
        this.commonService.showAlert(response.message)
      }
    })
  }

  edit_product(requestObj: any) {
    requestObj.id = this.product_id
    this.isLoadingSave = true
    this.apiService.updateProduct(requestObj).subscribe(response => {
      this.isLoadingSave = false
      this.commonService.showAlert(response.message)

      if (response.success) {
        this.commonService.commonEmitter.emit()
        this.sidenav.close()
      }
    })
  }

  createRequestObject() {
    let request: any = new Object()
    request.product_name = this.ProductForm.controls["product_name"].value
    request.price = this.ProductForm.controls["price"].value.replace(',','.').trim()
    let index = this.ivas.findIndex((iva : any) => iva._id == this.selectedValue)
    let tax = Number(this.ProductForm.controls["price"].value.replace(',','.').trim()) * this.ivas[index].iva_percent / (100 + this.ivas[index].iva_percent)
    request.price_with_iva =  (Number(this.ProductForm.controls["price"].value.replace(',','.').trim()) - tax).toFixed(2)
    request.iva = this.ProductForm.controls["vat"].value
    request.beanValue = this.ProductForm.controls["beanValue"].value
    request.categories = this.get_selected_category().join(",")
    request.available_branches = this.get_selected_branches().join(",")
    request.color = this.colors[this.selectedColorIndex]
    request.created_by = JSON.parse(localStorage.getItem('syra_admin') ?? "")["data"]["_id"]
    return request
  }
  get_Branches() {
    this.apiService.get_branch({}).subscribe(res => {
      res.data.branch_list.forEach((element: any) => {
        element.is_active = false
      });
      this.branches = res.data.branch_list
    })
  }
  get_categories() {
    this.apiService.getCategories({}).subscribe(res => {
      res.data.category.forEach((element: any) => {
        element.is_active = false
      });
      this.categories = res.data.category
    })
  }
  get_iva() {
    this.apiService.getIVA({}).subscribe(res => {
      this.ivas = this.commonService.sort(res.data.ivalist)
      this.selectedValue = this.ivas[0]._id
      this.ProductForm.setValue({ product_name: "", price: "", vat: this.selectedValue,beanValue : ""})
    })
  }

  updateAllComplete(row: any, value: any, component: any) {
    component == 0 ?
      this.categories[row].is_active = value : this.branches[row].is_active = value
  }

  get_selected_branches() {
    let selected_branches: any = []
    this.branches.forEach((element: any) => {
      if (element.is_active) {
        selected_branches.push(element._id)
      }
    });
    return selected_branches
  }

  get_selected_category() {
    let selected_category: any = []
    this.categories.forEach((element: any) => {
      if (element.is_active) {
        selected_category.push(element._id)
      }
    });

    return selected_category
  }
}
