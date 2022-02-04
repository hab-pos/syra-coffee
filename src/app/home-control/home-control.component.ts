import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { faTimes, faPlusCircle, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { CommonService } from "../common.service"
import { APIServices } from "../APIServices/api-services"
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../shared/components/delete/delete.component';

@Component({
  selector: 'app-home-control',
  templateUrl: './home-control.component.html',
  styleUrls: ['./home-control.component.scss']
})
export class HomeControlComponent implements OnInit {
  events: any = [

  ]

  stories: any = [
    // {
    //   id: 1,
    //   name: "STORY FROM COLOMBIA",
    // },
    // {
    //   id: 2,
    //   name: "AEROSPRESS TRADE SECRETS",
    // },
    // {
    //   id: 3,
    //   name: "STORIES FROM KENYA",
    // },
  ]
  featured_pdts: any = [
    // {
    //   id: 1,
    //   name: "ADADO NATURAL",
    // },
    // {
    //   id: 2,
    //   name: "ESPRESSO",
    // },
    // {
    //   id: 3,
    //   name: "FLAT WHITE",
    // },
    // {
    //   id: 4,
    //   name: "SLOPES OF 8",
    // },
  ]
  display_col = ["name", "icon"]
  Pagewidth: number = 0;

  faTimes = faTimes
  faArrowsAlt = faArrowsAlt
  faPlusCircle = faPlusCircle
  field: string = '';
  action: string = '';
  isLoadingEvents = false
  isLoadingStories = false
  isLoadingFeaturedPdts = false
  // selectedFieldIndex : Number = -1
  @ViewChild('sidenav') sidenav: any;
  @ViewChild('table') table: any;

  constructor(private commonService: CommonService, private apiService: APIServices, private modalService: NgbModal) {
    this.commonService.featuredProdcutSuccess.subscribe((_: any) => {
      this.getFeaturedProducts()
    })
    this.commonService.EventSuccess.subscribe((_: any) => {
      this.getEventlist()
    })
    this.commonService.storySuccess.subscribe((_: any) => {
      this.getStoryList()
    })
  }
  ngOnInit(): void {
    this.Pagewidth = window.innerWidth
    this.getFeaturedProducts()
    this.getEventlist()
    this.getStoryList()
  }
  getFeaturedProducts() {
    this.isLoadingFeaturedPdts = true
    this.apiService.get_featured_products().subscribe(response => {
      this.featured_pdts = response.data != null ? JSON.parse(JSON.stringify(response.data)) : []
      this.isLoadingFeaturedPdts = false
    })
  }
  getEventlist() {
    this.isLoadingEvents = true
    this.apiService.get_events().subscribe(response => {
      this.events = response.data != null ? JSON.parse(JSON.stringify(response.data)) : []
      this.isLoadingEvents = false
    })
  }

  getStoryList() {
    this.isLoadingStories = true
    this.apiService.getStories({}).subscribe(response => {
      this.stories = response.data != null ? JSON.parse(JSON.stringify(response.data)) : []
      this.isLoadingStories = false
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.Pagewidth = window.innerWidth;
  }
  selectedRow = -1
  openSideBar(field: string, action: string, row: any = -1) {
    this.field = field;
    this.selectedRow = row;
    this.action = action;
    this.sidenav.toggle()
  }
  push() {
    switch (this.field) {
      case "featured_pdts":
        this.commonService.featuredProductopUpopend.emit(this.action == 'edit' ? this.featured_pdts[this.selectedRow] : null)
        break
      case "event":
        this.commonService.eventFormOpend.emit(this.action == 'edit' ? this.events[this.selectedRow] : null)
        break
      default:
        this.commonService.storyPopupOpened.emit(this.action == 'edit' ? this.stories[this.selectedRow] : null)
        break
    }
  }
  closed() {
    this.commonService.resetForms.emit()
  }
}

