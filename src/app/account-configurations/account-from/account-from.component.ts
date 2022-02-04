import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { faTimesCircle, faEye, faEyeSlash, IconDefinition,faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { APIServices } from '../../APIServices/api-services';
import { Api_response } from '../../APIServices/api_response';
import { CommonService } from '../../common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../../shared/components/delete/delete.component';
@Component({
  selector: 'app-account-from',
  templateUrl: './account-from.component.html',
  styleUrls: ['./account-from.component.scss']
})
export class AccountFromComponent implements OnInit {

  faTimesCircle = faTimesCircle
  faEye = faEye
  faEyeSlash = faEyeSlash
  close = close
  password_type = "password";
  user_id = ""
  isLoading = false
  is_location_checked = false
  faChevronDown = faChevronDown
  @Input() sidenav: any;
  @Input() field: any;
  @Input() action: any;
  @Input() admin: any;
  @ViewChild('dropDown') dd: any;

  selected_days : any = []
  days : any = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
  branch_id: any
  branchform = new FormGroup({
    branch_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    device_id: new FormControl('', [Validators.required, Validators.minLength(5)]),
    lat :  new FormControl('', []),
    lng : new FormControl('', []),
    espresso_report_day : new FormControl('', []),
  })
  userform = new FormGroup({
    user_name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('')
  })
  adminform = new FormGroup({
    user_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    password: new FormControl('')
  })
  deleteAction(){
    this.modalService.open(DeleteComponent)
    .result.then(
      () => {
        this.deleteBaristaAPI()
      },
      () => {

      }
    )
  }
  checkAction(value : any){
    this.is_location_checked = value
  }
  deleteBaristaAPI(){
    this.isLoadingDelete = true
    this.apiService.deleteBarista({id : this.user_id}).subscribe((res : any) =>{
      this.common_service.showAlert(res.message)
      this.isLoadingDelete = false
      this.sidenav.close()
      this.common_service.passing_res_user.emit();
    }) 
  }
  isLoadingDelete = false

  constructor(private apiService: APIServices, private common_service: CommonService, private _snackBar: MatSnackBar,private modalService: NgbModal) {
    this.common_service.resetForms.subscribe(() => {
      this.branchform.reset()
      this.userform.setValue({user_name : "",password : ""})
      this.adminform.setValue({user_name : "",password : ""})
    })
  }
  ngOnInit(): void {
    this.common_service.parent_open.subscribe((result: any) => {
      console.log(this.action)
      if (this.action == "edit") {
        var espressoReportDate = result.espresso_report_date.map((data : any) => {
          return this.capitalizeFirstLetter(data)
        })
        this.branchform.setValue({ branch_name: result.branch_name, device_id: result.device_id,lat : result.lat,lng : result.lng,espresso_report_day : espressoReportDate})
        this.is_location_checked = result.show_on_app
        this.branch_id = result._id
      } else {
        this.branchform.setValue({ branch_name: "", device_id: "",lat : "",lng : "",espresso_report_day : "" })
      }
    })

    this.common_service.admin_open.subscribe((_: any) => {
      this.adminform.setValue({ user_name: this.admin.email_id, password: "" })
    })

    this.common_service.userEmitter.subscribe((result: any) => {
      if (this.action == "edit") {
        this.user_id = result._id
        this.userform.setValue({ user_name: result?.barista_name ?? "", password: "" })
      }
      else {
        this.userform.setValue({ user_name: "", password: "" })
      }
    })
  }
  capitalizeFirstLetter(string : any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  edit_admin() {
    if (this.adminform.controls['user_name'].value != "") {
      var parse_data = JSON.parse(localStorage.getItem('syra_admin') ?? "");

      let req = this.adminform.controls['password'].value != "" ?
        { id: parse_data.data['_id'], user_name: this.adminform.controls['user_name'].value, password: this.adminform.controls['password'].value }
        :
        { id: parse_data.data['_id'], user_name: this.adminform.controls['user_name'].value }
      this.isLoading = true
      this.apiService.update_admin_details(req).subscribe(
        (res: Api_response) => {
          this.common_service.showAlert(res.message);
          this.isLoading = false
          if (res.success) {
            this.sidenav.toggle()
            this.common_service.pass_data(res.data.admin_details);
          }
        }
      )
    }
    else {
      this.common_service.showAlert("User Name is Mandatory");
    }

  }


  add_branch() {
    let espresso_report_days = this.branchform.get('espresso_report_day')?.value.map((data : any) => 
    data.toLowerCase()
  ).join(",")
    if (this.branchform.valid) {
      this.isLoading = true
      var parse_data = JSON.parse(localStorage.getItem('syra_admin') ?? "");
      this.apiService.add_branch({ created_by: parse_data.data['_id'], branch_name: this.branchform.controls['branch_name'].value, device_id: this.branchform.controls['device_id'].value,lat : this.branchform.controls['lat'].value ,lng : this.branchform.controls['lng'].value,show_on_app : this.is_location_checked,espresso_report_date : espresso_report_days}).subscribe(
        (res: Api_response) => {
          this.common_service.showAlert(res.message);
          this.isLoading = false
          if (res.success) {
            this.sidenav.toggle()
            this.common_service.push_data(res.data)
          }
        }
      )
    }
    else {
      if(this.branchform.controls['branch_name'].errors){
        this.common_service.showAlert("Branch Name is Mandatory");
      }
      else{
        this.common_service.showAlert("Invalid Device Id");
      }
    }

  }

  edit_branch() {
    if (this.branchform.valid) {
      this.isLoading = true
      let espresso_report_days = this.branchform.get('espresso_report_day')?.value.map((data : any) => 
        data.toLowerCase()
      ).join(",")
      this.apiService.update_branch({ id: this.branch_id, branch_name: this.branchform.controls['branch_name'].value, device_id: this.branchform.controls['device_id'].value,lat : this.branchform.controls['lat'].value ,lng : this.branchform.controls['lng'].value,show_on_app : this.is_location_checked,espresso_report_date : espresso_report_days }).subscribe(
        (res: Api_response) => {
          this.isLoading = false
          this.common_service.showAlert(res.message);
          if (res.success) {
            this.sidenav.toggle()
            this.common_service.push_data(null);
          }
        }
      )
    }
    else {
      if(this.branchform.controls['branch_name'].errors){
        this.common_service.showAlert("Branch Name is Mandatory");
      }
      else{
        this.common_service.showAlert("Invalid Device Id");
      }
    }

  }

  add_user() {
    if (this.userform.valid) {
      this.isLoading = true
      var parse_data = JSON.parse(localStorage.getItem('syra_admin') ?? "");
      this.apiService.addBarista({ created_by: parse_data.data['_id'], barista_name: this.userform.controls['user_name'].value, password: this.userform.controls['password'].value }).subscribe(
        (res: Api_response) => {
          this.isLoading = false
          this.common_service.showAlert(res.message);
          if (res.success) {
            this.sidenav.toggle()
            this.common_service.push_user_data(res.data.barista);
          }
        }
      )
    }
    else {
      this.common_service.showAlert("user name field is mandatory");
    }

  }
  edit_user() {
    if (this.userform.valid) {
      this.isLoading = true
      this.apiService.update_barista_password({ _id: this.user_id, user_name: this.userform.controls['user_name'].value, password: this.userform.controls['password'].value }).subscribe(
        (res: Api_response) => {
          this.isLoading = false
          this.common_service.showAlert(res.message);
          if (res.success) {
            this.sidenav.toggle()
            this.common_service.push_user_data(res.data.barista);
          }
        }
      )
    }
    else {
      this.common_service.showAlert("user name field is mandatory");
    }
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
