/// <reference types="cypress" />

describe('Session management and details spec (Admin & Non-Admin)', () => {
  const adminUser = {
    token: 'mocked-token',
    type: 'Bearer',
    id: 1,
    username: 'adminUser',
    firstName: 'Admin',
    lastName: 'User',
    admin: true,
  };

  const normalUser = {
    token: 'mocked-token',
    type: 'Bearer',
    id: 3,
    username: 'studentUser',
    firstName: 'Student',
    lastName: 'User',
    admin: false,
  };

  const mockSessions = [
    {
      id: 1,
      name: 'Physique Class',
      date: '2025-02-23',
      teacher_id: 345,
      description: 'Advanced physique class',
      users: [],
    },
    {
      id: 2,
      name: 'Yoga',
      date: '2025-02-24',
      teacher_id: 345,
      description: 'Relaxing yoga',
      users: [3],
    },
  ];

  beforeEach(() => {
    cy.intercept('GET', '/api/teacher', {
      body: [
        { id: 345, lastName: 'teacher1', firstName: 'teacher' },
        { id: 346, lastName: 'teacher2', firstName: 'another' },
      ],
    }).as('getTeachers');

    cy.intercept('GET', '/api/teacher/345', {
      body: { id: 345, lastName: 'teacher1', firstName: 'teacher' },
    }).as('getTeacher');
  });

  context('Admin functionality', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', { body: adminUser }).as('getUser');
      cy.intercept('GET', '/api/session', mockSessions).as('getSessions');
      cy.intercept('GET', '/api/session/1', mockSessions[0]).as('getSession1');
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('admin@test.com');
      cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
      cy.location('pathname').should('eq', '/sessions');
    });

    it('should see create button', () => {
      cy.contains('button', 'Create').should('be.visible');
    });

    it('should access session details and see delete buttons', () => {
      cy.get('mat-card.item').first().within(() => {
        cy.contains('span', 'Detail').click();
      });
      cy.wait('@getSession1');
      cy.url().should('include', '/sessions/detail/1');
      cy.contains('button', 'Delete').should('exist');
    });

    it('should delete a session and return to list', () => {
      cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as('deleteSession');
      cy.get('mat-card.item').first().within(() => {
        cy.contains('span', 'Detail').click();
      });
      cy.wait('@getSession1');
      cy.contains('button', 'Delete').click();
      cy.wait('@deleteSession').its('response.statusCode').should('eq', 200);
      cy.location('pathname').should('eq', '/sessions');
    });

    it('should not show Participate or Do not participate buttons for admin', () => {
      cy.get('mat-card.item').first().within(() => {
        cy.contains('span', 'Detail').click();
      });
      cy.wait('@getSession1');
      cy.contains('button span.ml1', 'Participate').should('not.exist');
      cy.contains('button span.ml1', 'Do not participate').should('not.exist');
    });

    it('should see session details including title, description, date, and teacher', () => {
      cy.get('mat-card.item').first().within(() => {
        cy.contains('span', 'Detail').click();
      });
      cy.wait('@getSession1');
      cy.url().should('include', '/sessions/detail/1');

      // Vérification de l'affichage des détails de la session
      cy.contains('h1', 'Physique Class').should('be.visible'); // Titre de la session
      cy.contains('p', 'Description:').should('be.visible'); // Libellé "Description:"
      cy.contains('.description', 'Advanced physique class').should('be.visible'); // Description de la session
      cy.contains('span', 'February 23, 2025').should('be.visible'); // Date au format attendu
      cy.contains('span', 'teacher TEACHER1').should('be.visible'); // Nom du professeur
      cy.contains('button', 'Delete').should('be.visible'); // Bouton delete pour admin
    });
  });

  context('Non-Admin user', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', { body: normalUser }).as('getUser');
      cy.intercept('GET', '/api/session', mockSessions).as('getSessions');
      cy.intercept('GET', '/api/session/1', mockSessions[0]).as('getSession1');
      cy.intercept('GET', '/api/session/2', mockSessions[1]).as('getSession2');
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('user@test.com');
      cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
      cy.location('pathname').should('eq', '/sessions');
    });

    it('should not see create button', () => {
      cy.contains('button', 'Create').should('not.exist');
    });

    it('should participate in a session', () => {
      cy.intercept('POST', '/api/session/1/participate/3', {}).as('participate');
      cy.get('mat-card.item').eq(0).within(() => {
        cy.contains('span', 'Detail').click();
      });
      cy.wait('@getSession1');
      cy.contains('span', 'Participate').click();
      cy.wait('@participate').its('response.statusCode').should('eq', 200);
    });

    it('should cancel participation in a session', () => {
      cy.intercept('DELETE', '/api/session/2/participate/3', {}).as('unparticipate');
      cy.get('mat-card.item').eq(1).within(() => {
        cy.contains('span', 'Detail').click();
      });
      cy.wait('@getSession2');
      cy.contains('span', 'Do not participate').click();
      cy.wait('@unparticipate').its('response.statusCode').should('eq', 200);
    });
  });

  context('Detailed session view scenarios', () => {
    it('should display full session details for admin including delete button', () => {
      cy.intercept('POST', '/api/auth/login', { body: adminUser }).as('getUser');
      cy.intercept('GET', '/api/session', [mockSessions[0]]).as('getSessions');
      cy.intercept('GET', '/api/session/1', mockSessions[0]).as('getSession1');
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('admin@studio.com');
      cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
      cy.wait('@getSessions');
      cy.get('button[mat-raised-button]').eq(1).click({ force: true });
      cy.url().should('include', '/sessions/detail/1');
      cy.contains('Delete').should('exist');
    });

    it('should show session details for non-admin without delete button', () => {
      cy.intercept('POST', '/api/auth/login', { body: normalUser }).as('getUser');
      cy.intercept('GET', '/api/session', [mockSessions[0]]).as('getSessions');
      cy.intercept('GET', '/api/session/1', mockSessions[0]).as('getSession1');
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('student@studio.com');
      cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
      cy.wait('@getSessions');
      cy.get('button[mat-raised-button]').eq(0).click({ force: true });
      cy.url().should('include', '/sessions/detail/1');
      cy.contains('Delete').should('not.exist');
    });
  });
});
