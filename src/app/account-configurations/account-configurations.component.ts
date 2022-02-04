import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { APIServices } from '../APIServices/api-services';
import { Api_response } from '../APIServices/api_response';
import { CommonService } from '../common.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface branches {
  branch_id: String
  branch_name: String;
  device_id: String
}
export interface User {
  user_id: String,
  user_name: String,
  password: String
}
@Component({
  selector: 'app-account-configurations',
  templateUrl: './account-configurations.component.html',
  styleUrls: ['./account-configurations.component.scss']
})

export class AccountConfigurationsComponent implements OnInit {
  faEdit = faEdit;
  faPlusCircle = faPlusCircle;
  current = 1;
  totalPages = 1;
  pages: any
  endPage = 1;
  startPage = 1;
  username: any;
  isLoadingAdmim = false
  isLoadingBranch = false
  isLoadingusers = false

  public innerWidth: any;

  @ViewChild('sidenav') sidenav: any;

  admin: any
  tableData: any
  userData: any
  
  tableIndex : number
  displayColumsUser = ["user_name", "password", "icon"]
  displayedColumns = ["branch_name", "device_id", "icon"]

  field: string = '';
  action: string = '';

  constructor(private apiService: APIServices, private common_service: CommonService, private _snackBar: MatSnackBar) {
    this.common_service.passing_res_branch.subscribe((_: any) => {
     this.get_branches()     
    })
    this.common_service.passing_res_admin.subscribe((_: any) => {
      this.get_admin()
    })
    this.common_service.passing_res_user.subscribe((_: any) => {
      this.get_users()
    })
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(i => this.startPage + i);
    
    this.get_branches()
    this.get_admin()
    this.get_users()
  }


  get_branches() {
    this.isLoadingBranch = true
    this.apiService.get_branch({}).subscribe(
      (res: Api_response) => {
        this.isLoadingBranch = false
        if (res.success) {
          this.tableData = res.data.branch_list;
        }
        else {
          this.common_service.showAlert(res.message);
        }
      }
    )
  }
  get_admin() {
    this.isLoadingAdmim = true
    var parse_data = JSON.parse(localStorage.getItem('syra_admin') ?? "");
    this.apiService.get_admin_details_by_id({ id: parse_data.data['_id'] }).subscribe(
      (res: Api_response) => {
        this.isLoadingAdmim = false
        if (res.success) {
          this.admin = res.data.admin_details
        }
        else {
          this.common_service.showAlert(res.message);
        }
      }
    )
  }
   get_users() {
    this.isLoadingusers = true

    this.apiService.get_all_barista().subscribe(
      (res: Api_response) => {
        this.isLoadingusers = false

        if (res.success) {
          this.userData = res.data.barista_details;
        }
        else {
          this.common_service.showAlert(res.message);
        }
      }
    )
  }
  push() {
    if (this.field == "main") {
      this.common_service.admin_edit(this.admin);
    }
    else if(this.field == "branch"){      
      this.common_service.branch_edit(this.tableData[this.tableIndex]);
    }
    else {            
      this.common_service.userEmitter.emit(this.userData[this.tableIndex])
    }
  }
  openSideBar(field: string, action: string,tableIndex : number = -1) {
    this.field = field;
    this.action = action;
    this.tableIndex = tableIndex// to pass associated object in data source
    this.sidenav.toggle()
  }

  getBranches(page: Number = 1) {
    console.log(page);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  closed(){
    this.common_service.resetForms.emit()
  }
}
