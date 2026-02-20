import { useState } from 'react';

import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { LoadingOverlay } from '@mantine/core';

import { AuthProvider } from './context/auth-context.tsx';
import { RecipeContextProvider } from './context/recipe-context.tsx';
import { queryClient } from './state/query-client.ts';
import AboutPage from './views/about/about-page.tsx';
import Community from './views/community/community.tsx';
import Contact from './views/contact/contact.tsx';
import CreateRecipePage from './views/create/create-recipe-page.tsx';
import RecipeDetailPageContainer from './views/detail/recipe-detail-page-container.tsx';
import { Home } from './views/home/home-route.tsx';
import ImportPage from './views/import/import-page.tsx';
import { Privacy } from './views/privacy/privacy.tsx';
import RecipeBookContainer from './views/recipe/recipe-book-container.tsx';
import ProtectedRoute from './views/shared/auth/protected-route.tsx';
import Footer from './views/shared/footer/footer.tsx';
import { HeaderMenu } from './views/shared/menu/header-menu.tsx';

import './App.scss';


function App() {
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const routes = (
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
              <Community />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );

  console.log('showLoading', showLoading);

  return (
    <AuthProvider>
      <RecipeContextProvider
        showLoading={showLoading}
        setShowLoading={setShowLoading}
      >
        <HashRouter>
          <QueryClientProvider client={queryClient}>
            <div className="app-wrapper">
              <LoadingOverlay
                visible={showLoading}
                loaderProps={{ children: 'Loading...' }}
              />
              <HeaderMenu />
              {routes}
              <Footer />
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </HashRouter>
      </RecipeContextProvider>
    </AuthProvider>
  );
}

export default App;
