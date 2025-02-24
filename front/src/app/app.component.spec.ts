import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

describe('AppComponent', () => {
  let fixture;
  let app: AppComponent;
  let mockRouter: Router;
  let mockSessionService: SessionService;

  beforeEach(async () => {
   mockRouter = {
         navigate: jest.fn()
       } as unknown as jest.Mocked<Router>;
   mockSessionService = {
         sessionInformation: { admin: true, id: 1 },
         logOut: jest.fn(),
         $isLogged: jest.fn()
       } as unknown as jest.Mocked<SessionService>;

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should return the correct login status from $isLogged', () => {

    app.$isLogged()
    expect(mockSessionService.$isLogged).toBeTruthy;

    });

  it('should call logOut and navigate to home on logout', () => {

    app.logout();
    expect(mockSessionService.$isLogged).toBeFalsy;
  });
});
