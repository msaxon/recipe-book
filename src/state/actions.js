import {
    SET_DARK_MODE,
    SIGN_IN_GOOGLE_AUTH,
    SIGN_OUT_GOOGLE_AUTH,
    SET_IMPORTED_RECIPE,
    REMOVE_IMPORTED_RECIPE,
    ENABLE_LOADER,
    DISABLE_LOADER,
    SET_RECIPE_VIEW_MODE,
    SET_RECIPE_BOOK_VIEW_MODE,
    SET_RECIPES,
    SET_USER_RECIPE_IDS,
    SET_REDIRECT_URL,
    UNSET_REDIRECT_URL
} from './action-types';

export const setDarkMode = (darkMode) => {
    return {
        type: SET_DARK_MODE,
        payload: darkMode,
    };
};

export const signInGoogleAuth = (googleId, googleAuth) => {
    return {
        type: SIGN_IN_GOOGLE_AUTH,
        payload: {
            googleAuth,
            googleId
        },
    };
};

export const signOutGoogleAuth = () => {
    return {
        type: SIGN_OUT_GOOGLE_AUTH,
    };
};

export const setImportedRecipe = (recipe) => {
    return {
        type: SET_IMPORTED_RECIPE,
        payload: recipe,
    };
};

export const removeImportedRecipe = () => {
    return {
        type: REMOVE_IMPORTED_RECIPE,
    };
};

export const enableLoader = () => {
    return {
        type: ENABLE_LOADER
    };
};

export const disableLoader = () => {
    return {
        type: DISABLE_LOADER
    };
};

export const setRecipeViewMode = (mode) => {
    return {
        type: SET_RECIPE_VIEW_MODE,
        payload: mode
    };
};

export const setRecipeBookViewMode = (mode) => {
    return {
        type: SET_RECIPE_BOOK_VIEW_MODE,
        payload: mode
    };
};

export const setRecipes = (recipes, userId) => {
    return {
        type: SET_RECIPES,
        payload: {
            recipes: recipes,
            userId: userId
        }
    };
};

export const setUserRecipeIds = (recipeIds) => {
    return {
        type: SET_USER_RECIPE_IDS,
        payload: recipeIds
    };
};

export const setRedirectUrl = (url) => {
    return {
        type: SET_REDIRECT_URL,
        payload: url
    };
};

export const unSetRedirectUrl = () => {
    return {
        type: UNSET_REDIRECT_URL
    };
};