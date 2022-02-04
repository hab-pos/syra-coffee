import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { IconDefinition, faChevronDown, faTimes, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { faBolt, faEuroSign } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { APIServices } from 'src/app/APIServices/api-services';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../../shared/components/delete/delete.component';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-modifier-component',
  templateUrl: './modifier-component.component.html',
  styleUrls: ['./modifier-component.component.scss']
})
export class ModifierComponentComponent implements OnInit {
  isLoadingAdd = false
  isLoadingDelete = false
  faCaretDown = faCaretDown
  faTimes = faTimes
  faChevronDown = faChevronDown
  faBolt = faBolt
  close = close
  faEuroSign = faEuroSign
  @Input() sidenav: any
  @Input() action: any
  @Input() field: any
  @ViewChild('item') ivaTExtField: any;
  modifier_details : any = null
  constructor(private apiServices: APIServices, private commonService: CommonService, private modalService: NgbModal) {
    this.commonService.ModifierCategorypopUpopend.subscribe((data: any) => {
      this.modifier_details = data
      this.modifierForm = new FormGroup({
        modifier_name: new FormControl(data?.modifier_name, Validators.required),
        price: new FormControl(data?.price, Validators.required),
        iva: new FormControl(data?.iva_value, Validators.required),
        beans: new FormControl(data?.beans_value, Validators.required),
      })

      // this.modifierForm = new FormGroup({
      //   modifier_name: new FormControl('', Validators.required),
      //   price: new FormControl('', Validators.required),
      //   iva: new FormControl('', Validators.required),
      //   beans: new FormControl('', Validators.required),
      // })
    })

    this.commonService.resetForms.subscribe((_: any) => {
      this.modifierForm = new FormGroup({
        modifier_name: new FormControl('', Validators.required),
        price: new FormControl('', Validators.required),
        iva: new FormControl('', Validators.required),
        beans: new FormControl('', Validators.required),
      })
    })
  }
  ivas: any = []
  backup_Ivas: any = []
  selectedIVA = []
  modifierForm = new FormGroup({
    modifier_name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    iva: new FormControl('', Validators.required),
    beans: new FormControl('', Validators.required),
  })

  ngOnInit(): void {
    this.get_iva()
  }

  deleteAction() {
    this.modalService.open(DeleteComponent)
    .result.then(
      () => {
        this.deleteAPI()
      },
      () => {

      }
    )
  }
  filter_items(value: string) {
    const filterValue = value.toLowerCase();
    this.ivas = this.backup_Ivas.filter((option: any) => option.iva_percent.includes(filterValue));
  }

  get_iva() {
    this.apiServices.getIVA({}).subscribe(res => {
      this.ivas = this.commonService.sort(res.data.ivalist)
      this.backup_Ivas = this.ivas
      this.selectedIVA = this.ivas[0]._id
      // this.modifierForm.setValue({ modifier_name: "", price: "", iva: this.ivas[0].iva_percent + "%", beans: "" })
    })
  }

  saveAction() {
    if (this.modifierForm.valid) {
      this.action == "edit" ? this.editModifier() : this.saveModifier()
    }
    else {
      this.commonService.getFormValidationErrors(this.modifierForm)
    }
  }
  editModifier() {
    this.isLoadingAdd = true
    this.apiServices.updateModifiers({ modifier_name: this.modifierForm.controls['modifier_name'].value, price: this.modifierForm.controls['price'].value, iva: this.selectedIVA, iva_value :  this.modifierForm.controls['iva'].value,beans_value: this.modifierForm.controls['beans'].value,_id : this.modifier_details?._id }).subscribe((response: any) => {
      this.isLoadingAdd = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        this.sidenav.close()
        this.modifierForm.setValue({ modifier_name: "", price: "", iva: "", beans: "" })
        this.commonService.ModifierSuccess.emit()
      }
    })
  }
  saveModifier() {
    this.isLoadingAdd = true
    this.apiServices.addModifiers({ modifier_name: this.modifierForm.controls['modifier_name'].value, price: this.modifierForm.controls['price'].value, iva: this.selectedIVA, iva_value :  this.modifierForm.controls['iva'].value,beans_value: this.modifierForm.controls['beans'].value }).subscribe((response: any) => {
      this.isLoadingAdd = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        this.sidenav.close()
        this.modifierForm.setValue({ modifier_name: "", price: "", iva: "", beans: "" })
        this.commonService.ModifierSuccess.emit()
      }
    })
  }
  deleteAPI(){
    this.isLoadingDelete = true
    this.apiServices.deleteModifiers({id : this.modifier_details?._id }).subscribe((response: any) => {
      this.isLoadingDelete = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        this.sidenav.close()
        this.modifierForm.setValue({ modifier_name: "", price: "", iva: "", beans: "" })
        this.commonService.ModifierSuccess.emit()
      }
    })
  }
  optionSelected(value : any,percent : any){
    console.log("success",value,percent)
    // this.modifierForm.get('iva')?.setValue(percent);
    this.selectedIVA = value
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
