import { inject, Injectable } from '@angular/core';
import { UserManager, User, UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);

  private userManager: UserManager;
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    const env = environment.websdkEnvironment;

    const settings: UserManagerSettings = {
      authority: env === 'prod' ? 'https://login.allplan.com/realms/allplan/' : `https://login-${env}.allplan.com/realms/allplan/`,
      client_id: 'bimplus-demo-client', // Replace with your client ID
      redirect_uri: `${window.location.origin}/callback`,
      post_logout_redirect_uri: `${window.location.origin}`,
      response_type: 'code',
      scope: 'openid profile email',
      filterProtocolClaims: true,
      loadUserInfo: true,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    };

    this.userManager = new UserManager(settings);
    
    // Set up event handlers
    this.userManager.events.addUserLoaded((user: User) => {
      this.userSubject.next(user);
    });

    this.userManager.events.addUserUnloaded(() => {
      this.userSubject.next(null);
    });

    this.userManager.events.addAccessTokenExpired(() => {
      this.logout();
    });

    // Load user on service initialization
    this.loadUser();
  }

  async login(): Promise<void> {
    try {
      await this.userManager.signinRedirect();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.userManager.signoutRedirect();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async handleCallback(): Promise<User | null> {
    try {
      const user = await this.userManager.signinRedirectCallback();
      this.userSubject.next(user);
      this.apiService.setAccessToken(user?.access_token || '');
      return user;
    } catch (error) {
      console.error('Callback error:', error);
      throw error;
    }
  }

  async handleSilentCallback(): Promise<void> {
    try {
      await this.userManager.signinSilentCallback();
    } catch (error) {
      console.error('Silent callback error:', error);
      throw error;
    }
  }

  async renewToken(): Promise<User | null> {
    try {
      const user = await this.userManager.signinSilent();
      this.userSubject.next(user);
      this.apiService.setAccessToken(user?.access_token || '');
      return user;
    } catch (error) {
      console.error('Token renewal error:', error);
      throw error;
    }
  }

  async loadUser(): Promise<void> {
    try {
      const user = await this.userManager.getUser();
      this.userSubject.next(user);
    } catch (error) {
      console.error('Load user error:', error);
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.user$.subscribe(user => {
        observer.next(!!user && !user.expired);
      });
    });
  }

  getAccessToken(): Promise<string | null> {
    return this.userManager.getUser().then(user => {
      return user ? user.access_token : null;
    });
  }
}
