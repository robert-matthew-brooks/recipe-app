import SimpleMsg from './SimpleMsg';

export default function RecipeDeleted() {
  return (
    <SimpleMsg
      title="Deleted"
      msg="Your recipe has been successfully removed."
      linkText="Back to Recipes..."
      linkHref="/recipes"
    />
  );
}
