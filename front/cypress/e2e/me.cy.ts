describe('Me spec', () => {
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
      []
    ).as('session');

    cy.intercept('DELETE', '/api/user/1', {}).as('deleteUser');
  });

  it('should find the Account span, click on it, and navigate to /me', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        admin: true
      },
    }).as('login');

    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 2,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        email: 'yoga@studio.com',
        admin: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-02-01T00:00:00.000Z'
      },
    }).as('getUser');
    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.url().should('include', '/sessions');

    cy.get('span.link[routerLink="me"]')
      .should('be.visible')  // Vérifie qu'elle est visible
      .and('contain', 'Account')  // Vérifie que le texte est bien "Account"
      .click();  // Clique dessus

    cy.wait('@getUser');
    cy.url().should('include', '/me');
  });

  it('should find the Logout span, click on it, and navigate to /', () => {

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        admin: true
      },
    }).as('login');

    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 2,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        email: 'yoga@studio.com',
        admin: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-02-01T00:00:00.000Z'
      },
    }).as('getUser');

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.url().should('include', '/sessions');

    cy.get('span.link')
      .contains('Logout')  // Vérifie que le texte est bien "Logout"
      .should('be.visible')  // Vérifie qu'elle est visible
      .click();  // Clique dessus

    // Vérifier la redirection vers la page d'accueil "/"
    cy.url().should('eq', 'http://localhost:4200/');
  });

  it('should display correct user information', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        admin: true
      },
    }).as('login');

    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 2,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        email: 'yoga@studio.com',
        admin: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-02-01T00:00:00.000Z'
      },
    }).as('getUser');

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.url().should('include', '/sessions');

    cy.get('span.link[routerLink="me"]')
      .should('be.visible')  // Vérifie qu'elle est visible
      .and('contain', 'Account')  // Vérifie que le texte est bien "Account"
      .click();  // Clique dessus

    cy.wait('@getUser');

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

  it('should navigate to the previous page.', () => {

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        admin: true
      },
    }).as('login');

    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 2,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        email: 'yoga@studio.com',
        admin: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-02-01T00:00:00.000Z'
      },
    }).as('getUser');

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.url().should('include', '/sessions');

    cy.get('span.link[routerLink="me"]')
      .should('be.visible')  // Vérifie qu'elle est visible
      .and('contain', 'Account')  // Vérifie que le texte est bien "Account"
      .click();  // Clique dessus

    cy.wait('@getUser');

    cy.go('back');
    cy.url().should('include', '/sessions');
  });

  it('When he clicks on "Delete account Then he should be able to delete his account.', () => {

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        admin: false
      },
    }).as('login');

    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 2,
        username: 'userName',
        firstName: 'John',
        lastName: 'Doe',
        email: 'yoga@studio.com',
        admin: false,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-02-01T00:00:00.000Z'
      },
    }).as('getUser');

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.url().should('include', '/sessions');

    cy.get('span.link[routerLink="me"]')
      .should('be.visible')  // Vérifie qu'elle est visible
      .and('contain', 'Account')  // Vérifie que le texte est bien "Account"
      .click();  // Clique dessus

    cy.wait('@getUser');

    cy.get('button').contains('Detail').click();

    cy.wait('@deleteUser').then(() => {
      cy.contains('Your account has been deleted !').should(
        'be.visible'
      );
      cy.url().should('include', '/');
    });
  });
})
