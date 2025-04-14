import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockApiService = jasmine.createSpyObj('ApiService', ['isAuthorized']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true if authorized', async () => {
      mockApiService.isAuthorized.and.returnValue(true);
      const result = await guard.canActivate();
      expect(result).toBe(true);
    });

    it('should navigate to login and return false if not authorized', async () => {
      mockApiService.isAuthorized.and.returnValue(false);
      mockRouter.navigate.and.returnValue(Promise.resolve(true));

      const result = await guard.canActivate();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(result).toBe(false);
    });
  });

  describe('canLoad', () => {
    it('should return true if authorized', async () => {
      mockApiService.isAuthorized.and.returnValue(true);
      const result = await guard.canLoad();
      expect(result).toBe(true);
    });

    it('should navigate to login and return false if not authorized', async () => {
      mockApiService.isAuthorized.and.returnValue(false);
      mockRouter.navigate.and.returnValue(Promise.resolve(true));

      const result = await guard.canLoad();
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(result).toBe(false);
    });
  });
});
