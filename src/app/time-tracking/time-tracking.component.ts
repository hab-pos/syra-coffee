import { Component, Renderer2, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { faChevronDown, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { APIServices } from '../APIServices/api-services';
import { Api_response } from '../APIServices/api_response';
import { CommonService } from '../common.service';
import * as moment from 'moment';
import {
  Surface,
  Path,
  Text,
  Group,
  Layout,
  LinearGradient,
  GradientOptions,
  ShapeOptions,
} from "@progress/kendo-drawing";
import {
  Arc as DrawingArc,
  GradientStop,
  geometry,
} from "@progress/kendo-drawing";
export var pallets: any = []
export var count = 0

function createColumn(rect: any,color : any) {

  // let color = pallets[count % pallets.length]
  // count++
  const origin = rect.origin;
  const center = rect.center();
  const bottomRight = rect.bottomRight();
  const radiusX = rect.width() / 2;
  const radiusY = rect.width() / 2;
  const gradient = new LinearGradient(<GradientOptions>{
    stops: [
      <GradientStop><unknown>{
        offset: 0,
        color: color,
        options: null
      },
      <GradientStop><unknown>{
        offset: 0.5,
        color: color,
        options: null
      },
      <GradientStop><unknown>{
        offset: 0.5,
        color: color,
        options: null
      },
      <GradientStop><unknown>{
        offset: 1,
        color: color,
        options: null
      }
    ]
  });

  const path = new Path(<ShapeOptions>{
    fill: gradient,
    stroke: {
      color: color
    }
  })
    .moveTo(origin.x, origin.y)
    .lineTo(origin.x, bottomRight.y)
    .arc(180, 0, radiusX, radiusY, true)
    .lineTo(bottomRight.x, origin.y)
    .arc(0, 180, radiusX, radiusY);

  const topArcGeometry = new geometry.Arc([center.x, origin.y], <
    geometry.ArcOptions
    >{
      startAngle: 0,
      endAngle: 360,
      radiusX: radiusX,
      radiusY: radiusY
    });

  const topArc = new DrawingArc(topArcGeometry, {
    fill: {
      color: color
    },
    stroke: {
      color: color
    }
  });
  const group = new Group();
  group.append(path, topArc);
  return group;
}


@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  styleUrls: ['./time-tracking.component.scss']
})
export class TimeTrackingComponent implements AfterViewInit {
  isLoadingGrpah = false
  isLoadingUsers = false
  valueAxis =  {
    line : {visible:false},
    majorTicks : {visible : false},
    majorGridLines : {dashType : 'dash'},
    majorUnit: 60 * 60 * 24,
    min : 0,
    max : 0,
    labels: {
      font : 'CerebriSans-Bold',
      rotation: 'auto',
      template: "#= kendo.toString(new Date(value), 'HH:mm') #"
    }
  }

  getDate(value: any) {
    console.log(value);
    
    return moment(value).format("DD/MM")
  }
  seriesDefaults: any = null
  selected_barista_list: any = []
  constructor(private renderer: Renderer2, private api_services: APIServices, private common_service: CommonService) {

    this.common_service.choose_date.subscribe((selectedDates: any) => {
      pallets = []
      count = 0
      this.get_report()
      this.getGraph()
    })
    this.common_service.select_branch.subscribe((selectedBranch: any) => {

      pallets = []
      count = 0
      this.get_report()
      this.getGraph()
    })
  }
  get(val: any) {
    return JSON.stringify(val)
  }
  barista_list: any = []
  barista_list_backup: any = []
  get_users() {
    if (this.barista_list_backup.length == 0) {
      this.api_services.get_all_barista().subscribe(
        (res: Api_response) => {
          this.isLoadingUsers = false
          let array = []
          if (res.success) {
            let barista_name_list = this.graphData.baristas

            for (let index = 0; index < res.data.barista_details.length; index++) {
              const element = res.data.barista_details[index];
              if (barista_name_list.includes(element._id)) {
                array.push(element)
              }
            }
            this.barista_list = array
            this.barista_list_backup = array;
          }
          else {
            this.common_service.showAlert(res.message);
          }
        }
      )
    }

  }
  faChevronDown = faChevronDown
  faArrowDown = faArrowDown
  isBaristasCheckable = false
  @ViewChild("leftdiv") leftdiv: any
  @ViewChild("rightdiv") rightdiv: any

  users: any = []

  attendance: any = []

  branches: any = []

  chart_data: any = []

  ngAfterViewInit() {
    this.redrawCells()
    setTimeout(() => {
      this.redrawCells()
    }, 1)
    pallets = []
    count = 0
    this.barista_list_backup = []
    this.get_report()
    this.getGraph()
  }
  branch_selected: any = null
  dates_selected: any = null
  attendance_backup: any = null
  get_report() {
    let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.branch_selected = branch_list?.map(function (element: any) { return element._id })
    this.branch_selected = this.branch_selected?.length == 0 ? null : this.branch_selected
    this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null
    // this.branch_selected = this.branch_selected == "syra-all" ? null : this.branch_selected
    this.api_services.getAttendance_report({ dates: this.dates_selected, branch: this.branch_selected }).subscribe((response: any) => {
      this.attendance = response.data
      this.attendance_backup = response.data
    })
  }

