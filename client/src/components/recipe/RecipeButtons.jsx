import TextBtn from '../TextBtn';
import './RecipeButtons.css';

export default function RecipeButtons({ slug }) {
  return (
    <div className="RecipeButtons">
      <TextBtn
        light={true}
        text="Share via Email"
        size="2"
        callback={() => {
          console.log(` website.com/recipes/${slug}`);
        }}
      />

      <TextBtn text="&hearts; Add to Favourites" size="2" />
      {/* TODO remove from favourites if already added */}
      {/* or show error if not signed in */}
    </div>
  );
}
