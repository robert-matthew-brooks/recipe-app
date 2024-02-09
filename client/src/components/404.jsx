import SimpleMsg from './SimpleMsg';

export default function Missing404() {
  return (
    <SimpleMsg
      title="Oops!"
      msg="Sorry, the page you're looking for doesn't exist! &#9785;"
      linkText="Back to Recipes..."
      linkHref="/recipes"
    />
  );
}
