"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.close = exports.ItemComponentComponent = exports._filter = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var forms_1 = require("@angular/forms");
var free_solid_svg_icons_2 = require("@fortawesome/free-solid-svg-icons");
var delete_component_1 = require("../../shared/components/delete/delete.component");
exports._filter = function (opt, value) {
    var filterValue = value.toLowerCase();
    return opt.filter(function (item) { return item.toLowerCase().includes(filterValue); });
};
var ItemComponentComponent = /** @class */ (function () {
    function ItemComponentComponent(apiServices, commonService, modalService) {
        var _this = this;
        this.apiServices = apiServices;
        this.commonService = commonService;
        this.modalService = modalService;
        this.isLoadingAdd = false;
        this.isLoadingDelete = false;
        this.ivas = [];
        this.backup_Ivas = [];
        this.selectedIVA = "";
        this.category = [];
        this.backup_category = [];
        this.setup = ["Modifiers", "Variants"];
        this.orgin = [];
        this.backup_setup = [];
        this.require_modifier = [];
        this.optional_modifier = [];
        this.image_to_upload = null;
        this.grind = [
            {
                grind_name: "Whole Beans",
                _id: "whole_beans",
                checked: false,
                price: "0",
                beans_value: "0"
            },
            {
                grind_name: "Espresso",
                _id: "espresso",
                checked: false,
                price: "0",
                beans_value: "0"
            },
            {
                grind_name: "Moka Pot",
                _id: "moka_pot",
                checked: false,
                price: "0",
                beans_value: "0"
            },
            {
                grind_name: "French Press",
                _id: "french_press",
                checked: false,
                price: "0",
                beans_value: "0"
            },
            {
                grind_name: "Filter",
                _id: "filter",
                checked: false,
                price: "0",
                beans_value: "0"
            }
        ];
        this.notes = [];
        this.close = exports.close;
        this.orgin_value = true;
        this.note_value = true;
        this.faCaretDown = free_solid_svg_icons_1.faCaretDown;
        this.faTimes = free_solid_svg_icons_1.faTimes;
        this.faEuroSign = free_solid_svg_icons_2.faEuroSign;
        this.faBolt = free_solid_svg_icons_2.faBolt;
        this.OriginEnabled = true;
        this.NotesEnabled = true;
        this.isLoadingUpload = false;
        this.itemsForm = new forms_1.FormGroup({
            items_name: new forms_1.FormControl('', forms_1.Validators.required),
            price: new forms_1.FormControl('', forms_1.Validators.required),
            iva: new forms_1.FormControl('', forms_1.Validators.required),
            beans: new forms_1.FormControl('', forms_1.Validators.required),
            category: new forms_1.FormControl('', forms_1.Validators.required),
            setup: new forms_1.FormControl('', forms_1.Validators.required),
            orgin_text: new forms_1.FormControl('', null),
            notes: new forms_1.FormControl('', null),
            description: new forms_1.FormControl('', null),
            reference: new forms_1.FormControl('', forms_1.Validators.required)
        });
        this.modules = {
            content: 'my text',
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image', 'video'] // link and image, video
            ]
        };
        this.htmlDescription = "";
        this.selectedCategory = "";
        this.commonService.UserProductpopUpopend.subscribe(function (data) {
            var _a, _b, _c;
            _this.optional_modifier = JSON.parse(JSON.stringify(_this.require_modifier));
            _this.productInfo = data;
            if (data != null) {
                _this.itemsForm = new forms_1.FormGroup({
                    items_name: new forms_1.FormControl(data.product_name, forms_1.Validators.required),
                    price: new forms_1.FormControl(data.price, forms_1.Validators.required),
                    iva: new forms_1.FormControl(data.iva_info ? data.iva_info.iva_percent_withSymbol : "0.00%", forms_1.Validators.required),
                    beans: new forms_1.FormControl(data.beans_value, forms_1.Validators.required),
                    category: new forms_1.FormControl((_a = data === null || data === void 0 ? void 0 : data.category_details) === null || _a === void 0 ? void 0 : _a.category_name, forms_1.Validators.required),
                    setup: new forms_1.FormControl(data.setup_selected, forms_1.Validators.required),
                    orgin_text: new forms_1.FormControl(data.orgin_text, null),
                    notes: new forms_1.FormControl(data.notes, null),
                    description: new forms_1.FormControl(data.description, null),
                    reference: new forms_1.FormControl(data === null || data === void 0 ? void 0 : data.reference, null)
                });
                //reset image details
                _this.imagePath = null;
                _this.image_to_upload = null;
                _this.imagenfo = {
                    webContentLink: data.image_url,
                    imageName: data.image_name
                };
                _this.imgURL = data.image_url;
                _this.setup_selected = data.setup_selected;
                _this.selectedCategory = data.category;
                _this.selectedIVA = data.iva;
                // checkboxes
                _this.require_modifier = _this.resetArray(_this.require_modifier, data.required_modifier);
                _this.optional_modifier = _this.resetArray(_this.optional_modifier, data.optional_modifier);
                var grainds = (_b = data.grinds) === null || _b === void 0 ? void 0 : _b.map(function (item) {
                    return item._id;
                });
                _this.grind = _this.resetArray(_this.grind, grainds);
                //description    
                //description    
                //description    
                (_c = _this.itemsForm.get('description')) === null || _c === void 0 ? void 0 : _c.setValue(data.description);
            }
            else {
                _this.resetForm();
            }
        });
    }
    ItemComponentComponent.prototype.parse = function (obj) {
        JSON.parse(JSON.stringify(obj));
    };
    ItemComponentComponent.prototype.selectModifiers = function (row, checked, type) {
        if (type == 'optional') {
            this.optional_modifier[row].checked = checked;
        }
        else if (type == "required") {
            this.require_modifier[row].checked = checked;
        }
        else {
            this.grind[row].checked = checked;
        }
    };
    ItemComponentComponent.prototype.ngOnInit = function () {
        this.get_iva();
        this.backup_category = JSON.parse(JSON.stringify(this.category));
        this.backup_setup = this.setup;
    };
    ItemComponentComponent.prototype.ngAfterViewInit = function () {
        this.editor.content = this.htmlDescription;
    };
    ItemComponentComponent.prototype.preview = function (files) {
        var _this = this;
        if (files.length === 0)
            return;
        var mimeType = files[0].type;
        this.image_to_upload = files[0];
        if (mimeType.match(/image\/*/) == null) {
            this.message = "Only images are supported.";
            return;
        }
        var reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]);
        this.uploadPhoto();
        reader.onload = function (_event) {
            _this.imgURL = reader.result;
        };
    };
    ItemComponentComponent.prototype.uploadPhoto = function () {
        var _this = this;
        this.isLoadingUpload = true;
        this.apiServices.uploadProductsImage(this.image_to_upload).subscribe(function (response) {
            _this.commonService.showAlert(response.message);
            _this.isLoadingUpload = false;
            _this.imagenfo = response.data;
        });
    };
    ItemComponentComponent.prototype.onSelect = function (value) {
        this.setup_selected = value.toLowerCase();
    };
    ItemComponentComponent.prototype.saveAction = function () {
        var _a, _b;
        var request = this.genereteInputObject();
        if ((this.itemsForm.valid)) {
            // if (this.setup_selected.toLowerCase() == "modifiers" && request.required_modifier.length == 0) {
            //   this.commonService.showAlert("Please choose Required Modifiers")
            // }
            if (this.setup_selected.toLowerCase() != "modifiers" && request.grinds.length == 0) {
                this.commonService.showAlert("Please Select atleast one Grind");
            }
            else if (((_a = this.imagenfo) === null || _a === void 0 ? void 0 : _a.webContentLink) == null || ((_b = this.imagenfo) === null || _b === void 0 ? void 0 : _b.webContentLink) == undefined) {
                this.commonService.showAlert("Please Upload product Image");
            }
            else {
                this.action == "edit" ? this.editProduct(request) : this.saveProduct(request);
            }
        }
        else {
            this.commonService.getFormValidationErrors(this.itemsForm);
        }
    };
    ItemComponentComponent.prototype.saveProduct = function (request) {
        var _this = this;
        this.isLoadingAdd = true;
        this.apiServices.addUserProduct(request).subscribe(function (response) {
            _this.isLoadingAdd = false;
            _this.commonService.showAlert(response.message);
            if (response.success) {
                _this.resetForm();
                _this.sidenav.close();
                _this.commonService.UserproductSuccess.emit();
            }
        });
    };
    ItemComponentComponent.prototype.deleteAPI = function () {
        var _this = this;
        this.isLoadingDelete = true;
        this.apiServices.deleteUserProducts({ id: this.productInfo._id }).subscribe(function (response) {
            _this.isLoadingDelete = false;
            _this.commonService.showAlert(response.message);
            if (response.success) {
                _this.resetForm();
                _this.sidenav.close();
                _this.commonService.UserproductSuccess.emit();
            }
        });
    };
    ItemComponentComponent.prototype.resetForm = function () {
        var _a;
        //reset form
        this.itemsForm.reset();
        //reset image details
        this.imagePath = null;
        this.image_to_upload = null;
        this.imagenfo = null;
        this.imgURL = null;
        // checkboxes
        this.require_modifier = this.resetArray(this.require_modifier);
        this.optional_modifier = this.resetArray(this.optional_modifier);
        this.grind = this.resetArray(this.grind);
        //description    
        (_a = this.itemsForm.get('description')) === null || _a === void 0 ? void 0 : _a.setValue("");
    };
    ItemComponentComponent.prototype.Quillcreated = function (editorInstance) {
        this.quilEditor = editorInstance;
    };
    ItemComponentComponent.prototype.resetArray = function (modifiers, dataFromAPI) {
        if (dataFromAPI === void 0) { dataFromAPI = null; }
        var array = modifiers.filter(function (data) {
            return data.is_Active == true;
        });
        if (dataFromAPI == null || dataFromAPI == "") {
            for (var index = 0; index < array.length; index++) {
                array[index].checked = false;
            }
        }
        else {
            for (var index = 0; index < array.length; index++) {
                if (dataFromAPI.includes(array[index]._id)) {
                    array[index].checked = true;
                }
            }
        }
        return array;
    };
    ItemComponentComponent.prototype.editProduct = function (request) {
        var _this = this;
        var _a;
        request._id = this.productInfo._id;
        if (((_a = this.imagenfo) === null || _a === void 0 ? void 0 : _a.webContentLink) != undefined) {
            this.isLoadingAdd = true;
            this.apiServices.UpdateUserProducts(request).subscribe(function (response) {
                _this.isLoadingAdd = false;
                _this.commonService.showAlert(response.message);
                if (response.success) {
                    _this.resetForm();
                    _this.sidenav.close();
                    _this.commonService.UserproductSuccess.emit();
                }
            });
        }
        else {
            this.commonService.showAlert("Image Not uploaded, Please wait till image is being uploaded!");
        }
    };
    ItemComponentComponent.prototype.changedEditor = function (event) {
        this.htmlDescription = event.html;
    };
    ItemComponentComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.deleteAPI();
        }, function () {
        });
    };
    ItemComponentComponent.prototype.filter_items = function (value) {
        var filterValue = value.toLowerCase();
        this.ivas = this.backup_Ivas.filter(function (option) { return option.iva_percent_withSymbol.toLowerCase().includes(filterValue); });
        if (this.ivas.length == 0) {
            this.ivas = this.backup_Ivas;
        }
    };
    ItemComponentComponent.prototype.filter_category = function (value) {
        var filterValue = value.toLowerCase();
        this.category = this.backup_category.filter(function (option) { return option.toLowerCase().includes(filterValue); });
        if (this.category.length == 0) {
            this.category = this.backup_category;
        }
    };
    ItemComponentComponent.prototype.filter_setup = function (value) {
        var filterValue = value.toLowerCase();
        this.setup = this.backup_setup.filter(function (option) { return option.toLowerCase().includes(filterValue); });
        if (this.setup.length == 0) {
            this.setup = this.backup_setup;
        }
    };
    ItemComponentComponent.prototype.get_iva = function () {
        var _this = this;
        this.apiServices.getIVA({}).subscribe(function (res) {
            _this.ivas = _this.commonService.sort(res.data.ivalist);
            _this.backup_Ivas = JSON.parse(JSON.stringify(_this.ivas));
            // this.itemsForm.reset()
        });
    };
    ItemComponentComponent.prototype.optionSelected = function (value, percent) {
        this.selectedIVA = value;
    };
    ItemComponentComponent.prototype.optionSelectedCategory = function (value) {
        this.selectedCategory = value;
    };
    ItemComponentComponent.prototype.updateOriginNotes = function (target, value) {
        if (target = "notes") {
            this.NotesEnabled = value;
        }
        else {
            this.OriginEnabled = value;
        }
    };
    ItemComponentComponent.prototype.genereteInputObject = function () {
        //  {items_name,price,iva,beans,category,orgin_text,notes}
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var obj = {};
        obj.product_name = (_a = this.itemsForm.get('items_name')) === null || _a === void 0 ? void 0 : _a.value;
        obj.price = (_b = this.itemsForm.get('price')) === null || _b === void 0 ? void 0 : _b.value;
        obj.reference = (_c = this.itemsForm.get('reference')) === null || _c === void 0 ? void 0 : _c.value;
        obj.iva = this.selectedIVA;
        obj.beans_value = (_d = this.itemsForm.get('beans')) === null || _d === void 0 ? void 0 : _d.value;
        obj.category = this.selectedCategory;
        obj.image = this.image_to_upload;
        obj.setup_selected = (_e = this.setup_selected) === null || _e === void 0 ? void 0 : _e.toLowerCase();
        obj.required_modifier = this.require_modifier.filter(function (modifier) {
            return modifier.checked == true;
        }).map(function (element) { return element._id; }).join(',');
        obj.optional_modifier = this.optional_modifier.filter(function (modifier) {
            return modifier.checked == true;
        }).map(function (element) { return element._id; }).join(',');
        obj.grinds = JSON.stringify(this.grind.filter(function (item) {
            return item.checked == true;
        }));
        obj.orgin_text = ((_f = this.itemsForm.get('orgin_text')) === null || _f === void 0 ? void 0 : _f.value) || "";
        obj.origin_enabled = this.OriginEnabled;
        obj.notes_enabled = this.NotesEnabled;
        obj.notes = ((_g = this.itemsForm.get('notes')) === null || _g === void 0 ? void 0 : _g.value) || "";
        obj.description = ((_h = this.itemsForm.get('description')) === null || _h === void 0 ? void 0 : _h.value) || "";
        obj.image_name = ((_j = this.imagenfo) === null || _j === void 0 ? void 0 : _j.imageName) || "";
        obj.image_url = ((_k = this.imagenfo) === null || _k === void 0 ? void 0 : _k.webContentLink) || "";
        return obj;
    };
    __decorate([
        core_1.Input()
    ], ItemComponentComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], ItemComponentComponent.prototype, "action");
    __decorate([
        core_1.Input()
    ], ItemComponentComponent.prototype, "field");
    __decorate([
        core_1.ViewChild('editor')
    ], ItemComponentComponent.prototype, "editor");
    __decorate([
        core_1.Input()
    ], ItemComponentComponent.prototype, "category");
    __decorate([
        core_1.Input()
    ], ItemComponentComponent.prototype, "require_modifier");
    ItemComponentComponent = __decorate([
        core_1.Component({
            selector: 'app-item-component',
            templateUrl: './item-component.component.html',
            styleUrls: ['./item-component.component.scss']
        })
    ], ItemComponentComponent);
    return ItemComponentComponent;
}());
exports.ItemComponentComponent = ItemComponentComponent;
exports.close = {
    prefix: 'fa',
    iconName: 'line',
    icon: [
        512,
        512,
        [],
        '',
        "M437.126,74.939c-99.826-99.826-262.307-99.826-362.133,0C26.637,123.314,0,187.617,0,256.005\n\t\t\ts26.637,132.691,74.993,181.047c49.923,49.923,115.495,74.874,181.066,74.874s131.144-24.951,181.066-74.874\n\t\t\tC536.951,337.226,536.951,174.784,437.126,74.939z M409.08,409.006c-84.375,84.375-221.667,84.375-306.042,0\n\t\t\tc-40.858-40.858-63.37-95.204-63.37-153.001s22.512-112.143,63.37-153.021c84.375-84.375,221.667-84.355,306.042,0\n\t\t\tC493.435,187.359,493.435,324.651,409.08,409.006z M341.525,310.827l-56.151-56.071l56.151-56.071c7.735-7.735,7.735-20.29,0.02-28.046\n\t\t\tc-7.755-7.775-20.31-7.755-28.065-0.02l-56.19,56.111l-56.19-56.111c-7.755-7.735-20.31-7.755-28.065,0.02\n\t\t\tc-7.735,7.755-7.735,20.31,0.02,28.046l56.151,56.071l-56.151,56.071c-7.755,7.735-7.755,20.29-0.02,28.046\n\t\t\tc3.868,3.887,8.965,5.811,14.043,5.811s10.155-1.944,14.023-5.792l56.19-56.111l56.19,56.111\n\t\t\tc3.868,3.868,8.945,5.792,14.023,5.792c5.078,0,10.175-1.944,14.043-5.811C349.28,331.117,349.28,318.562,341.525,310.827z",
    ]
};
