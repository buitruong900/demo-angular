import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignupDto } from '../model/signup-dto';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseUrl = 'http://localhost:2809/api/auth';

  constructor(private httpCline : HttpClient) { }

  registerCutomer(signupDto : SignupDto) : Observable<SignupDto>{
    return this.httpCline.post<SignupDto>(`${this.baseUrl}/signup`,signupDto);
  }
}
