import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    try {
      // Handle the OIDC callback
      const user = await this.authService.handleCallback();
      
      if (user) {
        // Authentication successful, redirect to the projects page
        await this.router.navigate(['/projects']);
      } else {
        // Authentication failed, redirect to login
        await this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Authentication callback error:', error);
      // Redirect to login on error
      await this.router.navigate(['/login']);
    }
  }
}