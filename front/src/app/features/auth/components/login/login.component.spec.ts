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

import { LoginComponent } from './login.component';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn().mockReturnValue(of({ token: 'fake-token' })) // Ajout ici
    };
    const mockRouter = {
      navigate: jest.fn()
    };
    const mockSessionService = {
      logIn: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService }
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully and navigate', () => {
    // Simuler une réponse réussie
    (authService.login as jest.Mock).mockReturnValue(of({ token: 'fake-token' }));

    // Remplir le formulaire
    component.form.setValue({ email: 'test@example.com', password: 'password123' });

    // Soumettre le formulaire
    component.submit();

    // Vérifier que les services ont été appelés correctement
    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(sessionService.logIn).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should handle login error', () => {
    // Simuler une erreur de login
    (authService.login as jest.Mock).mockReturnValue(throwError(() => new Error('Invalid credentials')));

    // Remplir le formulaire avec de mauvaises données
    component.form.setValue({ email: 'wrong@example.com', password: 'wrongpassword' });

    // Soumettre le formulaire
    component.submit();

    // Vérifier que l'erreur est bien affichée
    expect(component.onError).toBe(true);
  });

  it('should show validation errors when required fields are missing', () => {
    // Laisser les champs vides et soumettre
    component.submit();

    // Vérifier que le formulaire est invalide
    expect(component.form.invalid).toBe(true);
    expect(component.form.controls.email.errors?.['required']).toBeTruthy();
    expect(component.form.controls.password.errors?.['required']).toBeTruthy();
  });
});
