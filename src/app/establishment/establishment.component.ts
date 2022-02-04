import { Component, AfterViewInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { APIServices } from '../APIServices/api-services'
import { Api_response } from '../APIServices/api_response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from "../common.service"
@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.component.html',
  styleUrls: ['./establishment.component.scss']
})
export class EstablishmentComponent implements AfterViewInit {

  constructor(private apiServices: APIServices, private _snackBar: MatSnackBar, private commonService: CommonService) { }

  @ViewChildren("text") textareas: QueryList<any>;
  @ViewChild("admin_message") admin_message: any
  rowHeights: number[] = []
  mobile: Number = window.innerWidth
  isToEdit: Boolean = false
  toChangeReciptMsg: Boolean = false
  establishmentInfo: any = []
  reciept_message = "";
  logo = ""
  localData = JSON.parse(localStorage.getItem('syra_admin') ?? "")
  isLoadingSettings = false
  isLoadingLogo = false
  isLoadingadminMessage = false
  admin_height: any = null
  ngAfterViewInit(): void {
    this.getSettings()
    //this.getAdminMessage()
    this.get_logo()

    this.textareas.changes.subscribe(() => {
      this.rowHeights = []
      this.textareas.toArray().forEach(el => {
        let rows = Math.round(el.nativeElement.scrollHeight / 24);
        this.rowHeights.push(rows)
      });
    });
  }
  getSettings() {
    this.isLoadingSettings = true
    this.apiServices.get_settings().subscribe((response: Api_response) => {
      this.isLoadingSettings = false
      if (response.success) {
        this.establishmentInfo = response.data.settings_list.filter((value: any, index: any, arr: any) => {
          if(value.code == "admin_message")
          {
            this.reciept_message = value.value
          }
          return value.code != "logo" && value.code != "admin_message"
        })

        setTimeout(() => {    
          this.admin_height = this.admin_message.nativeElement.scrollHeight / 20
        }, 100);
      }
      else {
        this.commonService.showAlert(response.message)
      }
    })
  }

  // resizeRows(){
  //   this.rowHeights = []
  //   this.textareas.forEach(textArea => {      
  //     let rows = Math.round(textArea.nativeElement.scrollHeight / 24);     
  //     this.rowHeights.push(rows) 
  //   }); 
  // }

  getAdminMessage() {
    this.isLoadingadminMessage = true
    this.apiServices.get_admin_details_by_id({ id: this.localData.data._id }).subscribe((response: Api_response) => {
      this.isLoadingadminMessage = false
      if (response.success) {
        this.reciept_message = response.data.admin_details.admin_recipt_message

        setTimeout(() => {    
          this.admin_height = this.admin_message.nativeElement.scrollHeight / 20
        }, 100);
      }
      else {
        this.commonService.showAlert(response.message)
      }
    })
  }
  get_logo() {
    this.isLoadingLogo = true
    this.apiServices.get_logo().subscribe((res) => {
      this.isLoadingLogo = false
      if (res.success) {
        this.logo = res.data.logo.value
      }
      else {
        this.commonService.showAlert(res.message)
      }
    })
  }
  editAll() {
    if (this.isToEdit) {
      this.updateSettings()
    }
    this.isToEdit = this.isToEdit ? false : true
  }
  editReciptMsg() {
    if (this.toChangeReciptMsg) {
      this.updateAdminMessage()
    }
    this.toChangeReciptMsg = this.toChangeReciptMsg ? false : true
  }
  updateAdminMessage() {
    this.isLoadingadminMessage = true
    this.apiServices.update_admin_message(this.localData.data._id, this.admin_message.nativeElement.value).subscribe((response) => {
      this.isLoadingadminMessage = false
      this.commonService.showAlert(response.message)
    })
  }

  updateSettings() {
    this.isLoadingSettings = true
    let objects: { id: String, value: String }[] = []
    this.textareas.forEach((textArea, index) => {
      objects.push({ id: this.establishmentInfo[index]._id, value: textArea.nativeElement.value })
    });
    this.apiServices.update_settings(objects).subscribe((response) => {
      this.isLoadingSettings = false
      this.commonService.showAlert(response.message)
    })
  }
  autoGrowTextZone(e: any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 0) + "px";
  }
  handleFileInput(files: any) {
    this.isLoadingLogo = true
    console.log(files[0],"12323123")
    this.apiServices.upload_logo(files[0]).subscribe((response) => {
      this.isLoadingLogo = false
      this.commonService.showAlert(response.message)
      //this.logo = this.apiServices.url("/assets/logos/" + response.data.imageName)  
    })
  }
}
