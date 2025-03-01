import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes, ActivatedRoute  } from '@angular/router';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { ListComponent } from '../list/list.component';
import { DetailComponent } from '../detail/detail.component';
import { Location } from '@angular/common';

import { FormComponent } from './form.component';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fakeAsync, tick } from '@angular/core/testing';
import { escape } from 'cypress/types/lodash';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let router: Router;
  let matSnackBar: MatSnackBar;
  let mockActivatedRoute: any;

  const routes: Routes = [
    { path: '', title: 'Sessions', component: ListComponent },
    { path: 'detail/:id', title: 'Sessions - detail', component: DetailComponent },
    { path: 'create', title: 'Sessions - create', component: FormComponent },
    { path: 'update/:id', title: 'Sessions - update', component: FormComponent }
  ];

  const mockSessionService = {
    sessionInformation: { admin: true }
  };

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn(() => '1')  // Mock pour retourner '1' comme ID
        },
        url: [{ path: 'update/1' }]  // URL complète de la route
      }
    };
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes), // Mock du Router
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule // Désactivation des animations
      ],

      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService,
        { provide: MatSnackBar, useValue: { open: jest.fn() } }, // Mock MatSnackBar
        { provide: Location, useValue: { path: jest.fn(() => ''), back: jest.fn() } },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      declarations: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);

    jest.spyOn(matSnackBar, 'open').mockImplementation();
    jest.spyOn(router, 'navigate').mockResolvedValue(true);// Mock navigation

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a session and navigate', () => {
    // Arrange
    const sessionData: Session = {
      name: 'Math Class',
      date: new Date('2025-02-23'),
      teacher_id: 123,
      description: 'Advanced math class',
      users: []
    };

    component.onUpdate = false
    component.sessionForm?.setValue({
      name: sessionData.name,
      date: sessionData.date,
      teacher_id: sessionData.teacher_id,
      description: sessionData.description
    });

    jest.spyOn(sessionApiService, 'create').mockReturnValue(of(sessionData));

    // Act
    component.submit();

    // Assert
    expect(sessionApiService.create).toHaveBeenCalledWith(expect.objectContaining({
      name: sessionData.name,
      date: sessionData.date,
      teacher_id: sessionData.teacher_id,
      description: sessionData.description
    }));
    expect(matSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']); // Vérifie que la navigation est appelée
  });

  it('should update a session and navigate', () => {
    // Arrange
    const sessionData: Session = {
      name: 'Physique Class',
      date: new Date('2025-02-23'),
      teacher_id: 345,
      description: 'Advanced physique class',
      users: []
    };

    component.sessionForm?.setValue({
      name: sessionData.name,
      date: sessionData.date,
      teacher_id: sessionData.teacher_id,
      description: sessionData.description
    });

    // Mock de la fonction update de l'API
    jest.spyOn(sessionApiService, 'update').mockReturnValue(of(sessionData));

    // Mock de la route avec un id "1"
    mockActivatedRoute.snapshot = {
      paramMap: {
        get: jest.fn(() => '1'),  // Simuler l'ID '1' récupéré
      },
      url: [{ path: 'update/1' }]  // La route est définie sur '/update/1'
    };

    // Simuler la navigation
    jest.spyOn(router, 'navigate');

    // Appeler ngOnInit
    component.ngOnInit();

    fixture.detectChanges();

    // Attendre que toutes les tâches asynchrones soient terminées
    fixture.whenStable().then(() => {
      // Logguer l'URL actuelle
      console.log('Current route after navigation: ', mockSessionService.sessionInformation.admin); // Vérifier l'URL

      // Vérifier que la fonction update a bien été appelée
      expect(sessionApiService.update).toHaveBeenCalledWith('1', expect.objectContaining({
        name: sessionData.name,
        date: sessionData.date,
        teacher_id: sessionData.teacher_id,
        description: sessionData.description
      }));
      expect((component as any).submit()).toHaveBeenCalled
      // Vérifier que le snackBar a bien été appelé
      expect(matSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });

      // Vérifier que la navigation a bien eu lieu
      expect(router.navigate).toHaveBeenCalledWith(['sessions']); // S'assurer que la navigation se fait bien vers "sessions"
      expect(component.onUpdate).toBeTruthy;
      // Vérifier que l'ID est bien récupéré
      expect(mockActivatedRoute.snapshot.paramMap.get('id')).toBe('1');
      expect(mockActivatedRoute.snapshot.url[0].path).toBe('update/1');
    });
  });


  it('should show errors when required fields are missing', () => {
    // Arrange
    component.sessionForm?.patchValue({
      name: '',
      date: '',
      teacher_id: '',
      description: ''
    });

    fixture.detectChanges();

    // Act
    component.submit();
    fixture.detectChanges();

    // Assert
    const form = component.sessionForm;
    expect(form?.invalid).toBeTruthy();
    expect(form?.get('name')?.hasError('required')).toBeTruthy();
    expect(form?.get('date')?.hasError('required')).toBeTruthy();
    expect(form?.get('teacher_id')?.hasError('required')).toBeTruthy();
    expect(form?.get('description')?.hasError('required')).toBeTruthy();
  });

  it('should call sessionApiService.update', () => {

    const sessionData: Session = {
      name: 'Physique Class',
      date: new Date('2025-02-23'),
      teacher_id: 345,
      description: 'Advanced physique class',
      users: []
    };

    component.sessionForm?.setValue({
      name: sessionData.name,
      date: sessionData.date,
      teacher_id: sessionData.teacher_id,
      description: sessionData.description
    });
    component.onUpdate =true;
    // Mock de la fonction update de l'API
    jest.spyOn(sessionApiService, 'update').mockReturnValue(of(sessionData));
    // Appel de la méthode
    (component as any).submit();
    expect(sessionApiService.update).toHaveBeenCalledWith(undefined, expect.objectContaining({
      name: sessionData.name,
      date: sessionData.date,
      teacher_id: sessionData.teacher_id,
      description: sessionData.description
    }));

    expect(matSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });

  });

  it('should display snackbar message and navigate to sessions', () => {
    const testMessage = 'Session est fermée';

    // Appel de la méthode
    (component as any).exitPage(testMessage);

    // Vérifier que MatSnackBar a été appelé avec les bons paramètres
    expect(matSnackBar.open).toHaveBeenCalledWith(testMessage, 'Close', { duration: 3000 });

    // Vérifier que le Router a bien navigué vers 'sessions'
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
