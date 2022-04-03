import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { ProfileService } from '../service/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router,
    private profileService: ProfileService
    ){

  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      let userId = localStorage.getItem('userId');

      if(userId === null || userId === undefined || userId === ''){
        return this.router.createUrlTree(['admin/login']);
      }
      return this.profileService.getAdminDetails(userId).pipe(
        take(1),
        map((userDetails:any) => {
              if(userDetails !== undefined && userDetails.email !== undefined){
                return true;
              }
          // return false;
          return this.router.createUrlTree(['admin/login'])
        })
      );
  }
  
}
