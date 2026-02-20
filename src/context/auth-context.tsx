import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

import {
  type CredentialResponse,
  GoogleOAuthProvider,
} from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import { clientId } from '../utils/constants.ts';

interface GoogleJwtPayload {
  sub: string; // Google user ID
}

interface AuthProps {
  googleId: string;
  googleAuth: string;
  isSignedIn: boolean;
  redirectUrl: string | undefined;
  signIn: (res: CredentialResponse) => void;
  signOut: () => void;
  setRedirectUrl: (url: string | undefined) => void;
}

export const AuthContext = createContext<AuthProps>({
  googleAuth: '',
  googleId: '',
  isSignedIn: false,
  redirectUrl: undefined,
  signIn: () => {},
  signOut: () => {},
  setRedirectUrl: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [googleId, setGoogleId] = useState(localStorage.getItem('googleId') || '');
  const [googleAuth, setGoogleAuth] = useState(localStorage.getItem('googleAuth') || '');
  const [isSignedIn, setIsSignedIn] = useState<boolean>(
    !!(localStorage.getItem('googleAuth') || googleAuth) && !!(localStorage.getItem('googleId') || googleId)
  );
  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);

  const onSuccess = (res: CredentialResponse) => {
    console.log('on success', res);
    if (!res.credential) {
      return onFailure();
    }

    const decodedToken = jwtDecode<GoogleJwtPayload>(res.credential);
    setGoogleId(decodedToken.sub);
    setGoogleAuth(res.credential);
    setIsSignedIn(true);

    localStorage.setItem('googleId', decodedToken.sub);
    localStorage.setItem('googleAuth', res.credential);
  };

  const onLogout = () => {
    setGoogleId('');
    setGoogleAuth('');
    setIsSignedIn(false);
    localStorage.removeItem('googleId');
    localStorage.removeItem('googleAuth');
  };

  const onFailure = () => {
    console.log('user is not logged in');
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        googleAuth: googleAuth ?? '',
        googleId: googleId ?? '',
        isSignedIn,
        redirectUrl,
        signIn: onSuccess,
        signOut: onLogout,
        setRedirectUrl,
      }}
    >
      <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
