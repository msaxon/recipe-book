import React from 'react';
import { useStore } from '../../utils/hooks/useStore';
import './home-route.scss';

export function Home() {
    const isUserSignedIn = useStore((state) => state.isSignedIn);
    const message = isUserSignedIn ? 'Welcome, youre signed in' : 'Please sign in to start your recipe book.';
    return (
        <div>
            <p>{message}</p>
        </div>
    );
}
