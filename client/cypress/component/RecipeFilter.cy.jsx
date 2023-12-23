import RecipeFilter from '../../src/components/recipes/RecipeFilter';

const allIngredients = [
  { id: 1, name: 'Beef Mince', units: 'g' },
  { id: 2, name: 'Milk', units: 'ml' },
  { id: 3, name: 'Potatoes', units: '' },
  { id: 4, name: 'Rice', units: 'g' },
  { id: 5, name: 'Baked Beans', units: 'g' },
];

const filterIngredients = allIngredients.slice(0, 2);

beforeEach(() => {
  cy.intercept('GET', 'http://localhost:9090/ingredients', {
    body: { ingredients: allIngredients },
  }).as('getIngredients');

  cy.mount(
    <RecipeFilter
      filterName=""
      setFilterName={cy.stub().as('setFilterName')}
      filterOrderBy=""
      setFilterOrderBy={cy.stub().as('setFilterOrderBy')}
      filterIngredients={filterIngredients}
      setFilterIngredients={cy.stub().as('setFilterIngredients')}
      setIsLoading={() => {}}
    />
  );

  cy.get('[data-test="RecipeFilter-accordion"]').as('accordion');
  cy.get('[data-test="RecipeFilter-panel"]').as('panel');
  cy.get('[data-test="filter-search"]').as('searchBox');
});

describe('RecipeFilter', () => {
  it('should show contents when clicked', () => {
    //hidden by default
    cy.get('@panel').should('not.be.visible');

    // click to open
    cy.get('@accordion').click();
    cy.get('@panel').should('be.visible');

    // click to close
    cy.get('@accordion').click();
    cy.get('@panel').should('not.be.visible');

    // double click (dblclick bugged)
    cy.get('@accordion').click().click();
    cy.get('@panel').should('not.be.visible');
  });

  it('should show and update search term', () => {
    cy.get('@accordion').click();

    cy.get('@searchBox').type('beans on toast');
    cy.get('@setFilterName').its('callCount').should('eq', 1);

    cy.get('@searchBox').clear().type('instant noodles');
    cy.get('@setFilterName').its('callCount').should('eq', 2);
  });

  it('should update sort order', () => {
    cy.get('@accordion').click();

    cy.get('@setFilterOrderBy').its('callCount').should('eq', 0);

    cy.get('[data-test="filter-sort-dropdown"]').select(1);
    cy.get('@setFilterOrderBy').its('callCount').should('eq', 1);
  });

  it('should show and update ingredients', () => {
    cy.get('@accordion').click();

    // show correct ingredients
    cy.get('[data-test="filter-ingredients-dropdown"]').within(() => {
      cy.get('option:enabled').should(
        'have.length',
        allIngredients.length - filterIngredients.length
      );
    });

    cy.get('[data-test="filter-ingredients-list"]').within(() => {
      cy.get('li').should('have.length', filterIngredients.length);
    });

    // selecting or removing ingredients calls setter
    cy.get('@setFilterIngredients').its('callCount').should('eq', 0);

    cy.get('[data-test="filter-ingredients-dropdown"]').select(1);
    cy.get('@setFilterIngredients').its('callCount').should('eq', 1);

    cy.get('[data-test="filter-ingredients-list"]').within(() => {
      cy.get('li')
        .first()
        .within(() => {
          cy.get('button').click();
        });
    });
    cy.get('@setFilterIngredients').its('callCount').should('eq', 2);
  });
});
