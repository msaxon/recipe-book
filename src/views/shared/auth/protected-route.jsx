import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStore } from '../../../utils/hooks/useStore';

export default function ProtectedRoute({ component: Component, ...rest }) {
    const [redirect, setRedirect] = useState(null);
    const googleAuth = useStore(state => state.googleAuth);

    useEffect(() => {
        if (googleAuth) {
            setRedirect(false);
        }
    }, [googleAuth]);

    if (redirect === false) {
        return <Route {...rest} render={props => <Component {...props} />} />;
    } else if (redirect === true) {
        return <Route {...rest} render={props => <Redirect to="/" />} />;
    } else {
        return null;
    }
}
