import { Component, OnInit } from '@angular/core';
import { LoginService } from './dashbord/service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  canAddProduct = false;
  canUpdateProduct = false;
  canDeleteProduct = false;
  canSearchProduct = false;
  canGetAllProducts = false;
  canExportExcel = false;
  canImportExcel = false;
  canImportExcelSkipDuplicate = false;
  canManageProduct = false;
  canManageRoleAll =  false;
  canManageRoleAdd = false;
  canMangeAcount = false
  constructor(public loginService: LoginService, private router: Router) {}

  ngOnInit() {
    this.loadPermissions();
  }
  loadPermissions() {
    const role = this.loginService.getRole();
    if (role) {
      this.loginService.loadRoleFunctions(role).subscribe(
        permissions => {
          this.canAddProduct = permissions.some(permission => permission.includes('/product/add'));
          this.canUpdateProduct = permissions.some(permission => permission.includes('/product/update'));
          this.canDeleteProduct = permissions.some(permission => permission.includes('/product/delete'));
          this.canSearchProduct = permissions.some(permission => permission.includes('/product/search'));
          this.canGetAllProducts = permissions.some(permission => permission.includes('/product/all'));
          this.canExportExcel = permissions.some(permission => permission.includes('/product/export-excel'));
          this.canImportExcel = permissions.some(permission => permission.includes('/product/import-excel'));
          this.canImportExcelSkipDuplicate = permissions.some(permission => permission.includes('/product/import-excelSkipDuplicate'));
          this.canManageProduct = this.canAddProduct || this.canUpdateProduct || this.canDeleteProduct ||
            this.canSearchProduct || this.canGetAllProducts || this.canExportExcel ||
            this.canImportExcel || this.canImportExcelSkipDuplicate;


          this.canManageRoleAll = permissions.some(permission => permission.includes('/manage/all'));
          this.canManageRoleAdd = permissions.some(permission => permission.includes('/manage/add'));
          this.canMangeAcount = this.canManageRoleAll || this.canManageRoleAdd;
        },
        error => {
          console.error('Không thể load các function', error);
          this.resetFunctionAndPermissions();
        }
      );
    }
  }
  resetFunctionAndPermissions() {
    this.canAddProduct = false;
    this.canUpdateProduct = false;
    this.canDeleteProduct = false;
    this.canSearchProduct = false;
    this.canGetAllProducts = false;
    this.canExportExcel = false;
    this.canImportExcel = false;
    this.canImportExcelSkipDuplicate = false;
    this.canManageProduct = false;
    this.canManageRoleAdd = false;
    this.canManageRoleAll = false;
    this.canMangeAcount = false;
  }

  logOut() {
    this.loginService.logout();
    this.resetFunctionAndPermissions();
    console.clear();
    this.router.navigate(['/login']);
  }
  title = 'crud-procedure';
}
