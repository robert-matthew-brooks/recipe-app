import TextBtn from '../TextBtn';
import './RecipePagination.css';

export default function RecipePagination({
  recipesCount = 0,
  totalRecipes = 0,
  callback,
}) {
  return (
    <div id="RecipePagination">
      <p>
        {recipesCount > 0 &&
          `Showing ${recipesCount} of ${totalRecipes} matching recipes`}
      </p>
      {totalRecipes > recipesCount && (
        <TextBtn
          dataTest="RecipePagination-load-btn"
          text="&#8595; Load More..."
          size={3}
          callback={callback}
        />
      )}
    </div>
  );
}
