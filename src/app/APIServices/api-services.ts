import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Api_response } from './api_response';
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin' : '*',
  })
}
@Injectable()
export class APIServices {

  units = [
    {
      code: "bag(s)",
      name: "Bag(s)",
    },
    {
      code: "kilo(s)",
      name: "Kilo(s)",
    },
    {
      code: "litro(s)",
      name: "Litro(s)",
    },
    {
      code: "box(s)",
      name: "Box(s)",
    },
    {
      code: "unit(s)",
      name: "Unit(s)",
    }
  ]
  url(path: any) {
    // var url = 'https://us-central1-syra-sharafa.cloudfunctions.net/api'
    // var url = 'https://syra-coffee.herokuapp.com'
    var url = 'http://localhost:8080'
    // var url = 'http://localhost:5001/syra-sharafa/us-central1/api'
    url = `${url}${path}`

    return url
  }

  constructor(private httpClient: HttpClient) { }
  admin_login(data: any) {
    return this.httpClient.post<Api_response>(this.url("/admin/login"), data)
  }
  get_admin_details_by_id(admindetails: any) {
    return this.httpClient.post<Api_response>(this.url("/admin/get_admin_details"), admindetails)
  }
  logout(log_out: any) {
    return this.httpClient.post<Api_response>(this.url("/admin/logout"), log_out)
  }
  update_admin_details(adminupdate: any) {
    return this.httpClient.post<Api_response>(this.url("/admin/update_admin_details"), adminupdate)
  }
  get_branch(branchlist: any) {
    return this.httpClient.post<Api_response>(this.url("/branches/get_branches"), branchlist)
  }
  update_branch(branch: any) {
    return this.httpClient.post<Api_response>(this.url("/branches/update_branch"), branch)
  }
  add_branch(branch: any) {
    return this.httpClient.post<Api_response>(this.url("/branches/add_branch"), branch)
  }
  get_all_barista() {
    return this.httpClient.post<Api_response>(this.url("/barista/get_all_barista"), {})
  }
  addBarista(barista: any) {
    return this.httpClient.post<Api_response>(this.url("/barista/add_barista"), barista)
  }
  update_barista_password(barista: any) {
    return this.httpClient.post<Api_response>(this.url("/barista/update_password"), barista)
  }
  get_settings() {
    return this.httpClient.post<Api_response>(this.url("/settings/get_settings"), null)
  }
  update_admin_message(id: any, admin_message: any) {
    return this.httpClient.post<Api_response>(this.url("/admin/update_admin_details"), { id: id, admin_recipt_message: admin_message })
  }
  update_settings(settings: any) {
    return this.httpClient.post<Api_response>(this.url("/settings/update_settings"), { request_array: settings })
  }
  upload_logo(files: File) {
    const formData: FormData = new FormData();
    formData.append("file", files, files.name);
    return this.upload(formData, null)
  }

  addUserCategory(params : any){
    const url = this.url("/user_categories/add_category")
    return this.httpClient.post(url, params)
  }

  uploadCategoryImage(file : File){
    const formData = new FormData();
    formData.append("category_image", file);
    const url = this.url("/user_categories/upload_image")
    return this.httpClient.post(url, formData)
  }  
  //User Categories
  getUserCategories(){
    return this.httpClient.post<Api_response>(this.url("/user_categories/get_categories"), null)
  }
  UpdateUserCategory(data : any){
    return this.httpClient.post<Api_response>(this.url("/user_categories/update_category"), data)
  }
  reOrderUserCategory(data : any){
    return this.httpClient.post<Api_response>(this.url("/user_categories/re_order"), data)
  }
  updateOnlineStatus(data : any){
    return this.httpClient.post<Api_response>(this.url("/user_categories/updateOnlineStatus"), data)
  }
  deleteUserCategory(data : any){
    return this.httpClient.post<Api_response>(this.url("/user_categories/delete_category"), data)
  }

  //Modifiers
  addModifiers(data : any){
    return this.httpClient.post<Api_response>(this.url("/modifiers/add_modifier"), data)
  }
  getModifiers(data : any){
    return this.httpClient.post<Api_response>(this.url("/modifiers/get_modifer"), data)
  }
  updateModifiers(data : any){
    return this.httpClient.post<Api_response>(this.url("/modifiers/update_modifier"), data)
  }
  deleteModifiers(data : any){
    return this.httpClient.post<Api_response>(this.url("/modifiers/delete_modifers"), data)
  }
  updateModifierStatus(data : any){
    return this.httpClient.post<Api_response>(this.url("/modifiers/update_online_status"), data)
  }

