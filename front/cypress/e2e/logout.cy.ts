describe('Logout spec', () => {
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



  it('should successfully login with correct credentials and logout successfully', () => {
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
    cy.contains('span', 'Logout').click({ force: true });
    cy.url().should('include', '');
  });

})

