import React from 'react';
import { Route } from 'react-router-dom';
import { useStore } from '../../../utils/hooks/useStore';
import { Redirect } from 'react-router-dom';

export default function ProtectedRoute({ component: Component, ...rest }) {
    const googleAuth = useStore((state) => state.googleAuth);

    return <Route {...rest} render={(props) => (googleAuth ? <Component {...props} /> : <Redirect to="/" />)} />;
}
