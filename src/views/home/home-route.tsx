import React, { useContext } from 'react';
import { GoogleSignOn } from '../shared/auth/google-sign-on';
import './home-route.scss';
import { AuthContext } from '../../App';

export function Home() {
  const { isSignedIn } = useContext(AuthContext);
  const message = isSignedIn
    ? "Welcome, you're signed in"
    : 'Please sign in to start your recipe book.';
  return (
    <div className="home-container">
      <p>{message}</p>
      <GoogleSignOn />
      <div className="text-container">
        <div className="text-area">
          <h2>Your Recipe Book</h2>
          <p>
            The <strong>My Recipe Book</strong> tab is where you can see all of
            the recipes you have in your collection. When you first join, this
            section will be empty, but you can easily start building your
            collection by importing or creating recipes.
          </p>
          <p>
            On the <strong>My Recipe Book</strong> tab, you can search for
            recipes by name or ingredients, you can sort your library, or look
            for recipes with specific tags like
            <strong> Under 30 Minutes</strong> or <strong>Beef</strong>. By
            clicking the toggle in the top right of the page, you can view a
            minimal version of the recipe book without images.
          </p>
          <p>
            Clicking on a recipe lets you view the whole recipe. You can scale
            recipes (though the number of servings on the page will not change),
            and by clicking the toggle in the top right of the page, you can
            view an index card version of the recipe that is excellent for while
            you are cooking.
          </p>
        </div>
        <div className="text-area">
          <h2>Import Recipes</h2>
          <p>
            On the <strong>Import Recipe</strong> tab, you can import recipes
            from supported websites. A list of currently supported websites will
            be listed there. The importer will take the recipe URL and pre-load
            the create recipe form with as much data as possible, but you may
            have to fill in a few missing pieces, as well as add any tags that
            you feel describe the recipe.
          </p>
        </div>
        <div className="text-area">
          <h2>Create Your Own Recipe</h2>
          <p>
            On the <strong>Create a Recipe</strong> tab, you can fill out the
            form to create a new recipe. This recipe is owned by you, and only
            you can edit it. Fill out the required fields and submit. The recipe
            will then appear in your library.
          </p>
        </div>
      </div>
    </div>
  );
}
