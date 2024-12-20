import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, Observable, tap, throwError, of, map } from 'rxjs';
import { UserOtpDto } from 'src/app/dashbord/model/user-otp-dto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrel = 'http://localhost:2809/api/auth';
  roleFunctions: string[] = [];

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  loginCustomer(email: string, password: string): Observable<any> {
    const loginRequest = { email: email, password: password };
    return this.httpClient.post(`${this.baseUrel}/login`, loginRequest).pipe(
      tap((response: any) => {
        if (response.token && response.refreshToken) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 403:
          errorMessage = 'Forbidden';
          break;
        case 404:
          errorMessage = 'Email không tồn tại.';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          break;
      }
    }
    return throwError(errorMessage);
  }

  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      const decoded : any = jwtDecode(token);
      return {
        role : decoded.role,
        functions : decoded.functions || {},
      };
    }
    return null;
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.role : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }


  isAdmin(): boolean {
    const role = this.getRole();
    return role === "ROLE_ADMIN";
  }

  isUser(): boolean {
    const role = this.getRole();
    return role === "ROLE_USER";
  }
  loadRoleFunctions(role: string): Observable<string[]> {
    return this.httpClient.post< string[] >(
      `${this.baseUrel}/function-permission`, [role]
    ).pipe(
      map(response => {
        this.roleFunctions = response;
        return response;
      })
    );
  }
  checkEmail(email : string): Observable<boolean>{
    const payload = {email};
    return this.httpClient.post<{exits : boolean}>(`${this.baseUrel}/check-email`,payload).pipe(
      map(response => response.exits),
    )
  }
  checkOtp(userOtpDto : UserOtpDto) : Observable<UserOtpDto>{
      return this.httpClient.post<UserOtpDto>(`${this.baseUrel}/check-otp`,userOtpDto);
  }

  sendBackOtp(userOtpDto : UserOtpDto) : Observable<UserOtpDto>{
    return this.httpClient.post<UserOtpDto>(`${this.baseUrel}/sendBack-otp`,userOtpDto);
  }

    loginGoogle(token : string):Observable<any>{
      return this.httpClient.post<any>(`${this.baseUrel}/login-google`,token);
    }
}
