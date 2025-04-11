describe('Me spec', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('GET', '/api/teacher', {
      body: [
        { id: 345, lastName: "teacher1", firstName: "teacher" },
        { id: 346, lastName: "teacher2", firstName: "another" }
      ]
    }).as('getTeachers');

    cy.intercept('GET', '/api/session', []).as('session');
    cy.intercept('DELETE', '/api/user/1', {}).as('deleteUser');
  });

  context('As Admin', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', {
        body: {
          id: 1,
          username: 'adminUser',
          firstName: 'Admin',
          lastName: 'User',
          admin: true
        }
      }).as('login');

      cy.intercept('GET', '/api/user/1', {
        body: {
          id: 1,
          username: 'adminUser',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@yoga.com',
          admin: true,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-02-01T00:00:00.000Z'
        }
      }).as('getUser');

      cy.get('input[formControlName=email]').type("admin@yoga.com");
      cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);
      cy.url().should('include', '/sessions');
    });

    it('should navigate to /me via Account span', () => {
      cy.get('span.link[routerLink="me"]').should('contain', 'Account').click();
      cy.wait('@getUser');
      cy.url().should('include', '/me');
    });

    it('should display admin user information and not show delete button', () => {
      cy.get('span.link[routerLink="me"]').click();
      cy.wait('@getUser');

      cy.contains('p', 'Name: Admin USER').should('be.visible');
      cy.contains('p', 'Email: admin@yoga.com').should('be.visible');
      cy.contains('p', 'You are admin').should('be.visible');
      cy.contains('button', 'Detail').should('not.exist');
    });

    it('should logout and go to /', () => {
      cy.get('span.link').contains('Logout').click();
      cy.url().should('eq', 'http://localhost:4200/');
    });

    it('should navigate back from /me', () => {
      cy.get('span.link[routerLink="me"]').click();
      cy.wait('@getUser');
      cy.go('back');
      cy.url().should('include', '/sessions');
    });
  });

  context('As Non-Admin', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', {
        body: {
          id: 1,
          username: 'regularUser',
          firstName: 'John',
          lastName: 'Doe',
          admin: false
        }
      }).as('login');

      cy.intercept('GET', '/api/user/1', {
        body: {
          id: 1,
          username: 'regularUser',
          firstName: 'John',
          lastName: 'Doe',
          email: 'yoga@studio.com',
          admin: false,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-02-01T00:00:00.000Z'
        }
      }).as('getUser');

      cy.get('input[formControlName=email]').type("yoga@studio.com");
      cy.get('input[formControlName=password]').type(`test!1234{enter}{enter}`);
      cy.url().should('include', '/sessions');
    });

    it('should display user info and show delete button', () => {
      cy.get('span.link[routerLink="me"]').click();
      cy.wait('@getUser');

      cy.contains('p', 'Name: John DOE').should('be.visible');
      cy.contains('p', 'Email: yoga@studio.com').should('be.visible');
      cy.contains('button', 'Detail').should('be.visible');
    });

    it('should delete account and redirect to /', () => {
      cy.get('span.link[routerLink="me"]').click();
      cy.wait('@getUser');

      cy.contains('button', 'Detail').click();
      cy.wait('@deleteUser');
      cy.contains('Your account has been deleted !').should('be.visible');
      cy.url().should('include', '/');
    });
  });
});
