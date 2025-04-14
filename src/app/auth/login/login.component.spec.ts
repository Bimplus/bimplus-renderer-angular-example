import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockApiService = jasmine.createSpyObj('ApiService', ['authorize']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, LoginComponent ],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with required fields', async () => {
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('email')!.hasError('required')).toBe(true);

    expect(component.loginForm.get('password')).toBeTruthy();
    expect(component.loginForm.get('password')!.hasError('required')).toBe(true);
  });

  it('should call apiService.authorize on form submission', async () => {
    const email = 'test@example.com';
    const pw = 'p123';

    component.loginForm.patchValue({ email, password : pw });

    mockApiService.authorize.and.returnValue(Promise.resolve(true));

    await component.onSubmit();

    expect(mockApiService.authorize).toHaveBeenCalledWith(email, pw);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/projects']);
  });

  it('should not navigate if authorization fails', async () => {
    const email = 'test@example.com';
    const pw = 'p123';

    component.loginForm.patchValue({ email, password : pw});

    mockApiService.authorize.and.returnValue(Promise.resolve(false));

    await component.onSubmit();

    expect(mockApiService.authorize).toHaveBeenCalledWith(email, pw);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
