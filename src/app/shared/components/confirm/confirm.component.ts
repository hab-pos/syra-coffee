import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from "../../../common.service"
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private common_service : CommonService
  ) { }

  ngOnInit(): void {
  }

  emit(value : any){
    console.log(value)
    this.common_service.sendMail.emit({email : value})
    this.modal.dismiss()
  }

}
