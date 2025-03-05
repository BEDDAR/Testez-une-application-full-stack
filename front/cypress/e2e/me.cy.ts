describe('Me spec', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    }).as('getUser');

    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        email: 'yoga@studio.com',
        admin: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-02-01T00:00:00.000Z'
      },
    }).as('getUserById');

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
      []
    ).as('session');

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.url().should('include', '/sessions');
  });

  it('should find the Account span, click on it, and navigate to /me', () => {
    // Vérifier que la span existe et est visible
    cy.get('span.link[routerLink="me"]')
      .should('be.visible')  // Vérifie qu'elle est visible
      .and('contain', 'Account')  // Vérifie que le texte est bien "Account"
      .click();  // Clique dessus

    // Vérifier la redirection vers /me
    cy.url().should('include', '/me');
  });

  it('should find the Logout span, click on it, and navigate to /', () => {
    // Vérifier que la span "Logout" existe et est visible
    cy.get('span.link')
      .contains('Logout')  // Vérifie que le texte est bien "Logout"
      .should('be.visible')  // Vérifie qu'elle est visible
      .click();  // Clique dessus

    // Vérifier la redirection vers la page d'accueil "/"
    cy.url().should('eq', 'http://localhost:4200/');
  });

  it('should display correct user information', () => {
    // Aller à la page /me après le login
    cy.get('span.link[routerLink="me"]').click();
    cy.url().should('include', '/me');

    // Vérifier que le nom complet est bien affiché
    cy.get('p').contains('Name: John DOE').should('be.visible');

    // Vérifier que l'email est correctement affiché
    cy.get('p').contains('Email: yoga@studio.com').should('be.visible');

    // Vérifier que la date de création est correcte
    cy.get('p').contains('Create at: January 1, 2025').should('be.visible');

    // Vérifier que la dernière mise à jour est correcte
    cy.get('p').contains('Last update: February 1, 2025').should('be.visible');

    // Vérifier si l'utilisateur est admin
    cy.get('p').contains('You are admin').should('be.visible');
  });
});
