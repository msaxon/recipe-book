import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import { useGoogleLogin } from 'react-google-login';
import { Home} from './views/home/home-route';
import {HeaderMenu} from './views/shared/menu/header-menu';
import {Privacy} from './views/privacy/privacy';
import Footer from './views/shared/footer/footer';
import ImportPage from './views/import/import-page';
import AboutPage from './views/about/about-page';
import CreateRecipePage from './views/create/create-recipe-page';
import ProtectedRoute from './views/shared/auth/protected-route';
import AsyncLoader from './views/shared/interstitial/async-loader';
import RecipeDetailPageContainer from './views/detail/recipe-detail-page-container';
import RecipeBookContainer from './views/recipe/recipe-book-container';
import Contact from './views/contact/contact';
import CommunityPage from './views/community/community';
import {useStore, useDispatch} from './utils/hooks/useStore';
import { signInGoogleAuth } from './state/actions';
import { clientId } from './utils/constants';
import './App.scss';

const App = () => {

    //TODO, no copy pasta
    const dispatch = useDispatch();
    
    const onSuccess = (res) => {
        console.log('success!');
        dispatch(signInGoogleAuth(res.googleId, res.tokenId));
    }

    const onFailure = (res) => {
        console.log('user is not logged in');
    }

    useGoogleLogin({
        onSuccess,
        onFailure,
        clientId,
        isSignedIn: true,
        accessType: 'online'
    });

    const isLoaderActive = useStore(state => state.isLoaderActive);

    let routes = ( 
        <div className = "app" >
            <Route path = "/" exact component = {Home} /> 
            <ProtectedRoute path = "/recipes" exact component = { RecipeBookContainer}/> 
            <ProtectedRoute path = "/recipes/import" component = {ImportPage}/> 
            <ProtectedRoute path = "/recipes/details" component = {RecipeDetailPageContainer}/> 
            <ProtectedRoute path = "/recipes/create" component = {CreateRecipePage}/> 
            <ProtectedRoute path = "/recipes/edit" component = {CreateRecipePage}/> 
            <ProtectedRoute path = "/recipes/community" component = {CommunityPage} />
            <Route path = "/privacy" component = {Privacy}/> 
            <Route path = "/about" component = { AboutPage} /> 
            <Route path = "/contact" component = {Contact} />
        </div>
    );

    if (isLoaderActive) {
        routes = ( 
            <div className = "app" >
                <AsyncLoader size = {50}/> 
            </div>
        );
    }

    return ( 
        <HashRouter>
            <div className = "app-wrapper">
                <HeaderMenu /> 
                {routes} 
                <Footer / >
            </div> 
        </HashRouter>
    );
};

export default App;