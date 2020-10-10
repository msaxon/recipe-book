import React, {
    useEffect
} from 'react';
import {
    HashRouter,
    Route
} from 'react-router-dom';
import {
    gapi
} from 'gapi-script';

import {
    Home
} from './views/home/home-route';
import {
    HeaderMenu
} from './views/shared/menu/header-menu';
import {
    Privacy
} from './views/privacy/privacy';
import Footer from './views/shared/footer/footer';
import RecipeBook from './views/recipe/recipe-book-page';
import RecipeDetailPage from './views/detail/recipe-detail-page';
import ImportPage from './views/import/import-page';
import AboutPage from './views/about/about-page';
import CreateRecipePage from './views/create/create-recipe-page';
import ProtectedRoute from './views/shared/auth/protected-route';
import {
    useDispatch,
    useStore
} from './utils/hooks/useStore';
import {
    signInGoogleAuth
} from './state/actions';

import './App.scss';
import AsyncLoader from './views/shared/interstitial/async-loader';
import RecipeDetailIndexCard from './views/detail/recipe-detail-index-card';
import RecipeDetailPageContainer from './views/detail/recipe-detail-page-container';

const App = () => {
    const isLoaderActive = useStore(state => state.isLoaderActive);
    const dispatch = useDispatch();

    useEffect(() => {
        const params = {
            clientId: '238655587100-654a8ufkm69v4m667g23ftfu9ec0shc9.apps.googleusercontent.com',
            scope: 'profile email'
        };

        gapi.load('client:auth2', () => {
            window.gapi.auth2
                .init(params)
                .then(() => {
                    const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
                    dispatch(signInGoogleAuth(googleUser.getId(), googleUser.getAuthResponse(true).id_token));
                })
                .catch(e => {
                    console.log('error: user is not logged in');
                });
        });
    }, [dispatch]);

    let routes = ( <
        div className = "app" >
        <
        Route path = "/"
        exact component = {
            Home
        }
        /> <
        ProtectedRoute path = "/recipes"
        exact component = {
            RecipeBook
        }
        /> <
        ProtectedRoute path = "/recipes/import"
        component = {
            ImportPage
        }
        /> <
        ProtectedRoute path = "/recipes/details"
        component = {
            RecipeDetailPageContainer
        }
        /> <
        ProtectedRoute path = "/recipes/create"
        component = {
            CreateRecipePage
        }
        /> <
        ProtectedRoute path = "/recipes/edit"
        component = {
            CreateRecipePage
        }
        /> <
        Route path = "/privacy"
        component = {
            Privacy
        }
        /> <
        Route path = "/about"
        component = {
            AboutPage
        }
        /> < /
        div >
    );

    if (isLoaderActive) {
        routes = ( <
            div className = "app" >
            <
            AsyncLoader size = {
                50
            }
            /> < /
            div >
        );
    }

    return ( <
        HashRouter >
        <
        div className = "app-wrapper" >
        <
        HeaderMenu / > {
            routes
        } <
        Footer / >
        <
        /div> < /
        HashRouter >
    );
};

export default App;