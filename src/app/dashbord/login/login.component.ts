import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ToastrService } from 'ngx-toastr';
declare var google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email : string ='';
  password : string ='';
  errorMessage: string = '';
  passwordErrorMessage: string = '';
  canAddProduct: boolean = false;
  canUpdateProduct: boolean = false;
  canDeleteProduct: boolean = false;
  constructor(private loginService: LoginService,
              private router : Router,
              private appComponent : AppComponent,
              private toastr: ToastrService,

  ){}
  ngOnInit(): void {
    this.initGoogleSignIn();
  }
  onSubmit() {
    if (!this.email || this.email.trim() === '') {
      this.toastr.error('Email không được để trống', 'Thông báo');
      return;
    }
    if (!this.password || this.password.trim() === '') {
      this.toastr.error('Mật khẩu không được để trống', 'Thông báo');
      return;
    }
    this.loginService.loginCustomer(this.email, this.password).subscribe(
      data => {
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          const decodedToken = this.loginService.decodeToken();
          const role = decodedToken?.role;
          this.appComponent.loadPermissions();
          this.router.navigate(['/home']);
          this.toastr.success('Đăng nhập thành công', 'Thông báo');
          console.clear();
        }
      },error =>{
        this.toastr.error('Email hoặc Password không đúng', 'Thông báo');
      }
    );
  }

  onEmailInput() {
    if (!this.email || this.email.trim() === '') {
      this.errorMessage = 'Email không được để trống';

    }else{
    this.loginService.checkEmail(this.email).subscribe(
      exists => {
        if (!exists) {
          this.errorMessage = 'Email không tồn tại';
        } else {
          this.errorMessage = '';
        }
      },
      error => {
        this.errorMessage = 'Đã xảy ra lỗi, vui lòng thử lại';
      }
    );
  }
}
initGoogleSignIn() {
  google.accounts.id.initialize({
    client_id: '536431985965-ftgr9ml55j43o7oojpdojh7f86hcnf0e.apps.googleusercontent.com', // Thay YOUR_CLIENT_ID bằng Client ID bạn nhận được từ Google
    callback: (response: any) => this.handleGoogleSignIn(response)
  });
  google.accounts.id.renderButton(
    document.getElementById("google-signin-button"),
    { theme: "outline", size: "large" }
  );
}

handleGoogleSignIn(response: any) {
  const token = response.credential;
  this.loginService.loginGoogle(token).subscribe(
    response => {
      console.log(response);
      this.router.navigate(['/home']);
    },
    error => {
      console.error('Login failed', error);
      this.toastr.error('Đăng nhập Google thất bại', 'Thông báo');
    }
  );
}

}
