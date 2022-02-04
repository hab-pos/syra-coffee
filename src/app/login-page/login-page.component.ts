import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { APIServices } from '../APIServices/api-services'
import { Api_response } from '../APIServices/api_response'
import {MatSnackBar} from '@angular/material/snack-bar';
import {CommonService} from "../common.service"
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit {
  //Api_response = Api_response
  @ViewChild('SubmitBtn') SubmitBtn: any;
  @ViewChild('submitLoader') submitLoader: any;
  url_logo = ""
  errorMessage = "Valid form"
  showLoader = "hidden"
  loginform = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{1,4}$")]),
    password: new FormControl('', Validators.required)
  })

  constructor(public router: Router, private apiService: APIServices,private _snackBar: MatSnackBar,private commonServices : CommonService) { }

  ngOnInit(): void {
    this.url_logo = this.apiService.url("/assets/logos/logo-admin.png")
  }

  btnClick() {
    if (this.loginform.valid) {
      this.openLoader()
      this.apiService.admin_login({ email_id: this.loginform.controls['email'].value, password: this.loginform.controls['password'].value }).subscribe(
        (data: Api_response) => {
          this.hideLoader()
          if (data.success) {
            var dataToStore = JSON.stringify(data);
            localStorage.setItem('syra_admin', dataToStore);
            this.router.navigateByUrl('/dashboard');
          }
          else {
            this.commonServices.showAlert(data.message);
          }
        }
      )
    }
    else {
      this.isInvalidEmail ?
        this.loginform.get('email')?.errors?.pattern ?
        this.commonServices.showAlert("Invalid email id / user name.") : this.commonServices.showAlert("Email id / User name is mandatory.") :
        this.commonServices.showAlert("Password is madatory.")
    }
  };

  get isInvalidEmail() {
    return this.loginform.get('email')?.invalid
  }
  get isInvalidPassword() {
    return this.loginform.get('password')?.invalid
  }
  openLoader() {
    this.submitLoader.nativeElement.classList.remove('hideLoader');
  }
  hideLoader() {
    this.submitLoader.nativeElement.classList.remove('hideLoader');
    this.submitLoader.nativeElement.classList.add('hideLoader');
  }
}
