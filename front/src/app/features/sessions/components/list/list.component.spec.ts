import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [{ provide: SessionService, useValue: mockSessionService }]
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
    component.sessions$ = of([{
      id: 1,
      name: 'Session 1',
      date: new Date('2025-02-21'),
      teacher_id: 1,
      description: 'Description 1',
      users: [],
    }]);
    fixture.detectChanges();

    // Recherche des éléments ayant la classe "item" qui représentent les sessions
    const sessionItems = fixture.debugElement.queryAll(By.css('.item'));
    expect(sessionItems.length).toBeGreaterThan(0);
  });

});
