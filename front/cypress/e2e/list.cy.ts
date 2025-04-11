describe('list session spec for admin and non-admin', () => {
  const sessionMock = [{
    id: 1,
    name: 'Physique Class',
    date: '2025-02-23',
    teacher_id: 345,
    description: 'Advanced physique class',
    users: []
  }];

  beforeEach(() => {
    cy.intercept('GET', '/api/session', sessionMock).as('getSessions');
    cy.intercept('GET', '/api/teacher', {
      body: [
        { id: 345, lastName: "teacher1", firstName: "teacher" },
        { id: 346, lastName: "teacher2", firstName: "another" }
      ]
    }).as('getTeachers');
  });

  context('Admin user', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', (req) => {
        req.reply({
          body: {
            token: 'mocked-token',
            type: 'Bearer',
            id: 1,
            username: 'adminUser',
            firstName: 'Admin',
            lastName: 'User',
            admin: true
          }
        });
      }).as('getUser');

      cy.visit('/login');
      cy.get('input[formControlName=email]').type("admin@yoga.com");
      cy.get('input[formControlName=password]').type("test!1234{enter}{enter}");
      cy.location('pathname').should('eq', '/sessions');
      cy.wait('@getSessions');
    });

    it('should display Create button for admin', () => {
      cy.get('button[routerLink="create"]')
        .should('exist')
        .and('contain', 'Create')
        .and('be.visible');
    });

    it('should display session list with Edit button for admin', () => {
      cy.get('mat-card.item').should('have.length.at.least', 1);
      cy.get('mat-card.item').first().within(() => {
        cy.get('mat-card-title').should('contain', 'Physique Class');
        cy.get('mat-card-subtitle').should('contain', 'February 23, 2025');
        cy.get('mat-card-content p').should('contain', 'Advanced physique class');

        cy.contains('button', 'Detail')
          .should('exist')
          .and('be.visible');

        cy.contains('button', 'Edit')
          .should('exist')
          .and('be.visible');
      });
    });

    it('should navigate to /sessions/create when Create button is clicked', () => {
      cy.get('button[routerLink="create"]').click();
      cy.url().should('include', '/sessions/create');
    });

    it('should display the session image', () => {
      cy.get('mat-card.item').first().within(() => {
        cy.get('img.picture').should('have.attr', 'src').and('include', 'assets/sessions.png');
      });
    });
  });

  context('Non-admin user', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', (req) => {
        req.reply({
          body: {
            token: 'mocked-token',
            type: 'Bearer',
            id: 2,
            username: 'normalUser',
            firstName: 'Normal',
            lastName: 'User',
            admin: false
          }
        });
      }).as('getUser');

      cy.visit('/login');
      cy.get('input[formControlName=email]').type("user@yoga.com");
      cy.get('input[formControlName=password]').type("test!1234{enter}{enter}");
      cy.location('pathname').should('eq', '/sessions');
      cy.wait('@getSessions');
    });

    it('should NOT display Create button for non-admin', () => {
      cy.get('button[routerLink="create"]').should('not.exist');
    });

    it('should display session list with only Detail button for non-admin', () => {
      cy.get('mat-card.item').should('have.length.at.least', 1);
      cy.get('mat-card.item').first().within(() => {
        cy.contains('button', 'Detail')
          .should('exist')
          .and('be.visible');

        cy.contains('button', 'Edit')
          .should('not.exist');
      });
    });
  });
});
