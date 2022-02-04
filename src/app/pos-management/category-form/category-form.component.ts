import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { close } from '../../account-configurations/account-from/account-from.component';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Api_response } from 'src/app/APIServices/api_response';
import { APIServices } from 'src/app/APIServices/api-services';
import { CommonService } from 'src/app/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from '../../shared/components/delete/delete.component';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  isLoadingDelete = false
  isLoadingSave = false
  //declaration
  @ViewChild('category') categoryName: any;

  @Input() sidenav: any;
  @Input() field: any;
  @Input() action: any;
  @Input() parentParams: ParamMap

  branches: any = []
  allComplete: boolean = false;
  selectedValue: String = "10.00%";
  dropDown: any;
  isLoading = true
  categoryForm = new FormGroup(
    {
      category: new FormControl('', Validators.required)
    }
  )

  //initalization
  close = close
  category_id = ""
  selectedColorIndex = 0
  colors = [
    { color: "#4751c9" },
    { color: "#45a9ea" },
    { color: "#cc6ae3" },
    { color: "#dea766" },
    { color: "#7c52cb" },
    { color: "#16a186" },
  ]

  //constructor
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private apiServices: APIServices, private commonService: CommonService, private modalService: NgbModal) { 
    this.commonService.resetForms.subscribe(() =>{
      this.initPopup(null)
    })
  }

  //Init
  ngOnInit(): void {
    this.parentParams = this.activatedRoute.snapshot.paramMap
    this.commonService.categoryEmitter.subscribe((category_id: any) => {
      if (this.parentParams.get("category")) {
        this.initQueryParams()
      }
      else {
        this.initPopup(category_id)
      }
    })
    this.get_branches()
  }

  //update achecked status of individal branches => to get selected branches
  updateAllComplete(row: number, checked: boolean) {
    this.branches[row].is_active = checked
    this.allComplete = this.branches != null && this.branches.every((t: any) => t.is_active);
  }

  //parent function to init entire pop up for both actions (add and edit categoried)
  initPopup(category_id: any) {
    this.category_id = category_id
    if (category_id) {
      this.getCategoryDetails()
    }
    else {
      this.categoryForm.setValue({ category: "" })
      this.selectedColorIndex = 0
      this.init_branches()
    }
  }

  //to get category detials while comming to edit option to fill form 
  getCategoryDetails() {
    this.isLoading = true
    this.apiServices.getCategories({ id: this.category_id }).subscribe((response) => {
      this.isLoading = false
      this.categoryForm.setValue({ category: response.data?.category?.category_name })
      this.selectedColorIndex = this.colors.findIndex((x: any) => x.color === response.data.category.color)
      this.init_branches()
      response.data.category.available_branches.forEach((element: any) => {
        let index = this.branches.findIndex((x: any) => x._id === element)
        this.branches[index].is_active = true;
      });
      this.isLoading = false
    })
  }

  //to get all brnaches
  get_branches() {
    this.apiServices.get_branch({}).subscribe(
      (res: Api_response) => {
        if (res.success) {
          this.branches = res.data.branch_list;
          this.branches.forEach((element: any) => {
            element["is_active"] = false
          });
        }
        else {
          this.commonService.showAlert(res.message);
        }
      }
    )
  }

  //save category function
  saveAction() {
    if (this.categoryForm.valid) {
      if (!this.commonService.isAnyBranchSelected(this.branches)) {
        this.commonService.showAlert("select atleast any one branch")
      }
      else {
        this.saveCategory()
      }
    }
    else {
      this.commonService.showAlert("Category name is mandatory")
    }
  }

  //to add category API
  saveCategory() {
    this.isLoadingSave = true
    let request = this.generateObject()
    this.apiServices.addCategory(request).subscribe((response) => {
      this.isLoadingSave = false
      if (response.success) {
        if (this.parentParams.get("category") != null) {
          this.redirectToCatelouge()
        }
        else {
          this.commonService.showAlert(response.message)
          this.commonService.commonEmitter.emit()
          this.sidenav.close()
        }
      }
      else {
        this.commonService.showAlert(response.message)
      }
    })
  }

  //to edit category
  editAction() {
    this.isLoadingSave = true
    let req = this.generateObject()
    req.id = this.category_id
    this.apiServices.updateCategory(req).subscribe((response) => {
      this.commonService.showAlert(response.message)
      this.isLoadingSave = false
      if (response.success) {
        this.sidenav.close()
        this.commonService.commonEmitter.emit()
      }
    })

  }

  //to delete category
  deleteAction() {

    this.modalService.open(DeleteComponent)
      .result.then(
        () => {
          this.isLoadingDelete = true
          this.apiServices.deleteCategory({ id: this.category_id }).subscribe((response: any) => {
            this.commonService.showAlert(response.message)
            this.isLoadingDelete = false
            if (response.success) {
              this.sidenav.close()
              this.commonService.commonEmitter.emit()
            }
          })
        },
        () => {

        }
      )



  }

  // to get all branch ids when checked
  getSelectedBranches() {
    let selected: String[] = []
    this.branches.forEach((element: any) => {
      if (element.is_active) {
        selected.push(element._id)
      }
    });
    return selected
  }


  //to change category the color index
  ChangeColor(row: number) {
    this.selectedColorIndex = row
  }

  //to generate input object
  generateObject() {
    let request: any = Object()
    request.color = this.colors[this.selectedColorIndex].color
    request.category_name = this.categoryForm.controls['category'].value
    request.available_branches = this.getSelectedBranches().join(",")
    request.is_Active = true
    request.created_by = JSON.parse(localStorage.getItem('syra_admin') ?? "")["data"]["_id"]
    return request
  }

  //redirect to catelouge page with created category data
  redirectToCatelouge() {
    let params = this.getAllParams()
    this.router.navigate(["/configurations/catalouge", params])
  }

  //to get all params returned from inventory page
  getAllParams() {
    let data: any
    this.activatedRoute?.parent?.params.subscribe(
      (params: any) => {
        data = params
      });
    return data
  }

  // to set all branches un selected
  init_branches() {
    this.branches.forEach((element: any) => {
      element.is_active = false
    });
    this.isLoading = false
  }

  //to initialize while comming from inventory page
  initQueryParams() {
    console.log(this.parentParams)
    this.categoryForm.setValue({ category: this.parentParams.get("category") })
  }
}
