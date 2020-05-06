import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  
  isLoading = false;

  constructor(private apiService: ApiService,
              private router : Router ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email' : new FormControl('', {validators:[Validators.required, Validators.email]} ),  
      'password' : new FormControl('', {validators:[Validators.required]}),
    });  
  }

  async onSubmit(){
    let loginOk = await this.apiService.authorize( this.loginForm.value.email, this.loginForm.value.password );

    if (loginOk) {
      this.router.navigate(['/projects']);
    }
  }

}
