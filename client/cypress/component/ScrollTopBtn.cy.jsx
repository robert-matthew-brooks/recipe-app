import ScrollTopBtn from '../../src/components/nav/ScrollTopBtn';

beforeEach(() => {
  cy.get('body').invoke('attr', 'style', 'height: 10000px');
  cy.mount(<ScrollTopBtn />);
  cy.get('[data-test="scroll-top-btn"]').as('scrollTopBtn');
});

describe('ScrollTopBtn', () => {
  it('should only be visible in certain conditions', () => {
    // delay scrolling due to 100ms throttling of scroll listener
    cy.get('@scrollTopBtn').should('not.be.inViewport');
    cy.scrollTo('bottom', { duration: 200 });
    cy.scrollTo('center', { duration: 200 });
    cy.get('@scrollTopBtn').should('be.inViewport');

    cy.get('@scrollTopBtn').click();
    cy.get('@scrollTopBtn').should('not.be.inViewport');
    cy.window().then((window) => {
      expect(window.scrollY).to.equal(0);
    });
  });
});
