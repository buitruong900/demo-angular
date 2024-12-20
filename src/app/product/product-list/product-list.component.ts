import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../model/product';
import { PageResponse } from '../model/page-response';
import { ProductDto } from '../model/product-dto';
import { ProductService } from '../service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDeletedto } from '../model/product-deletedto';
import { ProductUpdatedto } from '../model/product-updatedto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductFinddto } from '../model/product-finddto';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/dashbord/service/login.service';
import { ProductCreatdto } from '../model/product-createdto';
import { HttpHeaders } from '@angular/common/http';
declare var bootstrap: any;
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @ViewChild('fileInput') fileInput! : ElementRef;
  private processingImport: boolean = false;
  products : Product[] = [];
  allProducts : Product[] = [];
  pageResponse : PageResponse<Product> = new PageResponse<Product>();
  searchDto : ProductDto = new ProductDto();
  deleteProductDto : ProductDeletedto = new ProductDeletedto();
  updateProductDto : ProductUpdatedto = new ProductUpdatedto();
  detailProductDto : ProductFinddto = new ProductFinddto();
  isAdmin: boolean = false;
  producers: string[] = [];
  qualities: string[] = [];
  years: number[] = [];
  canAddProduct: boolean = false;
  canUpdateProduct: boolean = false;
  canDeleteProduct: boolean = false;
  canSearchProduct: boolean = false;
  canExportProduct: boolean = false;
  canImportProduct: boolean = false;
  canImportProductSkipDulicateImportExcel: boolean = false;
  productCreateDto : ProductCreatdto = new ProductCreatdto();
  productForm!: FormGroup;
  isModalOpen = false;
  productUpdatedto : ProductUpdatedto = new ProductUpdatedto();
  productFinddto : ProductFinddto = new ProductFinddto();
  searchExport: Product[] = [];
  private currentFile : File | null = null;
  private duplicateImportModal : any;
  errorMessage: string = '';
  private detailModal : any;
  private productModal: any;
  selectedProduct: Product | null = null;
  constructor(private ProductService : ProductService,
  public router : Router,
  private toastr: ToastrService,
  public loginService : LoginService,
  private formBuilder: FormBuilder,
  private route : ActivatedRoute,
){}
  ngOnInit() {
    this.searchDto.page = 0;
    this.searchDto.size = 5;
    this.getAllProduct();
    this.search();
    this.initForm();
    const decodedToken = this.loginService.decodeToken();
    const role = decodedToken?.role;
    this.loginService.loadRoleFunctions(role).subscribe(permissions =>{
      this.canAddProduct=permissions.some(permission => permission.includes('/product/add'));
      this.canUpdateProduct=permissions.some(permission => permission.includes('/product/update'));
      this.canDeleteProduct=permissions.some(permission => permission.includes('/product/delete'));
      this.canSearchProduct=permissions.some(permission => permission.includes('/product/search'));
      this.canExportProduct=permissions.some(permission => permission.includes('/product/export-excel'));
      this.canImportProduct=permissions.some(permission => permission.includes('/product/import-excel'));
      this.canImportProductSkipDulicateImportExcel=permissions.some(permission => permission.includes('/product/import-excelSkipDuplicate'));
    })
  }
  initForm(): void {
    this.productForm = this.formBuilder.group({
      proName: ['', [Validators.required, Validators.minLength(4)]],
      producer: ['', [Validators.required, Validators.minLength(4)]],
      yearMaking: ['', [Validators.required]],
      expDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      quality: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[0-9]*$/)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]]
    });
  }
  search(){
    this.ProductService.searchProduct(this.searchDto).subscribe(data => {
      this.pageResponse.content = data.content;
      this.pageResponse.totalElements = data.totalElements;
      this.pageResponse.totalPages = data.totalPages;
      this.pageResponse.page = data.page || 0;
      this.pageResponse.size = data.size || 0;
      this.products = data.content;
      this.searchExport = data.content;
    });
  }

  onSearch(){
    this.search();
  }
  onPageChange(event : number) {
    this.searchDto.page = event -1 ;
    this.search();
  }
  getAllProduct(){
    this.ProductService.getProductList().subscribe(data => {
      this.allProducts = data;
    })
  }

  deleteProduct() {
    this.ProductService.deleteProduct(this.deleteProductDto).subscribe(
      data => {
        this.toastr.success("Đã xóa sản phẩm thành công!"," Thành công")
        this.search();
        this.getAllProduct();
      });
  }

  updateProduct() {
    if (this.productForm.valid) {
      const updatedProduct = this.productForm.value as ProductUpdatedto;
      updatedProduct.proId = this.selectedProduct?.proId;

      this.ProductService.updateProduct(updatedProduct).subscribe(
        (response) => {
          this.toastr.success('Cập nhật sản phẩm thành công!', 'Thành công');
          this.search();
          this.getAllProduct();
          this.closeDetailModal();
        }
      );
    } else {
      this.toastr.warning('Vui lòng điền đầy đủ thông tin hợp lệ', 'Cảnh báo');
    }
  }
  detailProduct(product: ProductFinddto) {
    if (!product.proId) {
      this.toastr.error('Không tìm thấy ID sản phẩm', 'Lỗi');
      return;
    }

    const findDto = new ProductFinddto();
    findDto.proId = product.proId;

    this.ProductService.detaillProduct(findDto).subscribe(
      (data) => {
        this.selectedProduct = data;
        this.productForm.patchValue({
          proName : data.proName,
          producer : data.producer,
          yearMaking : data.yearMaking ,
          expDate : data.expDate,
          quality : data.quality,
          price : data.price
        });
        this.detailModal = new bootstrap.Modal(document.getElementById('detailProductModal'));
        this.detailModal.show();
      }
    );
  }
  closeDetailModal() {
    if (this.detailModal) {
      this.detailModal.hide();
      this.selectedProduct = null;
    }
  }
  selectAll(event: any) {
    const checked = event.target.checked;
    this.pageResponse.content.forEach(product => product.selected = checked);
  }
  ngAfterViewInit() {
    this.productModal = new bootstrap.Modal(document.getElementById('productModal'));
  }
  saveProduct() {
    if (this.productForm.valid) {
      this.ProductService.createProduct(this.productForm.value).subscribe(
        data => {
          this.toastr.success('Đã thêm sản phẩm thành công!', 'Thành công');
          this.productForm.reset();
          this.products.push(data);

          this.search();
          this.getAllProduct();
          if (this.productModal) {
            this.productModal.hide();
          }
        });
    } else {
      this.toastr.warning('Vui lòng điền đầy đủ thông tin', 'Cảnh báo');
    }
  }
  goToProductList(){
    this.router.navigate(['/products']);
  }
  onSubmit(){
    this.saveProduct();
  }
  importExcel(event: any): void {
    this.errorMessage = '';
    const file: File = event.target.files[0];
    if (!file) {
      return;
    }
    this.resetImportState();
    this.processingImport = true;
    this.currentFile = file;
    this.ProductService.importExcelProduct(file).subscribe({
      next: (response) => {
        this.toastr.success('Import thành công !', 'Thông báo');
        this.search();
        this.resetImportState();
      },
      error: (error) => {
        if (error.status === 400 && error.error) {
          this.errorMessage = error.error;
          this.showDuplicateImportModal();
        } else {
          this.toastr.error('Lỗi khi import', 'Thông báo');
          this.resetImportState();
        }
        this.processingImport = false;
      },
      complete: () => {
        this.processingImport = false;
      }
    });
  }

  private resetFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
  showDuplicateImportModal() {
    if (this.duplicateImportModal) {
      this.duplicateImportModal.hide();
      this.duplicateImportModal = null;
    }
    this.duplicateImportModal = new bootstrap.Modal(document.getElementById('duplicateImportModal'));
    this.duplicateImportModal.show();
  }
  closeDuplicateImportModal(): void {
    if (this.duplicateImportModal) {
      this.duplicateImportModal.hide();
      this.duplicateImportModal = null;
      console.clear();
      this.resetImportState();
    }
  }
  private resetImportState(): void {
    this.processingImport = false;
    this.currentFile = null;
    this.errorMessage = '';
    this.resetFileInput();
    if (this.duplicateImportModal) {
      this.duplicateImportModal.hide();
      this.duplicateImportModal = null;
    }
  }
  importSkipDuplicateImportExcel(): void {
    if (!this.currentFile) {
      this.toastr.warning('Không tìm thấy file để import', 'Thông báo');
      return;
    }
    this.processingImport = true;
    this.ProductService.importSkipDuplicateExcelProduct(this.currentFile).subscribe({
      next: (response) => {
        this.toastr.success('Import thành công ', 'Thông báo');
        console.clear();
        this.search();
        this.resetImportState();
      },
      error: (error) => {
        this.toastr.error('Lỗi khi import', 'Thông báo');
        this.resetImportState();
      },
      complete: () => {
        this.processingImport = false;
      }
    });
  }

  exportExcel() {
    const searchProductDto = new ProductDto();
    searchProductDto.proName = this.searchDto.proName;
    searchProductDto.producer = this.searchDto.producer;
    searchProductDto.yearMaking = this.searchDto.yearMaking;
    searchProductDto.startDate = this.searchDto.startDate;
    searchProductDto.expDate = this.searchDto.expDate;
    searchProductDto.quality = this.searchDto.quality;
    searchProductDto.price = this.searchDto.price;
    this.ProductService.exportExcelProduct(searchProductDto).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toastr.success('Export thành công!', 'Thành công');
      },
      error => {
        console.error(error);
        this.toastr.error('Có lỗi xảy ra khi xuất file Excel.', 'Lỗi');
      }
    );
  }
}
