import React from 'react';
import { useStore } from '../../../utils/hooks/useStore';

export function GoogleSignOn() {
    const theme = useStore((state) => state.darkMode) === true ? 'dark' : 'light';
    return <div className="g-signin2" data-theme={theme} />;
}
