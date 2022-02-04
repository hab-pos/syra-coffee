import { Component, OnInit, Input,AfterViewInit,OnDestroy } from '@angular/core';
import { IconDefinition, faChevronDown, faSearch, faTimes, faCaretDown, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { CommonService } from '../../common.service';
import { APIServices } from "../../APIServices/api-services";
import { Api_response } from '../../APIServices/api_response';

@Component({
  selector: 'app-addproduct-component',
  templateUrl: './addproduct-component.component.html',
  styleUrls: ['./addproduct-component.component.scss']
})
export class AddproductComponentComponent implements OnInit,AfterViewInit {
  faCaretDown = faCaretDown
  faTimes = faTimes
  isLoading = false
  close = close
  faPlusCircle = faPlus
  faMinusCircle = faMinus
  faSearch = faSearch
  plus = plus
  minuss = minuss
  qty: number
  products: any = []
  subs : any
  products_backup: any = []
  products_to_order: any = []
  searchOptionEnabled = false
  @Input() orderDetails: any = null
  @Input() orderedProductsFromAddInventory : any = []
  constructor(public common_service: CommonService, private apiServices: APIServices) {
    this.common_service.syncProductQuantity.subscribe((data: any) => {
      var index = this.products.findIndex((x: any) => x._id == data.inventory_id);
      this.products[index].quantity = data.qty
      console.log(data, this.products[index])
    })
  }
  @Input() sidenav: any;
  ngOnInit(): void {
    this.get_catelouges()
  }
  ngOnDestroy(){
  }
  ngAfterViewInit(){   
  }
  searchViewUpdate() {
    this.searchOptionEnabled = !this.searchOptionEnabled
    if(!this.searchOptionEnabled){
      this.products = this.products_backup
    }
  }
  sidenav_close() {
    this.common_service.closeInventoryForm.emit()
    console.log("emitted for close")
  }
  private loadTeams = function () {
    // this here refers to the function
  }
  add(row: number) {

    this.products[row].quantity++
    let index = this.products_to_order.map((item: any) => item.refernce).indexOf(this.products[row].reference);
    if (index == -1) {
      this.products_to_order.push({ inventory_id: this.products[row]._id, refernce: this.products[row].reference, unit: this.products[row].unit, inventory_name: this.products[row].inventory_name, qty: this.products[row].quantity, price: this.products[row].quantity * Number(this.products[row].price), unit_price: this.products[row].price })
    }
    else {
      this.products_to_order[index].qty += 1
      this.products_to_order[index].price = this.products[row].price * this.products_to_order[index].qty
    }
    this.common_service.CreateInvOrderFromAdminDataFetcher.emit({ products: this.products_to_order })
  }
  minus(row: number) {
    let index = this.products_to_order.map((item: any) => item.refernce).indexOf(this.products[row].reference);

    if (this.products[row].quantity > 0) {
      this.products[row].quantity -= 1
      this.products_to_order[index].qty -= 1
      this.products_to_order[index].price = this.products[row].price * this.products_to_order[index].qty
    }
    else {
      if (index >= 0) {
        this.products_to_order.splice(index, 1)
      }
    }
    this.common_service.CreateInvOrderFromAdminDataFetcher.emit({ products: this.products_to_order })
  }
  get_catelouges(device_id: any = null, list: any = null) {
    this.apiServices.getCatelouge({ branch_list: list }).subscribe((response) => {
      if (response.success) {
        if (this.orderDetails != null) {
          let ordered_refs = this.orderDetails.data.ordered_items.map((item: any) => item.refernce)
          console.log(ordered_refs, "test");
          this.products = response.data.inventories.filter((element: any) => {
            return !ordered_refs.includes(element.reference)
          });
        }
        else {
          this.products = response.data.inventories
          let refs = this.products.map((item: any) => item._id)

          for (let index = 0; index < this.orderedProductsFromAddInventory.length; index++) {
            let element = this.orderedProductsFromAddInventory[index]
            let indexPdt = refs.indexOf(element.inventory_id)
            this.products[indexPdt].quantity = element.qty
          }
        }
        this.products_backup = this.products
        this.products_to_order = this.products.filter((data : any) => {
          return data.quantity > 0
        })
        this.generateSelectedProducts()
      }
      else {
        this.common_service.showAlert(response.message)
      }
    })
  }
  generateSelectedProducts(){
    for (let index = 0; index < this.products_to_order.length; index++) {
      this.products_to_order[index].qty = this.products_to_order[index].quantity   
      this.products_to_order[index].inventory_id = this.products_to_order[index]._id   
      this.products_to_order[index].refernce = this.products_to_order[index].reference  
    }
  }
  search(searchString: String) {
    console.log(searchString)
    if (searchString == "") {
      this.products = this.products_backup
    }
    else {
      this.products = this.products_backup.filter((data: any) => {
        return data.inventory_name.toLowerCase().includes(searchString.toLowerCase())
      })
    }
  }
  addOrder() {
    this.isLoading = true
    this.products_to_order = this.products_to_order.concat(this.orderDetails.data.ordered_items)
    this.apiServices.reOrderInventory({ data: this.products_to_order, id: this.orderDetails.data._id }).subscribe((response) => {
      if (response.success) {
        this.isLoading = false
        this.sidenav_close()
        this.common_service.updateInventoryOrderFrom.emit(this.products_to_order)
        this.common_service.commonEmitter.emit(true)
      }
      else {
        this.common_service.showAlert(response.message)
      }

    })
    console.log(JSON.parse(JSON.stringify(this.products_to_order)))
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
