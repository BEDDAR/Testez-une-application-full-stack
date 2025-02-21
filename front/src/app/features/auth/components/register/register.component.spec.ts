import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn().mockReturnValue(of({ message: 'Registration successful' }))
    };
    const mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register successfully and navigate to login', () => {
    (authService.register as jest.Mock).mockReturnValue(of({ message: 'Registration successful' }));

    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securepassword'
    });

    component.submit();

    expect(authService.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securepassword'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle registration error', () => {
    (authService.register as jest.Mock).mockReturnValue(throwError(() => new Error('Email already taken')));

    component.form.setValue({
      email: 'existing@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'password123'
    });

    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should show validation errors when required fields are missing', () => {
    component.submit();

    expect(component.form.invalid).toBe(true);
    expect(component.form.controls.email.errors?.['required']).toBeTruthy();
    expect(component.form.controls.firstName.errors?.['required']).toBeTruthy();
    expect(component.form.controls.lastName.errors?.['required']).toBeTruthy();
    expect(component.form.controls.password.errors?.['required']).toBeTruthy();
  });
});
