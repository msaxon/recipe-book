import React, { useState } from 'react';
import PromiseLoadingSpinner from 'promise-loading-spinner';
import { Input, Button } from 'semantic-ui-react';
import { importRecipe } from '../../importer/importer';
import { supportedSites } from '../../data/supported-websites';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import { disableLoader, enableLoader, setImportedRecipe } from '../../state/actions';
import './import-page.scss';

export default function (props) {
    const [url, setUrl] = useState('');
    const [importError, setImportError] = useState(null);
    const googleAuth = useStore(state => state.googleAuth);
    const dispatch = useDispatch();

    const loader = new PromiseLoadingSpinner();

    const handleImportRecipe = loader.wrapFunction(async () => {
        dispatch(enableLoader());
        const recipe = await importRecipe(url, googleAuth);
        dispatch(disableLoader());
        if (recipe.error) {
            console.log('setting import error');
            setImportError(recipe.msg);
        } else {
            dispatch(setImportedRecipe(recipe));
            props.history.push('/recipes/create');
        }
    });

    console.log('importError', importError);

    const importErrorContainer = importError ? <p>{importError}</p> : <></>;

    return (
        <div className="import-parent">
            <h2>Recipe Importer</h2>
            <Input
                fluid
                action={<Button content="Import" onClick={handleImportRecipe} />}
                placeholder="https://www.seriouseats.com/recipes/2020/07/lamb-biryani.html"
                onChange={e => setUrl(e.target.value)}
            />
            {importErrorContainer}
            <div className="supported-sites">
                <h2>Supported Sites</h2>
                <div>
                    <p>List of websites currently supported* by the importer.</p>
                    <ul>
                        {supportedSites.map(site => (
                            <li>{site}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
