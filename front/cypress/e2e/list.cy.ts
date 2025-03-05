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

  });

  it('should click on Create button and navigate to /sessions/create', () => {

    cy.get('button[mat-raised-button]', { timeout: 10000 }).eq(0)  // Attendre jusqu'à 10 secondes
    .should('not.be.disabled')  // Vérifie que le bouton n'est pas désactivé
    .should('be.visible')  // Vérifie qu'il est visible
    .click({ force: true });
  cy.url().should('include', '/sessions/create');
  });

  it('should display a list of sessions and check session data', () => {
    cy.wait('@getSessions');
    // Vérifier que l'élément contenant les sessions existe
    cy.get('div.items.mt2').should('exist').and('be.visible');

    // Vérifier que chaque session est bien affichée (en supposant qu'il y en a au moins une)
    cy.get('mat-card.item').should('have.length.greaterThan', 0); // Vérifie qu'il y a au moins une session

    // Vérifier le contenu de la première session
    cy.get('mat-card.item').first().within(() => {
      cy.get('mat-card-title').should('contain', 'Physique Class'); // Vérifie que le nom de la session est bien "Physique Class"
      cy.get('mat-card-subtitle').should('contain', 'Session on February 23, 2025'); // Vérifie que la date est correctement formatée
      cy.get('mat-card-content p').should('contain', 'Advanced physique class'); // Vérifie que la description est bien affichée
    });

    // Vérifier que le bouton "Detail" existe dans la première session
    cy.get('button[mat-raised-button]', { timeout: 10000 }).eq(1)  // Attendre jusqu'à 10 secondes
    .should('not.be.disabled')  // Vérifie que le bouton n'est pas désactivé
    .should('be.visible')

    // Vérifier si l'utilisateur admin a un bouton "Edit"
    cy.get('button[mat-raised-button]', { timeout: 10000 }).eq(2)  // Attendre jusqu'à 10 secondes
    .should('not.be.disabled')  // Vérifie que le bouton n'est pas désactivé
    .should('be.visible')
  });
});
