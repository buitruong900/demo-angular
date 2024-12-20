import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginService } from './login.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router,
    private toastr: ToastrService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    if (this.loginService.isLoggedIn()) {
      const url = state.url;
      const role = this.loginService.getRole();
      if (!role) {
        return of(this.router.createUrlTree(['/login']));
      }
      return this.loginService.loadRoleFunctions(role).pipe(
        map((permissions: string[]) => {
          const hasPermission = permissions.some(permission => {
            const path = permission.split(',');
            const permissionUrl = path[1];
            return permissionUrl === url;
          });
          if (url === '/home') {
            return true;
          }
          if (hasPermission) {
            return true;
          } else {
              this.toastr.warning('Bạn không có quyền truy cập', 'Thông báo');
              return this.router.createUrlTree(['/unauthorized']);
          }
        })
      );
    } else {
      return of(this.router.createUrlTree(['/login']));
    }
  }
}
