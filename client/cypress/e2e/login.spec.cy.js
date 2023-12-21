import user from '../fixtures/user.json';

describe('login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should sign in with correct credentials', () => {
    cy.login(user.username, user.password);
    cy.location('pathname').should('not.equal', '/login');
    cy.get('[data-test="login-btn"]').should('not.exist');
    cy.get('[data-test="logout-btn"]').should('exist');
  });

  it('should not sign in with incorrect username', () => {
    cy.get('[data-test="login-err-msg"]').should('not.be.visible');
    cy.login('not_a_username', user.password);
    cy.location('pathname').should('equal', '/login');
    cy.get('[data-test="login-err-msg"]').should('be.visible');
  });

  it('should not sign in with incorrect password', () => {
    cy.get('[data-test="login-err-msg"]').should('not.be.visible');
    cy.login(user.username, 'n0t_@_p@$$w0rd');
    cy.location('pathname').should('equal', '/login');
    cy.get('[data-test="login-err-msg"]').should('be.visible');
  });

  it('should stay logged in on same browser session', () => {
    cy.login(user.username, user.password);
    cy.location('pathname').should('not.equal', '/login');
    cy.reload();
    cy.get('[data-test="login-btn"]').should('not.exist');
    cy.get('[data-test="logout-btn"]').should('exist');
  });
});
