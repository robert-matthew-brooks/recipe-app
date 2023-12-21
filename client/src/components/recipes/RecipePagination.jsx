import TextBtn from '../TextBtn';
import './RecipePagination.css';

export default function RecipePagination({
  recipesCount = 0,
  totalRecipes = 0,
  cb,
  isLoading,
}) {
  return (
    <div id="RecipePagination">
      <p>
        {recipesCount > 0 &&
          `Showing ${recipesCount} of ${totalRecipes} matching recipes`}
      </p>
      {totalRecipes > recipesCount && (
        <TextBtn
          text="&#8595; Load More..."
          size={3}
          cb={cb}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
