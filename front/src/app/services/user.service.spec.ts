import { expect } from '@jest/globals';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';  // Assure-toi que ton interface User est bien importée

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Vérifie qu'il n'y a pas de requêtes HTTP non résolues
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a user when getById is called', () => {
    const mockUser: User = {
      id: 1,
      email: 'john.doe@example.com',
      lastName: 'Doe',
      firstName: 'John',
      admin: true,
      password: 'password123',
      createdAt: new Date('2022-01-01')
    };

    service.getById('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should delete a user when delete is called', () => {
    const mockId = '1';

    service.delete(mockId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`api/user/${mockId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
