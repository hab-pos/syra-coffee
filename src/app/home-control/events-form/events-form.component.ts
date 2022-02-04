import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IconDefinition, faChevronDown, faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { APIServices } from 'src/app/APIServices/api-services';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../../shared/components/delete/delete.component';
export const _filter = (opt: any, value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item : any) => item.product_name.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.scss']
})

export class EventsFormComponent implements OnInit {
  @ViewChild('matProduct') product_select: any;

  isLoadingAdd = false
  isLoadingDelete = false
  isLoadingUploadCover = false
  isLoadingUploadThumbnail = false
  @Input() sidenav: any
  @Input() action: any
  @Input() field: any
  close = close
  imagePath: any;
  imgURL: any;
  thumbnail_info:any;
  coverimage_info:any;
  cover_imagePath: any;
  cover_imgURL: any;
  public message: string;
  faCaretDown = faCaretDown
  image_base64 : any;
  image_base65 : any;
  faTimes = faTimes
  selectedEvent : any
  content = "sadfasdfasdf"
  rewards: any = [
    {
      name : "discount",
      value : "Discount"
    },
    {
      name : "beans",
      value : "Beans"
    }
  ]
  constructor(private apiServices: APIServices, private commonService: CommonService, private modalService: NgbModal) { 
    this.commonService.eventFormOpend.subscribe((data : any) => {
      this.getProduct_list()
      if(data == null){
        this.eventForm.reset()
        this.selectedProducts = []
        this.selectedEvent = null
        this.imgURL = null
        this.cover_imgURL = null
        this.thumbnail_info = {}
        this.coverimage_info = {}
      }
      else{
        // console.log("else")
        let reward_index = this.rewards.findIndex((i : any) => i.name == (data.reward_mode || "discount"));
        this.eventForm = new FormGroup({
          event_name: new FormControl(data.event_name, Validators.required),
          start: new FormControl(data.start_date, Validators.required),
          expiry_date: new FormControl(data.end_date, Validators.required), 
          reward:new FormControl(this.rewards[reward_index].value, Validators.required), 
          amount:new FormControl(data.amount, Validators.required), 
          products: new FormControl('', null),
          thumb_image:new FormControl("", null), 
          cover_image:new FormControl("", null), 
          notes:new FormControl(data.description, Validators.required), 
        })
        this.selectedProducts = data.products.split(',')
        this.selectedEvent = data
        this.imgURL = data.thumbnail_url
        this.cover_imgURL = data.cover_url
        this.thumbnail_info = {imageName :data?.thumbnail_name,webContentLink : data?.thumbnail_url  }
        this.coverimage_info = {imageName :data?.cover_name,webContentLink : data?.cover_url  }

      }
      this.selectedEvent = data
    })
  }

  backup_rewards: any = []
  toppingss = new FormControl();
  notes: string[] = ['Honey', 'Plum', 'Cream', 'Dark Chocolate'];
  eventForm = new FormGroup({
    event_name: new FormControl('', Validators.required),
    start: new FormControl('', Validators.required),
    expiry_date: new FormControl('', Validators.required),
    reward: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    products: new FormControl('', null),
    thumb_image: new FormControl('', null),
    cover_image: new FormControl('', null),
    notes: new FormControl('', Validators.required),
  })
  @Input() product_list: any = [
  ];
  ProductOptions: Observable<any>;
  getProduct_list() {
    this.apiServices.getUserGroupedProducts({}).subscribe((products: any) => {
      this.product_list = JSON.parse(JSON.stringify(products)).data.products_list.filter((res : any) => {
        return res.type == "product"
      })
      this.initSearch()
    })
  }
  ngOnInit(): void {
    this.backup_rewards = this.rewards
  }

