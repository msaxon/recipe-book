import React, { useState } from 'react';
import { importRecipe } from '../../importer/importer';
// import { putNewRecipe, getAllUserRecipes } from '../../importer/persistance';
// import { recipes } from '../../data/recipes';
// import { useStore } from '../../utils/hooks/useStore';

export default function () {
    const [url, setUrl] = useState('');
    // const googleAuth = useStore((state) => state.googleAuth);

    return (
        <>
            <input onChange={(e) => setUrl(e.target.value)} />
            <button onClick={() => importRecipe(url)}>Import currently broken</button>
        </>
    );
}
