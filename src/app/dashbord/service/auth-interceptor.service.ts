import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private loginService : LoginService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.loginService.getToken();
    const authReq = req.clone({
      headers : req.headers.set('Authorization',`Bearer ${authToken}`)
    });
    return next.handle(authReq);
  }
}
