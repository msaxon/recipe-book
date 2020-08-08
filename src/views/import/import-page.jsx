import React, { useState } from 'react';
import { Input, Button } from 'semantic-ui-react';
import { importRecipe } from '../../importer/importer';
import { supportedSites } from '../../data/supported-websites';
import { useStore } from '../../utils/hooks/useStore';
import './import-page.scss';

export default function () {
    const [url, setUrl] = useState('');
    const googleAuth = useStore((state) => state.googleAuth);

    return (
        <div className="import-parent">
            <h2>Recipe Importer</h2>
            <Input
                fluid
                action={<Button content="Import" onClick={() => importRecipe(url, googleAuth)} />}
                placeholder="https://www.seriouseats.com/recipes/2020/07/lamb-biryani.html"
                onChange={(e) => setUrl(e.target.value)}
            />
            <div className="supported-sites">
                <h2>Supported Sites</h2>
                <div>
                    <p>List of websites currently supported* by the importer.</p>
                    <ul>
                        {supportedSites.map((site) => (
                            <li>{site}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
