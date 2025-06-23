import { type PropsWithChildren, useEffect } from 'react';

import { useAuthContext } from '../../../context/auth-context.tsx';
import { GoogleSignOn } from './google-sign-on';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { googleAuth, redirectUrl, setRedirectUrl } = useAuthContext();

  useEffect(() => {
    if (!redirectUrl) {
      setRedirectUrl(window.location.href);
    }
  }, [redirectUrl, setRedirectUrl]);

  if (googleAuth) {
    return <>{children}</>;
  } else {
    return <GoogleSignOn />;
  }
}
