import React from 'react';
import { setRedirectUrl } from '../../../state/actions';
import { useStore, useDispatch } from '../../../utils/hooks/useStore';
import { GoogleSignOn } from './google-sign-on';

interface IProps {
    children: JSX.Element;
}

export default function ProtectedRoute({ children }: IProps) {
    const { redirectUrl, googleAuth } = useStore();
    const dispatch = useDispatch();

    if (googleAuth) {
        return <>{children}</>;
    } else {
        if(!redirectUrl) {
            // @ts-ignore
            dispatch(setRedirectUrl(window.location.href));
        } 
        
        return <GoogleSignOn />;
    }
}
