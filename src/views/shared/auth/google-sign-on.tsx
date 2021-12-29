import React from 'react';
import {GoogleLoginResponse, GoogleLoginResponseOffline, useGoogleLogin} from 'react-google-login';
import { Button } from 'semantic-ui-react';
import { useStore, useDispatch } from '../../../utils/hooks/useStore';
import { signInGoogleAuth} from '../../../state/actions';
import { clientId } from '../../../utils/constants';
import './auth.scss';

export function GoogleSignOn() {
    const { redirectUrl } = useStore();
    const dispatch = useDispatch();

    const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log('meow');
        const response: GoogleLoginResponse = res as GoogleLoginResponse;
        // @ts-ignore
        dispatch(signInGoogleAuth(response.googleId, response.tokenId));
    }

    const onFailure = (res: any) => {
        console.log('res', res);
        console.log('user is not logged in');
    }

    const { signIn } = useGoogleLogin({
        onSuccess,
        onFailure,
        clientId,
        isSignedIn: true,
        accessType: 'online',
        redirectUri: redirectUrl ? redirectUrl : undefined
    });

    return (
        <Button color="grey" onClick={signIn}>
            Login With Google
        </Button>
    );
}
