import { Component, OnInit, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { faBars, IconDefinition, faMapMarkerAlt, faCalendarDay, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { CommonService } from '../common.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '../helpers'
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { APIServices } from 'src/app/APIServices/api-services';
import * as moment from 'moment';
declare var require: any
var FileSaver = require('file-saver');
@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class AppHeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('picker') picker: any;
  branch: string = '';

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  branches: any = []
  selectedValue: any = [];
  dropDown: any;
  isMobileCalender = false;
  faCalendarDay = faCalendarDay;
  faBars = faBars;
  faMapMarkerAlt = faMapMarkerAlt;
  fa_download = fa_download;
  faTimes = faTimesCircle
  mobile: any = window.innerWidth;
  selectedDate: any
  isLoading = false
  url_logo = ""
  matLabelTitle = "Today"
  url_loading = ""
  url_array: String[] = []
  branch_list: any = []
  @ViewChild('dropDown') dd: any;
  @ViewChild('datepickerFooter') datepickerFooter: any;


  constructor(public common_service: CommonService, private apiService: APIServices) { }
  ngOnInit(): void {
    this.get_Branches()
    localStorage.removeItem("selectedBranch")
    localStorage.removeItem("selectedDate")

    this.common_service.url_updated.subscribe((date: any) => {
      this.url_array = date
      if (this.url_array[1] == "products" && this.url_array[2] == "inventory-reports" || this.url_array[1] == "products" && this.url_array[2] == "inventory-orders") {
        this.selectedValueSingle = null
        this.selectedValue = []
        this.dd.options.forEach((item: any, index: any) => {
          item.deselect()
        })
        this.branch_list = []
      }
    })
  }
  getMultiEnable() {
    return !(this.url_array[1] == "products" && this.url_array[2] == "inventory-reports")
  }
  onOpen() {
    this.appendFooter();
  }
  resetDatePicker(e: any) {
    // if(this.range.get('start'))
    this.range.reset()
    // if (this.range.value.start != null) {
      let date = { start: moment().toDate(), end: moment().toDate() }
      var dataToStore = JSON.stringify(date);
      localStorage.setItem('selectedDate', dataToStore);
      this.common_service.set_date(date)
      this.matLabelTitle = "Today"
    // }
    e.stopPropagation();
    e.preventDefault();
  }
  today() {
    let date = { start: moment(), end: moment() }
    var dataToStore = JSON.stringify(date);
    localStorage.setItem('selectedDate', dataToStore);
    // this.common_service.set_date(date)
    this.selectedDate = date
    this.picker.close()
    this.range.setValue({ start: moment().toDate(), end: moment().toDate() })
    this.matLabelTitle = "Today"
  }
  thisWeek() {
    console.log("this week");
    let date = { start: moment().startOf('week'), end: moment().endOf('week') }
    var dataToStore = JSON.stringify(date);
    localStorage.setItem('selectedDate', dataToStore);
    this.selectedDate = date
    // this.common_service.set_date(date)
    this.picker.close()
    this.range.setValue({ start: moment().startOf('week').toDate(), end: moment().endOf('week').toDate() })
    this.matLabelTitle = "This week"
  }
  thisMonth() {
    let date = { start: moment().startOf('month'), end: moment().endOf('month') }
    var dataToStore = JSON.stringify(date);
    localStorage.setItem('selectedDate', dataToStore);
    this.selectedDate = date
    // this.common_service.set_date(date)
    this.picker.close()
    this.range.setValue({ start: moment().startOf('month').toDate(), end: moment().endOf('month').toDate() })
    this.matLabelTitle = "This Month"
  }
  private appendFooter() {
    const matCalendar = document.getElementsByClassName('mat-datepicker-content')[0] as HTMLElement;
    matCalendar.appendChild(this.datepickerFooter.nativeElement);
  }
  openSideBar() {
    this.common_service.set_sidebar_toggle("sidebar");
  }
  ngAfterViewInit() {
    this.url_logo = this.apiService.url("/assets/logos/logo-admin.png")
    this.url_loading = this.apiService.url("/assets/logos/loading.gif")
    this.common_service.export_success.subscribe(() => {
      this.isLoading = false
    })
  }
  addEvent() {
    this.selectedDate = this.range.value
  }
  selectedRow = -1
  selectedValueSingle = null
  select_branch_single(row: any) {
    console.log(row, this.branches[row])
    let item = JSON.stringify(this.branches[row])
    localStorage.setItem('selectedBranch', item);
    this.common_service.set_branch(this.branches[row]);
  }

  select_branch(row: any) {

    this.selectedRow = row
    console.log(this.branches[row]._id, this.branch_list.length);

    if (this.branches[row]._id == "syra-all") {
      if (this.branch_list.length == 0) {
        this.branch_list = this.branches.map(function (element: any) { return element })
        this.branch_list.splice(0, 1) //to remove all-branches obj in list
      }
      else {
        if (this.branch_list.length == this.branches.length - 1) {
          this.branch_list = []
        }
        else {
          this.branch_list = this.branches.map(function (element: any) { return element })
          this.branch_list.splice(0, 1) //to remove all-branches obj in list
        }
      }
      this.toggleAllSelection()
    }
    else {
      let index = this.branch_list.map(function (element: any) { return element._id; }).indexOf(this.branches[row]._id);
      if (index >= 0) {
        this.branch_list.splice(index, 1);
      }
      else {
        this.branch_list.push(this.branches[row])
      }

      if (this.branch_list.length < this.branches.length - 1) {
        this.dd.options.forEach((item: any, index: any) => {
          if (index == 0) {
            item.deselect()
          }
        })
      }
      if (this.branch_list.length == this.branches.length - 1) {
        this.dd.options.forEach((item: any, index: any) => {
          if (index == 0) {
            item.select()
          }
        })
      }
    }

    console.log(this.branch_list)
  }

  allSelected = true
  toggleAllSelection() {
    this.allSelected = this.branch_list.length == this.branches.length - 1 // to control select-unselect
    console.log(this.dd, 123)
    if (this.allSelected) {
      this.dd.options.forEach((item: any) => item.select());
    } else {
      this.dd.options.forEach((item: any) => { item.deselect() });
    }
  }

  exportAct() {
    this.isLoading = true
    if (this.url_array[1] == "reports" && this.url_array[2] == "sales" || this.url_array[1] == "reports" && this.url_array[2] == "accounting" || this.url_array[1] == "configurations" && this.url_array[2] == "catalouge" || this.url_array[1] == "products" && this.url_array[2] == "inventory-orders") {
      this.common_service.exportClicked.emit()
    }
    else {
      this.exportAction()
    }
  }

  exportAction() {
    let branch = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    let selectedDates = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null

    this.apiService.generate_accounting_report({ branch: branch, dates: selectedDates }).subscribe((report: any) => {
      if (report.success) {
        this.isLoading = false
        let url = report.data.url
        FileSaver.saveAs(url, report.data.title + ".pdf");
      }
      else {
        this.common_service.showAlert(report.message)
      }
    })
  }
  get_Branches() {
    this.apiService.get_branch({}).subscribe(res => {
      this.branches = res.data.branch_list
      let item: any = { branch_name: "All branches", device_id: "", _id: "syra-all" }
      this.branches.unshift(item)
      this.selectedValue = this.branches.map(function (element: any) { return element._id })
      this.branch_list = this.branches.map(function (element: any) { return element })
      this.branch_list.splice(0, 1)
      this.allSelected = false
      this.toggleAllSelection()
      localStorage.setItem('branch_list', JSON.stringify(this.branch_list));
    })
  }

  closedAction() {
    if (this.selectedDate?.start == null || this.selectedDate?.end == null) {
      this.matLabelTitle = this.selectedDate.start == null ? moment(this.selectedDate.end).format("DD MMM YYYY") : moment(this.selectedDate.start).format("DD MMM YYYY")
      this.range.setValue({ start: '', end: '' })
    }

    if (this.selectedDate.start == null && this.selectedDate.end == null) {
      this.matLabelTitle = "Today"
    }
    var dataToStore = JSON.stringify(this.selectedDate);
    localStorage.setItem('selectedDate', dataToStore);
    this.common_service.set_date(this.selectedDate)
  }
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.mobile = window.innerWidth;
    this.isMobileCalender = (this.mobile > 1024) ? false : true;
    this.picker.close()
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.mobile = window.innerWidth;
    this.isMobileCalender = (this.mobile > 1024) ? false : true;
    this.picker.close()
  }

  closed_branch() {

    if (this.getMultiEnable()) {
      var dataToStore = JSON.stringify(this.branch_list);
      localStorage.setItem('selectedBranch', dataToStore);
      this.common_service.set_branch(this.branch_list);
    }
    else {
      var dataToStore = JSON.stringify(this.branches[this.selectedRow]);
      localStorage.setItem('selectedBranch', dataToStore);
      this.common_service.set_branch(this.branches[this.selectedRow]);
      // this.selectedValue = this.branches.map(function (element: any) { return element._id })
    }

  }

}

export const fa_download: IconDefinition = {
  prefix: 'fa',
  iconName: 'line',
  icon: [
    512, // SVG view box width
    512, // SVG view box height
    [],
    '', // probably not important for SVG and JS approach
    `M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64
    c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472
    c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z`,
  ],
} as any;