import { Component, OnInit } from '@angular/core';
import { Role } from '../model/role';
import { RoleService } from '../service/role.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlApi } from '../model/url-api';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  roleDto : Role[] = [];
  permissions : UrlApi[] = [];
  canCheckbox : boolean = false;
  constructor(private roleService: RoleService,
    private toastr: ToastrService,
    private router : Router
    ){}
  ngOnInit(): void {
    this.getAllRole();
    this.getAllPermissions();
  }

  checkRoute(){
    const currentUrl = this.router.url;
    if(currentUrl === '/manage/add'){
      this.canCheckbox = true;
    }else{
      this.canCheckbox = false;
    }
  }

  getAllRole(): void {
    this.roleService.getRoleAll().subscribe({
      next: (data) => {
        this.roleDto = data.map((role) => ({
          ...role,
          permissions: [],
        }));
      },
    });
  }
  getAllPermissions() : void{
    this.roleService.getPerrmissionsAll().subscribe({
      next : (data) => {
        this.permissions = data;
      },
    })
  }
  onCheckboxChange(role: Role): void {
    if (role.selected) {
      this.roleService.getPerrmissionsAll().subscribe({
        next: (allPermissions: UrlApi[]) => {
          this.roleService.findUrlApiByRole(role).subscribe({
            next: (rolePermissions: UrlApi[]) => {
              role.permissions = allPermissions.map(permission => ({
                ...permission,
                selected: rolePermissions.some(rolePerm => rolePerm.nameUrl === permission.nameUrl)
              }));
            }});
        }});
    } else {
      role.permissions = [];
    }
  }

  onCheckboxPermission(permission: UrlApi, role: Role): void {
    if (permission.selected) {
      this.roleService.addPermissionToRole({
        nameRole: role.name,
        nameUrl: [permission.nameUrl || ''],
      }).subscribe({
        next: () => {
          console.log(`Permission ${permission.nameUrl} duoc them vao role ${role.name}`);
        },
      });
    } else {
      this.roleService.deletePermissionToRole({
        nameRole: role.name,
        nameUrl: [permission.nameUrl || ''],
      }).subscribe({
        next: () => {
          console.log(`Permission ${permission.nameUrl} duoc xoa o role ${role.name}`);
        }
      });
    }
  }
}
