import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { MeComponent } from './me.component';
import { expect, jest } from '@jest/globals';
import { By } from '@angular/platform-browser';
import { User } from 'src/app/interfaces/user.interface';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRouter: jest.Mocked<Router>;
  let mockSessionService: jest.Mocked<SessionService>;

  beforeEach(async () => {
    mockUserService = {
      getById: jest.fn().mockReturnValue(of({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        admin: true,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      delete: jest.fn()
    } as unknown as jest.Mocked<UserService>;

    mockRouter = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    mockSessionService = {
      sessionInformation: { admin: true, id: 1 },
      logOut: jest.fn(),
      $isLogged: jest.fn().mockReturnValue(of(true))
    } as unknown as jest.Mocked<SessionService>;

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on init', () => {
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toBeDefined();
    expect(component.user?.firstName).toBe('John');
  });

  it('should display user information in the DOM', () => {
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(nameElement.textContent).toContain('John DOE');
    expect(fixture.nativeElement.textContent).toContain('john.doe@example.com');
  });

  it('should delete user and navigate home', () => {
    mockUserService.delete.mockReturnValue(of({}));

    component.delete();
    expect(mockUserService.delete).toHaveBeenCalledWith('1');
    expect(mockSessionService.$isLogged).toBeFalsy;
  });
});
