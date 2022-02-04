import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { faArrowDown ,faSort,faAdjust} from '@fortawesome/free-solid-svg-icons';
import { CommonService } from '../common.service';
import { APIServices } from '../APIServices/api-services'
import * as _ from "lodash";
import { } from 'googlemaps';
// import { Loader } from "@googlemaps/js-api-loader"
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface City {
  center: google.maps.LatLngLiteral;
  population: number;
}
// const loader = new Loader({
//   apiKey: "AIzaSyAzbQF8oEP1TPqdFSC9GPphUAHzZVH0vXg",
//   version: "weekly",
// });
@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss']
})

export class CrmComponent implements OnInit, AfterViewInit {

  map: any;
  faSort = faSort
  faFilter = faAdjust
  faArrowDown = faArrowDown
  toDate = ""
  loadsh = _
  isLoadingGrpah = false
  isLoadingReport = false
  is_online_cheked = true
  is_offline_checked = true
  branch_sales: Object[] = [
  ]
  isFilterChecked = false
  filterIconUrl = ""
  public chartArea: Object = {
    border: {
      width: 0
    },
  };
  primaryXAxis = {
    valueType: 'Category',
    majorGridLines: {
      width: 0
    },
    majorTickLines: {
      width: 0,
    },
    lineStyle: { width: 0 },
    interval: 1,
    labelIntersectAction: "Rotate45",
  };
  primary_stacked_col_y_price = {
    valueType: 'Double',
    labelFormat: '{value}€',
    visible: true,
    majorTickLines: {
      width: 0,
    },
    lineStyle: { width: 0 },
  }

  primary_stacked_col_y_qty = {
    valueType: 'Double',
    visible: true,
    majorTickLines: {
      width: 0,
    },
    lineStyle: { width: 0 },
  }


  tooltipGlobal = {
    enable: true,
    format: '${point.x} : <b>${point.y}€</b>'
  }
  groupe_mode_of_sales = ["POS", "APP", "ECOMMERCE"]
  pallets = ["#47545E", "#4D9E96", "#DF7C84"]
  graphData: any = [
    [
      { hour: 20, amount: 30 },
      { hour: 21, amount: 45 },
      { hour: 22, amount: 55 },
      { hour: 24, amount: 30 },
      { hour: 25, amount: 50 },
      { hour: 26, amount: 25 },
      { hour: 27, amount: 40 },
    ],
    [
      { hour: 20, amount: 30 },
      { hour: 21, amount: 45 },
      { hour: 22, amount: 55 },
      { hour: 24, amount: 30 },
      { hour: 25, amount: 50 },
      { hour: 26, amount: 25 },
      { hour: 27, amount: 40 },
    ],
    [
      { hour: 20, amount: 30 },
      { hour: 21, amount: 45 },
      { hour: 22, amount: 55 },
      { hour: 24, amount: 30 },
      { hour: 25, amount: 50 },
      { hour: 26, amount: 25 },
      { hour: 27, amount: 40 },
    ],
  ]


  graphData_per_branch: any = [
    [
      { hour: 20, amount: 30 },
      { hour: 21, amount: 45 },
      { hour: 22, amount: 55 },
      { hour: 24, amount: 30 },
      { hour: 25, amount: 50 },
      { hour: 26, amount: 25 },
      { hour: 27, amount: 40 },
    ],
    [
      { hour: 20, amount: 30 },
      { hour: 21, amount: 45 },
      { hour: 22, amount: 55 },
      { hour: 24, amount: 30 },
      { hour: 25, amount: 50 },
      { hour: 26, amount: 25 },
      { hour: 27, amount: 40 },
    ],
    [
      { hour: 20, amount: 30 },
      { hour: 21, amount: 45 },
      { hour: 22, amount: 55 },
      { hour: 24, amount: 30 },
      { hour: 25, amount: 50 },
      { hour: 26, amount: 25 },
      { hour: 27, amount: 40 },
    ],
    [
      { hour: 20, amount: 30 },
      { hour: 21, amount: 45 },
      { hour: 22, amount: 55 },
      { hour: 24, amount: 30 },
      { hour: 25, amount: 50 },
      { hour: 26, amount: 25 },
      { hour: 27, amount: 40 },
    ]
  ]
  branches = ["Gracia", "Diputacio", "Poplenou", "Parel-lel", "Passing San Juan", "Ecommerce"]
  pallets_branches = ["#47545E", "#449F97", "#DF7C84", "#EDBC83", "#7596D5", "#A678CE"]

