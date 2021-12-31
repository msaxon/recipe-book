import {Dispatch, ReactElement} from "react";
import {Recipe} from "../models/interfaces";

export interface IStore {
    darkMode: boolean;
    isSignedIn: boolean;
    googleAuth: string;
    googleId: string;
    isLoaderActive: boolean;
    recipeViewMode: string;
    recipeBookViewMode: string;
    recipes: Recipe[];
    userRecipeIds?: string[];
    redirectUrl?: string;
    importedRecipe?: Recipe;
    recipeUserId: string;
}

export interface IAction {
    type: string;
    payload: any;
}

export interface IStoreProviderProps {
    children: ReactElement;
}

export interface IStoreValue {
    state: IStore;
    dispatch: Dispatch<any>;
}