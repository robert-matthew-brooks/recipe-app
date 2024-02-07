import SimpleMsg from '../SimpleMsg';

export default function ProfileUpdated() {
  return (
    <SimpleMsg
      title="Profile Updated"
      msg="Your details were updated successfully"
      linkText="Back to Profile"
      linkHref="/profile"
    />
  );
}
