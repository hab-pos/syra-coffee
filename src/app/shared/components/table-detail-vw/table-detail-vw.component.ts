import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash'

@Component({
  selector: 'app-table-detail-vw',
  templateUrl: './table-detail-vw.component.html',
  styleUrls: ['./table-detail-vw.component.scss']
})
export class TableDetailVwComponent implements OnInit {

  reports
  category : String = ""
  quarter
  isFull = false
  constructor(
    private modalService: NgbModal,
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
   console.log(this.reports);
   
  }

  getHalfAvg(month : Number,half: Number, forElement: String) {
    let searchObj = _.filter(this.reports, function (element) {
      return element.month == month;
    });

    var obj = Object()
    if (half == 1) {
      obj = searchObj[0]?.avg.firstHalf.avg
    }
    else {
      obj = searchObj[0]?.avg.secondHalf.avg
    }
    var returnValue = ''
    switch (forElement) {
      case 'gst':
        returnValue = (obj && obj?.length > 0) ? obj[0]?.avgGST : "0.00"
        break
      case 'expense':
        returnValue = (obj && obj?.length > 0) ? obj[0]?.averageExpense : "0.00" 
        break
      default:
        returnValue = (obj && obj?.length > 0) ? obj[0]?.avgTotal : "0.00"
        break
    }
   return returnValue
  }
  subract(n1,n2){
    return Math.abs(n1-n2)
  }
  total = 0
  calculateTotal(val)
  {
    this.total += val
  }
}
