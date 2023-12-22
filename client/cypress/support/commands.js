Cypress.Commands.add('login', (username, password) => {
  cy.get('[data-test="username-box"]').clear().type(username);
  cy.get('[data-test="password-box"]').clear().type(password);
  cy.get('[data-test="login-btn"]').click();
});
