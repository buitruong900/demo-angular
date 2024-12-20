import {NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list/product-list.component';
import { RegisterComponent } from './dashbord/register/register.component';
import { LoginComponent } from './dashbord/login/login.component';
import { AuthGuardService } from './dashbord/service/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RoleListComponent } from './role/role-list/role-list.component';
import { CheckOtpComponent } from './dashbord/check-otp/check-otp.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'check-otp', component: CheckOtpComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [AuthGuardService],
  },
  {
   path:'home',
   component: HomeComponent,
   canActivate : [AuthGuardService]
  },
  {
    path:'manage',
    component : RoleListComponent,
    canActivate : [AuthGuardService]
  },
  {
    path : 'unauthorized',
    component : UnauthorizedComponent,
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
