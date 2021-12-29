import React from 'react';
import { setRedirectUrl } from '../../../state/actions';
import { useStore, useDispatch } from '../../../utils/hooks/useStore';
import { GoogleSignOn } from './google-sign-on';

export default function ProtectedRoute({ children }) {
    const { redirectUrl, googleAuth } = useStore();
    const dispatch = useDispatch();

    if (googleAuth) {
        return <>{children}</>;
    } else {
        if(!redirectUrl) {
            dispatch(setRedirectUrl(window.location.href));
        } 
        
        return <GoogleSignOn />;
    }
}
