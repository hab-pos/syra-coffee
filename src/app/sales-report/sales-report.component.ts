import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { category } from '../pos-management/pos-management.component';
import { MatTabChangeEvent } from '@angular/material/tabs'
import { faSearch, faSort } from '@fortawesome/free-solid-svg-icons';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { APIServices } from "../APIServices/api-services"
import { CommonService } from "../common.service"
import { ILoadedEventArgs, Series } from '@syncfusion/ej2-angular-charts';
import * as _ from "lodash";
import { FormControl } from '@angular/forms';
import * as XLSX from "xlsx";
import * as moment from 'moment';

export var subscription: any = null

export interface sales {
  name: String;
  unit_sold: Number;
  total_without_iva: Number;
  total_with_iva: Number;
}
@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements AfterViewInit {

  @ViewChild('todayBilling') todayBillingChart: any
  @ViewChild('yesterdayBilling') yesterdayBillingChart: any
  @ViewChild('chart_category') chartCategory: any
  @ViewChild('chart_product') chartProduct: any
  is_loading_billing  = false
  is_loading_category = false
  is_loading_product = false
  is_loading_category_list = false
  selectedIndex: number = 0
  categories: category[] = []

  allComplete: boolean = false;

  best_category = [
    { color: "#3f9f97", name: "Coffee", earned: 316.87 },
    { color: "#8cbeba", name: "Cappuccino", earned: 218.87 },
  ]
  worstCategories = [
    { color: "#de7c84", name: "Coffee", earned: 316.87 },
    { color: "#de7c6f", name: "Coffee", earned: 100.87 }
  ]

  graphData_category: any = [];
  graphData_product: any = [];
  backup: any = []
  loadsh = _
  Pagewidth: number = 0;

  display_coloumns = ["name", "count", "price_without_iva", "price_with_iva"]
  display_headers: string[] = []

  primaryXAxis: any = null
  primaryXAxisCategory: any = null
  yesterday_XAxis: any = null
  primaryYAxis = {
    valueType: 'Double',
    majorGridLines: {
      visible: false,
    },
    majorTickLines: {
      width: 0,
    },
    lineStyle: { width: 0 },
  };

  public zoomSettings: Object = {
    mode: 'X',
    enableMouseWheelZooming: false,
    enablePinchZooming: false,
    enableSelectionZooming: false,
    enableScrollbar: true,
    toolbarItems: ['Zoom', 'Pan']
  };

  public chartArea: Object = {
    border: {
      width: 0
    },
    lineStyle: { width: 0 },
  };

  yesterday_yAxis = {
    valueType: 'Double',
    isInversed: true,
    majorTickLines: {
      width: 0,
    },
    lineStyle: { width: 0 },
  }

  radius = { bottomLeft: 7, bottomRight: 7, topLeft: 7, topRight: 7 };

  pallets: String[] = []

  faSearch = faSearch
  faSort = faSort
  searchProductsKeys: { id: string, name: string }[] = []

  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild(MatSort) sort: MatSort;

  dataSourceCategory: MatTableDataSource<any>

  dataSourceProduct: MatTableDataSource<any>
  inputField = new FormControl('');

  constructor(private apiService: APIServices, private commonService: CommonService) {
    this.resizeGraph()
  }

  resizeGraph() {
    this.primaryXAxis = {
      valueType: 'Category',
      majorGridLines: {
        width: 0
      },
      majorTickLines: {
        width: 0,
      },
      lineStyle: { width: 0 },
      interval: 1,
      zoomFactor: (this.dates_selected != null && this.dates_selected?.start != this.dates_selected?.end && this.dates_selected?.end != null) && this.salesStats?.sales_sorted?.length > 15 ? 0.55 : 1,
    };

    this.yesterday_XAxis = {
      valueType: 'Category',
      majorGridLines: {
        width: 0
      },
      majorTickLines: {
        width: 0,
      },
      lineStyle: { width: 0 },
      interval: 1,
      zoomFactor: (this.dates_selected != null && this.dates_selected?.start != this.dates_selected?.end && this.dates_selected?.end != null) && this.salesStats?.previous_sales_sorted?.length > 15 ? 0.55 : 1,
    }

    let maximumValue = 0
    for (let index = 0; index < this.graphData_category.length; index++) {
      const element = this.graphData_category[index];
      if (maximumValue < element.length) {
        maximumValue = element.length
      }
    }

    this.primaryXAxisCategory = {
      valueType: 'Category',
      majorGridLines: {
        width: 0
      },
      majorTickLines: {
        width: 0,
      },
      lineStyle: { width: 0 },
      interval: 1,
      zoomFactor: (this.dates_selected != null && this.dates_selected?.start != this.dates_selected?.end && this.dates_selected?.end != null) && maximumValue > 10 ? 0.55 : 1
    };

    let maximumValuePdt = 0
    for (let index = 0; index < this.graphData_product.length; index++) {
      const element = this.graphData_product[index];
      if (maximumValuePdt < element.length) {
        maximumValuePdt = element.length
      }
    }

    this.primaryXAxisCategory = {
      valueType: 'Category',
      majorGridLines: {
        width: 0
      },
      majorTickLines: {
        width: 0,
      },
      lineStyle: { width: 0 },
      interval: 1,
      zoomFactor: (this.dates_selected != null && this.dates_selected?.start != this.dates_selected?.end && this.dates_selected?.end != null) && maximumValuePdt > 10 ? 0.55 : 1,
    };
  }

  public load(args: ILoadedEventArgs): void {
    args.chart.zoomModule.isZoomed = true;
  };

  ngOnInit(): void {
    this.Pagewidth = window.innerWidth
  }
  totCount = 0
  totPriceWoVAT = 0
  totWVAT = 0
  category_graph_Data: any = []
  getCategorySales() {
    this.is_loading_category = true
    let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.branch_selected = branch_list?.map(function (element: any) { return element._id })
    this.branch_selected = this.branch_selected?.length == 0 ? null : this.branch_selected

    this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    this.branch_selected = this.branch_selected == "syra-all" ? null : this.branch_selected

    this.apiService.generateCategorysalesReport({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(response => {
      this.backup = response.data.category_grouped
      this.is_loading_category = false
      this.totCount = 0
      this.totPriceWoVAT = 0
      this.totWVAT = 0
      this.backup.forEach((element: any) => {
        element.name = element.category_info.category_name
        this.totCount += Number(element.count)
        this.totPriceWoVAT += Number(element.price_without_iva)
        this.totWVAT += Number(element.price_with_iva)
      });

      this.dataSourceCategory = new MatTableDataSource(this.backup);
      this.dataSourceCategory.sort = this.sort;

      this.best_category = response.data.best_categories
      this.worstCategories = response.data.worst_categories

      this.category_graph_Data = this.best_category.concat(this.worstCategories)
      setTimeout(() => {
        this.loadGraph()
      }, 1);
      this.loadGraph()
    })

  }
  backup_products: any = []
  best_products: any = []
  worst_products: any = []
  product_graph_Data: any = []
  getNumber(theNumber: any) {
    if (theNumber > 0) {
      return "+" + theNumber.toFixed(2);
    } else {
      return theNumber.toFixed(2);
    }
  }
  getProductSales() {
    this.is_loading_product = true
    let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.branch_selected = branch_list?.map(function (element: any) { return element._id })
    this.branch_selected = this.branch_selected?.length == 0 ? null : this.branch_selected
    this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    this.branch_selected = this.branch_selected == "syra-all" ? null : this.branch_selected

    this.apiService.generateProductSalesReport({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(response => {
      this.backup_products = response.data.product_grouped
      this.is_loading_product = false
      this.totCount = 0
      this.totPriceWoVAT = 0
      this.totWVAT = 0
      this.backup_products.forEach((element: any) => {
        element.name = element.product_info.product_name
        this.totCount += Number(element.count)
        this.totPriceWoVAT += Number(element.price_without_iva)
        this.totWVAT += Number(element.price_with_iva)
      });

      this.dataSourceProduct = new MatTableDataSource(this.backup_products);
      this.dataSourceProduct.sort = this.sort;

      this.best_products = response.data.best_products
      this.worst_products = response.data.worst_products

      this.product_graph_Data = this.best_products.concat(this.worst_products)

      setTimeout(() => {
        this.loadGraphPdt()
      }, 1);
      this.loadGraphPdt()
    })
  }
  palletsPdt: any = []
  loadGraphPdt(gpData: any = []) {
    this.palletsPdt = []
    let data_toPush: any = []
    let data_to_be_casted = gpData
    let backupComparision = this.searchProductsKeys.length == 0 ? this.product_graph_Data : data_to_be_casted
    if (this.dates_selected == null || this.dates_selected.end == null || this.dates_selected.start == this.dates_selected.end) {
      backupComparision = _.map(backupComparision, function filterate(n) {
        return n.HourBased;
      })
    }
    else {
      backupComparision = _.map(backupComparision, function filterate(n) {
        return n.DateBased;
      })
    }
    backupComparision.forEach((category: any, index: any) => {
      let array: any = []
      let value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      if (this.searchProductsKeys.length == 0) {
        this.palletsPdt = ["#8cbeba","#3f9f97", "#de7c84", "#de7c64"]
      }
      else {
        this.palletsPdt.push(category[0].product_info.color)
      }
      if (this.dates_selected == null || this.dates_selected.end == null || this.dates_selected.start == this.dates_selected.end) {

        category.forEach((item: any, index: any) => {

          value[Number(item.time_slot) + 2] = item.price_with_iva
        })

        value.forEach((element: any, index: any) => {
          let obj: any = { hour: index, amount: element }
          array.push(obj)
        });
        data_toPush.push(array)
      }
      else {
        let TimeLine: any = []
        for (var m = moment(this.dates_selected.start); m.diff(this.dates_selected.end, 'days') <= 0; m.add(1, 'days')) {
          TimeLine.push(m.format('DD/MM'))
        }
        // category.forEach((item: any, index: any) => {
        //   if (!TimeLine.includes(item.time_slot)) {
        //     TimeLine.push(item.time_slot)
        //   }
        // })

        TimeLine.forEach((element: any) => {
          let match_found = false
          category.forEach((item: any, index: any) => {
            if (element == item.time_slot) {
              match_found = true
              let obj: any = { hour: element, amount: item.price_with_iva }
              array.push(obj)
            }
          })
          if (match_found == false) {
            let obj: any = { hour: element, amount: 0 }
            array.push(obj)
          }
        });
        let arraySorted = _.sortBy(array, (data, index) => {
          return data.hour
        })
        data_toPush.push(arraySorted)
      }
    });

    this.graphData_product = data_toPush

    this.chartProduct?.series.forEach((element : any,index : any) => {
      console.log(element)
      this.chartProduct.series[index].dataSource = data_toPush[index]
    });
    // this.chartProduct?.refresh()
    this.refreshGraphs()
    this.resizeGraph()
  }

  loadGraph(gpData: any = []) {
    this.pallets = []
    let data_toPush: any = []
    let data_to_be_casted = gpData.length > 0 ? gpData : this.dataSourceCategory.data
    let backupComparision = this.getCheckBoxStatus() == false ? this.category_graph_Data : data_to_be_casted
    if (this.dates_selected == null || this.dates_selected.end == null || this.dates_selected.start == this.dates_selected.end) {
      backupComparision = _.map(backupComparision, function filterate(n) {
        return n.HourBased;
      })
    }
    else {
      backupComparision = _.map(backupComparision, function filterate(n) {
        return n.DateBased;
      })
    }

    this.pallets = []
    backupComparision.forEach((category: any, index: any) => {
      let array: any = []
      let value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      if (this.getCheckBoxStatus() == false) {
        this.pallets = ["#8cbeba","#3f9f97", "#de7c84", "#de7c64"]
      }
      else {
        this.pallets.push(category[0].category_info.color)
      }
      if (this.dates_selected == null || this.dates_selected.end == null || this.dates_selected.start == this.dates_selected.end) {

        category.forEach((item: any, index: any) => {

          value[Number(item.time_slot) + 2] = item.price_with_iva
        })

        value.forEach((element: any, index: any) => {
          let obj: any = { hour: index, amount: element }
          array.push(obj)
        });
        data_toPush.push(array)
      }
      else {
        let TimeLine: any = []

        for (var m = moment(this.dates_selected.start); m.diff(this.dates_selected.end, 'days') <= 0; m.add(1, 'days')) {
          TimeLine.push(m.format('DD/MM'))
        }
        // category.forEach((item: any, index: any) => {
        //   if (!TimeLine.includes(item.time_slot)) {
        //     TimeLine.push(item.time_slot)
        //   }
        // })

        TimeLine.forEach((element: any) => {
          let match_found = false
          category.forEach((item: any, index: any) => {
            if (element == item.time_slot) {
              match_found = true
              let obj: any = { hour: element, amount: item.price_with_iva }
              array.push(obj)
            }
          })
          if (match_found == false) {
            let obj: any = { hour: element, amount: 0 }
            array.push(obj)
          }
        });
        let arraySorted = _.sortBy(array, (data, index) => {
          return data.hour
        })
        data_toPush.push(arraySorted)
      }
    });

    this.graphData_category = data_toPush
    this.refreshGraphs()
    this.resizeGraph()
  }
  getFooter(col: any) {
    switch (col) {
      case "name":
        return "Total"
      case "count":
        return this.totCount
      case "price_without_iva":
        return this.totPriceWoVAT.toFixed(2) + "€";
      default:
        return this.totWVAT.toFixed(2) + "€";
    }
  }
  url_array = []
  ngAfterViewInit() {
    this.loadHeader()

    this.getGlobalSalesReport()
    this.getCategorySales()
    this.get_categories()
    this.getProductSales()

    if (subscription == null) {
      subscription = this.commonService.exportClicked.subscribe((res: any) => {
        if (this.url_array[1] == "reports" && this.url_array[2] == "sales") {
          let branch_list = JSON.parse(localStorage.getItem('branch_list') || "")
          let array_doc: any = []

          let row_title_header = ["Products"]
          let date = [""]
          branch_list.forEach((element: any) => {
            row_title_header.push(element.branch_name)
            date.push("")
          });
          row_title_header.push("Total")

          let product_sorted = _.sortBy(this.dataSourceProduct.data, (data, index) => {
            return data.product_info.product_name
          })
          this.dataSourceCategory.data.forEach((element: any) => {
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            if(this.dates_selected == null){
              date[Math.round(date.length / 2)] = moment().format("DD/MM/YYYY")
            }
            else if(this.dates_selected.start != null && this.dates_selected.end != null ){
              date[Math.round(date.length / 2)] = moment(this.dates_selected.start).format("DD/MM/YYYY") + "-" + moment(this.dates_selected.end).format("DD/MM/YYYY")
            }
            else{
              date[Math.round(date.length / 2)] = moment(this.dates_selected.start).format("DD/MM/YYYY")
            }
            array_doc.push(date)
            array_doc.push(row_title_header)
            product_sorted.forEach((element_product: any) => {
              if (element_product.product_info.categories.includes(element.category_id)) {
                let row: any = [element_product.product_info.product_name]
                branch_list.forEach((element_branch: any, index_branch: any) => {
                  row.push(0)
                })
                let total_pdts_sold = 0
                for (let index_branch = 0; index_branch < branch_list.length; index_branch++) {
                  const element_branch = branch_list[index_branch];
                  for (let index_branch_products = 0; index_branch_products < element_product.info.length; index_branch_products++) {
                    const element_branch_products = element_product.info[index_branch_products];
                    if (element_branch._id == element_branch_products.branch_id) {
                      row[index_branch + 1] = element_branch_products.count
                      total_pdts_sold += Number(element_branch_products.count)
                    }
                  }
                }
                row.push(total_pdts_sold)
                array_doc.push(row)
                total_pdts_sold = 0
              }
            })

            let row_footer: any = ["TOTAL"]
            for (let index = 2; index < array_doc.length; index++) {
              const element_row = array_doc[index];
              for (let index_j = 1; index_j < element_row.length; index_j++) {
                const element_col = element_row[index_j];

                if (row_footer[index_j]) {
                  row_footer[index_j] += element_col;
                } else {
                  row_footer[index_j] = element_col;
                }
              }
            }
            array_doc.push(row_footer)

            const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(array_doc)
            
            const merge = [
              { s: { r: 0, c: 0 }, e: { r: 0, c:  row_title_header.length - 1} },
            ];
            ws["!merges"] = merge
            XLSX.utils.sheet_add_aoa(ws, [
              [date[Math.round(date.length / 2)]]
            ], { origin: 0 });
      
            XLSX.utils.book_append_sheet(wb, ws, element.category_info.category_name);
            XLSX.writeFile(wb, element.category_info.category_name.toUpperCase() + ".xls");

            array_doc = []
          });
          this.commonService.export_success.emit()
        }
      })

      this.commonService.choose_date.subscribe((selectedDates: any) => {
        this.dataSourceProduct.data = []
        this.dataSourceCategory.data = []
        this.best_products = []
        this.worst_products = []
        this.setAll(false)
        this.getGlobalSalesReport()
        this.getCategorySales()
        this.getProductSales()

      })
      this.commonService.select_branch.subscribe((selectedBranch: any) => {
        this.dataSourceProduct.data = []
        this.dataSourceCategory.data = []
        this.best_products = []
        this.worst_products = []
        this.setAll(false)
        this.getGlobalSalesReport()
        this.getCategorySales()
        this.getProductSales()
      })
      this.commonService.url_updated.subscribe((date: any) => {
        this.url_array = date
      })
    }
  }

  refreshGraphs() {
    if (this.selectedIndex == 0) {
      this.todayBillingChart?.refresh()
      this.yesterdayBillingChart?.refresh()
    }
    if (this.selectedIndex == 1) {
      this.chartCategory?.refresh()
    }
    if (this.selectedIndex == 2)  {
      this.chartProduct?.refresh()
    }
  }

  searchKeys: any = []
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const index = this.searchKeys.indexOf(value.trim());
    if (!(index >= 0)) {
      if ((value || '').trim()) {
        this.searchProductsKeys.push({ id: "", name: value.toLowerCase() });
        this.searchKeys.push(value.trim().toLowerCase())
      }

      if (input) {
        input.value = '';
      }

    }
    this.search(this.searchKeys)
  }

  remove(fruit: any): void {
    const index = this.searchProductsKeys.indexOf(fruit);

    if (index >= 0) {
      this.searchProductsKeys.splice(index, 1);
      this.searchKeys.splice(index, 1);

    }
    this.search(this.searchKeys)
  }

  search(keys: any) {
    if (keys.length == 0) {
      if (this.category_selected.length > 0) {
        let array = []
        for (let index = 0; index < this.backup_products.length; index++) {
          const element = this.backup_products[index];
          for (let indexCategory = 0; indexCategory < element.product_info.categories.length; indexCategory++) {
            const element_category = element.product_info.categories[indexCategory];
            if (this.categoryId_Selected.includes(element_category)) {
              array.push(element)
            }
          }
        }
        this.dataSourceProduct.data = array
      }
      else {
        this.dataSourceProduct.data = this.backup_products
      }
    }
    else {
      this.dataSourceProduct.data = this.backup_products.filter((t: any) => keys.includes(t.name.trim().toLowerCase()))
    }

    this.totCount = 0
    this.totPriceWoVAT = 0
    this.totWVAT = 0
    this.dataSourceProduct.data.forEach((element: any) => {
      this.totCount += Number(element.count)
      this.totPriceWoVAT += Number(element.price_without_iva)
      this.totWVAT += Number(element.price_with_iva)
    });
    setTimeout(() => {
      this.loadGraphPdt(this.dataSourceProduct.data)
    }, 1);
    this.loadGraphPdt(this.dataSourceProduct.data)
  }
  updateAllComplete(row: number, checked: boolean) {
    this.categories[row].is_active = checked
    this.allComplete = this.categories != null && this.categories.every(t => t.is_active);
    let filtered = this.categories.filter(t => t.is_active)
    this.compare(filtered)
  }

  category_selected: any
  categoryId_Selected: any
  compare(selectedCategories: any) {

    let CategoryArray = selectedCategories.map((obj: any, index: any) => {
      return obj.category_name
    })

    let CategoryIdArray = selectedCategories.map((obj: any, index: any) => {
      return obj._id
    })
    this.category_selected = CategoryArray
    this.categoryId_Selected = CategoryIdArray
    if (CategoryArray.length == 0) {
      this.dataSourceCategory.data = this.backup
      this.dataSourceProduct.data = this.backup_products
    }
    else {
      this.dataSourceCategory.data = this.backup.filter((t: any) => CategoryArray.includes(t.name))
      let array = []
      for (let index = 0; index < this.backup_products.length; index++) {
        const element = this.backup_products[index];
        for (let indexCategory = 0; indexCategory < element.product_info.categories.length; indexCategory++) {
          const element_category = element.product_info.categories[indexCategory];
          if (CategoryIdArray.includes(element_category)) {
            array.push(element)
          }
        }
      }
      this.dataSourceProduct.data = array
    }
    this.searchProductsKeys = []
    this.searchKeys = []
    //clear category selection api call when on pdcts tab
    this.worst_products = JSON.parse(JSON.stringify(this.dataSourceProduct.data.slice(0, 2)))
    this.best_products = JSON.parse(JSON.stringify(this.dataSourceProduct.data.slice(-2)))
    if (this.best_products.length > 0) {
      this.best_products[0].color = "#3f9f97"
      this.best_products[1].color = "#8cbeba"
    }

    if (this.worst_products.length > 0) {
      this.worst_products[0].color = "#de7c84"
      this.worst_products[1].color = "#de7c64"
    }

    this.totCount = 0
    this.totPriceWoVAT = 0
    this.totWVAT = 0
    this.dataSourceCategory.data.forEach((element: any) => {
      this.totCount += Number(element.count)
      this.totPriceWoVAT += Number(element.price_without_iva)
      this.totWVAT += Number(element.price_with_iva)
    });

    let gpData = this.backup.filter((t: any) => CategoryArray.includes(t.name))
   
    this.product_graph_Data = this.best_products.concat(this.worst_products)

    setTimeout(() => {
      this.loadGraph(gpData)
    }, 1);
    this.loadGraph(gpData)
    this.loadGraphPdt()
  }
  someComplete(): any {
    if (this.categories == null) {
      return false;
    }
    return this.categories.filter(t => t.is_active).length > 0 && !this.allComplete;
  }

  getCheckBoxStatus() {
    return this.categories.filter(t => t.is_active).length > 0
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.categories == null) {
      return;
    }
    this.categories.forEach(t => {
      t.is_active = completed
    });
    this.compare(this.categories)
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
    this.loadHeader()

    this.refreshGraphs()
  }
  salesStats: any = null
  dates_selected: any = null
  branch_selected: any = null
  tooltipGlobal = {
    enable: true,
    format: '${point.x} : <b>${point.y}€</b>'
  }

  getGlobalSalesReport() {
    let data_toPush: any = []
    let value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.is_loading_billing = true
    let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.branch_selected = branch_list?.map(function (element: any) { return element._id })
    this.branch_selected = this.branch_selected?.length == 0 ? null : this.branch_selected

    this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    this.branch_selected = this.branch_selected == "syra-all" ? null : this.branch_selected

    this.apiService.generateGlobalsalesReport({ dates: this.dates_selected, branch: this.branch_selected }).subscribe(response => {
      this.salesStats = response.data
      this.is_loading_billing = false
      if (this.dates_selected == null || this.dates_selected.end == null || (this.dates_selected.end == this.dates_selected.start)) {
        response.data.sales_sorted.forEach((element: any, index: any) => {
          value[Number(element.hour)] = element.amount
        });

        value.forEach((element: any, index: any) => {
          let obj: any = { hour: index, amount: element }
          data_toPush.push(obj)
        });

        this.salesStats.sales_sorted = response.data.sales_sorted.length > 0 ? data_toPush : []

        value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        data_toPush = []
        response.data.previous_sales_sorted.forEach((element: any, index: any) => {
          value[Number(element.hour)] = element.amount
        });

        value.forEach((element: any, index: any) => {
          let obj: any = { hour: index, amount: element }
          data_toPush.push(obj)
        });
        this.salesStats.previous_sales_sorted = response.data.previous_sales_sorted.length > 0 ? data_toPush : []
      }
      this.resizeGraph()
    })
  }

  get_categories() {
    this.is_loading_category_list = true
    this.apiService.getCategories().subscribe((response: any) => {
      if (response.success) {
        this.categories = response.data.category
        this.is_loading_category_list = false
      }
      else {
        this.commonService.showAlert(response.message)
      }
    })
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.Pagewidth = window.innerWidth;
  }
  loadHeader() {
    if (this.selectedIndex == 1) {
      this.display_headers = ["CATEGORY", "UNITS SOLD", "TOTAL SIN IVA", "TOTAL CON IVA"]
    } else {
      this.display_headers = ["PRODUCTS", "UNITS SOLD", "TOTAL SIN IVA", "TOTAL CON IVA"]
    }
  }
}


