import { LoginComponent } from './login/login.component';
import { NgModule} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    declarations: [
        LoginComponent   
    ],
    imports: [
        ReactiveFormsModule,  
        SharedModule,
        AuthRoutingModule
    ],
    exports: []
})
export class AuthModule{}