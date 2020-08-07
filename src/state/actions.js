import { SET_DARK_MODE, SIGN_IN_GOOGLE_AUTH, SIGN_OUT_GOOGLE_AUTH } from './action-types';

export const setDarkMode = (darkMode) => {
    return {
        type: SET_DARK_MODE,
        payload: darkMode,
    };
};

export const signInGoogleAuth = (googleId, googleAuth) => {
    return {
        type: SIGN_IN_GOOGLE_AUTH,
        payload: { googleAuth, googleId },
    };
};

export const signOutGoogleAuth = () => {
    return {
        type: SIGN_OUT_GOOGLE_AUTH,
    };
};
