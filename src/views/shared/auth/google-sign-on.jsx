import React from 'react';
import { useGoogleLogin } from 'react-google-login';
import { Button } from 'semantic-ui-react';
import { useDispatch } from '../../../utils/hooks/useStore';
import { signInGoogleAuth} from '../../../state/actions';
import { clientId } from '../../../utils/constants';
import './auth.scss';

export function GoogleSignOn() {
    const dispatch = useDispatch();
    
    const onSuccess = (res) => {
        console.log('success!');
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
