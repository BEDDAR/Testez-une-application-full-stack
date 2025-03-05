describe('form session spec', () => {
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

    cy.intercept('GET', '/api/session/1', {
      body: {
        id:1,
        name: 'Physique Class',
        date: '2025-02-23',
        teacher_id: 345,
        description: 'Advanced physique class',
        users: []
      },
    }).as('getSession');

    cy.intercept('PUT', '/sessions/update/1', {
      body: {
        name: 'math Class',
        date: '2025-02-23',
        teacher_id: 345,
        description: 'Advanced physique class',
        users: []
      },
    }).as('updateSession');

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
  });

  it('should click on Create button and navigate to /sessions/create', () => {

  cy.get('button[mat-raised-button]', { timeout: 10000 }).eq(0)  // Attendre jusqu'à 10 secondes
  .should('not.be.disabled')  // Vérifie que le bouton n'est pas désactivé
  .should('be.visible')  // Vérifie qu'il est visible
  .click({ force: true });  // Clique sur le bouton

  // Vérifier la redirection
  cy.url().should('include', '/sessions/create');
  });

  it('create session successful', () => {
    cy.get('button[mat-raised-button]', { timeout: 10000 }).eq(0)  // Attendre jusqu'à 10 secondes
    .should('not.be.disabled')  // Vérifie que le bouton n'est pas désactivé
    .should('be.visible')  // Vérifie qu'il est visible
    .click({ force: true });  // Clique sur le bouton

    // Fill out the session creation form
    cy.get('input[formControlName=name]').type("Physique Class");
    cy.get('input[formControlName=date]').type("2025-02-23");
    cy.wait('@getTeachers');  // Attendre la récupération des enseignants
    cy.get('mat-select[formControlName=teacher_id]').click();  // Ouvrir le menu déroulant
    cy.get('mat-option').should('exist').contains('teacher1').click();  // Sélectionner l'enseignant

    cy.get('textarea[formControlName=description]').type("Advanced physique class{enter}{enter}");

    // Assert that the user is redirected back to the /sessions page after successful creation
    cy.url().should('include', '/sessions');
  });

  it('update session successful', () => {
    cy.get('button[mat-raised-button]', { timeout: 10000 }).eq(2)
    .should('not.be.disabled')
    .should('be.visible')
    .click({ force: true });
    cy.url().should('include', '/sessions/update/1');
    cy.wait('@getSession');

    // Fill out the session creation form
    cy.get('input[formControlName=name]').type("math Class");
    cy.get('input[formControlName=date]').type("2025-02-23");
    cy.wait('@getTeachers');  // Attendre la récupération des enseignants
    cy.get('mat-select[formControlName=teacher_id]').click();  // Ouvrir le menu déroulant
    cy.get('mat-option').should('exist').contains('teacher1').click();  // Sélectionner l'enseignant

    cy.get('textarea[formControlName=description]').type("Advanced physique class{enter}{enter}");

    // Assert that the user is redirected back to the /sessions page after successful creation
    cy.url().should('include', '/sessions');
  });
});
