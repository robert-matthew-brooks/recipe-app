import RecipePagination from '../../src/components/recipes/RecipePagination';

beforeEach(() => {});

describe('RecipePagination.', () => {
  it('should show the current recipes, total recipes, and load button', () => {
    cy.mount(
      <RecipePagination
        recipesCount={6}
        totalRecipes={30}
        cb={cy.stub().as('cb')}
        isLoading={false}
      />
    );
    cy.get('[data-test="RecipePagination-load-btn"]').as('loadBtn');

    cy.contains('6').should('exist');
    cy.contains('30').should('exist');
    cy.get('@loadBtn').should('exist');

    cy.get('@cb').its('callCount').should('eq', 0);
    cy.get('@loadBtn').click();
    cy.get('@cb').its('callCount').should('eq', 1);
  });

  it('should not show the load button if all recipes are loaded', () => {
    cy.mount(
      <RecipePagination
        recipesCount={30}
        totalRecipes={30}
        cb={null}
        isLoading={false}
      />
    );

    cy.get('[data-test="RecipePagination-load-btn"]').should('not.exist');
  });
});
