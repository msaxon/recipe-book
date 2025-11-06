import { useState } from 'react';

import { Flex } from '@mantine/core';
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';

import { useAuthContext } from '../../../context/auth-context.tsx';

import './auth.scss';

export function GoogleSignOn() {
  const { isSignedIn, signIn } = useAuthContext();
  const [noSession, setNoSession] = useState<boolean>(false);

  useGoogleOneTapLogin({
    auto_select: true,
    onSuccess: (response) => {
      console.log('success', response);
      signIn(response);
    },
    onError: () => {
      console.error('One Tap login failed');
    },
    promptMomentNotification: (notification) => {
      console.log('One Tap prompt status:', notification);

      if (notification.getNotDisplayedReason() === 'opt_out_or_no_session') {
        setNoSession(true);
      }
    },
  });

  console.log('state', isSignedIn, noSession);

  return (
    <div>
      {isSignedIn && <p>You are logged in</p>}
      {!isSignedIn && !noSession && <p>Waiting for One Tap</p>}
      {!isSignedIn && noSession && (
        <Flex direction="column" gap="md" align="center" pt="lg">
          <GoogleLogin
            onSuccess={(credentialResponse) => signIn(credentialResponse)}
            onError={() => console.log('Login failed')}
          />
        </Flex>
      )}
    </div>
  );
}