  initSearch() {
    this.ProductOptions = this.eventForm.get('products')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }
  _filterGroup(value: string): any {
    if (value && value != '') {
      return this.product_list
        .map((group: any) => ({ category: group.category, products: _filter(group.products, value) }))
        .filter((group: any) => group.products.length > 0);
    }

    return this.product_list;
  }
  selectProduct(event : any) {
    this.initSearch()
  }
  selectedCategory = 0
  selectedPRoduct = 0
  updateValue(section : any,row : any){
    this.selectedCategory = section
    this.selectedPRoduct = row
    this.product_list[this.selectedCategory].products[this.selectedPRoduct].checked = !this.product_list[this.selectedCategory].products[this.selectedPRoduct].checked
    
    let valueToDisplay : String []= []
    
    this.product_list.forEach((element : any) => {
      element.products.forEach((element_prod : any) => {
        if(element_prod.checked){
          valueToDisplay.push(element_prod.product_name)
        }
      });
    });
    this.eventForm.get('products')?.setValue(valueToDisplay.join(", "))
  }
  getValue(value : any) {
   return value
  }

  updateProductList(section : any, row : any){
  
  }
  saveAction() {   
   this.gatherInput();  
  }

saveEvent() {
  if((this.thumbnail_info?.webContentLink != null || this.thumbnail_info?.webContentLink != undefined) && (this.coverimage_info?.webContentLink != null || this.coverimage_info?.webContentLink != undefined)){
    this.isLoadingAdd = true
    console.log("Inside saveEvent")  
    var reward_index = this.rewards.findIndex((i : any) => i.value == this.eventForm.get('reward')?.value || "");

    var request:any = {
      event_name:this.eventForm.get('event_name')?.value || "",
      start_date:this.eventForm.get('start')?.value || "",
      end_date:this.eventForm.get('expiry_date')?.value || "",
      reward_mode: this.rewards[reward_index].name,
      amount:this.eventForm.get('amount')?.value || "",
      products:this.product_select.value.join(','),
      thumbnail_name:this.thumbnail_info.imageName,
      thumbnail_url : this.thumbnail_info.webContentLink,
      cover_name : this.coverimage_info.imageName,
      cover_url : this.coverimage_info.webContentLink,
      description:this.eventForm.get('notes')?.value || "",
    }  
    this.apiServices.addEvent(request).subscribe((response : any) => {
      console.log(response);
      this.isLoadingAdd = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        this.thumbnail_info = null
        this.imagePath = null
        this.sidenav.close()
        this.eventForm.reset()
        this.commonService.EventSuccess.emit()
      }
    })
  }
  else{
    this.commonService.showAlert("Image Not uploaded, Please wait till image is being uploaded!")
  }
}
editEvent(){
  if((this.thumbnail_info?.webContentLink != null || this.thumbnail_info?.webContentLink != undefined) && (this.coverimage_info?.webContentLink != null || this.coverimage_info?.webContentLink != undefined)){
    this.isLoadingAdd = true
    console.log("Inside saveEvent")  
    var reward_index = this.rewards.findIndex((i : any) => i.value == this.eventForm.get('reward')?.value || "");
    var request:any = {
      _id : this.selectedEvent._id,
      event_name:this.eventForm.get('event_name')?.value || "",
      start_date:this.eventForm.get('start')?.value || "",
      end_date:this.eventForm.get('expiry_date')?.value || "",
      reward_mode:this.rewards[reward_index].name,
      amount:this.eventForm.get('amount')?.value || "",
      products:this.selectedProducts.join(","),
      thumbnail_name:this.thumbnail_info.imageName,
      thumbnail_url : this.thumbnail_info.webContentLink,
      cover_name : this.coverimage_info.imageName,
      cover_url : this.coverimage_info.webContentLink,
      description:this.eventForm.get('notes')?.value || "",
    }  
    this.apiServices.UpdateEvent(request).subscribe((response : any) => {
      console.log(response);
      this.isLoadingAdd = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        this.thumbnail_info = null
        this.imagePath = null
        this.sidenav.close()
        this.commonService.EventSuccess.emit()
        this.eventForm.reset()
      }
    })
  }
  else{
    this.commonService.showAlert("Image Not uploaded, Please wait till image is being uploaded!")
  }
}
selectedProducts : any = []
gatherInput(){
  if(this.eventForm.invalid){
    this.commonService.showAlert(this.commonService.getFormValidationErrors(this.eventForm))
  }
  else if(this.selectedProducts.length == 0){
    this.commonService.showAlert("Please select products for events")
  }
  else{
    console.log(this.action)
    this.action == "edit" ? this.editEvent() : this.saveEvent()
  }
}
  filter_rewards(value: string) {
    const filterValue = value.toLowerCase();
    this.rewards = this.backup_rewards.filter((option: any) => option.toLowerCase().includes(filterValue));
  }
  // deleteAction() {
  //   this.sidenav.close()
  // }
  preview(files: any) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    this.uploadPhoto();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }
  preview_cover(cover_files: any) {
    if (cover_files.length === 0)
      return;

    var mimeType = cover_files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.cover_imagePath = cover_files;
    this.uploadCoverPhoto();
    reader.readAsDataURL(cover_files[0]);
    reader.onload = (_event) => {
      this.cover_imgURL = reader.result;
    }
  }
  uploadPhoto(){    
    if(this.thumbnail_info.webContentLink != null){
      this.thumbnail_info.webContentLink = null
    }
    this.isLoadingUploadThumbnail = true;    
    this.apiServices.uploadEventImage(this.imagePath[0]).subscribe((response : any) => {      
      this.commonService.showAlert(response.message)
      this.isLoadingUploadThumbnail = false;
      this.thumbnail_info = response.data;
      console.log(this.thumbnail_info);
    })
  }
  uploadCoverPhoto()
  {
    if(this.coverimage_info.webContentLink != null){
      this.coverimage_info.webContentLink = null
    }
    this.isLoadingUploadCover = true;    
    this.apiServices.uploadEventImage(this.cover_imagePath[0]).subscribe((response : any) => {      
      this.commonService.showAlert(response.message)
      this.coverimage_info = response.data;
      this.isLoadingUploadCover = false;
    })
  }
  deleteAction(){
    this.modalService.open(DeleteComponent)
    .result.then(
      () => {
        this.deleteAPI()
      },
      () => {

      }
    )
  }
  deleteAPI(){
    this.isLoadingDelete = true
    this.apiServices.deleteEvent({id : this.selectedEvent._id}).subscribe((res : any) =>{
      this.commonService.showAlert(res.message)
      this.isLoadingDelete = false
      this.sidenav.close()
      this.commonService.EventSuccess.emit()
    }) 
  }

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'video']                         // link and image, video
    ]
  };
}

