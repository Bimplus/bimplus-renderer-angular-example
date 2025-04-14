import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard  {
  constructor(private apiService: ApiService, private router: Router) {}

  private async checkAuthorizationAndNavigate() {
    const isAuthorized = this.apiService.isAuthorized();
    if (!isAuthorized) {
      return this.router.navigate(['/login']).then(() => false);
    }
    return Promise.resolve(true);
  }

  async canActivate() {
    return await this.checkAuthorizationAndNavigate();
  }

  async canLoad() {
    return await this.checkAuthorizationAndNavigate();
  }
}
