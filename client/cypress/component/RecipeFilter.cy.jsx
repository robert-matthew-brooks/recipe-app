import { Link } from 'react-router-dom';
import { UserContext } from '../../src/components/context/UserContext';
import RecipeFilter from '../../src/components/recipes/RecipeFilter';

const allIngredients = [
  { id: 1, name: 'Beef Mince', units: 'g' },
  { id: 2, name: 'Milk', units: 'ml' },
  { id: 3, name: 'Potatoes', units: '' },
  { id: 4, name: 'Rice', units: 'g' },
  { id: 5, name: 'Baked Beans', units: 'g' },
];

const filterIngredients = allIngredients.slice(0, 2);

const setupRecipeFilter = (value) => {
  cy.intercept('GET', 'http://localhost:9090/ingredients', {
    body: { ingredients: allIngredients },
  }).as('getIngredients');

  cy.stub(Link);

  cy.mount(
    <UserContext.Provider value={value}>
      <RecipeFilter
        filterName=""
        setFilterName={cy.stub().as('setFilterName')}
        filterOrderBy=""
        setFilterOrderBy={cy.stub().as('setFilterOrderBy')}
        filterIngredients={filterIngredients}
        setFilterIngredients={cy.stub().as('setFilterIngredients')}
        filterIsFavourites={false}
        setFilterIsFavourites={cy.stub().as('setFilterIsFavourites')}
        filterIsVegetarian={false}
        setFilterIsVegetarian={cy.stub().as('setFilterIsVegetarian')}
        setIsLoading={() => {}}
      />
    </UserContext.Provider>
  );

  cy.get('[data-test="filter-accordion"]').as('accordion');
  cy.get('[data-test="filter-panel"]').as('panel');
  cy.get('[data-test="filter-search"]').as('searchBox');
  cy.get('[data-test="filter-sort-dropdown"]').as('sort-dropdown');
  cy.get('[data-test="filter-ingredients-dropdown"]').as(
    'ingredients-dropdown'
  );
  cy.get('[data-test="filter-favourites"]').as('favourites-chkbox');
  cy.get('[data-test="filter-vegetarian"]').as('vegetarian-chkbox');
};

describe('RecipeFilter', () => {
  it('should show contents when clicked', () => {
    setupRecipeFilter({ activeUser: null });

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
    setupRecipeFilter({ activeUser: null });
    cy.get('@accordion').click();

    cy.get('@searchBox').type('beans on toast');
    cy.get('@setFilterName').its('callCount').should('eq', 1);

    cy.get('@searchBox').clear().type('instant noodles');
    cy.get('@setFilterName').its('callCount').should('eq', 2);
  });

  it('should update sort order', () => {
    setupRecipeFilter({ activeUser: null });
    cy.get('@accordion').click();

    cy.get('@setFilterOrderBy').its('callCount').should('eq', 0);

    cy.get('@sort-dropdown').select(1);
    cy.get('@setFilterOrderBy').its('callCount').should('eq', 1);
  });

  it('should show and update ingredients', () => {
    setupRecipeFilter({ activeUser: null });
    cy.get('@accordion').click();

    // show correct ingredients
    cy.get('@ingredients-dropdown').within(() => {
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

    cy.get('@ingredients-dropdown').select(1);
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

  it('should update filter state on favourites box click and logged in', () => {
    setupRecipeFilter({ activeUser: { username: 'test_user' } });
    cy.get('@accordion').click();

    cy.get('@favourites-chkbox').click();
    cy.get('@setFilterIsFavourites').its('callCount').should('eq', 1);
    cy.get('@favourites-chkbox').click();
    cy.get('@setFilterIsFavourites').its('callCount').should('eq', 2);
  });

  it('should show an error on favourites box click and not logged in', () => {
    setupRecipeFilter({ activeUser: null });
    cy.get('@accordion').click();

    cy.get('@favourites-chkbox').click();
    cy.get('[data-test="favourites-err"]').should('be.visible');
    cy.get('@setFilterIsFavourites').its('callCount').should('eq', 0);
  });

  it('should update filter state when vegetarian box is checked', () => {
    setupRecipeFilter({ activeUser: null });
    cy.get('@accordion').click();

    cy.get('@vegetarian-chkbox').click();
    cy.get('@setFilterIsVegetarian').its('callCount').should('eq', 1);
    cy.get('@vegetarian-chkbox').click();
    cy.get('@setFilterIsVegetarian').its('callCount').should('eq', 2);
  });
});
