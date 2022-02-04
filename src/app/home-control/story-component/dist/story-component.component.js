"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.close = exports.StoryComponentComponent = exports._filter = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var forms_1 = require("@angular/forms");
var delete_component_1 = require("src/app/shared/components/delete/delete.component");
exports._filter = function (opt, value) {
    var filterValue = value.toLowerCase();
    return opt.filter(function (item) { return item.toLowerCase().includes(filterValue); });
};
var StoryComponentComponent = /** @class */ (function () {
    function StoryComponentComponent(apiServices, commonService, modalService) {
        var _this = this;
        this.apiServices = apiServices;
        this.commonService = commonService;
        this.modalService = modalService;
        this.isLoadingAdd = false;
        this.isLoadingDelete = false;
        this.faPlusCircle = free_solid_svg_icons_1.faPlus;
        this.faMinusCircle = free_solid_svg_icons_1.faMinus;
        this.faCaretDown = free_solid_svg_icons_1.faCaretDown;
        this.close = exports.close;
        this.selectedStory = null;
        this.product_list = [];
        /* */
        this.story = [];
        this.storyform = new forms_1.FormGroup({
            title: new forms_1.FormControl('', forms_1.Validators.required)
        });
        this.modules = {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image', 'video'] // link and image, video
            ]
        };
        this.commonService.storyPopupOpened.subscribe(function (data) {
            if (_this.action == "edit") {
                _this.selectedStory = data;
                _this.imgURL = data.thumbnail_url;
                _this.storyform = new forms_1.FormGroup({
                    title: new forms_1.FormControl(data.title, forms_1.Validators.required)
                });
                _this.selectedProducts = data.products;
                _this.story = JSON.parse(data.story_content);
                _this.thumbnailInfo = { imageName: data === null || data === void 0 ? void 0 : data.thumbnail_name, webContentLink: data === null || data === void 0 ? void 0 : data.thumbnail_url };
            }
            else {
                _this.selectedStory = null;
                _this.story = [{ type: 'image', value: '' }, { type: 'text', value: '' }];
                _this.selectedProducts = "";
                _this.imgURL = null;
                _this.storyform.reset();
                _this.thumbnailInfo = null;
            }
        });
    }
    StoryComponentComponent.prototype.ngOnInit = function () {
        this.getProduct_list();
        this.story.push({ type: 'image', value: '' });
        this.story.push({ type: 'text', value: '' });
    };
    StoryComponentComponent.prototype.getProduct_list = function () {
        var _this = this;
        this.apiServices.getUserGroupedProducts({}).subscribe(function (products) {
            _this.product_list = JSON.parse(JSON.stringify(products)).data.products_list.filter(function (res) {
                return res.type == "product";
            });
        });
    };
    StoryComponentComponent.prototype.preview = function (files) {
        var _this = this;
        if (files.length === 0)
            return;
        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = "Only images are supported.";
            return;
        }
        var reader = new FileReader();
        this.imagePath = files;
        this.uploadThumbPhoto();
        reader.readAsDataURL(files[0]);
        reader.onload = function (_event) {
            _this.imgURL = reader.result;
        };
    };
    StoryComponentComponent.prototype.preview_cover = function (cover_files, row) {
        var _this = this;
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
        this.uploadCover(row);
        reader.onload = function (_event) {
            _this.cover_imgURL = reader.result;
            _this.story[row].value = _this.cover_imgURL;
        };
    };
    StoryComponentComponent.prototype.saveAction = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var invalidData = false;
        for (var i = 0; i < this.story.length; i++) {
            if (((_b = (_a = this.story[i]) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.toString()) == "" || ((_d = (_c = this.story[i]) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.toString()) == null || ((_f = (_e = this.story[i]) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.toString()) == undefined) {
                invalidData = true;
                break;
            }
        }
        if (this.storyform.controls['title'].value == "") {
            this.commonService.showAlert("Story Title is Mandatory");
        }
        else if (this.product_select.value.length == 0) {
            this.commonService.showAlert("Choost the products");
        }
        else if (((_g = this.thumbnailInfo) === null || _g === void 0 ? void 0 : _g.webContentLink) == "" || ((_h = this.thumbnailInfo) === null || _h === void 0 ? void 0 : _h.webContentLink) == null || ((_j = this.thumbnailInfo) === null || _j === void 0 ? void 0 : _j.webContentLink) == undefined) {
            this.commonService.showAlert("Upload Story Thumbnail Image");
        }
        else if (invalidData == true) {
            this.commonService.showAlert("Please Fill all story contents");
        }
        else {
            this.action == "edit" ? this.editAPI() : this.saveAPI();
        }
    };
    StoryComponentComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.deleteAPI();
        }, function () {
        });
    };
    StoryComponentComponent.prototype.deleteAPI = function () {
        var _this = this;
        this.isLoadingDelete = true;
        this.apiServices.deleteStories({ id: this.selectedStory._id }).subscribe(function (res) {
            _this.commonService.showAlert(res.message);
            _this.isLoadingDelete = false;
            _this.storyFormReset();
            _this.sidenav.close();
            _this.commonService.storySuccess.emit();
        });
    };
    StoryComponentComponent.prototype.editAPI = function () {
        var _this = this;
        this.isLoadingAdd = true;
        var request = {
            _id: this.selectedStory._id,
            title: this.storyform.controls['title'].value,
            products: this.product_select.value,
            thumbnail_name: this.thumbnailInfo.imageName,
            thumbnail_url: this.thumbnailInfo.webContentLink,
            story_content: JSON.stringify(this.story)
        };
        this.apiServices.updateStories(request).subscribe(function (response) {
            console.log(response);
            _this.isLoadingAdd = false;
            _this.commonService.showAlert(response.message);
            if (response.success) {
                _this.storyFormReset();
                _this.sidenav.close();
                _this.commonService.storySuccess.emit();
            }
        });
    };
    StoryComponentComponent.prototype.saveAPI = function () {
        var _this = this;
        this.isLoadingAdd = true;
        var request = {
            title: this.storyform.controls['title'].value,
            products: this.product_select.value,
            thumbnail_name: this.thumbnailInfo.imageName,
            thumbnail_url: this.thumbnailInfo.webContentLink,
            story_content: JSON.stringify(this.story)
        };
        this.apiServices.addStory(request).subscribe(function (response) {
            console.log(response);
            _this.isLoadingAdd = false;
            _this.commonService.showAlert(response.message);
            if (response.success) {
                _this.storyFormReset();
                _this.sidenav.close();
                _this.commonService.storySuccess.emit();
            }
        });
    };
    StoryComponentComponent.prototype.storyFormReset = function () {
        this.thumbnailInfo = null;
        this.imagePath = null;
        this.storyform.reset();
        this.selectedProducts = "";
        this.story = [];
    };
    StoryComponentComponent.prototype.add_image = function () {
        this.story.push({ type: 'image', value: '' });
    };
    StoryComponentComponent.prototype.add_text = function () {
        this.story.push({ type: 'text', value: '' });
    };
    StoryComponentComponent.prototype.onContentChanged = function (event_quill, row) {
        this.story[row].value = event_quill.html;
        // event_quill.editor.setSelection(event_quill.editor.getLength(), 0);
    };
    StoryComponentComponent.prototype.uploadThumbPhoto = function () {
        var _this = this;
        var _a;
        if (((_a = this.thumbnailInfo) === null || _a === void 0 ? void 0 : _a.webContentLink) != null) {
            this.thumbnailInfo.webContentLink = null;
        }
        this.isUploadingThumb = true;
        this.apiServices.uploadStoryImage(this.imagePath[0]).subscribe(function (response) {
            _this.commonService.showAlert(response.message);
            _this.isUploadingThumb = false;
            _this.thumbnailInfo = response.data;
        });
    };
    StoryComponentComponent.prototype.uploadCover = function (row) {
        var _this = this;
        var _a;
        if (((_a = this.story[row]) === null || _a === void 0 ? void 0 : _a.value) != null) {
            this.story[row].value = null;
        }
        this.isUploadingContent = true;
        this.apiServices.uploadStoryImage(this.cover_imagePath[0]).subscribe(function (response) {
            _this.commonService.showAlert(response.message);
            _this.isUploadingContent = false;
            _this.story[row].value = response.data.webContentLink;
        });
    };
    __decorate([
        core_1.Input()
    ], StoryComponentComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], StoryComponentComponent.prototype, "field");
    __decorate([
        core_1.Input()
    ], StoryComponentComponent.prototype, "action");
    __decorate([
        core_1.ViewChild('matProduct')
    ], StoryComponentComponent.prototype, "product_select");
    StoryComponentComponent = __decorate([
        core_1.Component({
            selector: 'app-story-component',
            templateUrl: './story-component.component.html',
            styleUrls: ['./story-component.component.scss']
        })
    ], StoryComponentComponent);
    return StoryComponentComponent;
}());
exports.StoryComponentComponent = StoryComponentComponent;
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
