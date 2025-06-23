import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import type {
  RecipeBookViewMode,
  RecipeViewMode,
} from '../models/interfaces.ts';

interface RecipeContextProps {
  recipeViewMode: RecipeViewMode;
  recipeBookViewMode: RecipeBookViewMode;
  showLoading: boolean;
  setRecipeViewMode: (m: RecipeViewMode) => void;
  setRecipeBookViewMode: (m: RecipeBookViewMode) => void;
  setShowLoading: (m: boolean) => void;
}

export const RecipeContext = createContext<RecipeContextProps>({
  recipeViewMode: 'default',
  recipeBookViewMode: 'default',
  showLoading: false,
  setRecipeViewMode: () => {},
  setRecipeBookViewMode: () => {},
  setShowLoading: () => {},
});

interface IProps {
  showLoading: boolean;
  setShowLoading: Dispatch<SetStateAction<boolean>>;
}

export const RecipeContextProvider = ({
  showLoading,
  setShowLoading,
  children,
}: PropsWithChildren<IProps>) => {
  const [recipeViewMode, setRecipeViewMode] =
    useState<RecipeViewMode>('default');
  const [recipeBookViewMode, setRecipeBookViewMode] =
    useState<RecipeBookViewMode>('default');

  return (
    <RecipeContext.Provider
      value={{
        recipeViewMode,
        recipeBookViewMode,
        showLoading,
        setRecipeViewMode,
        setRecipeBookViewMode,
        setShowLoading,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => useContext(RecipeContext);
