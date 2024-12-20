import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Role } from '../model/role';
import { HttpClient } from '@angular/common/http';
import { UrlApi } from '../model/url-api';
import { UrlApiAddDto } from '../model/url-api-add-dto';
import { UrlApiDeleteDto } from '../model/url-api-delete-dto';
import { UserOtpDto } from '../../dashbord/model/user-otp-dto';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'http://localhost:2809/manage';

  private urlPermissionsAll = 'http://localhost:2809/api/auth';
  constructor(private httpClient  : HttpClient) {}
  getRoleAll(): Observable<Role[]>{
    return this.httpClient.post<Role[]>(`${this.baseUrl}/all`,{});
  }
  getPerrmissionsAll(): Observable<UrlApi[]>{
    return this.httpClient.post<UrlApi[]>(`${this.urlPermissionsAll}/permissions-all`,{});
  }

  findUrlApiByRole(role: Role): Observable<UrlApi[]> {
    return this.httpClient.post<string[]>(
      `${this.urlPermissionsAll}/find-apiUrl-byRole`,
      { name: role.name }
    ).pipe(
      map((urls: string[]) => {
        return urls.map((url: string): UrlApi => ({
          nameUrl: url,
          selected: false
        }));
      })
    );
  }
  addPermissionToRole(urlApiAddDto : UrlApiAddDto): Observable<any>{
    return this.httpClient.post<any>(`${this.urlPermissionsAll}/add-permission-to-role`,urlApiAddDto);
  }

  deletePermissionToRole(urlApiDeleteDto : UrlApiDeleteDto): Observable<any>{
    return this.httpClient.post<any>(`${this.urlPermissionsAll}/delete-permission-to-role`,urlApiDeleteDto);
  }


}
