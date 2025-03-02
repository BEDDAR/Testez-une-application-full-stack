describe('register spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200, // Indique que la requête a réussi
      body: {} // Simule un `Observable<void>` en renvoyant un objet vide
    }).as('register');
  });




  it('register successful', () => {
    cy.get('input[formControlName=firstName]').type("user1")
    cy.get('input[formControlName=lastName]').type("user1test")
    cy.get('input[formControlName=email]').type("user1@test.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/login')
  });
});
