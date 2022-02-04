import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IconDefinition, faCaretDown, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { APIServices } from 'src/app/APIServices/api-services';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from 'src/app/shared/components/delete/delete.component';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-story-component',
  templateUrl: './story-component.component.html',
  styleUrls: ['./story-component.component.scss']
})
export class StoryComponentComponent implements OnInit {
  isLoadingAdd = false
  isLoadingDelete = false
  @Input() sidenav: any
  @Input() field: any
  @Input() action: any
  faPlusCircle = faPlus
  faMinusCircle = faMinus
  faCaretDown = faCaretDown
  selectedProducts: any
  close = close
  selectedStory: any = null
  @ViewChild('matProduct') product_select: any;

  thumbnailInfo: any
  constructor(private apiServices: APIServices, private commonService: CommonService, private modalService: NgbModal) {
    this.commonService.storyPopupOpened.subscribe((data: any) => {
      if (this.action == "edit") {
        this.selectedStory = data
        this.imgURL = data.thumbnail_url
        this.storyform = new FormGroup({
          title: new FormControl(data.title, Validators.required),
        })
        this.selectedProducts = data.products
        this.story = JSON.parse(data.story_content)
        this.thumbnailInfo = {imageName :data?.thumbnail_name,webContentLink : data?.thumbnail_url  }
      }
      else {
        this.selectedStory = null
        this.story = [{ type: 'image', value: '' },{ type: 'text', value: '' }]
        this.selectedProducts = ""
        this.imgURL = null
        this.storyform.reset()
        this.thumbnailInfo = null
      }
    })
  }
  product_list: any = [
  ];
  imagePath: any;
  imgURL: any;
  cover_imagePath: any;
  cover_imgURL: any;
  public message: string;
  editor: any;
  url: any;
  /*for pring value*/
  title: any;
  products: any;
  /* */
  story: any = []
  storyform = new FormGroup({
    title: new FormControl('', Validators.required),
  })

  ngOnInit(): void {
    this.getProduct_list()
    this.story.push({ type: 'image', value: '' })
    this.story.push({ type: 'text', value: '' })
  }
  getProduct_list() {
    this.apiServices.getUserGroupedProducts({}).subscribe((products: any) => {
      this.product_list = JSON.parse(JSON.stringify(products)).data.products_list.filter((res: any) => {
        return res.type == "product"
      })
    })
  }
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
    this.uploadThumbPhoto()
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }
  preview_cover(cover_files: any, row: any) {
    if (cover_files.length === 0)
      return;

    var mimeType = cover_files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    this.cover_imagePath = cover_files;
    reader.readAsDataURL(cover_files[0]);
    this.uploadCover(row)
    reader.onload = (_event) => {
      this.cover_imgURL = reader.result;
      this.story[row].value = this.cover_imgURL;
    }
  }

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // this.story.push(this.story[row].type = 'image' ? this.story[row].value = this.cover_imgURL : '')
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'video']                         // link and image, video
    ]
  };

  saveAction() {
    var invalidData = false
    for (var i = 0; i < this.story.length; i++) {
      if (this.story[i]?.value?.toString() == "" || this.story[i]?.value?.toString() == null || this.story[i]?.value?.toString() == undefined) {
        invalidData = true
        break
      }
    }
    if (this.storyform.controls['title'].value == "") {
      this.commonService.showAlert("Story Title is Mandatory")
    }
    else if (this.product_select.value.length == 0) {
      this.commonService.showAlert("Choost the products")
    }
    else if (this.thumbnailInfo?.webContentLink == "" || this.thumbnailInfo?.webContentLink == null || this.thumbnailInfo?.webContentLink == undefined) {
      this.commonService.showAlert("Upload Story Thumbnail Image")
    }
    else if (invalidData == true) {
      this.commonService.showAlert("Please Fill all story contents")
    }
    else {
      this.action == "edit" ? this.editAPI() : this.saveAPI()
    }
  }

  deleteAction() {
    this.modalService.open(DeleteComponent)
      .result.then(
        () => {
          this.deleteAPI()
        },
        () => {

        }
      )
  }
  deleteAPI() {
    this.isLoadingDelete = true
    this.apiServices.deleteStories({ id: this.selectedStory._id }).subscribe((res: any) => {
      this.commonService.showAlert(res.message)
      this.isLoadingDelete = false
      this.storyFormReset()
      this.sidenav.close()
      this.commonService.storySuccess.emit()
    })
  }

  editAPI() {
    this.isLoadingAdd = true
    var request: any = {
      _id : this.selectedStory._id,
      title: this.storyform.controls['title'].value,
      products: this.product_select.value,
      thumbnail_name: this.thumbnailInfo.imageName,
      thumbnail_url: this.thumbnailInfo.webContentLink,
      story_content: JSON.stringify(this.story),
    }
    this.apiServices.updateStories(request).subscribe((response: any) => {
      console.log(response);
      this.isLoadingAdd = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        this.storyFormReset()
        this.sidenav.close()
        this.commonService.storySuccess.emit()
      }
    })
  }

  saveAPI() {
    this.isLoadingAdd = true
    var request: any = {
      title: this.storyform.controls['title'].value,
      products: this.product_select.value,
      thumbnail_name: this.thumbnailInfo.imageName,
      thumbnail_url: this.thumbnailInfo.webContentLink,
      story_content: JSON.stringify(this.story),
    }
    this.apiServices.addStory(request).subscribe((response: any) => {
      console.log(response);
      this.isLoadingAdd = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        this.storyFormReset()
        this.sidenav.close()
        this.commonService.storySuccess.emit()
      }
    })
  }
  storyFormReset() {
    this.thumbnailInfo = null
    this.imagePath = null
    this.storyform.reset()
    this.selectedProducts = ""
    this.story = []
  }
  add_image() {
    this.story.push({ type: 'image', value: '' });
  }
  add_text() {
    this.story.push({ type: 'text', value: '' });
  }
  onContentChanged(event_quill: any, row: any) {
    this.story[row].value = event_quill.html;
    // event_quill.editor.setSelection(event_quill.editor.getLength(), 0);
  }
  isUploadingThumb: any
  isUploadingCover: any
  isUploadingContent: any
  uploadThumbPhoto() {
    if(this.thumbnailInfo?.webContentLink != null){
      this.thumbnailInfo.webContentLink = null
    }
    this.isUploadingThumb = true;
    this.apiServices.uploadStoryImage(this.imagePath[0]).subscribe((response: any) => {
      this.commonService.showAlert(response.message)
      this.isUploadingThumb = false
      this.thumbnailInfo = response.data
    })
  }

  uploadCover(row : any) {
    if(this.story[row]?.value != null){
      this.story[row].value = null
    }
    this.isUploadingContent = true;
    this.apiServices.uploadStoryImage(this.cover_imagePath[0]).subscribe((response: any) => {
      this.commonService.showAlert(response.message)
      this.isUploadingContent = false
      this.story[row].value = response.data.webContentLink
    })
  }
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

