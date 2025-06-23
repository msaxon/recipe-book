import { useGoogleOneTapLogin } from '@react-oauth/google';

import { useAuthContext } from '../../../context/auth-context.tsx';

import './auth.scss';

export function GoogleSignOn() {
  const { isSignedIn, signIn } = useAuthContext();

  useGoogleOneTapLogin({
    auto_select: true,
    onSuccess: (response) => {
      signIn(response);
    },
    onError: () => {
      console.error('One Tap login failed');
    },
    promptMomentNotification: (notification) => {
      console.log('One Tap prompt status:', notification);
    },
  });

  return (
    <div>
      {isSignedIn ? <p>You are logged in</p> : <p>Waiting for One Tap</p>}
    </div>
  );
}
