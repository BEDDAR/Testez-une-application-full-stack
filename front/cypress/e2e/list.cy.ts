describe('list session spec', () => {
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
    cy.intercept('GET', '/api/session', []).as('getSessions');

    // Intercept session creation request (POST)
    cy.intercept('POST', '/api/session', {
      body: {
        name: 'Physique Class',
        date: '2025-02-23',
        teacher_id: 345,
        description: 'Advanced physique class',
        users: []
      },
    }).as('createSession');

    cy.intercept('GET', '/api/teacher', {
      body: [
        { id: 345, lastName: "teacher1", firstName: "teacher" },
        { id: 346, lastName: "teacher2", firstName: "another" }
      ]
    }).as('getTeachers');



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
  });

  it('should click on Create button and navigate to /sessions/create', () => {

  cy.get('button[mat-raised-button]', { timeout: 10000 })
  .should('not.be.disabled')
  .should('be.visible')
  .click({ force: true });
  cy.url().should('include', '/sessions/create');
  });
});
