import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
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
  exp: number; // Expiration time
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

const getStoredAuth = () => {
  const token = localStorage.getItem('googleAuth');
  const id = localStorage.getItem('googleId');
  if (token && id) {
    try {
      const decoded = jwtDecode<GoogleJwtPayload>(token);
      // exp is in seconds, Date.now() is in ms
      if (decoded.exp * 1000 > Date.now()) {
        return { token, id, isSignedIn: true };
      }
    } catch (e) {
      console.error('Invalid token', e);
    }
  }
  return { token: '', id: '', isSignedIn: false };
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [initialAuth] = useState(getStoredAuth);

  const [googleId, setGoogleId] = useState(initialAuth.id);
  const [googleAuth, setGoogleAuth] = useState(initialAuth.token);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(initialAuth.isSignedIn);
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

  useEffect(() => {
    if (isSignedIn && googleAuth) {
      try {
        const decodedToken = jwtDecode<GoogleJwtPayload>(googleAuth);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log('Token expired, logging out');
          setGoogleId('');
          setGoogleAuth('');
          setIsSignedIn(false);
          localStorage.removeItem('googleId');
          localStorage.removeItem('googleAuth');
        }
      } catch (error) {
        console.error('Invalid token', error);
        setGoogleId('');
        setGoogleAuth('');
        setIsSignedIn(false);
        localStorage.removeItem('googleId');
        localStorage.removeItem('googleAuth');
      }
    }
  }, [isSignedIn, googleAuth]);

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
