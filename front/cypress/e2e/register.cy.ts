describe('register spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/register');
  });

  it('register successful', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {},
    }).as('register');

    cy.get('input[formControlName=firstName]').type('user1');
    cy.get('input[formControlName=lastName]').type('user1test');
    cy.get('input[formControlName=email]').type('user1@test.com');
    cy.get('input[formControlName=password]').type('test!1234');

    cy.get('button[type="submit"]').click();
    cy.wait('@register');

    cy.url().should('include', '/login');
  });

  it('should disable button if fields are empty', () => {
    cy.get('input[formControlName=firstName]').clear();
    cy.get('input[formControlName=lastName]').clear();
    cy.get('input[formControlName=email]').clear();
    cy.get('input[formControlName=password]').clear();

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should show error if password is too weak', () => {
    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('john@doe.com');
    cy.get('input[formControlName=password]').type('123');

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should show error if email is invalid', () => {
    cy.get('input[formControlName=firstName]').type('Jane');
    cy.get('input[formControlName=lastName]').type('Smith');
    cy.get('input[formControlName=email]').type('invalid-email');
    cy.get('input[formControlName=password]').type('test!1234');

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should display error message when registration fails', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 500,
      body: {},
    }).as('registerFail');

    cy.get('input[formControlName=firstName]').type('user1');
    cy.get('input[formControlName=lastName]').type('user1test');
    cy.get('input[formControlName=email]').type('user1@test.com');
    cy.get('input[formControlName=password]').type('test!1234');

    cy.get('button[type="submit"]').click();
    cy.wait('@registerFail');

    cy.get('span.error').should('contain', 'An error occurred');
  });
});
