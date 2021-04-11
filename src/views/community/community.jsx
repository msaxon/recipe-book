import React, {useEffect } from 'react';
import { useStore } from '../../utils/hooks/useStore';
import { getAllUsers } from '../../importer/persistance';

export default function Community() {
    const { googleAuth, googleId } = useStore();

    /**
     *  Grab all recipes/some subset of random recipes
     *      Hit db
     *      Filter out Recipes already in your book
     *  Show them all using recipeBookCards
     * 
     *  Considerations
     *      Store "community" recipes in state somewhere else
     *      Maybe have to rename
     */

    useEffect(() => {
        async function getUsers() {
            const response = await getAllUsers(googleAuth);
            console.log('response', response);
        }

        getUsers();

    }, [googleAuth, googleId])

    return (
        <div>
            <h2>Community Recipes</h2>
            <p>Coming soon... maybe</p>
        </div>
    );
}