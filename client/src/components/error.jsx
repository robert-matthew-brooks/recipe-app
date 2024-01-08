import SimpleMsg from './SimpleMsg';

export default function Error() {
  return (
    <SimpleMsg
      title="Oops!"
      msg="Something went wrong &#9785;. Please try again later"
      linkText="Back to Recipes"
      linkHref="/recipes"
    />
  );
}
