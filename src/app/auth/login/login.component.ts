import { Component, inject } from '@angular/core';
//import { Router } from '@angular/router';
import { ReactiveFormsModule} from '@angular/forms';
//import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ReactiveFormsModule]
})
export class LoginComponent {
//  private apiService = inject(ApiService);
//  private router = inject(Router);
  private authService = inject(AuthService);
  login = () => {
    this.authService.login();
  }
}
