import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { IconDefinition, faChevronDown, faTimes, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { faEuroSign, faBolt } from '@fortawesome/free-solid-svg-icons';
import { APIServices } from 'src/app/APIServices/api-services';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../../shared/components/delete/delete.component';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-item-component',
  templateUrl: './item-component.component.html',
  styleUrls: ['./item-component.component.scss']
})
export class ItemComponentComponent implements OnInit, AfterViewInit {
  isLoadingAdd = false
  isLoadingDelete = false
  @Input() sidenav: any
  @Input() action: any
  @Input() field: any
  productInfo: any
  @ViewChild('editor') editor: any;
  constructor(private apiServices: APIServices, private commonService: CommonService, private modalService: NgbModal) {
    this.commonService.UserProductpopUpopend.subscribe((data: any) => {
      this.optional_modifier = JSON.parse(JSON.stringify(this.require_modifier))
      this.productInfo = data
      if (data != null) {
        this.itemsForm = new FormGroup({
          items_name: new FormControl(data.product_name, Validators.required),
          price: new FormControl(data.price, Validators.required),
          iva: new FormControl(data.iva_info ? data.iva_info.iva_percent_withSymbol : "0.00%", Validators.required),
          beans: new FormControl(data.beans_value, Validators.required),
          category: new FormControl(data?.category_details?.category_name, Validators.required),
          setup: new FormControl(data.setup_selected, Validators.required),
          orgin_text: new FormControl(data.orgin_text, null),
          notes: new FormControl(data.notes, null),
          description: new FormControl(data.description, null),
          reference: new FormControl(data?.reference, null),
        })

        //reset image details
        this.imagePath = null
        this.image_to_upload = null
        this.imagenfo = {
          webContentLink: data.image_url,
          imageName: data.image_name
        }
        this.imgURL = data.image_url

        this.setup_selected = data.setup_selected
        this.selectedCategory = data.category
        this.selectedIVA = data.iva
        // checkboxes

        this.require_modifier = this.resetArray(this.require_modifier, data.required_modifier)
        this.optional_modifier = this.resetArray(this.optional_modifier, data.optional_modifier)
        let grainds = data.grinds?.map(function (item: any) {
          return item._id
        })
        this.grind = this.resetArray(this.grind, grainds)

        //description    
  //description    
        //description    
        this.itemsForm.get('description')?.setValue(data.description)

      }
      else {
        this.resetForm()
      }
    })
  }
  ivas: any = []
  backup_Ivas: any = []
  selectedIVA: any = ""
  @Input() category: any = []
  backup_category: any = []
  setup: any = ["Modifiers", "Variants"]
  orgin: any = []
  backup_setup: any = []
  @Input() require_modifier: any = []
  optional_modifier: any = []
  image_to_upload: any = null
  grind: any =
    [
      {
        grind_name: "Whole Beans",
        _id: "whole_beans",
        checked: false,
        price: "0",
        beans_value : "0",
        is_Active : true
      },
      {
        grind_name: "Espresso",
        _id: "espresso",
        checked: false,
        price: "0",
        beans_value : "0",
        is_Active : true
      },
      {
        grind_name: "Moka Pot",
        _id: "moka_pot",
        checked: false,
        price: "0",
        beans_value : "0",
        is_Active : true
      },
      {
        grind_name: "French Press",
        _id: "french_press",
        checked: false,
        price: "0",
        beans_value : "0",
        is_Active : true
      },
      {
        grind_name: "Filter",
        _id: "filter",
        checked: false,
        price: "0",
        beans_value : "0",
        is_Active : true
      }
    ]
  notes: string[] = [];
  category_info: any
  close = close
  orgin_value = true
  note_value = true
  faCaretDown = faCaretDown
  faTimes = faTimes
  faEuroSign = faEuroSign
  faBolt = faBolt
  setup_selected: string;
  imagenfo: any
  OriginEnabled = true
  NotesEnabled = true
  isLoadingUpload = false
  itemsForm = new FormGroup({
    items_name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    iva: new FormControl('', Validators.required),
    beans: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    setup: new FormControl('', Validators.required),
    orgin_text: new FormControl('', null),
    notes: new FormControl('', null),
    description: new FormControl('', null),
    reference: new FormControl('', Validators.required)
  })
  parse(obj: any) {
    JSON.parse(JSON.stringify(obj))
  }
  modules = {
    content: 'my text',
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

  htmlDescription: any = ""
  selectModifiers(row: number, checked: boolean, type: string) {
    if (type == 'optional') {
      this.optional_modifier[row].checked = checked
    }
    else if (type == "required") {
      this.require_modifier[row].checked = checked
    }
    else {
      this.grind[row].checked = checked
    }
  }
  imagePath: any;
  imgURL: any;
  public message: string;
  quilEditor: any
  ngOnInit(): void {
    this.get_iva()
    this.backup_category = JSON.parse(JSON.stringify(this.category))
    this.backup_setup = this.setup
  }
  ngAfterViewInit() {
    this.editor.content = this.htmlDescription
  }
  preview(files: any) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    this.image_to_upload = files[0]
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    this.uploadPhoto()
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  uploadPhoto() {
    this.isLoadingUpload = true
    this.apiServices.uploadProductsImage(this.image_to_upload).subscribe((response: any) => {
      this.commonService.showAlert(response.message)
      this.isLoadingUpload = false
      this.imagenfo = response.data
    })
  }
  onSelect(value: string) {
    this.setup_selected = value.toLowerCase();
  }
  saveAction() {
    let request = this.genereteInputObject()
    if ((this.itemsForm.valid)) {
      // if (this.setup_selected.toLowerCase() == "modifiers" && request.required_modifier.length == 0) {
      //   this.commonService.showAlert("Please choose Required Modifiers")
      // }
      if (this.setup_selected.toLowerCase() != "modifiers" && request.grinds.length == 0) {
        this.commonService.showAlert("Please Select atleast one Grind")
      }
      else if (this.imagenfo?.webContentLink == null || this.imagenfo?.webContentLink == undefined) {
        this.commonService.showAlert("Please Upload product Image")
      }
      else {
        this.action == "edit" ? this.editProduct(request) : this.saveProduct(request)
      }
    }
    else {
      this.commonService.getFormValidationErrors(this.itemsForm)
    }
  }
  saveProduct(request: any) {
    this.isLoadingAdd = true

    this.apiServices.addUserProduct(request).subscribe((response: any) => {
      this.isLoadingAdd = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        this.resetForm()
        this.sidenav.close()
        this.commonService.UserproductSuccess.emit()

      }
    })
  }
  deleteAPI() {
    this.isLoadingDelete = true
    this.apiServices.deleteUserProducts({ id: this.productInfo._id }).subscribe((response: any) => {
      this.isLoadingDelete = false
      this.commonService.showAlert(response.message)
      if (response.success) {
        this.resetForm()
        this.sidenav.close()
        this.commonService.UserproductSuccess.emit()
      }
    })
  }
  resetForm() {

    //reset form
    this.itemsForm.reset()

    //reset image details
    this.imagePath = null
    this.image_to_upload = null
    this.imagenfo = null
    this.imgURL = null

    // checkboxes
  this.require_modifier = this.resetArray(this.require_modifier)
  this.optional_modifier = this.resetArray(this.optional_modifier)
  this.grind = this.resetArray(this.grind)
     //description    
    this.itemsForm.get('description')?.setValue("")
  }
  Quillcreated(editorInstance: any) {
    this.quilEditor = editorInstance
  }
  resetArray(modifiers: any, dataFromAPI: any = null) {

    var array = modifiers.filter((data : any) => {
      return data.is_Active == true
    })
    if (dataFromAPI == null || dataFromAPI == "") {
      for (let index = 0; index < array.length; index++) {
        array[index].checked = false;
      }
    }
    else {
      for (let index = 0; index < array.length; index++) {
        if (dataFromAPI.includes(array[index]._id)) {
          array[index].checked = true;
        }
      }
    }
    return array
  }
  editProduct(request: any) {
    request._id = this.productInfo._id
    if (this.imagenfo?.webContentLink != undefined) {
      this.isLoadingAdd = true
      this.apiServices.UpdateUserProducts(request).subscribe((response: any) => {
        this.isLoadingAdd = false
        this.commonService.showAlert(response.message)
        if (response.success) {
          this.resetForm()
          this.sidenav.close()
          this.commonService.UserproductSuccess.emit()
        }
      })
    }
    else {
      this.commonService.showAlert("Image Not uploaded, Please wait till image is being uploaded!")
    }
  }
  changedEditor(event: any) {
    this.htmlDescription = event.html
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
  filter_items(value: string) {
    const filterValue = value.toLowerCase();
    this.ivas = this.backup_Ivas.filter((option: any) => option.iva_percent_withSymbol.toLowerCase().includes(filterValue));
    if (this.ivas.length == 0) {
      this.ivas = this.backup_Ivas
    }
  }
  filter_category(value: string) {
    const filterValue = value.toLowerCase();
    this.category = this.backup_category.filter((option: any) => option.toLowerCase().includes(filterValue));
    if (this.category.length == 0) {
      this.category = this.backup_category
    }
  }
  filter_setup(value: string) {
    const filterValue = value.toLowerCase();
    this.setup = this.backup_setup.filter((option: any) => option.toLowerCase().includes(filterValue));
    if (this.setup.length == 0) {
      this.setup = this.backup_setup
    }
  }

  get_iva() {
    this.apiServices.getIVA({}).subscribe(res => {
      this.ivas = this.commonService.sort(res.data.ivalist)
      this.backup_Ivas = JSON.parse(JSON.stringify(this.ivas))
      // this.itemsForm.reset()
    })
  }

  optionSelected(value: any, percent: any) {
    this.selectedIVA = value
  }
  selectedCategory = ""
  optionSelectedCategory(value: any) {
    this.selectedCategory = value
  }

  updateOriginNotes(target: any, value: any) {
    if (target = "notes") {
      this.NotesEnabled = value
    }
    else {
      this.OriginEnabled = value
    }
  }

  genereteInputObject() {
    //  {items_name,price,iva,beans,category,orgin_text,notes}

    let obj: any = {}
    obj.product_name = this.itemsForm.get('items_name')?.value
    obj.price = this.itemsForm.get('price')?.value
    obj.reference = this.itemsForm.get('reference')?.value
    obj.iva = this.selectedIVA
    obj.beans_value = this.itemsForm.get('beans')?.value
    obj.category = this.selectedCategory
    obj.image = this.image_to_upload
    obj.setup_selected = this.setup_selected?.toLowerCase()
    obj.required_modifier = this.require_modifier.filter(function (modifier: any) {
      return modifier.checked == true
    }).map((element: any) => element._id).join(',');
    obj.optional_modifier = this.optional_modifier.filter(function (modifier: any) {
      return modifier.checked == true
    }).map((element: any) => element._id).join(',');
    obj.grinds = JSON.stringify(this.grind.filter(function (item: any) {
      return item.checked == true
    }))
    obj.orgin_text = this.itemsForm.get('orgin_text')?.value || ""
    obj.origin_enabled = this.OriginEnabled
    obj.notes_enabled = this.NotesEnabled
    obj.notes = this.itemsForm.get('notes')?.value || ""
    obj.description = this.itemsForm.get('description')?.value || ""
    obj.image_name = this.imagenfo?.imageName || ""
    obj.image_url = this.imagenfo?.webContentLink || ""
    return obj
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