    //Modifiers
    addStory(data : any){
      return this.httpClient.post<Api_response>(this.url("/story/add_story"), data)
    }
    getStories(data : any){
      return this.httpClient.post<Api_response>(this.url("/story/get_story "), data)
    }
    updateStories(data : any){
      return this.httpClient.post<Api_response>(this.url("/story/update_story"), data)
    }
    deleteStories(data : any){
      return this.httpClient.post<Api_response>(this.url("/story/delete_story"), data)
    }
    uploadStoryImage(file : File){
      const formData = new FormData();
      formData.append("storyImage", file);
      const url = this.url("/story/upload_image")
      return this.httpClient.post(url, formData)
    }
    
    //User Categories
    addUserProduct(params : any){
      const url = this.url("/user-products/add_product")
      return this.httpClient.post(url, params)
    }
  
    getUserProducts(){
      return this.httpClient.post<Api_response>(this.url("/user-products/get_product"), null)
    }
    get_featured_products(){
      return this.httpClient.post<Api_response>(this.url("/user-products/get_featured"), null)
    }
    UpdateUserProducts(data : any){
      return this.httpClient.post<Api_response>(this.url("/user-products/update_product"), data)
    }
    reOrderUserProducts(data : any){
      return this.httpClient.post<Api_response>(this.url("/user-products/re_order"), data)
    }
    updateProductsOnlineStatus(data : any){
      return this.httpClient.post<Api_response>(this.url("/user-products/updateOnlineStatus"), data)
    }
    deleteUserProducts(data : any){
      return this.httpClient.post<Api_response>(this.url("/user-products/delete_product"), data)
    }
    getUserGroupedProducts(data : any){
      return this.httpClient.post<Api_response>(this.url("/user-products/get-all-products"), data)
    }
    uploadProductsImage(file : File){
      const formData = new FormData();
      formData.append("product_image", file);
      const url = this.url("/user-products/upload_image")
      return this.httpClient.post(url, formData)
    }
    
  get_logo() {
    return this.httpClient.post<Api_response>(this.url("/settings/get_logo"), null)
  }
  upload(formData: any, params: any): Observable<any> {
    formData.append('params', JSON.stringify(params))
    const url = this.url("/settings/upload_logo")
    return this.httpClient.post(url, formData, httpOptions)
  }
  addCategory(category: any) {
    return this.httpClient.post<Api_response>(this.url("/categories/add_category"), category)
  }
  updateCategory(category: any) {
    return this.httpClient.post<Api_response>(this.url("/categories/update_category"), category)
  }
  getCategories(data: any = null) {
    return this.httpClient.post<Api_response>(this.url("/categories/get_categories"), data)
  }
  deleteCategory(req: any) {
    return this.httpClient.post<Api_response>(this.url("/categories/delete_category"), req)
  }
  update_category_order(orders : any){
    return this.httpClient.post<Api_response>(this.url("/categories/update_order"), orders)

  }

  addCatelouge(category: any) {
    return this.httpClient.post<Api_response>(this.url("/catelouge/add_catelouge"), category)
  }
  updateCatelouge(category: any) {
    return this.httpClient.post<Api_response>(this.url("/catelouge/update_catelouge"), category)
  }
  getCatelouge(data: any = null) {
    return this.httpClient.post<Api_response>(this.url("/catelouge/get_inventories_sorted"), data)
  }
  deleteCatelouge(req: any) {
    return this.httpClient.post<Api_response>(this.url("/catelouge/delete_catelouge"), req)
  }
  searchCatelouge(req: any) {
    return this.httpClient.post<Api_response>(this.url("/catelouge/search_catelouge"), req)
  }

  addIVA(iva: any) {
    return this.httpClient.post<Api_response>(this.url("/setup/add_iva"), iva)
  }
  getIVA(iva: any = null) {
    return this.httpClient.post<Api_response>(this.url("/setup/get_iva"), iva)
  }
  deleteIVA(iva: any) {
    return this.httpClient.post<Api_response>(this.url("/setup/delete_iva"), iva)
  }

  addExpense(expense: any) {
    return this.httpClient.post<Api_response>(this.url("/setup/add_expense"), expense)
  }
  getExpense(expense: any = null) {
    return this.httpClient.post<Api_response>(this.url("/setup/get_expense"), expense)
  }
  deleteExpense(expense: any) {
    return this.httpClient.post<Api_response>(this.url("/setup/delete_expense"), expense)
  }

