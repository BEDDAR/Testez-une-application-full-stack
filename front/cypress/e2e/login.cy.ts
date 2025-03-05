describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('GET', '/api/teacher', {
      body: [
        { id: 345, lastName: "teacher1", firstName: "teacher" },
        { id: 346, lastName: "teacher2", firstName: "another" }
      ]
    }).as('getTeachers');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session');
  });

  it('should show an error message when login fails', () => {
    // Intercept the login request to simulate a failed login response (incorrect credentials)
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401, // Unauthorized
      body: {
        message: 'Invalid email or password',
      },
    }).as('loginRequest');
    // Type incorrect email and password
    cy.get('input[formControlName=email]').type('incorrect@studio.com');
    cy.get('input[formControlName=password]').type('wrongpassword{enter}{enter}');

    // Wait for the login request to complete
    cy.wait('@loginRequest');
    // Vérifier que le message d'erreur apparaît
    cy.get('p.error').should('be.visible').and('contain', 'An error occurred');

    // Vérifier que l'URL est toujours celle de la page de connexion
    cy.url().should('include', '/login');
  });

  it('should successfully login with correct credentials', () => {
    // Intercept a successful login request
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200, // Successful login
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    }).as('loginSuccess');

    // Type correct email and password
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    // Wait for the successful login request
    cy.wait('@loginSuccess');

    // Verify that the user is redirected to the /sessions page
    cy.url().should('include', '/sessions');

    // Verify that the "Create" button is present
    cy.contains('button', 'Create').should('be.visible');
  });

  it('should show an error message when email is missing', () => {

    cy.get('input[formControlName=email]').clear();  // Email vide
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}'); // Mot de passe valide
    // Vérifier que le message d'erreur pour le champ email est affiché
    cy.get('p.error')  // Vérifie si un élément <p> avec la classe error existe
    .should('be.visible')
    .and('contain', 'An error occurred');
  });

  it('should show an error message when password is missing', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    }).as('loginSuccess');
    cy.get('input[formControlName=email]').type('yoga@studio.com');  // Email valide
    cy.get('input[formControlName=password]').clear(); // Mot de passe vide
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should show an error message when both email and password are missing', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    }).as('loginSuccess');
    cy.get('input[formControlName=email]').clear();  // Email vide
    cy.get('input[formControlName=password]').clear(); // Mot de passe vide
    cy.get('button[type="submit"]').should('be.disabled');   // Soumettre

  });
});
