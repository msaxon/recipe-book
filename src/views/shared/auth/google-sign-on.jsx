import React from 'react';
import { useGoogleLogin } from 'react-google-login';
import { Button } from 'semantic-ui-react';
import { useDispatch } from '../../../utils/hooks/useStore';
import { signInGoogleAuth} from '../../../state/actions';
import './auth.scss';

const clientId = '238655587100-654a8ufkm69v4m667g23ftfu9ec0shc9.apps.googleusercontent.com';

export function GoogleSignOn() {
    const dispatch = useDispatch();
    
    const onSuccess = (res) => {
        dispatch(signInGoogleAuth(res.googleId, res.tokenId));
    }

    const onFailure = (res) => {
        console.log('user is not logged in');
    }

    const { signIn } = useGoogleLogin({
        onSuccess,
        onFailure,
        clientId,
        isSignedIn: true,
        accessType: 'online'
    });

    return (
        <Button color="grey" onClick={signIn}>
            Login With Google
        </Button>
    );
}
