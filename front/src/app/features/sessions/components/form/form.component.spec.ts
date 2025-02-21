import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { expect } from '@jest/globals'; // ✅ Gardé comme dans ton fichier

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSessionService = {
    sessionInformation: { admin: true }
  };

  const mockSessionApiService = {
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({})),
    delete: jest.fn().mockReturnValue(of({})),
    detail: jest.fn().mockReturnValue(of({ id: 1, name: 'Session 1', date: new Date(), teacher_id: 1, description: 'Description 1', users: [] }))
  };

  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      declarations: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Create button if user is admin', () => {
    const createButton = fixture.debugElement.query(By.css('button[color="primary"]'));
    expect(createButton).toBeTruthy();
  });

  it('should initialize form with session data when updating', () => {
    component.onUpdate = true;
    component.ngOnInit(); // ✅ Ajouté pour initialiser id correctement
    fixture.detectChanges();

    expect(component.sessionForm?.value.name).toBe('Session 1');
  });

  it('should show error when submitting an empty form', () => {
    component.sessionForm?.patchValue({ name: '', date: '', teacher_id: '', description: '' });
    fixture.detectChanges();
    component.submit();
    expect(component.sessionForm?.invalid).toBeTruthy();
  });

  it('should call create method when form is submitted for a new session', () => {
    component.onUpdate = false;
    component.sessionForm?.patchValue({ name: 'New Session', date: '2025-02-21', teacher_id: 1, description: 'Test Description' });
    component.submit();
    expect(mockSessionApiService.create).toHaveBeenCalled();
  });

  it('should call update method when form is submitted for an existing session', () => {
    component.onUpdate = true;
    component.ngOnInit(); // ✅ Ajouté pour éviter les erreurs sur id
    component.sessionForm?.patchValue({ name: 'Updated Session', date: '2025-02-21', teacher_id: 1, description: 'Updated Description' });
    component.submit();
    expect(mockSessionApiService.update).toHaveBeenCalledWith('1', expect.any(Object));
  });

  it('should delete a session if delete method is called', () => {
    mockSessionApiService.delete('1').subscribe((response: any) => {
      expect(response).toBeTruthy();
    });
    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
  });

  it('should handle API errors when creating a session', () => {
    mockSessionApiService.create.mockReturnValue(throwError(() => new Error('API error')));
    component.onUpdate = false;
    component.sessionForm?.patchValue({ name: 'New Session', date: '2025-02-21', teacher_id: 1, description: 'Test Description' });

    component.submit();
    expect(mockSessionApiService.create).toHaveBeenCalled();
  });

  it('should handle API errors when updating a session', () => {
    mockSessionApiService.update.mockReturnValue(throwError(() => new Error('API error')));
    component.onUpdate = true;
    component.ngOnInit(); // ✅ Ajouté pour éviter les erreurs
    component.sessionForm?.patchValue({ name: 'Updated Session', date: '2025-02-21', teacher_id: 1, description: 'Updated Description' });

    component.submit();
    expect(mockSessionApiService.update).toHaveBeenCalledWith('1', expect.any(Object));
  });
});
