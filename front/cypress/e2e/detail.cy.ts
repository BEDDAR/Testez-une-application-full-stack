describe('detail session spec', () => {
  beforeEach(() => {
    // Intercept login request
    cy.intercept('POST', '/api/auth/login', (req) => {
      req.reply({
        body: {
          token: 'mocked-token',
          type: 'Bearer',
          id: 1,
          username: 'adminUser',
          firstName: 'Admin',
          lastName: 'User',
          admin: true // L'utilisateur est admin
        }
      });
    }).as('getUser');

    // Intercept session request (GET)
    cy.intercept('GET', '/api/session', [{
      id:1,
      name: 'Physique Class',
      date: '2025-02-23',
      teacher_id: 345,
      description: 'Advanced physique class',
      users: []
    }]).as('getSessions');


    cy.intercept('GET', '/api/session/1', {
      body: {
        id:1,
        name: 'Physique Class',
        date: '2025-02-23',
        teacher_id: 345,
        description: 'Advanced physique class',
        users: []
      },
    }).as('createSession');

    cy.intercept('DELETE', '/api/session/1', {
      body: {
        id:1,
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


    // Visit login page
    cy.visit('/login');
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    // Vérifier que l'authentification a bien changé l'interface utilisateur
    cy.location('pathname').should('eq', '/sessions');

    // Vérifier dans la console que la requête a bien été interceptée
    cy.window().then((win) => {
      console.log('Utilisateur connecté:', win.localStorage.getItem('token'));
    });
    document.querySelectorAll('button[mat-raised-button]').forEach(btn => console.log(btn.getAttribute('routerLink')));

  });

  it('should click on detail button and navigate to /sessions/detail/1', () => {
    cy.wait('@getSessions');
    cy.get('button[mat-raised-button]').should('have.length.at.least', 1);
    cy.get('button[mat-raised-button]', { timeout: 10000 }).eq(1)
    .should('not.be.disabled')
    .should('be.visible')
    .click({ force: true });
  cy.url().should('include', '/sessions/detail/1');
  cy.get('mat-card-title h1').should('be.visible').and('not.be.empty');
  cy.get('mat-card-subtitle').should('be.visible').and('not.be.empty');

  });

  it('should click on delete button and delete the session 1', () => {
    cy.wait('@getSessions');
    cy.get('button[mat-raised-button]').should('have.length.at.least', 1);
    cy.get('button[mat-raised-button]', { timeout: 10000 }).eq(1)
    .should('not.be.disabled')
    .should('be.visible')
    .click({ force: true });
  cy.url().should('include', '/sessions/detail/1');
  cy.get('mat-card-title h1').should('be.visible').and('not.be.empty');
  cy.get('mat-card-subtitle').should('be.visible').and('not.be.empty');

  cy.get('button[mat-raised-button][color="warn"]')
    .contains('Delete')  // Vérifier que le bouton contient bien "Delete"
    .should('be.visible')  // Vérifier qu'il est affiché
    .click();
     // Attendre que la suppression soit terminée
  cy.wait('@deleteSession').its('response.statusCode').should('eq', 200);

  // Attendre que la liste des sessions soit rafraîchie
  cy.wait('@getSessions');

  // Vérifier que la liste des sessions est vide
  cy.get('table tbody tr').should('not.exist');
  });

});
