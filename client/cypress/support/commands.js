Cypress.Commands.add('getDataTest', (dataTestValue) => {
  return cy.get(`[data-test="${dataTestValue}"]`);
});

Cypress.Commands.add('login', (username, password) => {
  cy.getDataTest('username-box').clear().type(username);
  cy.getDataTest('password-box').clear().type(password);
  cy.getDataTest('login-btn').click();
});