  citymap_offline: Record<string, City> = {
    diputacio: {
      center: { lat: 41.3843936, lng: 2.1588444 },
      population: 100,
    },
    pobloune: {
      center: { lat: 41.3965511, lng: 2.1941618 },
      population: 152,
    },
    Gracia: {
      center: { lat: 41.4015125, lng: 2.1595149 },
      population: 120,
    },
    londres: {
      center: { lat:41.3939109, lng: 2.1493482 },
      population: 227,
    },
    maria_cubi : {
      center: { lat:41.3987376, lng: 2.1481485 },
      population: 280
    },
    vig_agusta : {
      center: { lat:41.3887844, lng: 2.1534999 },
      population: 124
    },
    bercelona : {
      center: { lat:41.4190362, lng: 2.1574323 },
      population: 98
    },
    sants : {
      center: { lat:41.4252481, lng: 2.2145278 },
      population: 176
    },
    gervasi : {
      center: { lat:41.4166567, lng: 2.1874287 },
      population: 300
    },
  };

  citymap_online: Record<string, City> = {
    la_saraga: {
      center: { lat: 41.4216956, lng: 2.1812312 },
      population: 100,
    },
    la_verneda: {
      center: { lat: 41.4236281, lng: 2.1946037 },
      population: 152,
    },
    el_besosi: {
      center: { lat: 41.4147627, lng: 2.2085157 },
      population: 120,
    },
    pobeloune: {
      center: { lat:41.3995667, lng: 2.1935128 },
      population: 227,
    },
    maria_cubi : {
      center: { lat:41.3900306, lng: 2.1875947 },
      population: 107
    },
    gervasi : {
      center: { lat:41.4121091, lng: 2.1929161 },
      population: 300
    },
  };
  bounds : any = null;

  markers : any = []

  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<any>

