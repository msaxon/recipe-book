import React, {
    useReducer
} from 'react';
import {
    SET_DARK_MODE,
    SIGN_IN_GOOGLE_AUTH,
    SIGN_OUT_GOOGLE_AUTH,
    SET_IMPORTED_RECIPE,
    REMOVE_IMPORTED_RECIPE,
    ENABLE_LOADER,
    DISABLE_LOADER,
    SET_RECIPE_VIEW_MODE
} from './action-types';

export const Store = React.createContext();

const initialState = {
    darkMode: false,
    isSignedIn: null,
    googleAuth: null,
    isLoaderActive: false,
    recipeViewMode: "default"
};

const reducer = (state, action) => {
    switch (action.type) {
        case SET_DARK_MODE:
            return {
                ...state, darkMode: action.payload
            };
        case SIGN_IN_GOOGLE_AUTH:
            return {
                ...state,
                googleId: action.payload.googleId,
                    googleAuth: action.payload.googleAuth,
                    isSignedIn: true,
            };
        case SIGN_OUT_GOOGLE_AUTH:
            return {
                ...state, googleAuth: null, googleId: null, isSignedIn: false
            };
        case SET_IMPORTED_RECIPE:
            return {
                ...state, importedRecipe: action.payload
            };
        case REMOVE_IMPORTED_RECIPE:
            return {
                ...state, importedRecipe: null
            };
        case ENABLE_LOADER:
            return {
                ...state, isLoaderActive: true
            };
        case DISABLE_LOADER:
            return {
                ...state, isLoaderActive: false
            };
        case SET_RECIPE_VIEW_MODE:
            return {
                ...state, recipeViewMode: action.payload
            }
            default:
                return state;
    }
};


export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {
        state,
        dispatch
    };

    // prettier-ignore
    return <Store.Provider value = {
        value
    } > {
        props.children
    } < /Store.Provider>;
}