export const close: IconDefinition = {
  prefix: 'fa',
  iconName: 'line',
  icon: [
    512, // SVG view box width
    512, // SVG view box height
    [],
    '', // probably not important for SVG and JS approach
    `M437.126,74.939c-99.826-99.826-262.307-99.826-362.133,0C26.637,123.314,0,187.617,0,256.005
			s26.637,132.691,74.993,181.047c49.923,49.923,115.495,74.874,181.066,74.874s131.144-24.951,181.066-74.874
			C536.951,337.226,536.951,174.784,437.126,74.939z M409.08,409.006c-84.375,84.375-221.667,84.375-306.042,0
			c-40.858-40.858-63.37-95.204-63.37-153.001s22.512-112.143,63.37-153.021c84.375-84.375,221.667-84.355,306.042,0
			C493.435,187.359,493.435,324.651,409.08,409.006z M341.525,310.827l-56.151-56.071l56.151-56.071c7.735-7.735,7.735-20.29,0.02-28.046
			c-7.755-7.775-20.31-7.755-28.065-0.02l-56.19,56.111l-56.19-56.111c-7.755-7.735-20.31-7.755-28.065,0.02
			c-7.735,7.755-7.735,20.31,0.02,28.046l56.151,56.071l-56.151,56.071c-7.755,7.735-7.755,20.29-0.02,28.046
			c3.868,3.887,8.965,5.811,14.043,5.811s10.155-1.944,14.023-5.792l56.19-56.111l56.19,56.111
			c3.868,3.868,8.945,5.792,14.023,5.792c5.078,0,10.175-1.944,14.043-5.811C349.28,331.117,349.28,318.562,341.525,310.827z`,
  ],
} as any;
