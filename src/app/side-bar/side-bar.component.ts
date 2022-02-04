import { Component, OnInit } from '@angular/core';
import { IconDefinition, faExchangeAlt, faChartLine,faUser ,faShoppingBasket,faTh ,faCog, faSignOutAlt, faChevronDown, faChevronUp, faCircle, faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../common.service';
import { APIServices } from '../APIServices/api-services';
import { Api_response } from '../APIServices/api_response'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  faMeterialDashboard = faMeterialDashboard;
  faExchangeAlt = faExchangeAlt;
  faChartLine = faChartLine;
  faShoppingBasket = faShoppingBasket;
  faCog = faCog;
  faLine = faLine;
  faUser = faUser
  faGripLines = faGripLinesVertical;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp
  faSignOutAlt = faSignOutAlt;
  faCircle = faCircle;
  current_url: String[] = [];
  admin_user: any;
  faTh = faTh
  innerWidth: any;
  selectedSection: String = ""
  selectedMenu: any
  sideMenuOptions: { mainMenu: String, subMenu: { title: String, route: string }[], icon: IconDefinition }[] =
    [
      {
        "mainMenu": "REPORTS",
        "subMenu":
          [
            { title: "SALES", route: "/reports/sales" },
            { title: "ACCOUNTING", route: "/reports/accounting" },
            { title: "TIME TRACKING", route: "/reports/time-tracking" },
            { title: "CONTROL", route: "/reports/control" }
          ],
        "icon": faChartLine,
      },
      {
        "mainMenu": "TRANSACTIONS",
        "subMenu": [
          { title: "IN", route: "/transactions/in" },
          { title: "OUT", route: "/transactions/out" }
        ],
        "icon": faExchangeAlt,
      },
      {
        "mainMenu": "PRODUCTS",
        "subMenu": [
          { title: "POS", route: "/products/pos" },
          { title: "INVENTORY ORDERS", route: "/products/inventory-orders" },
          { title: "INVENTORY REPORTS", route: "/products/inventory-reports" }
        ],
        "icon": faShoppingBasket,
      },
      {
        "mainMenu": "APP CONTROL",
        "subMenu": [
          { title: "STORE", route: "/app-control/store" },
          { title: "HOME CONTENT", route: "/app-control/home-content" },
        ],
        "icon": faTh,
      },
      {
        "mainMenu": "CONFIGURATIONS",
        "subMenu": [
          { title: "ESTABLISHMENT", route: "/configurations/establishment" },
          { title: "ACCOUNTS", route: "/configurations/accounts" },
          { title: "CATALOUGE", route: "/configurations/catalouge" },
          { title: "SETUP", route: "/configurations/setup" }
        ],
        "icon": faCog,
      },
    ]

  constructor(public common_service: CommonService, public router: Router, private apiService: APIServices) {
    common_service.url_updated.subscribe((value: any) => {
      this.current_url = value;
      this.getSelectedSection()
    })
    this.innerWidth = window.innerWidth
  }

  ngOnInit(): void {
    //this.admin_user = JSON.parse(localStorage.getItem('adminUsers'));
  }

  getSelectedSection() {
    var row = 0;
    this.sideMenuOptions.forEach(menu => {
      menu.subMenu.forEach(subMenu => {
        if (subMenu.title.toLowerCase().replace(" ", "-") == this.current_url[2]) {
          this.selectedSection = "ngb-panel-" + row
        }
      });
      row += 1;
    });

    console.log(this.selectedSection)
  }
  setSelectedMenu(menu: String) {
    this.selectedMenu = menu
    if (menu == "logout") {
      this.openAlert()

    }
  }

  public beforeChange($event: NgbPanelChangeEvent) {
    // to avoid selection of two tabs in accordian while clicking logout
    this.selectedMenu = $event.panelId
    let index = Number($event.panelId.split("-")[2])
    let value: string = this.sideMenuOptions[index].subMenu[0].route
    this.router.navigateByUrl(value)
  }

  public openAlert() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn  alert-yes',
        cancelButton: 'btn  alert-no'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Logout',
      text: "Are you surely want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        var parse_data = JSON.parse(localStorage.getItem('syra_admin') ?? "");

        this.apiService.logout({ id: parse_data.data['_id'] }).subscribe(
          (log_out: Api_response) => {
            localStorage.removeItem('syra_admin');
            localStorage.clear();
            log_out.success == true ? this.router.navigateByUrl('/login') : "";
          }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.selectedMenu = this.current_url.join("/")
      }
    })
  }

  toggleSidebar() {
    this.common_service.set_sidebar_toggle("sidebar");
  }
}
export const faMeterialDashboard: IconDefinition = {
  prefix: 'fa',
  iconName: 'meterialDashboard',
  icon: [
    512, // SVG view box width
    512, // SVG view box height
    [],
    'U+E002', // probably not important for SVG and JS approach
    `M0,285.8h226.2V3H0V285.8z M0,512h226.2V342.3H0V512z M282.8,512H509V229.2H282.8V512z M282.8,3v169.7H509V3H282.8z`,
  ],
} as any;

export const faLine: IconDefinition = {
  prefix: 'fa',
  iconName: 'line',
  icon: [
    512, // SVG view box width
    512, // SVG view box height
    [],
    '', // probably not important for SVG and JS approach
    `M392.533,187.733H17.067C7.641,187.733,0,195.374,0,204.8s7.641,17.067,17.067,17.067h375.467
    c9.426,0,17.067-7.641,17.067-17.067S401.959,187.733,392.533,187.733z`,
  ],
} as any;

