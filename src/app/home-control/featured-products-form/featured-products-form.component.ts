import { Component, OnInit,Input, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IconDefinition, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { APIServices } from 'src/app/APIServices/api-services';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../../shared/components/delete/delete.component';

@Component({
  selector: 'app-featured-products-form',
  templateUrl: './featured-products-form.component.html',
  styleUrls: ['./featured-products-form.component.scss']
})
export class FeaturedProductsFormComponent implements OnInit,AfterViewInit {
  isLoadingAdd = false
  @Input() sidenav : any
  @Input() fieldIndex : any
  @Input() field : any
  @Input() action : any
  @Input() productList : any
  close = close
  faCaretDown = faCaretDown
  featured_product_form = new FormGroup({
    product_name: new FormControl('', Validators.required),      
  })
  isLoading = false
  selected_product : any
  prevProductInfo : any
  constructor(private apiService : APIServices,private commonService : CommonService,private modalService : NgbModal) {
    this.commonService.featuredProductopUpopend.subscribe((data : any) => {
      if(data == null){
        this.featured_product_form = new FormGroup({
          product_name: new FormControl('', Validators.required),      
        })
      }
      else{
        this.featured_product_form = new FormGroup({
          product_name: new FormControl(data.product_name, Validators.required),      
        })
        this.selected_product = data
      }
      this.prevProductInfo = data

      console.log(data)
    })
   }
  backup_products : any = []
  ngOnInit(): void {
    this.backup_products = this.productList
  }
  saveAction(){
    if(this.featured_product_form.valid){
      this.saveAPI()
    }
    else{
      this.commonService.showAlert("Please choose the product")
    }
  }
  saveAPI(){
    this.isLoadingAdd = true
    if(this.prevProductInfo?._id != null && this.selected_product._id != this.prevProductInfo?._id){
      this.apiService.UpdateUserProducts({_id : this.prevProductInfo._id, is_featured : false}).subscribe((res : any) =>{
        this.apiService.UpdateUserProducts({_id : this.selected_product._id, is_featured : true}).subscribe((response : any) =>{
          this.commonService.showAlert(response.message)
          this.isLoadingAdd = false
          this.sidenav.close()
          this.commonService.featuredProdcutSuccess.emit()
        }) 
      }) 
    }
    else{
      this.apiService.UpdateUserProducts({_id : this.selected_product._id, is_featured : true}).subscribe((res : any) =>{
        this.commonService.showAlert(res.message)
        this.isLoadingAdd = false
        this.sidenav.close()
        this.commonService.featuredProdcutSuccess.emit()
      }) 
    }
  }
  ngAfterViewInit(){
    this.getProductsList()
  }
  getProductsList(){
    this.isLoading = true
    this.apiService.getUserProducts().subscribe(response => {
      this.productList = response.data != null ? JSON.parse(JSON.stringify(response.data)) : []
      console.log(this.productList)
      this.isLoading = false
    })
  }
  filter_products(value: string) {
    const filterValue = value.toLowerCase();
    this.productList = this.backup_products.filter((option : any) => option.product_name.toLowerCase().includes(filterValue));
  }
  optionSelected(product : any){
    this.selected_product = product
  }

  deleteAction(){
    this.modalService.open(DeleteComponent)
    .result.then(
      () => {
        this.deleteAPI()
      },
      () => {

      }
    )
  }
  deleteAPI(){
    this.apiService.UpdateUserProducts({_id : this.prevProductInfo._id, is_featured : false}).subscribe((res : any) =>{
      this.commonService.showAlert(res.message)
      this.isLoadingAdd = false
      this.sidenav.close()
      this.commonService.featuredProdcutSuccess.emit()
    }) 
  }
}

export const close: IconDefinition = {
  prefix: 'fa',
  iconName: 'line',
  icon: [
    512, // SVG view box width
    512, // SVG view box height
    [],
    '', // probably not important for SVG and JS approach
    `M437.126,74.939c-99.826-99.826-262.307-99.826-362.133,0C26.637,123.314,0,187.617,0,256.005
			s26.637,132.691,74.993,181.047c49.923,49.923,115.495,74.874,181.066,74.874s131.144-24.951,181.066-74.874
			C536.951,337.226,536.951,174.784,437.126,74.939z M409.08,409.006c-84.375,84.375-221.667,84.375-306.042,0
			c-40.858-40.858-63.37-95.204-63.37-153.001s22.512-112.143,63.37-153.021c84.375-84.375,221.667-84.355,306.042,0
			C493.435,187.359,493.435,324.651,409.08,409.006z M341.525,310.827l-56.151-56.071l56.151-56.071c7.735-7.735,7.735-20.29,0.02-28.046
			c-7.755-7.775-20.31-7.755-28.065-0.02l-56.19,56.111l-56.19-56.111c-7.755-7.735-20.31-7.755-28.065,0.02
			c-7.735,7.755-7.735,20.31,0.02,28.046l56.151,56.071l-56.151,56.071c-7.755,7.735-7.755,20.29-0.02,28.046
			c3.868,3.887,8.965,5.811,14.043,5.811s10.155-1.944,14.023-5.792l56.19-56.111l56.19,56.111
			c3.868,3.868,8.945,5.792,14.023,5.792c5.078,0,10.175-1.944,14.043-5.811C349.28,331.117,349.28,318.562,341.525,310.827z`,
  ],
} as any;
