import { Component, OnInit, Input,ViewChild,AfterViewInit } from '@angular/core';
import { faTimesCircle, IconDefinition,faPercent,faEuroSign } from '@fortawesome/free-solid-svg-icons';
import {FormGroup,FormControl,Validators} from "@angular/forms"
import { APIServices } from "../../APIServices/api-services"
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-setup-form',
  templateUrl: './setup-form.component.html',
  styleUrls: ['./setup-form.component.scss']
})


export class SetupFormComponent implements OnInit,AfterViewInit {

  faTimesCircle = faTimesCircle
  close = close
  faPercent = faPercent
  faEuroSign = faEuroSign
  @Input() sidenav: any;
  @Input() field: any;

  @ViewChild("percentCheck") percentCheck : any
  @ViewChild("EuroCheck") EuroCheck : any

  isLoading = false
  constructor(private apiService : APIServices,private commonService : CommonService) { }

  ivaForm = new FormGroup({
    iva: new FormControl('', Validators.required),
  })

  expenseForm = new FormGroup({
    expense: new FormControl('', Validators.required),
  })

  discountForm = new FormGroup({
    name: new FormControl('', Validators.required),
    amount : new FormControl('',Validators.required)
  })
  ngOnInit(): void {
    this.commonService.setupEmitter.subscribe((res : any) => {
      this.ivaForm.setValue({iva : ""})
      this.expenseForm.setValue({expense : ""})
      this.discountForm.setValue({name : "",amount : ""})
      this.percentCheck.checked = true
    })

    this.commonService.resetForms.subscribe(() => {
      this.ivaForm = new FormGroup({
        iva: new FormControl('', Validators.required),
      })
    
      this.expenseForm = new FormGroup({
        expense: new FormControl('', Validators.required),
      })
    
      this.discountForm = new FormGroup({
        name: new FormControl('', Validators.required),
        amount : new FormControl('',Validators.required)
      })
    })
  }

  ngAfterViewInit(){

    setTimeout(()=>{                          
      this.percentCheck.checked = true
    }, 1000);
  }
  
  saveIVA(){

    if(this.ivaForm.valid)
    {
      this.isLoading = true
      this.apiService.addIVA({iva_precent : this.ivaForm.controls["iva"].value.replace(',','.').trim(),created_by :  JSON.parse(localStorage.getItem('syra_admin') ?? "")["data"]["_id"]}).subscribe(res => {
        this.commonService.showAlert(res.message)
        this.isLoading = false
        if(res.success){
          this.ivaForm.setValue({iva : ""})
          this.commonService.commonEmitter.emit()
          this.sidenav.close()
        }
      })
    }
    else{
      this.commonService.showAlert("Please Mention the Percentage")
    }

  }

  checked(item : any){
    if(item == 0)
    {
      this.percentCheck.checked = true
      this.EuroCheck.checked = false
    }
    else{
      this.percentCheck.checked = false
      this.EuroCheck.checked = true
    }
  }

  saveExpense(){
    if(this.expenseForm.valid){
      this.isLoading = true
      this.apiService.addExpense({expense_name : this.expenseForm.controls["expense"].value,created_by :  JSON.parse(localStorage.getItem('syra_admin') ?? "")["data"]["_id"]}).subscribe(res => {
        this.commonService.showAlert(res.message)
        this.isLoading = false
        if(res.success){
          this.expenseForm.setValue({expense : ""})
          this.commonService.commonEmitter.emit()
          this.sidenav.close()
        }
      })
    }
    else{
      this.commonService.showAlert("Please Mention the Expense")

    } 
  }

  saveDiscount(){

    if(this.discountForm.controls["name"].value == "")
    {
      this.commonService.showAlert("Please mention the Discount Name")
    }
    else if(this.discountForm.controls["amount"].value == ""){
      this.commonService.showAlert("Please mention the amount")
    }
    else if(isNaN(this.discountForm.controls["amount"].value.replace(',','.').trim())){
      this.commonService.showAlert("Invalid amount")
    }
    else{
      this.isLoading = true
      let option = (this.percentCheck.checked) ? "percent" : "euro"
      this.apiService.addDiscount({discount_name : this.discountForm.controls["name"].value,amount : this.discountForm.controls["amount"].value.replace(',','.').trim(),type : option,created_by :  JSON.parse(localStorage.getItem('syra_admin') ?? "")["data"]["_id"]}).subscribe(res => {
        this.commonService.showAlert(res.message)
        this.isLoading = false
        if(res.success){
          this.discountForm.setValue({name : "",amount : ""})
          this.commonService.commonEmitter.emit()
          this.sidenav.close()
        }
      })
    }
  }

  toggle() {
    this.sidenav.toggle()
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
