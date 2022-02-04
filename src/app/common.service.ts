import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SyraErrors } from './error'
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  language_slot() {
    var language_slot: any = [];
    language_slot['en'] = "English";
    language_slot['es'] = "Spanish";
    return language_slot;
  }
  date: {
    from_date: any;
    end_data: any;
  }

  constructor(private snackbar: MatSnackBar, private errorClass: SyraErrors) { }
  @Output() url_updated: EventEmitter<String> = new EventEmitter();
  set_current_url(value: any) {
    this.url_updated.emit(value);
  }

  @Output() update_status: EventEmitter<String> = new EventEmitter();
  set_status(value: any) {
    this.update_status.emit(value);
  }

  @Output() select_branch: EventEmitter<String> = new EventEmitter();
  set_branch(value: any) {
    this.select_branch.emit(value);
  }
  @Output() parent_open: EventEmitter<any> = new EventEmitter();
  branch_edit(value: any) {
    this.parent_open.emit(value);
  }
  @Output() admin_open: EventEmitter<any> = new EventEmitter();
  admin_edit(value: any) {
    this.admin_open.emit(value);
  }

  @Output() choose_date: EventEmitter<any> = new EventEmitter();
  set_date(date: any) {
    this.choose_date.emit(date);
  }
  @Output() passing_res_branch: EventEmitter<any> = new EventEmitter();
  push_data(value: any) {
    this.passing_res_branch.emit(value);
  }
  @Output() passing_res_user: EventEmitter<any> = new EventEmitter();
  push_user_data(value: any) {
    this.passing_res_user.emit(value);
  }

  @Output() passing_res_admin: EventEmitter<any> = new EventEmitter();
  pass_data(value: any) {
    this.passing_res_admin.emit(value);
  }
  @Output() toggle_sidebar: EventEmitter<String> = new EventEmitter();
  set_sidebar_toggle(value = "") {
    this.toggle_sidebar.emit(value);
  }
  @Output() updateScreenType: EventEmitter<String> = new EventEmitter();
  update_screen_type(value = "") {
    this.toggle_sidebar.emit(value);
  }
  @Output() getBranches: EventEmitter<any> = new EventEmitter();

  @Output() userEmitter: EventEmitter<String> = new EventEmitter();
  @Output() commonEmitter: EventEmitter<any> = new EventEmitter();
  @Output() categoryEmitter: EventEmitter<any> = new EventEmitter();
  @Output() productEmitter: EventEmitter<any> = new EventEmitter();
  @Output() inventoryOrder: EventEmitter<any> = new EventEmitter();
  @Output() catelougeEmitter: EventEmitter<any> = new EventEmitter();
  @Output() closedSideNav: EventEmitter<any> = new EventEmitter();
  @Output() setupEmitter: EventEmitter<any> = new EventEmitter();
  @Output() resetForms: EventEmitter<any> = new EventEmitter();
  @Output() exportClicked: EventEmitter<any> = new EventEmitter();
  @Output() export_success: EventEmitter<any> = new EventEmitter();
  @Output() reloadGrphEmitter: EventEmitter<any> = new EventEmitter();
  @Output() sendMail: EventEmitter<any> = new EventEmitter();
  @Output() EditReport: EventEmitter<any> = new EventEmitter();
  @Output() SuccessEditCoffeeCount: EventEmitter<any> = new EventEmitter();
  @Output() openInventoryForm: EventEmitter<any> = new EventEmitter();
  @Output() closeInventoryForm: EventEmitter<any> = new EventEmitter();
  @Output() reOrderSuccess : EventEmitter<any> = new EventEmitter();
  @Output() UserCategorySuccess : EventEmitter<any> = new EventEmitter();
  @Output() UserCategorypopUpopend : EventEmitter<any> = new EventEmitter();
 
  @Output() ModifierCategorypopUpopend : EventEmitter<any> = new EventEmitter();
  @Output() ModifierSuccess : EventEmitter<any> = new EventEmitter();
  @Output() UserproductSuccess : EventEmitter<any> = new EventEmitter();
  @Output() UserProductpopUpopend : EventEmitter<any> = new EventEmitter();

  @Output() featuredProdcutSuccess : EventEmitter<any> = new EventEmitter();
  @Output() featuredProductopUpopend : EventEmitter<any> = new EventEmitter();
  @Output() EventSuccess : EventEmitter<any> = new EventEmitter();
  @Output() eventFormOpend : EventEmitter<any> = new EventEmitter();
  @Output() storySuccess : EventEmitter<any> = new EventEmitter();
  @Output() storyPopupOpened : EventEmitter<any> = new EventEmitter();
  @Output() CreateInvOrderFromAdminDataFetcher : EventEmitter<any> = new EventEmitter();
  @Output() syncProductQuantity : EventEmitter<any> = new EventEmitter();
  @Output() updateInventoryOrderFrom : EventEmitter<any> = new EventEmitter();
  @Output() updateSyningCountEmitter : EventEmitter<any> = new EventEmitter();

  showAlert(value: any) {   
    console.log(value) ;
    this.snackbar.open(value.replace(/^./, value[0].toUpperCase()) , "close", {
      duration: 2000,
    });
  }

  getFormValidationErrors(form: any) {
    let error: any = []
    Object.keys(form.controls).forEach(key => {
      const controlErrors: any = form?.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          error.push(this.errorClass.errors[key] + ' is ' + this.errorClass.errorType[keyError])
        });
      }
    });
    console.log(error[0]);
    this.showAlert(error[0])
  }
  isAnyBranchSelected(branches : any){
    let success = false
    branches.forEach((element : any) => {
      if(element.is_active == true)
      {
        success = true
      }
    });    
    return success
  }

  isAnycategorySelected(category : any){
    let success = false
    category.forEach((element : any) => {
      if(element.is_active == true)
      {
        success = true
      }
    });    
    return success
  }

  sort(ivalist: any) {
    return ivalist.sort((obj1: any, obj2: any) => {
      if (Number(obj1.iva_percent) > Number(obj2.iva_percent)) {
        return 1;
      }

      if (Number(obj1.iva_percent) < Number(obj2.iva_percent)) {
        return -1;
      }

      return 0;
    });
  }

  processPrice(amount : any){
    return Number(amount).toFixed(2)
  }

  public findInvalidControls(controls_arg : any) {
    const invalid = [];
    const controls = controls_arg;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(this.errorClass.errors[name]);
        }
    }
    return invalid;
}
}

