import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { CommonService } from './common.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  current_url: any = [];
  sidebar_opened: boolean = false;
  is_logged_in = false;
  isMobile: boolean = false;
  innerWidth: any;
  title = 'syra-coffee';

  constructor(private router: Router, private common_service: CommonService,private spinner: NgxSpinnerService) {

    //to get subscribed on Routing options
    this.router.events.subscribe((evt) => {


      if (evt instanceof NavigationStart) {
        this.spinner.show();
        if (this.isMobile) {
          this.closeNav()
        }
      }
      if (evt instanceof NavigationEnd) {
        this.spinner.hide();
        this.current_url = evt.url.split('/');
        if (this.current_url[2] == "login" || typeof this.current_url[2] == "undefined") {
          this.closeNav();
        }
        if (localStorage.getItem("syra_admin") != null || localStorage.getItem("syra_admin")!= undefined ) {
          this.is_logged_in = true;
        } 
        else {
          this.is_logged_in = false;
        }
        (typeof this.current_url[2] == 'undefined') ? this.current_url[2] = '' : '';
        setTimeout(() => {
          this.common_service.set_current_url(this.current_url);
        }, 10);
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });


    //To get subscribed on Sidebar toggle movement
    this.common_service.toggle_sidebar.subscribe((value: any) => {
      if (this.current_url[1] != "login") {
        if (value == "sidebar") {
          if (this.isMobile) {
            (this.sidebar_opened) ? this.closeNav() : this.openNav();
          }
        }
        else {
          (this.sidebar_opened) ? this.closeNav() : this.openNav();
        }
      }
    })
  }
  openNav() {
    if (this.current_url[1] != "login") {
      this.sidebar_opened = true;
      if (!this.isMobile) {
        document.getElementById("hamburger_btn")?.classList.add("d-none")
      }
      document.getElementById("sidebar")?.classList.add("active_sidebar")
    }
  }
  closeNav() {
    this.sidebar_opened = false;
    if (this.isMobile) {
      document.getElementById("hamburger_btn")?.classList.remove("d-none")
      document.getElementById("sidebar")?.classList.remove("active_sidebar")
    }
  }
  set_mobile_config() {
    this.isMobile = true;
    setTimeout(() => {
      this.closeNav();
    }, 100);
  }
  remove_mobile_config() {
    this.isMobile = false;
    setTimeout(() => {
      this.openNav();
    }, 100);
  }
  ngOnInit() {
    this.set_config();
    console.log(this.is_logged_in);
    
  }
  set_config() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 1024) {
      this.set_mobile_config();
    }
    else {
      this.remove_mobile_config();
    }
  }
  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.set_config();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.set_config();
  }
}
