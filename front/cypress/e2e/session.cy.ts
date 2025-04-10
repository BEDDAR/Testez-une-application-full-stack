describe('list session spec for user not admin', () => {

  beforeEach(() =>{
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
      },
    }).as('getUser');

    cy.intercept('GET', '/api/session', [
      {
        id: 1,
        name: 'Physique Class',
        date: '2025-02-23',
        teacher_id: 345,
        description: 'Advanced physique class',
        users: [],
      },
      {
        id: 2,
        name: 'yoga',
        date: '2025-02-23',
        teacher_id: 345,
        description: 'yoga bienvenu',
        users: [1],
      },
    ]).as('getSessions');

    cy.intercept('GET', '/api/session/1', {
      id: 1,
      name: 'Physique Class',
      date: '2025-02-23',
      teacher_id: 345,
      description: 'Advanced physique class',
      users: [],
    }).as('getSessionParticipate');


    cy.intercept('GET', '/api/session/2', {
      id: 2,
      name: 'yoga',
      date: '2025-02-23',
      teacher_id: 345,
      description: 'yoga bienvenu',
      users: [1],
    }).as('getSessionNonparticipate');

    cy.intercept('GET', '/api/teacher', {
      body: [
        { id: 345, lastName: 'teacher1', firstName: 'teacher' },
        { id: 346, lastName: 'teacher2', firstName: 'another' },
      ],
    }).as('getTeachers');

    cy.intercept('GET', '/api/teacher/345', {
      body: { id: 345, lastName: 'teacher1', firstName: 'teacher' },
    }).as('getTeacher');

    cy.intercept('POST', '/api/session/1/participate/1', {});

    cy.visit('/login');

    cy.get('input[formControlName=email]').type('user1@test.com');
    cy.get('input[formControlName=password]').type(`${'test!1234'}{enter}{enter}`);

    cy.location('pathname').should('eq', '/sessions');
  })

  it('Then he should be able to participate to one session.', () => {

    cy.wait('@getSessions');

    cy.get('mat-card.item').eq(0).within(() => {
      cy.get('span').contains('Detail').click();
    });

    cy.wait('@getSessionParticipate');

    cy.get('span').contains('Participate').click();
  });

  it('Then he should be able Do not participate to one session.', () => {

    cy.wait('@getSessions');

    cy.get('mat-card.item').eq(1).within(() => {
      cy.get('span').contains('Detail').click();
    });

    cy.wait('@getSessionNonparticipate');

    cy.get('span').contains('Do not participate').click();
  });
});
