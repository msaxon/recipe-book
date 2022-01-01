import React, { createContext, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
} from 'react-google-login';
import { Home } from './views/home/home-route';
import { HeaderMenu } from './views/shared/menu/header-menu';
import { Privacy } from './views/privacy/privacy';
import Footer from './views/shared/footer/footer';
import ImportPage from './views/import/import-page';
import AboutPage from './views/about/about-page';
import CreateRecipePage from './views/create/create-recipe-page';
import ProtectedRoute from './views/shared/auth/protected-route';
import RecipeDetailPageContainer from './views/detail/recipe-detail-page-container';
import RecipeBookContainer from './views/recipe/recipe-book-container';
import Contact from './views/contact/contact';
import CommunityPage from './views/community/community';
import { clientId } from './utils/constants';
import './App.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RecipeBookViewMode, RecipeViewMode } from './models/interfaces';

interface AuthProps {
  googleId: string;
  googleAuth: string;
  isSignedIn: boolean;
  redirectUrl: string | undefined;
  signIn: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  setRedirectUrl: (url: string | undefined) => void;
}

interface RecipeContextProps {
  recipeViewMode: RecipeViewMode;
  recipeBookViewMode: RecipeBookViewMode;
  setRecipeViewMode: (m: RecipeViewMode) => void;
  setRecipeBookViewMode: (m: RecipeBookViewMode) => void;
}

export const RecipeContext = createContext<RecipeContextProps>({
  recipeViewMode: 'default',
  recipeBookViewMode: 'default',
  setRecipeViewMode: () => {},
  setRecipeBookViewMode: () => {},
});

export const AuthContext = createContext<AuthProps>({
  googleAuth: '',
  googleId: '',
  isSignedIn: false,
  redirectUrl: undefined,
  signIn: (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {},
  setRedirectUrl: () => {},
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function App() {
  const [googleId, setGoogleId] = useState('');
  const [googleAuth, setGoogleAuth] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);
  const [recipeViewMode, setRecipeViewMode] =
    useState<RecipeViewMode>('default');
  const [recipeBookViewMode, setRecipeBookViewMode] =
    useState<RecipeBookViewMode>('default');

  const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const response: GoogleLoginResponse = res as GoogleLoginResponse;
    setGoogleId(response.googleId);
    setGoogleAuth(response.tokenId);
    setIsSignedIn(true);
  };

  const onFailure = () => {
    console.log('user is not logged in');
    setIsSignedIn(false);
  };

  useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: 'online',
  });

  let routes = (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <RecipeBookContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/import"
          element={
            <ProtectedRoute>
              <ImportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/details"
          element={
            <ProtectedRoute>
              <RecipeDetailPageContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/create"
          element={
            <ProtectedRoute>
              <CreateRecipePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/edit"
          element={
            <ProtectedRoute>
              <CreateRecipePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/community"
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );

  return (
    <HashRouter>
      <AuthContext.Provider
        value={{
          googleAuth,
          googleId,
          isSignedIn,
          redirectUrl,
          signIn: onSuccess,
          setRedirectUrl,
        }}
      >
        <RecipeContext.Provider
          value={{
            recipeViewMode,
            recipeBookViewMode,
            setRecipeViewMode,
            setRecipeBookViewMode,
          }}
        >
          <QueryClientProvider client={queryClient}>
            <div className="app-wrapper">
              <HeaderMenu />
              {routes}
              <Footer />
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </RecipeContext.Provider>
      </AuthContext.Provider>
    </HashRouter>
  );
}
