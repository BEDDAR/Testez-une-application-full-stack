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
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        message: 'Invalid email or password',
      },
    }).as('loginRequest');
    cy.get('input[formControlName=email]').type('incorrect@studio.com');
    cy.get('input[formControlName=password]').type('wrongpassword{enter}{enter}');
    cy.wait('@loginRequest');
    cy.get('p.error').should('be.visible').and('contain', 'An error occurred');
    cy.url().should('include', '/login');
  });

  it('should successfully login with correct credentials', () => {
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
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.wait('@loginSuccess');
    cy.url().should('include', '/sessions');
    cy.contains('button', 'Create').should('be.visible');
  });

  it('should show an error message when email is missing', () => {
    cy.get('input[formControlName=email]').clear();
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.get('p.error').should('be.visible').and('contain', 'An error occurred');
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
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').clear();
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
    cy.get('input[formControlName=email]').clear();
    cy.get('input[formControlName=password]').clear();
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should display an error message when the site is not accessible', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/**',
      },
      {
        statusCode: 503,
        body: 'Ce site est inaccessible',
        headers: { 'content-type': 'text/html' },
      }
    ).as('getNonAccessiblePage');

    cy.visit('/login', { failOnStatusCode: false });

    cy.contains('Ce site est inaccessible').should('be.visible');
  });
});
