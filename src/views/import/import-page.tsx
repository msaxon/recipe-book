import React, { useContext, useState } from 'react';
import PromiseLoadingSpinner from 'promise-loading-spinner';
import { Input, Button } from 'semantic-ui-react';
import { importRecipe } from '../../aws/importer';
import { supportedSites } from '../../data/supported-websites';
import { setImportedRecipe } from '../../state/actions';
import './import-page.scss';
import { useNavigate } from 'react-router-dom';
import { AuthContext, RecipeContext } from '../../App';
import { useDispatch } from '../../utils/hooks/useStore';

export default function ImportPage() {
  const [url, setUrl] = useState('');
  const [importError, setImportError] = useState(null);
  const { googleAuth } = useContext(AuthContext);
  const { setShowLoading } = useContext(RecipeContext);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loader = new PromiseLoadingSpinner();

  const handleImportRecipe = loader.wrapFunction(async () => {
    setShowLoading('Importing Recipe');
    const recipe = await importRecipe(url, googleAuth);
    setShowLoading(null);
    if (recipe.error) {
      setImportError(recipe.msg);
    } else {
      dispatch(setImportedRecipe(recipe));
      navigate('/recipes/create');
    }
  });

  const importErrorContainer = importError ? <p>{importError}</p> : <></>;

  return (
    <div className="import-parent">
      <h2>Recipe Importer</h2>
      <Input
        fluid
        action={<Button content="Import" onClick={handleImportRecipe} />}
        placeholder="https://www.seriouseats.com/recipes/2020/07/lamb-biryani.html"
        onChange={(e) => setUrl(e.target.value)}
      />
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
