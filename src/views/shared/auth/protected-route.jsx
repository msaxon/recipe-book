import React from 'react';
import { Route } from 'react-router-dom';
import { setRedirectUrl } from '../../../state/actions';
import { useStore, useDispatch } from '../../../utils/hooks/useStore';
import { GoogleSignOn } from './google-sign-on';

export default function ProtectedRoute({ component: Component, ...rest }) {
    const { redirectUrl, googleAuth } = useStore();

    const dispatch = useDispatch();

    if (googleAuth) {
        return <Route {...rest} render={props => <Component {...props} />} />;
    } else {
        if(!redirectUrl) {
            dispatch(setRedirectUrl(window.location.href));
        } 
        
        return <Route {...rest} render={props => <GoogleSignOn />} />;
    }
}
