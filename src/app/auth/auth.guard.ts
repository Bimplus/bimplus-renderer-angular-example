import { ApiService } from '../services/api.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, Route } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad{

  constructor( private apiService: ApiService,
                private router: Router) {}

  canActivate( route: ActivatedRouteSnapshot, state : RouterStateSnapshot ){
    if ( this.apiService.isAuthorized() ){
      return true;
    } else {
      this.router.navigate(['/login']);
    }    
  }

  canLoad( route: Route ){
    if( this.apiService.isAuthorized() ){
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }
}