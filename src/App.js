import React, { useEffect } from 'react';
import {HashRouter, Route} from 'react-router-dom';
import {gapi} from 'gapi-script';
import { Home} from './views/home/home-route';
import {HeaderMenu} from './views/shared/menu/header-menu';
import {Privacy} from './views/privacy/privacy';
import Footer from './views/shared/footer/footer';
import ImportPage from './views/import/import-page';
import AboutPage from './views/about/about-page';
import CreateRecipePage from './views/create/create-recipe-page';
import ProtectedRoute from './views/shared/auth/protected-route';
import {useDispatch,useStore} from './utils/hooks/useStore';
import { signInGoogleAuth} from './state/actions';
import './App.scss';
import AsyncLoader from './views/shared/interstitial/async-loader';
import RecipeDetailPageContainer from './views/detail/recipe-detail-page-container';
import RecipeBookContainer from './views/recipe/recipe-book-container';

const App = () => {
    const isLoaderActive = useStore(state => state.isLoaderActive);
    const dispatch = useDispatch();

    useEffect(() => {
        const params = {
            clientId: '238655587100-654a8ufkm69v4m667g23ftfu9ec0shc9.apps.googleusercontent.com',
            scope: 'profile email',
            ux_mode: 'redirect'
        };

        gapi.load('client:auth2', async () => {
            const auth = await window.gapi.auth2.getAuthInstance(params);
            if(auth && auth.currentUser && auth.currentUser.get() && auth.currentUser.get().getAuthResponse(true)) {
                const token = auth.currentUser.get().getAuthResponse(true).id_token;
                dispatch(signInGoogleAuth(token));
            } else {
                console.log('user is not signed in');
            }            
        });
    }, [dispatch]);


    let routes = ( 
        <div className = "app" >
            <Route path = "/" exact component = {Home} /> 
            <ProtectedRoute path = "/recipes" exact component = { RecipeBookContainer}/> 
            <ProtectedRoute path = "/recipes/import" component = {ImportPage}/> 
            <ProtectedRoute path = "/recipes/details" component = {RecipeDetailPageContainer}/> 
            <ProtectedRoute path = "/recipes/create" component = {CreateRecipePage}/> 
            <ProtectedRoute path = "/recipes/edit" component = {CreateRecipePage}/> 
            <Route path = "/privacy" component = {Privacy}/> 
            <Route path = "/about" component = { AboutPage} /> 
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