  graphData: any = null
  branches_graph: any = null
  gpDataBackup: any = null
  getGraph() {
    this.isLoadingGrpah = true
    this.isLoadingUsers = true
    this.selected_barista_list = []
    this.barista_list_backup = []
    pallets = []
    count = 0
    this.valueAxis.min = this.dates_selected == null ? moment().startOf('day').unix() : moment(this.dates_selected.start).startOf('day').unix()
    this.valueAxis.max = this.dates_selected == null ? moment().endOf('day').unix() : this.dates_selected?.end != null ? moment(this.dates_selected.end).endOf('day').unix() : moment(this.dates_selected.start).endOf('day').unix()

    let branch_list = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null
    this.branch_selected = branch_list?.map(function (element: any) { return element._id })
    this.branch_selected = this.branch_selected?.length == 0 ? null : this.branch_selected
    this.dates_selected = localStorage.getItem('selectedDate') ? JSON.parse(localStorage.getItem('selectedDate') || "") : null

    this.api_services.getAttendance_report_graph({ dates: this.dates_selected, branch: this.branch_selected }).subscribe((response: any) => {
      this.isLoadingGrpah = false
      this.graphData = JSON.parse(JSON.stringify(response.data))
      this.gpDataBackup = JSON.parse(JSON.stringify(response.data))
      this.get_users()
      // pallets = response.data.colors
      this.seriesDefaults = {
        type: 'column',
        stack: true,
        visual: function (e: any) {
          return createColumn(e.rect,e.series.color);
        },
        highlight: {
          toggle: function (e: any) {
            // Do not create a highlight overlay,
            // the approach will modify the existing visual instead.
            e.preventDefault();

            const visual = e.visual;
            const opacity = e.show ? 0.7 : 1;

            visual.opacity(opacity);
          },
        },
      }
      if (this.branches_graph == null || this.branches_graph.length < response.data.branches.length) {
        this.get_branches()
      }
    })

  }

  get_branches() {
    this.api_services.get_branch({}).subscribe(
      (res: Api_response) => {
        this.branches_graph = res.data.branch_list.map(function (element: any) { return element.branch_name })      
        this.branches_graph.pop() 
      }
    )
  }
  UserFilterTitle = "All Users"
  renderHeight = "100%"
  toggleAction() {
    var icon = document.getElementById("icon") as any
    if (this.isBaristasCheckable) {
      icon.className = 'fa fa-arrow-down';
    } else {
      icon.className = 'fa fa-arrow-down open';
    }
    this.UserFilterTitle = this.selected_barista_list.length == this.users.length ? "All Users" : "Filtered"
    if (this.isBaristasCheckable) {
      if (this.selected_barista_list.length == 0) {
        this.barista_list = this.barista_list_backup
      } else {
        this.barista_list = this.barista_list_backup.filter((barista: any) => {
          return this.selected_barista_list.includes(barista._id)
        })
      }
    }
    else {
      this.barista_list = this.barista_list_backup
    }
    if (this.isBaristasCheckable) {
      this.filterGraph()
    }
    this.filter()
    this.isBaristasCheckable = !this.isBaristasCheckable
  }
  filterGraph() {
    let array: any = []
    let branches: any = []
    let color: any = []


    if (this.selected_barista_list.length == 0) {
      this.graphData = JSON.parse(JSON.stringify(this.gpDataBackup))
      pallets = this.graphData.colors
      count = 0
    }
    else {
      for (let index = 0; index < this.gpDataBackup?.response?.length; index++) {
        const element = this.gpDataBackup.response[index][0];
        if (this.selected_barista_list.includes(element.barista_id)) {
          if(branches.indexOf(element.branch) < 0){
            branches.push(element.branch)
          }  
          color.push(element.color)
          array.push([element])
        }
      }
      this.graphData.response = array
      this.graphData.baristas = this.selected_barista_list
      this.graphData.branches = branches
      this.graphData.colors = color

      pallets = this.graphData.colors
      count = 0
      console.log(this.selected_barista_list, this.graphData, this.gpDataBackup)

    }

    // this.seriesDefaults = {
    //   type: 'column',
    //   stack: true,
    //   visual: function (e: any) {
    //     return createColumn(e.rect);
    //   },
    //   highlight: {
    //     toggle: function (e: any) {
    //       // Do not create a highlight overlay,
    //       // the approach will modify the existing visual instead.
    //       e.preventDefault();

    //       const visual = e.visual;
    //       const opacity = e.show ? 0.7 : 1;

    //       visual.opacity(opacity);
    //     },
    //   },
    // }
    // if (this.branches_graph == null || this.branches_graph.length < this.graphData.branches.length) {
    //   this.branches_graph = this.graphData.data.branches
    // }
  }
  filter() {
    if (this.selected_barista_list.length == 0) {
      this.attendance = this.attendance_backup
    }
    else {
      this.attendance = this.attendance_backup.filter((attendee: any) => {
        return this.selected_barista_list.includes(attendee.barista_id)
      })
    }
  }

  redrawCells() {
    this.renderHeight = this.rightdiv?.nativeElement.offsetHeight + 'px';
  }
  handleSelection(checked: any, id: any, name: any) {
    if (checked) {
      this.selected_barista_list.push(id)
    }
    else {
      let index = this.selected_barista_list.indexOf(id);
      this.selected_barista_list.splice(index, 1);
    }
  }
  Pagewidth: number
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.Pagewidth = window.innerWidth;
    this.redrawCells()
  }
}
