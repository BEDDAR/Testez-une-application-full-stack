import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service'
import { ListComponent } from './list.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessionService = {
    sessionInformation: {
      token: 'sampleToken',
      type: 'Bearer',
      id: 1,
      username: 'testUser',
      firstName: 'John',
      lastName: 'Doe',
      admin: true
    },
    logIn: jest.fn(),
    logOut: jest.fn(),
    $isLogged: jest.fn().mockReturnValue(of(true)),
  };

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(of([{
      id: 1,
      name: 'Session 1',
      date: new Date('2025-02-21'),
      teacher_id: 1,
      description: 'Description 1',
      users: [],
    }]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of sessions', () => {
    fixture.detectChanges();

    // Recherche des éléments ayant la classe "item" qui représentent les sessions
    const sessionItems = fixture.debugElement.queryAll(By.css('.item'));
    expect(sessionItems.length).toBeGreaterThan(0);
  });

  it('should show the "Create" button if the user is an admin', () => {
    fixture.detectChanges();

    const createButton = fixture.debugElement.query(By.css('button[routerLink="create"]'));
    expect(createButton).toBeTruthy(); // Vérifie si le bouton Create est présent
  });

  it('should show the "Detail" button for each session', () => {
    fixture.detectChanges();

    const detailButton = fixture.debugElement.queryAll(By.css('button[routerLink]'));
    expect(detailButton.length).toBeGreaterThan(0); // Vérifie que les boutons "Detail" sont présents
  });

  it('should display session details correctly', () => {
    fixture.detectChanges();

    const sessionTitle = fixture.debugElement.query(By.css('.item mat-card-title')).nativeElement;
    const sessionSubtitle = fixture.debugElement.query(By.css('.item mat-card-subtitle')).nativeElement;

    expect(sessionTitle.textContent).toContain('Session 1');
    expect(sessionSubtitle.textContent).toContain('Session on February 21, 2025');
  });

  it('should not show the "Create" button if the user is not an admin', () => {
    // Mock user data to simulate non-admin user
    mockSessionService.sessionInformation.admin = false;
    fixture.detectChanges();

    const createButton = fixture.debugElement.query(By.css('button[routerLink="create"]'));
    expect(createButton).toBeNull(); // Vérifie que le bouton Create n'est pas présent
  });

});
