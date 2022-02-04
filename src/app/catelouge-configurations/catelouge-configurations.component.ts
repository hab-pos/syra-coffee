import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { faEdit, faSearch, faPlusCircle, faSort, faSortAlphaDown, faSortAlphaUp } from '@fortawesome/free-solid-svg-icons';
import { ParamMap, ActivatedRoute, Router } from "@angular/router"
import { CommonService } from '../common.service';
import { APIServices } from '../APIServices/api-services'
import * as _ from "lodash";
import * as XLSX from "xlsx";

export interface catelouge {
  refernce: String,
  product_name: String,
  unit: String,
  price: String,
  category: String,
  available_for: String[]
}

@Component({
  selector: 'app-catelouge-configurations',
  templateUrl: './catelouge-configurations.component.html',
  styleUrls: ['./catelouge-configurations.component.scss']
})
export class CatelougeConfigurationsComponent implements OnInit, AfterViewInit {
  public innerWidth: any;

  loadsh = _
  current = 1;
  totalPages = 1;
  pages: any
  endPage = 1;
  startPage = 1;
  faEdit = faEdit
  faSortRef = faSort
  faSortProd = faSort
  faSearch = faSearch
  faPlusCircle = faPlusCircle
  field: string = '';
  isLoading = false
  sortType: any = null
  @ViewChild('sidenav') sidenav: any;
  @ViewChild('tableView') tableView: any;
  avilableBranches: any = []
  sortField: any = null
  tableData: any = []
  backup: any = []
  displayedColumns = ["refernce", "product_name", "unit", "price", "category", "available_for", "available_for1", "action"]
  paramsFromParent: ParamMap
  indexSelected: number
  subscribtion: any
  url_array: any = []
  constructor(private router: Router, private activeRoute: ActivatedRoute, private commonServices: CommonService, private apiServices: APIServices) {
    this.commonServices.commonEmitter.subscribe((res: any) => {
      this.get_catelouges()
    })
    this.commonServices.select_branch.subscribe((branch_info: any) => {
      let array = branch_info.map(function (element: any) { return element._id; })

      this.get_catelouges(null, array)
    })
    this.commonServices.url_updated.subscribe((date: any) => {
      this.url_array = date
    })

    this.subscribtion = this.commonServices.exportClicked.subscribe((_: any) => {
      if (this.url_array[1] == "configurations" && this.url_array[2] == "catalouge") {
        let data = this.loadsh.map(this.tableData, (o: any) => this.loadsh.pick(o, ['reference', 'inventory_name', 'unit', 'price', 'category_id', 'branch_name_array']));
        this.downloadFile(data)
      }
    })
  }
  ngAfterViewInit() {
    this.paramsFromParent = this.activeRoute.snapshot.paramMap;
    if (this.paramsFromParent.get("toAddCategory")) {
      this.openSideBar(this.paramsFromParent.get("field") || "")
    }
    this.get_branches()
    this.get_catelouges()
  }
  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(i => this.startPage + i);
  }

  sort(field: any) {
    if (this.sortField != field) {
      this.sortType = null
      if (field == 'reference') {
        this.faSortRef = faSortAlphaUp
        this.faSortProd = faSort
      }
      else {
        this.faSortRef = faSort
        this.faSortProd = faSortAlphaUp
      }
    }
    this.sortField = field
    if (this.sortType == null) {
      let sorted = _.sortBy(this.tableData, (data) => {
        return field == 'reference' ? data.reference : data.inventory_name
      })
      this.tableData = sorted
      this.sortType = "asc"

      if (field == 'reference') {
        this.faSortRef = faSortAlphaUp
        this.faSortProd = faSort
      }
      else {
        this.faSortRef = faSort
        this.faSortProd = faSortAlphaUp
      }
    }
    else if (this.sortType == 'asc') {
      let sorted = _.sortBy(this.tableData, (data) => {
        return field == 'reference' ? data.reference : data.inventory_name
      })
      this.tableData = sorted.reverse()
      this.sortType = "desc"

      if (field == 'reference') {
        this.faSortRef = faSortAlphaDown
        this.faSortProd = faSort
      }
      else {
        this.faSortRef = faSort
        this.faSortProd = faSortAlphaDown
      }
    }
    else {
      this.tableData = this.backup
      this.sortType = null
      this.faSortRef = faSort
      this.faSortProd = faSort
    }
  }
  get_catelouges(device_id: any = null, list: any = null) {
    this.isLoading = true
    this.apiServices.getCatelouge({ branch_list: list }).subscribe((response) => {
      if (response.success) {
        console.log(response);
        this.isLoading = false
        this.tableData = response.data.inventories
        this.backup = this.tableData
        this.sortType = this.sortType == 'asc' ? null : this.sortType == 'desc' ? 'asc' : null
        this.sort(this.sortField)
      }
      else {
        this.commonServices.showAlert(response.message)
      }
    })
  }
  get_branches() {
    this.apiServices.get_branch({}).subscribe(
      (res) => {
        if (res.success) {
          this.avilableBranches = res.data.branch_list;
        }
        else {
          this.commonServices.showAlert(res.message);
        }
      }
    )
  }

  getCatelougs(page: Number = 1) {
    console.log(page);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }
  openSideBar(field: string, row: number = -1) {
    this.field = field;
    this.indexSelected = row
    this.sidenav.toggle()
  }

  search(value: any) {
    this.apiServices.searchCatelouge({ search_string: value }).subscribe(res => {
      this.tableData = res.data
    })
  }
  push() {
    if (this.field == "addinv") {
      this.commonServices.catelougeEmitter.emit(null)
    }
    else {
      if (this.paramsFromParent.get("category") != null) {
        this.commonServices.catelougeEmitter.emit({ data: this.tableData, index: this.paramsFromParent.get("index") })
      }
      else {
        this.commonServices.catelougeEmitter.emit({ data: this.tableData, index: this.indexSelected })
      }
    }
  }
  closed() {
    this.commonServices.resetForms.emit()
  }

  downloadFile(data: any) {
    console.log(this.tableView)
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.tableView.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, "catelouge.xls");
    this.subscribtion.unsubscribe()
    this.commonServices.export_success.emit()
  }
}
