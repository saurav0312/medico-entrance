import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { ProfileService } from '../service/profile.service';

@Injectable({
  providedIn: 'root'
})
export class StudentAuthGuardGuard implements CanActivate {

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
      console.log("Logged in user id iss: ", userId)

      if(userId === null || userId === undefined || userId === ''){
        return this.router.createUrlTree(['authentication/signin']);
      }
      return this.profileService.getUserDetails(userId).pipe(
        take(1),
        map(userDetails => {
              if(userDetails.accountType == 'student'){
                return true;
              }
          console.log("User data from guard: ", userDetails.accountType)
          // return false;
          return this.router.createUrlTree(['authentication/signin'])
        })
      );
  }
  
}
