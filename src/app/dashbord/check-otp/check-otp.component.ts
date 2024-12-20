import { Component, OnInit } from '@angular/core';
import { UserOtpDto } from '../model/user-otp-dto';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-otp',
  templateUrl: './check-otp.component.html',
  styleUrls: ['./check-otp.component.css']
})
export class CheckOtpComponent implements OnInit {
  userOtpDto : UserOtpDto = new UserOtpDto();
  isLoading: boolean = false;
  timer: number = 60;
  timerInterval: any;
  constructor(
    private toastr: ToastrService,
    private loginService : LoginService,
    private router : Router,
  ){}
  ngOnInit(): void {
    this.startTimer();
  }
  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
  resendOtp(): void {
    if (!this.userOtpDto.email) {
      this.toastr.error('Vui lòng nhập email trước khi gửi lại OTP', 'Lỗi');
      return;
    }
    console.log('Email gửi lại otp :' +this.userOtpDto.email);
    this.loginService.sendBackOtp(this.userOtpDto).subscribe(
      (response) => {
        this.isLoading = false;
        this.toastr.success('Đã gửi lại mã OTP thành công ! Vui lòng kiểm tra lại email', 'Thành công');
      }
    );
    this.timer = 60;
    this.startTimer();
  }
  onSubmit(): void{
    if (!this.userOtpDto.email || !this.userOtpDto.otpCode) {
      this.toastr.warning('Vui lòng nhập đầy đủ thông tin!', 'Cảnh báo');
      return;
    }
    this.isLoading = true;
    this.loginService.checkOtp(this.userOtpDto).subscribe(
      (response) => {
        this.isLoading = false;
        this.toastr.success('Xác thực OTP thành công!', 'Thành công');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.isLoading = false;
        this.toastr.error('Mã Otp không đúng hoặc đã hết hạn.', 'Lỗi');
      }
    );

  }
}
