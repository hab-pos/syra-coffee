import { Component, OnInit,Input } from '@angular/core';
import { IconDefinition, faChevronDown, faTimes,faCaretDown  } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { Api_response } from 'src/app/APIServices/api_response';
import { APIServices } from 'src/app/APIServices/api-services';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../../shared/components/delete/delete.component';
@Component({
  selector: 'app-category-component',
  templateUrl: './category-component.component.html',
  styleUrls: ['./category-component.component.scss']
})
export class CategoryComponentComponent implements OnInit {
  isLoadingAdd = false
  isLoadingDelete = false
  isLoadingUpload = false
  @Input() sidenav : any
  @Input() action : any
  @Input() field : any
  close =close  
  imagePath : any;
  imgURL: any;  
  image_base64 : any
  category_info : any
  // public message: string;
  imageInfo : any
  constructor(private apiServices: APIServices, private commonService: CommonService, private modalService: NgbModal) { 
    this.commonService.UserCategorypopUpopend.subscribe((data : any) => {
      this.categoryForm = new FormGroup({
        category_name: new FormControl(data?.category_name, Validators.required),      
        category_image: new FormControl('', null),      
      })    
      this.imageInfo = {imageName :data?.image_name,webContentLink : data?.image_url  }
      this.category_info = data
      this.imgURL = data?.image_url; 
    })

    this.commonService.resetForms.subscribe((_:any) => {
      this.categoryForm = new FormGroup({
        category_name: new FormControl('', Validators.required),      
        category_image: new FormControl('', null),      
      })
    })
  }
  categoryForm = new FormGroup({
    category_name: new FormControl('', Validators.required),      
    category_image: new FormControl('', null),      
  })

  ngOnInit(): void {
  }
  preview(files : any) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.commonService.showAlert("Only images are supported.")
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    this.image_base64 = files[0];
    this.uploadPhoto()
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }
  saveAction(){
    if (this.categoryForm.get('category_name')?.value != "" && this.categoryForm.get('category_name')?.value != null && this.imageInfo?.webContentLink != null && this.imageInfo?.webContentLink != undefined) {
      this.action == "edit" ? this.editCategory() : this.saveCategory()
    }
    else {
      this.categoryForm.get('category_name')?.value != "" && this.categoryForm.get('category_name')?.value != null ? this.commonService.showAlert("Category Name Madatory") : this.commonService.showAlert("Category Image  Madatory")
    }
  }

  uploadPhoto(){
    this.isLoadingUpload = true
    this.apiServices.uploadCategoryImage(this.image_base64).subscribe((response : any) => {
      console.log(response.data);
      this.commonService.showAlert(response.message)
      this.isLoadingUpload = false
      this.imageInfo = response.data
      this.categoryForm.setValue({category_image : "uploaded"})
    })
  }
  editCategory(){
    if(this.imageInfo?.webContentLink != undefined){
      this.isLoadingAdd = true

      console.log(this.imageInfo)
      this.apiServices.UpdateUserCategory({category_name : this.categoryForm.controls['category_name'].value,image_name : this.imageInfo.imageName,image_url : this.imageInfo.webContentLink,_id : this.category_info._id}).subscribe((response : any) => {
        this.isLoadingAdd = false
        this.commonService.showAlert(response.message)
        if (response.success) {
          this.imageInfo = null
          this.imagePath = null
          this.sidenav.close()
          this.categoryForm.setValue({category_name : "",category_image : ""})
          this.commonService.UserCategorySuccess.emit()
        }
      })
    }
    else{
      this.commonService.showAlert("Image Not uploaded, Please wait till image is being uploaded!")
    }
  }

  saveCategory() {
    if(this.imageInfo?.webViewLink != null || this.imageInfo?.webViewLink != undefined){
      this.isLoadingAdd = true

      console.log(this.imageInfo)
      this.apiServices.addUserCategory({category_name : this.categoryForm.controls['category_name'].value,image_name : this.imageInfo.imageName,image_url : this.imageInfo.webContentLink}).subscribe((response : any) => {
        this.isLoadingAdd = false
        this.commonService.showAlert(response.message)
        if (response.success) {
          this.imageInfo = null
          this.imagePath = null
          this.sidenav.close()
          this.categoryForm.setValue({category_name : "",category_image : ""})
          this.commonService.UserCategorySuccess.emit()
        }
      })
    }
    else{
      this.commonService.showAlert("Image Not uploaded, Please wait till image is being uploaded!")
    }
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
    this.apiServices.deleteUserCategory({id : this.category_info._id}).subscribe((response : any) => {
      this.isLoadingDelete = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        this.imageInfo = null
        this.imagePath = null
        this.sidenav.close()
        this.categoryForm.setValue({category_name : "",category_image : ""})
        this.commonService.UserCategorySuccess.emit()
      }
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
