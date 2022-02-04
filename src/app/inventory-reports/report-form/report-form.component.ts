import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { close } from '../../account-configurations/account-from/account-from.component';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Api_response } from 'src/app/APIServices/api_response';
import { APIServices } from 'src/app/APIServices/api-services';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../../shared/components/delete/delete.component';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss']
})
export class ReportFormComponent implements OnInit {
  isLoadingDelete = false
  isLoadingSave = false
  isLoading = false
  @Input() dataToGetPassed: any
  @Input() sidenav: any;
  entryForm = new FormGroup(
    {
      weekly_shipping: new FormControl('', Validators.required),
      final_remaining: new FormControl('', Validators.required)
    }
  )
  //initalization
  close = close
  //constructor
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private apiServices: APIServices, private commonService: CommonService, private modalService: NgbModal) {

  }

  //Init
  ngOnInit(): void {
    this.commonService.EditReport.subscribe((_: any) => {
      this.entryForm = new FormGroup(
        {
          weekly_shipping: new FormControl(this.dataToGetPassed.weekly_shipped == -1 ? '-' : this.dataToGetPassed.weekly_shipped, Validators.required),
          final_remaining: new FormControl(this.dataToGetPassed.final_remaining == -1 ? '-' : this.dataToGetPassed.final_remaining, Validators.required)
        }
      )
    })
  }
  //save category function
  saveAction() {
    var request: any = new Object()
    request._id = this.dataToGetPassed._id
    if (this.entryForm.valid) {
      request.final_remaining = this.entryForm.controls["final_remaining"].value
      request.weekly_shipping = this.entryForm.controls["weekly_shipping"].value
      this.callAPI(request)
    }
    else {
      if (this.entryForm.controls["weekly_shipping"].value == null) {
        this.commonService.showAlert("Invalid weekly shiping")
      }
      else {
        this.commonService.showAlert("Invalid Final remaining")
      }
    }
  }
  callAPI(request: any) {
    this.isLoadingSave = true
    this.apiServices.updateCoffeeReportEntry(request).subscribe((res: any) => {
      this.isLoadingSave = false
      this.commonService.showAlert(res.message)
      this.commonService.SuccessEditCoffeeCount.emit()
      this.sidenav.close()
    })
  }
  //to delete category
  deleteAction() {

    this.modalService.open(DeleteComponent)
      .result.then(
        () => {
          this.isLoadingDelete = true
          this.apiServices.deleteCoffeeReportEntry({_id : this.dataToGetPassed._id}).subscribe((res: any) => {
            this.isLoadingDelete = false
            this.commonService.showAlert("deleted successfully")
            this.commonService.SuccessEditCoffeeCount.emit()
            this.sidenav.close()

          })
        },
        () => {

        }
      )
  }
}
