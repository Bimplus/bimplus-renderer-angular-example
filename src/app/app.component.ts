import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet],
})
export class AppComponent {
  title = 'bimplus-renderer-angular-example';
  currentEnvironment = environment.websdkEnvironment;
}
