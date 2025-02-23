import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'; // L'importation correcte de Router
import { RouterTestingModule } from '@angular/router/testing'; // L'importation de RouterTestingModule reste la même
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { DetailComponent } from './detail.component';
import { of } from 'rxjs';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let matSnackBar: MatSnackBar;
  let router: Router; // Déclaration correcte du type Router

  // Mock du service SessionService
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  // Mock du service SessionApiService
  const mockSessionApiService = {
    delete: jest.fn().mockReturnValue(of({})), // Simule la suppression avec un observable
    detail: jest.fn().mockReturnValue(of({
      id: '1',
      name: 'Yoga Class',
      users: [],
      date: new Date(),
      description: 'A session for yoga enthusiasts.',
      createdAt: new Date(),
      updatedAt: new Date(),
      teacher_id: '123'
    })), // Simule les détails de la session
    participate: jest.fn().mockReturnValue(of({})),
    unParticipate: jest.fn().mockReturnValue(of({}))
  };

  // Mock du service TeacherService
  const mockTeacherService = {
    detail: jest.fn()
  };

  // Mock de MatSnackBar
  const matSnackBarMock = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: matSnackBarMock } // Mock de MatSnackBar
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router); // Injection correcte de Router

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 1: Vérification des informations de la session
  it('should display session information correctly', () => {
    const sessionData = {
      id: 1,
      name: 'Yoga Session',
      users: [1],
      teacher_id: 1,
      description: 'Yoga session description',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const teacherData = {
      firstName: 'JOHN',
      lastName: 'DOE'
    };

    mockSessionApiService.detail.mockReturnValue(of(sessionData));
    mockTeacherService.detail.mockReturnValue(of(teacherData));

    component.ngOnInit();
    fixture.detectChanges();

    const sessionTitle = fixture.nativeElement.querySelector('h1');
    expect(sessionTitle.textContent).toContain('Yoga Session');

    const sessionDescription = fixture.nativeElement.querySelector('.description p');
    expect(sessionDescription.textContent).toContain('Description:');

    const teacherName = fixture.nativeElement.querySelector('mat-card-subtitle span.ml1');
    expect(teacherName.textContent).toContain('JOHN DOE'); // Assure-toi que .teacher-name est bien l'élément qui contient le nom
  });

  // Test 2: Vérification de l'affichage du bouton Delete si l'utilisateur est admin
  it('should show delete button if user is admin', () => {
    component.session = { id: 1, name: 'Yoga Session', users: [1], teacher_id: 1, description: '', date: new Date(), createdAt: new Date(), updatedAt: new Date() };
    component.isAdmin = true;
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    expect(deleteButton).toBeTruthy();
  });

  // Test 3: Vérification de la suppression de la session
  it('should delete the session correctly', () => {
    const navigateSpy = jest.spyOn(router, 'navigate'); // Espionner la méthode navigate

    mockSessionApiService.delete.mockReturnValue(of(null));
    component.sessionId = '1';

    component.delete();

    expect(mockSessionApiService.delete).toHaveBeenCalledWith(component.sessionId);
    expect(matSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']); // Vérifie que navigate est appelé correctement
  });
});
