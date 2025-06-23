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
  setRedirectUrl: (url: string | undefined) => void;
}

export const AuthContext = createContext<AuthProps>({
  googleAuth: '',
  googleId: '',
  isSignedIn: false,
  redirectUrl: undefined,
  signIn: () => {},
  setRedirectUrl: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [googleId, setGoogleId] = useState('');
  const [googleAuth, setGoogleAuth] = useState('');
  const [isSignedIn, setIsSignedIn] = useState<boolean>(
    !!googleAuth && !!googleId
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
        setRedirectUrl,
      }}
    >
      <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
