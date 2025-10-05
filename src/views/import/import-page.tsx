import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, TextInput } from '@mantine/core';

import { importRecipe } from '../../aws/importer';
import { useAuthContext } from '../../context/auth-context.tsx';
import { useRecipeContext } from '../../context/recipe-context.tsx';
import { supportedSites } from '../../data/supported-websites';
import { useDispatch } from '../../hooks/useStore';
import { setImportedRecipe } from '../../state/actions';

import './import-page.scss';

export default function ImportPage() {
  const [url, setUrl] = useState('');
  const [importError, setImportError] = useState(null);

  const { googleAuth } = useAuthContext();
  const { setShowLoading } = useRecipeContext();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleImportRecipe = async () => {
    setShowLoading(true);
    const recipe = await importRecipe(url, googleAuth);
    setShowLoading(false);
    if (recipe.error) {
      setImportError(recipe.msg);
    } else {
      dispatch(setImportedRecipe(recipe));
      navigate('/recipes/create');
    }
  };

  const importErrorContainer = importError ? <p>{importError}</p> : <></>;

  return (
    <div className="import-parent">
      <h2>Recipe Importer</h2>
      <TextInput
        placeholder="https://www.seriouseats.com/recipes/2020/07/lamb-biryani.html"
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button content="Import" onClick={handleImportRecipe}>
        Import
      </Button>
      {importErrorContainer}
      <div className="supported-sites">
        <h2>Supported Sites</h2>
        <div>
          <p>List of websites currently supported* by the importer.</p>
          <ul>
            {supportedSites.sort().map((site) => (
              <li key={site}>{site}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
