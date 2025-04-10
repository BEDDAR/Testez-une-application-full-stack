describe('detail session spec', () => {
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

    cy.intercept('GET', '/api/session', [{
      id: 1,
      name: 'Physique Class',
      date: '2025-02-23',
      teacher_id: 345,
      description: 'Advanced physique class',
      users: []
    }]).as('getSessions');

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Physique Class',
        date: '2025-02-23',
        teacher_id: 345,
        description: 'Advanced physique class',
        users: []
      },
    }).as('createSession');

    cy.intercept('DELETE', '/api/session/1', {
      body: {
        id: 1,
        name: 'Physique Class',
        date: '2025-02-23',
        teacher_id: 345,
        description: 'Advanced physique class',
        users: []
      },
    }).as('deleteSession');

    cy.intercept('GET', '/api/teacher', {
      body: [
        { id: 345, lastName: "teacher1", firstName: "teacher" },
        { id: 346, lastName: "teacher2", firstName: "another" }
      ]
    }).as('getTeachers');

    cy.intercept('GET', '/api/teacher/345', {
      body: [
        { id: 345, lastName: "teacher1", firstName: "teacher" }
      ]
    }).as('getTeacher');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);
    cy.location('pathname').should('eq', '/sessions');
  });

  it('should click on detail button and navigate to /sessions/detail/1', () => {
    cy.wait('@getSessions');
    cy.get('button[mat-raised-button]').should('have.length.at.least', 1);
    cy.get('button[mat-raised-button]').eq(1).click({ force: true });
    cy.url().should('include', '/sessions/detail/1');
    cy.get('mat-card-title h1').should('be.visible').and('not.be.empty');
    cy.get('mat-card-subtitle').should('be.visible').and('not.be.empty');
  });

  it('should click on delete button and delete the session 1', () => {
    cy.wait('@getSessions');
    cy.get('button[mat-raised-button]').eq(1).click({ force: true });
    cy.url().should('include', '/sessions/detail/1');
    cy.get('mat-card-title h1').should('be.visible').and('not.be.empty');
    cy.get('mat-card-subtitle').should('be.visible').and('not.be.empty');
    cy.get('button[mat-raised-button][color="warn"]').contains('Delete').click();
    cy.wait('@deleteSession').its('response.statusCode').should('eq', 200);
    cy.wait('@getSessions');
    cy.get('table tbody tr').should('not.exist');
  });

  it('should display full session details for admin including delete button', () => {
    cy.wait('@getSessions');
    cy.get('button[mat-raised-button]').eq(1).click({ force: true });
    cy.url().should('include', '/sessions/detail/1');
    cy.get('mat-card-title h1').should('contain.text', 'Physique Class');
    cy.get('mat-card-content').should('contain.text', 'Advanced physique class');
    cy.get('mat-card-content').should('contain.text', 'attendees');
    cy.get('mat-card-content').should('contain.text', 'Create at');
    cy.get('mat-card-content').should('contain.text', 'Last update');
    cy.get('button[color="warn"] span.ml1').should('contain.text', 'Delete');
  });

  it('should show session details for non-admin without delete button', () => {
    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply({
        body: {
          token: 'mocked-token',
          type: 'Bearer',
          id: 3,
          username: 'studentUser',
          firstName: 'Student',
          lastName: 'User',
          admin: false
        }
      });
    }).as('getUserNonAdmin');

    cy.visit('/login');
    cy.get('input[formControlName=email]').clear().type("student@studio.com");
    cy.get('input[formControlName=password]').clear().type(`${"test!1234"}{enter}{enter}`);
    cy.wait('@getSessions');
    cy.get('button[mat-raised-button]').eq(0).click({ force: true });
    cy.url().should('include', '/sessions/detail/1');
    cy.get('mat-card-title h1').should('contain.text', 'Physique Class');
    cy.get('mat-card-content').should('contain.text', 'Advanced physique class');
    cy.get('button span.ml1').should('not.contain.text', 'Delete');
    cy.get('button span.ml1').then($el => {
      const text = $el.text();
      expect(text).to.match(/Participate|Do not participate/);
    });
  });
});
