import React, { useContext, useEffect } from 'react';
import { GoogleSignOn } from './google-sign-on';
import { AuthContext } from '../../../App';

interface IProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: IProps) {
  const { googleAuth, redirectUrl, setRedirectUrl } = useContext(AuthContext);

  useEffect(() => {
    if (!redirectUrl) {
      setRedirectUrl(window.location.href);
    }
  }, [redirectUrl]);

  if (googleAuth) {
    return <>{children}</>;
  } else {
    return <GoogleSignOn />;
  }
}
