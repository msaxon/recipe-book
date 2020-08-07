import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Input } from 'semantic-ui-react';
import { Fraction } from 'fractional';
import qs from 'qs';
import { getSingleRecipe } from '../../importer/persistance';
import { convertMarkdownToHtml } from '../../utils/markdown-utils';
import { minutesToTime } from '../../utils/time-utils';
import { useStore } from '../../utils/hooks/useStore';
import './recipe-detail.scss';

export default function RecipeDetailPage(props) {
    const [scale, setScale] = useState(1);
    const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
    const [scaleModalInput, setScaleModalInput] = useState('');
    const [recipe, setRecipe] = useState(null);
    const googleAuth = useStore((state) => state.googleAuth);

    const recipeId = qs.parse(props.location.search, { ignoreQueryPrefix: true }).recipeId;

    useEffect(() => {
        async function getRecipe(recipeId, googleAuth) {
            //have a failure scenario here
            setRecipe(await getSingleRecipe(recipeId, googleAuth));
        }

        if (recipeId && googleAuth) {
            getRecipe(recipeId, googleAuth);
        } else {
            console.error('THERE NEEDS TO BE A RECIPE ID AND AUTH');
        }
    }, [recipeId, googleAuth]);

    if (recipe === null) {
        return <div>Loading...</div>;
    }

    let recipeIngredients = recipe.ingredients;

    if (scale !== 1) {
        let recipeIngredientsArr = recipe.ingredients.split('\n');
        recipeIngredientsArr = recipeIngredientsArr.map((i) => {
            const iArr = i.split(' ');
            if (!isNaN(iArr[0])) {
                iArr[0] = parseInt(iArr[0]) * scale;
                iArr[0] = new Fraction(iArr[0]).toString();
            } else if (iArr[0].match(/\d\/\d/gi)) {
                const decimalArr = iArr[0].split('/');
                const decimal = new Fraction(parseInt(decimalArr[0]), parseInt(decimalArr[1]));
                iArr[0] = decimal.multiply(scale).toString();
            }

            return iArr.join(' ');
        });
        recipeIngredients = recipeIngredientsArr.join('\n');
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    const formatTextInput = (input) => {
        const formattedInput = input.target.value.replace(/[^\d.]/g, '');
        setScaleModalInput(formattedInput);
    };

    return (
        <div className="recipe-detail-wrapper container">
            <h2>{recipe.recipeName}</h2>
            <p>
                Author: {recipe.origin.authorName} /{' '}
                <a target="_blank" rel="noopener noreferrer" href={recipe.origin.url}>
                    {recipe.origin.website}
                </a>
            </p>
            <img src={recipe.image} alt="" />
            <div className="recipe-detail-meta row">
                <div className="col-1-4">
                    <p>
                        <strong>Servings:</strong>
                    </p>
                    <p>{recipe.servings}</p>
                </div>
                <p className="slash col-1-8">&sect;</p>
                <div className="col-1-4">
                    <p>
                        <strong>Active Time:</strong>
                    </p>
                    <p>{minutesToTime(recipe.activeTimeMinutes)}</p>
                </div>
                <p className="slash col-1-8">&sect;</p>
                <div className="col-1-4">
                    <p>
                        <strong>Total Time:</strong>
                    </p>
                    <p>{minutesToTime(recipe.totalTimeMinutes)}</p>
                </div>
            </div>
            <div className="recipe-ingredients-steps row">
                <div className="ingredients col-md-3 col-sm-12">
                    <h3>Ingredients</h3>
                    <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(recipeIngredients) }} />
                    <div className="scale-buttons">
                        <Button color="green" onClick={() => setIsScaleModalOpen(true)}>
                            Scale Recipe
                        </Button>
                    </div>
                </div>
                <div className="steps col-md-9 col-sm-12">
                    <h3>Steps</h3>
                    <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(recipe.steps) }} />
                </div>
            </div>
            <Modal
                isOpen={isScaleModalOpen}
                onRequestClose={() => setIsScaleModalOpen(false)}
                contentLabel="Scale the Recipe"
                style={customStyles}
            >
                <h3>Scale Recipe</h3>
                <p>Would you like to scale your recipe?</p>
                <p>
                    <em>WARNING: this doesn't always work.</em>
                </p>
                <div className="container">
                    <div className="row">
                        <Button.Group className="row" fluid>
                            <Button
                                className="col-3"
                                onClick={() => {
                                    setScale(0.25);
                                    setIsScaleModalOpen(false);
                                }}
                            >
                                Quarter
                            </Button>
                            <Button
                                className="col-3"
                                onClick={() => {
                                    setScale(0.5);
                                    setIsScaleModalOpen(false);
                                }}
                            >
                                Half
                            </Button>
                            <Button
                                className="col-3"
                                onClick={() => {
                                    setScale(2);
                                    setIsScaleModalOpen(false);
                                }}
                            >
                                Double
                            </Button>
                            <Button
                                className="col-3"
                                onClick={() => {
                                    setScale(3);
                                    setIsScaleModalOpen(false);
                                }}
                            >
                                Triple
                            </Button>
                        </Button.Group>
                    </div>
                    <div className="row">
                        <Input type="text" placeholder="Scale" action>
                            <input onChange={formatTextInput} value={scaleModalInput} />
                            <Button
                                color="green"
                                onClick={() => {
                                    setScale(scaleModalInput);
                                    setIsScaleModalOpen(false);
                                }}
                            >
                                Scale By
                            </Button>
                            <Button color="red" onClick={() => setIsScaleModalOpen(false)}>
                                Cancel
                            </Button>
                        </Input>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
