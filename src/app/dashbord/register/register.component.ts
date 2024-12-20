import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../service/register.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  email : string = '';
  password : string = '';
  userName : string = '';
  registerForm! : FormGroup;
  errorMessage : string = '';
  constructor(private registerService : RegisterService,
              private router : Router,
              private fb : FormBuilder,
              private toast : ToastrService
  ){}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email : ['',[Validators.required,Validators.email]],
      password : ['',[Validators.required,Validators.minLength(6)]],
      userName : ['',[Validators.required]]
    });
  }

  onSumitRegister() {
    if (this.registerForm.valid) {
      const signupDto = {
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        userName: this.registerForm.get('userName')?.value,
      };
      this.registerService.registerCutomer(signupDto).subscribe(
        (response: any) => {
          if (response?.message === 'Người dùng đã được đăng ký. Vui lòng kiểm tra email để nhận mã OTP') {
            this.toast.success("Đăng kí thành công! Hãy kiểm tra mã OTP ở email của bạn.");
            this.router.navigate(['/check-otp']);
          } else {
            this.toast.error('Đăng ký thất bại, vui lòng thử lại.');
          }
        }
      );
    } else {
      this.errorMessage = this.getFormValidationErrors();
    }
  }
  getFormValidationErrors(): string {
    if (this.registerForm.get('email')?.hasError('required') || this.registerForm.get('password')?.hasError('required')) {
      return 'Vui lòng điền đầy đủ thông tin ';
    }
    if (this.registerForm.get('email')?.hasError('email')) {
      return 'Vui lòng nhập một địa chỉ email hợp lệ.';
    }
    if (this.registerForm.get('password')?.hasError('minlength')) {
      return 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    return 'Vui lòng kiểm tra lại thông tin đăng ký.';
  }



}