  addDiscount(discount: any) {
    return this.httpClient.post<Api_response>(this.url("/setup/add_discount"), discount)
  }
  getDiscount(discount: any = null) {
    return this.httpClient.post<Api_response>(this.url("/setup/get_discount"), discount)
  }
  deleteDiscount(discount: any) {
    return this.httpClient.post<Api_response>(this.url("/setup/delete_discount"), discount)
  }
  orderDiscounts(discount: any) {
    return this.httpClient.post<Api_response>(this.url("/setup/arrange_discounts"), discount)
  }
  addProduct(product: any) {
    return this.httpClient.post<Api_response>(this.url("/products/add_product"), product)
  }
  updateProduct(product: any) {
    return this.httpClient.post<Api_response>(this.url("/products/update_product"), product)
  }
  getProducts(product: any = null) {
    return this.httpClient.post<Api_response>(this.url("/products/get_products"), product)
  }
  deleteproduct(product: any) {
    return this.httpClient.post<Api_response>(this.url("/products/delete_product"), product)
  }
  update_product_order(orders : any){
    return this.httpClient.post<Api_response>(this.url("/products/update_order"), orders)
  }
  get_branch_products(category : any){
    return this.httpClient.post<Api_response>(this.url("/products/branch_products"), category)
  }
  get_branch_category(category : any){
    return this.httpClient.post<Api_response>(this.url("/categories/branch_category"), category)
  }

  createInventoryOrder(order : any){
    return this.httpClient.post<Api_response>(this.url("/inventory-order/create_order"), order)
  }

  reOrderInventory(order : any){
    return this.httpClient.post<Api_response>(this.url("/inventory-order/reorder"), order)
  }

  updateInventoryOrder(order : any){
    return this.httpClient.post<Api_response>(this.url("/inventory-order/update_order"), order)
  }
  getInventoryOrders(order : any){
    return this.httpClient.post<Api_response>(this.url("/inventory-order/get_orders"), order)
  }

  get_branch_inventory_orders(order : any){
    return this.httpClient.post<Api_response>(this.url("/inventory-order/branch_orders"), order)
  }
  
  get_out_transactions(order : any){
    return this.httpClient.post<Api_response>(this.url("/transactionOut/get_txns"), order)
  }

  filter_transactions(request : any){
    return this.httpClient.post<Api_response>(this.url("/transactionOut/filter"), request)
  }

  get_inventory_reports(request : any){
    return this.httpClient.post<Api_response>(this.url("/inventory-report/get_reports"), request)
  }

  ger_inventory_reports_filtered(req : any){
    return this.httpClient.post<Api_response>(this.url("/inventory-report/filter_reports"), req)
    
  }
  getTxnIn(req : any){
    return this.httpClient.post<Api_response>(this.url("/orders/transactionIn"), req)
  }

  filter_in_transactions(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/filter"), request)
  }

  get_vat_reports(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/get_vat_report"), request)
  }

  get_payment_mode_based_report(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/get_report_with_payment_mode"), request)
  }

  get_discount_comparison(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/get_discount_comparsion"), request)
  }
  
  get_discount_report_user_coupon(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/get_discount_report"), request)
  }

  get_discount_report_user(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/get_barista_grouped_discount"), request)
  }
  get_discount_report_coupon(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/get_applied_discounts_grouped"), request)
  }

  //report Generation
  //1.Accounting Report PDF
  
  generate_accounting_report(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/accounting-report"), request)
  }

  generateGlobalsalesReport(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/global-sales"), request)
  }
  generateCategorysalesReport(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/category-sales"), request)
  }

  generateProductSalesReport(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/product-sales"), request)
  }

  getDashBoard(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/get-dashboard"), request)
  }
  downloadInventoryOrder(request : any){
    return this.httpClient.post<Api_response>(this.url("/inventory-order/print"), request)
  }

  getAttendance_report(request : any){
    return this.httpClient.post<Api_response>(this.url("/barista/get_report"), request)
  }
  getAttendance_report_graph(request : any){
    return this.httpClient.post<Api_response>(this.url("/barista/get_report_graph"), request)
  }
  getDashBoardGraph(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/get-dashboard-branch-graph"), request)
  }
  getDashReportGraph(request : any){
    return this.httpClient.post<Api_response>(this.url("/orders/get-dashboard-report-graph"), request)
  }
  updateCoffeeReportEntry(request : any){
    return this.httpClient.post<Api_response>(this.url("/inventory-report/update"), request)
  }
  deleteCoffeeReportEntry(request : any){
    return this.httpClient.post<Api_response>(this.url("/inventory-report/delete"), request)
  }
  addEvent(request : any){
    return this.httpClient.post<Api_response>(this.url("/events/add_event"), request)
  }
  uploadEventImage(file : File){
    const formData = new FormData();
    formData.append("Event_image", file);
    const url = this.url("/events/upload_event")
    return this.httpClient.post(url, formData)
  }
  get_events(){
    return this.httpClient.post<Api_response>(this.url("/events/get_events"), null)
  }
  UpdateEvent(data : any){
    return this.httpClient.post<Api_response>(this.url("/events/update_events"), data)
  }
  deleteEvent(data : any){
    return this.httpClient.post<Api_response>(this.url("/events/delete_event"), data)
  }

  deleteBarista(data : any){
    return this.httpClient.post<Api_response>(this.url("/barista/delete_barista"), data)
  }
}