  user_buisness_data : any = [
    {user_id : "B12345", first_name : "Maher", last_name : "Mansour",email : "mm@gmail.com",phone : "+31 6565656566",address : "R Dos Bragas",city : "Porto",country : "Portugal", date_of_birth : "10-12-1988",created : "10-10-20",Active : "YES",channel : "Online",top_store : "Ecommerce",store_visited : "2",top_prod1 : "Cappucino",top_prod2 : "Cartado",top_prod3 : "Cookie",transactions_online : 15, transaction_offline : 0, amount_spent_online : 500, amount_spent_offline : 0, total_transactions : 15, total_amount : 500,last_transaction : "10-10-2020",beans_generated : 50,beans_used : 10,bean_balenced : 40,gift_shared : 2 },
    {user_id : "B12345", first_name : "Maher", last_name : "Mansour",email : "mm@gmail.com",phone : "+31 6565656566",address : "R Dos Bragas",city : "Porto",country : "Portugal", date_of_birth : "10-12-1988",created : "10-10-20",Active : "YES",channel : "Online",top_store : "Ecommerce",store_visited : "2",top_prod1 : "Cappucino",top_prod2 : "Cartado",top_prod3 : "Cookie",transactions_online : 15, transaction_offline : 0, amount_spent_online : 500, amount_spent_offline : 0, total_transactions : 15, total_amount : 500,last_transaction : "10-10-2020",beans_generated : 50,beans_used : 10,bean_balenced : 40,gift_shared : 2 },
    {user_id : "B12345", first_name : "Maher", last_name : "Mansour",email : "mm@gmail.com",phone : "+31 6565656566",address : "R Dos Bragas",city : "Porto",country : "Portugal", date_of_birth : "10-12-1988",created : "10-10-20",Active : "YES",channel : "Online",top_store : "Ecommerce",store_visited : "2",top_prod1 : "Cappucino",top_prod2 : "Cartado",top_prod3 : "Cookie",transactions_online : 15, transaction_offline : 0, amount_spent_online : 500, amount_spent_offline : 0, total_transactions : 15, total_amount : 500,last_transaction : "10-10-2020",beans_generated : 50,beans_used : 10,bean_balenced : 40,gift_shared : 2 },
    {user_id : "B12345", first_name : "Maher", last_name : "Mansour",email : "mm@gmail.com",phone : "+31 6565656566",address : "R Dos Bragas",city : "Porto",country : "Portugal", date_of_birth : "10-12-1988",created : "10-10-20",Active : "YES",channel : "Online",top_store : "Ecommerce",store_visited : "2",top_prod1 : "Cappucino",top_prod2 : "Cartado",top_prod3 : "Cookie",transactions_online : 15, transaction_offline : 0, amount_spent_online : 500, amount_spent_offline : 0, total_transactions : 15, total_amount : 500,last_transaction : "10-10-2020",beans_generated : 50,beans_used : 10,bean_balenced : 40,gift_shared : 2 },
    {user_id : "B12345", first_name : "Maher", last_name : "Mansour",email : "mm@gmail.com",phone : "+31 6565656566",address : "R Dos Bragas",city : "Porto",country : "Portugal", date_of_birth : "10-12-1988",created : "10-10-20",Active : "YES",channel : "Online",top_store : "Ecommerce",store_visited : "2",top_prod1 : "Cappucino",top_prod2 : "Cartado",top_prod3 : "Cookie",transactions_online : 15, transaction_offline : 0, amount_spent_online : 500, amount_spent_offline : 0, total_transactions : 15, total_amount : 500,last_transaction : "10-10-2020",beans_generated : 50,beans_used : 10,bean_balenced : 40,gift_shared : 2 },
    {user_id : "B12345", first_name : "Maher", last_name : "Mansour",email : "mm@gmail.com",phone : "+31 6565656566",address : "R Dos Bragas",city : "Porto",country : "Portugal", date_of_birth : "10-12-1988",created : "10-10-20",Active : "YES",channel : "Online",top_store : "Ecommerce",store_visited : "2",top_prod1 : "Cappucino",top_prod2 : "Cartado",top_prod3 : "Cookie",transactions_online : 15, transaction_offline : 0, amount_spent_online : 500, amount_spent_offline : 0, total_transactions : 15, total_amount : 500,last_transaction : "10-10-2020",beans_generated : 50,beans_used : 10,bean_balenced : 40,gift_shared : 2 },
    {user_id : "B12345", first_name : "Maher", last_name : "Mansour",email : "mm@gmail.com",phone : "+31 6565656566",address : "R Dos Bragas",city : "Porto",country : "Portugal", date_of_birth : "10-12-1988",created : "10-10-20",Active : "YES",channel : "Online",top_store : "Ecommerce",store_visited : "2",top_prod1 : "Cappucino",top_prod2 : "Cartado",top_prod3 : "Cookie",transactions_online : 15, transaction_offline : 0, amount_spent_online : 500, amount_spent_offline : 0, total_transactions : 15, total_amount : 500,last_transaction : "10-10-2020",beans_generated : 50,beans_used : 10,bean_balenced : 40,gift_shared : 2 },
    {user_id : "B12345", first_name : "Maher", last_name : "Mansour",email : "mm@gmail.com",phone : "+31 6565656566",address : "R Dos Bragas",city : "Porto",country : "Portugal", date_of_birth : "10-12-1988",created : "10-10-20",Active : "YES",channel : "Online",top_store : "Ecommerce",store_visited : "2",top_prod1 : "Cappucino",top_prod2 : "Cartado",top_prod3 : "Cookie",transactions_online : 15, transaction_offline : 0, amount_spent_online : 500, amount_spent_offline : 0, total_transactions : 15, total_amount : 500,last_transaction : "10-10-2020",beans_generated : 50,beans_used : 10,bean_balenced : 40,gift_shared : 2 },
    {user_id : "B12345", first_name : "Maher", last_name : "Mansour",email : "mm@gmail.com",phone : "+31 6565656566",address : "R Dos Bragas",city : "Porto",country : "Portugal", date_of_birth : "10-12-1988",created : "10-10-20",Active : "YES",channel : "Online",top_store : "Ecommerce",store_visited : "2",top_prod1 : "Cappucino",top_prod2 : "Cartado",top_prod3 : "Cookie",transactions_online : 15, transaction_offline : 0, amount_spent_online : 500, amount_spent_offline : 0, total_transactions : 15, total_amount : 500,last_transaction : "10-10-2020",beans_generated : 50,beans_used : 10,bean_balenced : 40,gift_shared : 2 },
    {user_id : "B12345", first_name : "Maher", last_name : "Mansour",email : "mm@gmail.com",phone : "+31 6565656566",address : "R Dos Bragas",city : "Porto",country : "Portugal", date_of_birth : "10-12-1988",created : "10-10-20",Active : "YES",channel : "Online",top_store : "Ecommerce",store_visited : "2",top_prod1 : "Cappucino",top_prod2 : "Cartado",top_prod3 : "Cookie",transactions_online : 15, transaction_offline : 0, amount_spent_online : 500, amount_spent_offline : 0, total_transactions : 15, total_amount : 500,last_transaction : "10-10-2020",beans_generated : 50,beans_used : 10,bean_balenced : 40,gift_shared : 2 }
  ]

