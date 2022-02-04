import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { faTimes, faPlusCircle,faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { CommonService } from "../common.service"
import { APIServices } from "../APIServices/api-services"
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../shared/components/delete/delete.component';
@Component({
  selector: 'app-setup-configurations',
  templateUrl: './setup-configurations.component.html',
  styleUrls: ['./setup-configurations.component.scss']
})
export class SetupConfigurationsComponent implements OnInit {

  iva: any = []
  expense: any = []
  discounts: any = [
 
  ]

  Pagewidth: number = 0;
  display_col_iva = ["percent", "icon"]
  display_col_exp = ["expense_name", "icon"]
  display_col_discounts = ["discount_name", "discount_percent", "icon"]
  faTimes = faTimes
  faArrowsAlt = faArrowsAlt
  faPlusCircle = faPlusCircle
  field: string = '';
  isLoadingDiscount = false
  isLoadingExpense = false
  isLoadingIVA = false
  @ViewChild('sidenav') sidenav: any;
  @ViewChild('table') table: any;

  constructor(private commonService: CommonService, private apiService: APIServices, private modalService: NgbModal) { }
  ngOnInit(): void {
    this.Pagewidth = window.innerWidth
    console.log(innerWidth);
    this.listener()
    this.get_iva()
    this.get_expenses()
    this.get_discount()
  }
  action(){
    console.log("clicked");
  }

  dropTable(event: CdkDragDrop<any>) {
      const prevIndex = this.discounts.findIndex((d: any) => d === event.item.data);
      moveItemInArray(this.discounts, prevIndex, event.currentIndex);
      this.table.renderRows();
      let array : any = []
      for (let index = 0; index < this.discounts.length; index++) {
        const element = this.discounts[index];
        let item = {id : element._id,order : index + 1}
        array.push(item)
      }
      this.isLoadingDiscount = true

      this.apiService.orderDiscounts({order : array}).subscribe((response : any) => {
        this.isLoadingDiscount = false
      })  
  }
  listener() {
    this.commonService.commonEmitter.subscribe(() => {
      switch (this.field) {
        case "iva":
          this.get_iva()
          break
        case "expense":
          this.get_expenses()
          break
        default:
          this.get_discount()
      }
    })
  }
  get_iva() {
    this.isLoadingIVA = true
    this.apiService.getIVA().subscribe(res => {
      this.isLoadingIVA = false
      this.iva = res.data.ivalist
    })
  }
  get_discount() {
    this.isLoadingDiscount = true

    this.apiService.getDiscount().subscribe(res => {
      this.discounts = res.data.discount_list
      this.isLoadingDiscount = false

      console.log(res)
    })
  }
  get_expenses() {
    this.isLoadingExpense = true

    this.apiService.getExpense().subscribe(res => {
      console.log(res)
      this.isLoadingExpense = false

      this.expense = res.data.expense_list
    })
  }

  deleteIva(row: number) {
    this.modalService.open(DeleteComponent)
      .result.then(
        () => {
          this.isLoadingIVA = true
          this.apiService.deleteIVA({ id: this.iva[row]._id }).subscribe(res => {
            this.commonService.showAlert(res.message)
            if (res.success) {
              this.isLoadingIVA = false
              this.get_iva()
            }
          })
        },
        () => {

        }
      )
  }
  deleteExpense(row: any) {

    this.modalService.open(DeleteComponent)
      .result.then(
        () => {
          this.isLoadingExpense = true
          this.apiService.deleteExpense({ id: this.expense[row]._id }).subscribe(res => {
            this.commonService.showAlert(res.message)
            this.isLoadingExpense = false
            if (res.success) {
              this.get_expenses()
            }
          })
        },
        () => {

        }
      )


  }
  deleteDiscount(row: any) {
    this.modalService.open(DeleteComponent)
      .result.then(
        () => {
          this.isLoadingDiscount = true
          this.apiService.deleteDiscount({ id: this.discounts[row]._id }).subscribe(res => {
            this.commonService.showAlert(res.message)
            this.isLoadingDiscount = false
            if (res.success) {
              this.get_discount()
            }
          })
        },
        () => {

        }
      )


  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.Pagewidth = window.innerWidth;
  }
  openSideBar(field: string) {
    this.field = field;
    this.sidenav.toggle()
  }
  push() {
    this.commonService.setupEmitter.emit()
  }
  closed(){
    this.commonService.resetForms.emit()
  }
}
