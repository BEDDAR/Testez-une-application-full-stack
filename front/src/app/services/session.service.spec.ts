import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { BehaviorSubject } from 'rxjs';
import { expect } from '@jest/globals';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService]
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in user correctly', () => {
    const user: SessionInformation = {
      token: 'newToken',
      type: 'Bearer',
      id: 2,
      username: 'newUser',
      firstName: 'Jane',
      lastName: 'Smith',
      admin: false
    };

    service.logIn(user);
    expect(service.sessionInformation).toEqual(user);
    expect(service.isLogged).toBe(true);
  });

  it('should log out user correctly', () => {
    const user: SessionInformation = {
      token: 'newToken',
      type: 'Bearer',
      id: 2,
      username: 'newUser',
      firstName: 'Jane',
      lastName: 'Smith',
      admin: false
    };

    service.logIn(user);  // First, log the user in
    service.logOut();  // Then log them out
    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);
  });

  it('should emit correct value when $isLogged is called', (done) => {
    const user: SessionInformation = {
      token: 'newToken',
      type: 'Bearer',
      id: 2,
      username: 'newUser',
      firstName: 'Jane',
      lastName: 'Smith',
      admin: false
    };

    service.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(true);  // Expecting true after login
      done();
    });

    service.logIn(user);  // Log the user in during the test
  });
});
