import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RegisterComponent } from './dashbord/register/register.component';
import { LoginComponent } from './dashbord/login/login.component';
import { AuthInterceptorService } from './dashbord/service/auth-interceptor.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RoleListComponent } from './role/role-list/role-list.component';
import { CheckOtpComponent } from './dashbord/check-otp/check-otp.component';
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    UnauthorizedComponent,
    RoleListComponent,
    CheckOtpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgSelectModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
