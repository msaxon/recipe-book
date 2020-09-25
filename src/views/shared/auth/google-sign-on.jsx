import React from 'react';
import { useStore } from '../../../utils/hooks/useStore';
import './auth.scss';

export function GoogleSignOn() {
    const theme = useStore(state => state.darkMode) === true ? 'dark' : 'light';
    return <div className="g-signin2 google-button" data-theme={theme} />;
}
