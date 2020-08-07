import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div>
            <h2>Basic Idea</h2>
            <p>
                The basic idea of this app is to store recipes in books. Recipes are not private amongst users, but you
                do need an account to save a recipe. Log in with google should be safe. The recipes are tied to your
                google account id. You are also able to import recipes from some sites. Currently the list of supported
                sites can be found on the <Link to="/recipe/import">import</Link> page.
            </p>
        </div>
    );
}