  headers_json : any = [
    { header_id : "user_id",header_title : "USER ID", header_Spans : 8},
    { header_id : "first_name",header_title : "FIRST NAME", header_Spans : 8},
    { header_id : "last_name",header_title : "LAST NAME", header_Spans : 8},
    { header_id : "email",header_title : "EMAIL", header_Spans : 8},
    { header_id : "phone",header_title : "PHONE", header_Spans : 8},
    { header_id : "address",header_title : "ADDRESS", header_Spans : 8},
    { header_id : "city",header_title : "CITY", header_Spans : 8},
    { header_id : "country",header_title : "COUNTRY", header_Spans : 8},
    { header_id : "date_of_birth",header_title : "DATE OF BIRTH", header_Spans : 8},
    { header_id : "created",header_title : "CREATED", header_Spans : 10},
    { header_id : "Active",header_title : "ACTIVE", header_Spans : 10},
    { header_id : "channel",header_title : "CHANNEL", header_Spans : 13},
    { header_id : "top_store",header_title : "TOP STORE", header_Spans : 13},
    { header_id : "store_visited",header_title : "STORES VISITED", header_Spans : 13},
    { header_id : "top_prod1",header_title : "TOP PRODUCT - 1", header_Spans : 16},
    { header_id : "top_prod2",header_title : "TOP PRODUCT - 2", header_Spans : 16},
    { header_id : "top_prod3",header_title : "TOP PRODUCT - 3", header_Spans : 16},
    { header_id : "transactions_online",header_title : "# TRANSACTIONS ONLINE", header_Spans : 22},
    { header_id : "amount_spent_online",header_title : "AMOUNT SPENT ONLINE", header_Spans : 22},
    { header_id : "transaction_offline",header_title : "# TRANSACTIONS OFFLINE", header_Spans : 22},
    { header_id : "amount_spent_offline",header_title : "AMOUNT SPENT OFFLINE", header_Spans : 22},
    { header_id : "total_transactions",header_title : "# TRANSACTIONS TOTAL", header_Spans : 22},
    { header_id : "total_amount",header_title : "AMOUNT SPENT TOTAL", header_Spans : 22},
    { header_id : "last_transaction",header_title : "LAST TRANSACTION", header_Spans : 27},
    { header_id : "beans_generated",header_title : "BEANS GENERATED", header_Spans : 27},
    { header_id : "beans_used",header_title : "BEANS USED", header_Spans : 27},
    { header_id : "bean_balenced",header_title : "BEANS BALANCE", header_Spans : 27},
    { header_id : "gift_shared",header_title : "GIFT SHARED", header_Spans : 27},
  ]
  header_Sections_json : any = [
    { id : "empty", title : "",checked : true,span : 1},
    { id : "personal_info", title : "PERSONAL INFO",checked : true,span : 8},
    { id : "membersip", title : "MEMBERSHIP",checked : true,span : 2},
    { id : "channel1", title : "CHANNEL",checked : true,span : 3},
    { id : "products", title : "PRODUCTS",checked : true,span : 3},
    { id : "transaction", title : "TRANSACTIONS",checked : true,span : 6},
    { id : "engagement", title : "ENGAGEMENT",checked : true,span : 5},
  ]
  header_sections_json_backup : any = []
  headers_json_backup : any = []
  constructor(private common_service: CommonService, private apiServices: APIServices) { }
  ngOnInit(): void {
    // loader.load().then(() => {
    // });
  }
  ngAfterViewInit() {
    this.header_sections_json_backup = this.header_Sections_json
    this.dataSource = new MatTableDataSource(this.user_buisness_data);
    this.dataSource.sort = this.sort;
    this.filterIconUrl = this.apiServices.url("/assets/icons/filterIcon.webp")
    this.initMap()
  }
  get_coloumns_user_table(){
     
    return this.headers_json?.map(function (element: any) { return element.header_id })
  }
  get_section_user_table(){
    return this.header_Sections_json?.map(function (element: any) { return element.id })
  }
  initMap(){
    let options : any = {
      center: { lat: 41.3820048, lng: 2.1741849},
      zoom: 14,
      scaleControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      mapId: "e61e42b27c7f7597",
      disableDefaultUI: true,
    }
    this.map = new google.maps.Map(document.getElementById("map_area") as HTMLElement, options);
    this.bounds = new google.maps.LatLngBounds()
    this.is_offline_checked ? this.loadCitySalesMarkers(this.map,this.citymap_offline,"#FF0000") : ''
    this.is_online_cheked ? this.loadCitySalesMarkers(this.map,this.citymap_online,"#E5DD48") : ''
  }
  loadCitySalesMarkers(map : any,citymap : any,color :any){
    let maximum_value = 0
    for (const city in citymap) {
      // Add the circle for this city to the map.
      if(citymap[city].population > maximum_value){
        maximum_value = citymap[city].population
      }
      let loc = new google.maps.LatLng(citymap[city].center.lat,citymap[city].center.lng);
      this.bounds.extend(loc);
    }

    map.fitBounds(this.bounds);
    map.panToBounds(this.bounds); 

    for (const city in citymap) {
      // Add the circle for this city to the map.
      const cityCircle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 0,
        fillColor: color,
        fillOpacity: 0.5,
        map : map,
        center: citymap[city].center,
        radius: citymap[city].population / maximum_value * 500,
      });
      this.markers.push(cityCircle)
    }
  }

  resetMarkers(){
    for (let index = 0; index < this.markers.length; index++) {
      const element = this.markers[index];
      element.setMap(null)
    }
    this.is_offline_checked == true ? this.loadCitySalesMarkers(this.map,this.citymap_offline,"#FF0000") : ''
    this.is_online_cheked == true ? this.loadCitySalesMarkers(this.map,this.citymap_online,"#E5DD48") : ''
  }

  online_clicked(checked : any){
    this.is_online_cheked = checked
    this.resetMarkers()
  }
  offline_clicked(checked : any){
    this.is_offline_checked = checked
    this.resetMarkers()
  }
  public donut_data: any[] = [{
    store: 'Gracia', amount: 10, color: "#47545E"
  }, {
    store: 'Diputacio', amount: 40, color: "#449F97"
  }, {
    store: 'Poplenou', amount: 15, color: "#EDBC83"
  }, {
    store: 'Parel-lel', amount: 15, color: "#DF7C84"
  }, {
    store: 'Passing San Juan', amount: 12, color: "#7596D5"
  }, {
    store: 'Ecommerce', amount: 8, color: "#A678CE"
  }];

  public labelContent(e: any): string {
    return e.value + "%";
  }
 
  onClickFilter(){
    console.log(this.isFilterChecked);
    
    this.isFilterChecked = !this.isFilterChecked
  }
  chooseSections(i : any,checked : any){
    this.header_sections_json_backup[i].checked = checked;
    console.log(this.header_Sections_json);
    this.header_Sections_json = this.header_sections_json_backup.filter(function(item : any)
    {
     return item.checked;
    });
  }
}
