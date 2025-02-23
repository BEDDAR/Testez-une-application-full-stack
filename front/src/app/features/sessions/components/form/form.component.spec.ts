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
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { FormComponent } from './form.component';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: { admin: true }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]), // Mock du Router
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
        SessionApiService
      ],
      declarations: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true)); // Mock navigation

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
    expect(router.navigate).toHaveBeenCalledWith(['sessions']); // Vérifie que la navigation est appelée
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
});
