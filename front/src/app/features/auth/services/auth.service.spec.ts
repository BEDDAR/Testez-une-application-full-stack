import { expect } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Utilisation du module de test pour les appels HTTP
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Vérifie qu'il n'y a pas de requêtes HTTP non vérifiées
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user when register is called', () => {
    const mockRegisterRequest: RegisterRequest = {
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    };

    // Appel de la méthode register
    service.register(mockRegisterRequest).subscribe(response => {
      expect(response).toBeUndefined();  // Pas de contenu dans la réponse (void)
    });

    // Vérifie que la requête HTTP POST est correctement appelée
    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
  });

  it('should login a user when login is called', () => {
    const mockLoginRequest: LoginRequest = {
      email: 'john.doe@example.com',
      password: 'password123'
    };

    const mockSessionInfo: SessionInformation = {
      token: 'some-jwt-token',
      type: 'bearer',
      id: 1,
      username: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true
    };

    // Appel de la méthode login
    service.login(mockLoginRequest).subscribe(sessionInfo => {
      expect(sessionInfo).toEqual(mockSessionInfo);  // Vérifie que la session renvoyée est correcte
    });

    // Vérifie que la requête HTTP POST est correctement appelée
    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockSessionInfo);  // Réponse avec les informations de session mockées
  });
});
