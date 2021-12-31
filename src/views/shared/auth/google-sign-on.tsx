import React, { useContext } from 'react';
import { useGoogleLogin } from 'react-google-login';
import { Button } from 'semantic-ui-react';
import './auth.scss';
import { clientId } from '../../../utils/constants';
import { AuthContext } from '../../../App';

export function GoogleSignOn() {
  const { redirectUrl, signIn: onSuccess } = useContext(AuthContext);

  const onFailure = () => {
    console.log('user is not logged in');
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: 'online',
    redirectUri: redirectUrl,
  });

  return (
    <Button color="grey" onClick={signIn}>
      Login With Google
    </Button>
  );
}
