import {
    SET_DARK_MODE,
    SIGN_IN_GOOGLE_AUTH,
    SIGN_OUT_GOOGLE_AUTH,
    SET_IMPORTED_RECIPE,
    REMOVE_IMPORTED_RECIPE,
    ENABLE_LOADER,
    DISABLE_LOADER
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