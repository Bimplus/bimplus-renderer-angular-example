import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '@services/api.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ReactiveFormsModule, NgIf]
})
export class LoginComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  loginForm: FormGroup;

  isLoading = false;

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', { validators: [Validators.required] }),
    });
  }

  async onSubmit() {
    const loginOk = await this.apiService.authorize(
      this.loginForm.value.email,
      this.loginForm.value.password
    );

    if (loginOk) {
      await this.router.navigate(['/projects']);
    }
  }
}
