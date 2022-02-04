import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { faTimesCircle, IconDefinition, faCaretDown, faPlus, faEuroSign } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { APIServices } from "../../APIServices/api-services"
import { CommonService } from 'src/app/common.service';
import { Api_response } from '../../APIServices/api_response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../../shared/components/delete/delete.component';

export interface product {
  product_name: String;
  is_active: any;
}

@Component({
  selector: 'app-catelouge-form',
  templateUrl: './catelouge-form.component.html',
  styleUrls: ['./catelouge-form.component.scss']
})

export class CatelougeFormComponent implements OnInit {
  faTimesCircle = faTimesCircle
  close = close
  selectedValue: String = "10.00%";
  dropDown: any;
  faEuroSign = faEuroSign
  faCaretDown = faCaretDown
  faPlus = faPlus
  @Input() sidenav: any;
  @Input() field: any;

  @ViewChild("product_name") product: any
  @ViewChild("refernce_name") refernce_name: any
  @ViewChild("units") units_field: any
  @ViewChild("price") price: any
  @ViewChild("category") category: any

  catelougeForm = new FormGroup({
    product_name: new FormControl('', Validators.required),
    refernce: new FormControl('', Validators.required),
    units: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required)
  })

  isLoadingAdd = false
  isLoadingDelete = false

  branches: any = []
  categories: any = []
  units: string[] = []
  options: string[] = [];
  filteredOptions: string[]
  filtered_units: string[]
  inventory: any = new Object()
  requests: any = new Object()
  indexTobeMined : number = -1
  parentParams : any = null
  updateAllComplete(row: number, checked: boolean) {
    this.branches[row].is_active = checked
  }

  ngOnInit() {
    this.get_branches()
    this.get_categories()
    this.commonService.catelougeEmitter.subscribe((value: any) => {
      this.parentParams = this.activatedRoute.snapshot.paramMap

      if (this.field != "addinv") {
        this.indexTobeMined = value.index

        this.inventory = value.data[value.index]
        this.init_branches()
          this.catelougeForm.setValue({
            product_name: this.inventory.inventory_name,
            refernce: this.inventory.reference,
            units: this.inventory.unit,
            price: this.inventory.price,
            category: this.inventory.category_id
          })
  
          let branches = this.inventory.available_branches
          branches.forEach((element: any) => {
            let index = this.branches.findIndex((x: any) => x._id === element)
            this.branches[index].is_active = true;
          });
      }
      else {
        if (this.parentParams?.get("category")) {
          this.catelougeForm.setValue({
            product_name: this.parentParams.get("inventory_name"),
            refernce: this.parentParams.get("reference"),
            units: this.parentParams.get("unit"),
            price: this.parentParams.get("price"),
            category: this.parentParams.get("category")
          })
          let branches = this.parentParams.get("available_branches")?.split(",") || []
          branches.forEach((element: any) => {
            let index = this.branches.findIndex((x: any) => x._id === element)
            this.branches[index].is_active = true;
          });
        }
        else {
          this.catelougeForm.setValue({
            product_name: "",
            refernce: "",
            units: "",
            price: "",
            category: ""
          })

          this.init_branches()
        }

      }
    })
  }

  init_branches() {
    this.branches.forEach((element: any) => {
      element.is_active = false
    });
  }

  get_categories() {
    this.apiServices.getCategories().subscribe((response: Api_response) => {
      if (response.success) {
        this.categories = response.data.category
        response.data.category.forEach((element: any) => {
          this.options.push(element.category_name)
        });
      }
      else {
        this.commonService.showAlert(response.message)
      }
    })
  }

  filter(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredOptions = this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  filter_units(value: string) {
    const filterValue = value.toLowerCase();
    this.filtered_units = this.units.filter(option => option.toLowerCase().includes(filterValue));
  }
  saveAction() {
    if (this.catelougeForm.valid) {
      if (this.filtered_units.length == 0) {
        this.commonService.showAlert("There is no unit named : " + this.catelougeForm.controls["units"].value + " please add and continue")
      }
      else if (this.filteredOptions.length == 0) {
        this.commonService.showAlert("There is no category named : " + this.catelougeForm.controls["category"].value + " please add and continue")
      }
      else if (!this.commonService.isAnyBranchSelected(this.branches)) {
        this.commonService.showAlert("select atleast any one branch")
      }
      else {
        this.addCatelouge()
      }
    }
    else {
      this.commonService.getFormValidationErrors(this.catelougeForm)
    }
  }
  editAction() {

    if (this.catelougeForm.valid) {
      if (this.filtered_units.length == 0) {
        this.commonService.showAlert("There is no unit named : " + this.catelougeForm.controls["units"].value + " please add and continue")
      }
      else if (this.filteredOptions.length == 0) {
        this.commonService.showAlert("There is no category named : " + this.catelougeForm.controls["category"].value + " please add and continue")
      }
      else if (!this.commonService.isAnyBranchSelected(this.branches)) {
        this.commonService.showAlert("select atleast any one branch")
      }
      else {
        this.editCatelouge()
      }
    }
    else {
      this.commonService.getFormValidationErrors(this.catelougeForm)
    }
  }
  editCatelouge() {
    this.isLoadingAdd = true

    this.getInputs()

    this.requests.id = this.inventory._id
    this.requests._id = this.inventory._id
    this.apiServices.updateCatelouge(this.requests).subscribe(res => {
      this.commonService.showAlert(res.message)
      this.isLoadingAdd = false
      if (res.success) {
        if(this.parentParams){
          this.parentParams = null
          this.router.navigateByUrl('/configurations/catalouge')
        }
        this.sidenav.close()
        setTimeout(() => { this.commonService.commonEmitter.emit() }, 2000);
      }
    })
  }


  deleteAction() {
    this.modalService.open(DeleteComponent)
      .result.then(
        () => {
          this.isLoadingDelete = true

          this.apiServices.deleteCatelouge({ id: this.inventory._id }).subscribe(res => {
            this.commonService.showAlert(res.message)
            this.isLoadingDelete = false
            if (res.success) {
              this.sidenav.close()
              this.commonService.commonEmitter.emit()
            }
          })
        },
        () => {

        }
      )


  }
  async get_branches() {
    await this.apiServices.get_branch({}).subscribe(
      (res: Api_response) => {
        if (res.success) {
          this.branches = res.data.branch_list;
          this.branches.forEach((element: any) => {
            element["is_active"] = false
          });
        }
        else {
          this.commonService.showAlert(res.message);
        }
      }
    )
  }

  async addCatelouge() {
    this.isLoadingAdd = true
    this.getInputs()
    this.apiServices.addCatelouge(this.requests).subscribe((response) => {
      this.isLoadingAdd = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        if(this.parentParams){
          this.parentParams = null
          this.router.navigateByUrl('/configurations/catalouge')
        }
        setTimeout(() => { this.commonService.commonEmitter.emit() }, 2000);

        this.sidenav.close()        
      }
    })
  }

  constructor(private apiServices: APIServices, private router: Router, private commonService: CommonService, private activatedRoute: ActivatedRoute, private modalService: NgbModal) {
    let obj = this.apiServices.units
    obj.forEach(element => {
      this.units.push(element.name)
    });
    this.filtered_units = this.units

    this.filteredOptions = this.options

    this.commonService.resetForms.subscribe(() => {
      this.catelougeForm = new FormGroup({
        product_name: new FormControl('', Validators.required),
        refernce: new FormControl('', Validators.required),
        units: new FormControl('', Validators.required),
        price: new FormControl('', Validators.required),
        category: new FormControl('', Validators.required)
      })
      this.init_branches()
    })

  }
  navigateCategory() {
    this.getInputs()
    let data = this.requests
    data.toAddCategory = true
    data.field = this.field
    data.category = this.catelougeForm.controls["category"].value
    data.index = this.indexTobeMined
    this.router.navigate(["/products/pos", data])
  }

  getInputs() {
    let selected_branches: any = []

    this.requests = new Object()
    this.requests.inventory_name = this.product.nativeElement.value
    this.requests.reference = this.refernce_name.nativeElement.value
    this.requests.unit = this.units_field.nativeElement.value
    this.requests.price = this.price.nativeElement.value
    this.requests.category_id = this.category.nativeElement.value
    this.requests.created_by = JSON.parse(localStorage.getItem('syra_admin') ?? "")["data"]["_id"]
    selected_branches = []
    this.branches.forEach((element: any) => {
      if (element.is_active) {
        selected_branches.push(element._id)
      }
    });

    this.requests.available_branches = selected_branches.join(",")
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
