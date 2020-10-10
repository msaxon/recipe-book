import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Input, Popup } from 'semantic-ui-react';
import { Fraction } from 'fractional';
import RecipeViewModeToggle from './recipe-view-mode-toggle';
import { deleteRecipeRelationship, deleteRecipe, putNewRecipeRelationship } from '../../importer/persistance';

import { setImportedRecipe } from '../../state/actions';
import { convertMarkdownToHtml } from '../../utils/markdown-utils';
import { minutesToTime } from '../../utils/time-utils';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import './recipe-detail.scss';

export default function RecipeDetailPage(props) {
    const [scale, setScale] = useState(1);
    const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
    const [scaleModalInput, setScaleModalInput] = useState('');
    const [serviceCallError, setServiceCallError] = useState(false);
    const { googleAuth, googleId } = useStore();
    const dispatch = useDispatch();

    let recipeIngredients = props.recipe.ingredients;

    if (scale !== 1) {
        let recipeIngredientsArr = props.recipe.ingredients.split('\n');
        recipeIngredientsArr = recipeIngredientsArr.map(i => {
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
            transform: 'translate(-50%, -50%)'
        }
    };

    const formatTextInput = input => {
        const formattedInput = input.target.value.replace(/[^\d.]/g, '');
        setScaleModalInput(formattedInput);
    };

    const editRecipe = () => {
        dispatch(setImportedRecipe(props.recipe));
        props.history.push('/recipes/edit');
    };

    const removeRecipe = async () => {
        const response = await deleteRecipeRelationship(props.recipe, googleId, googleAuth);
        if (response.error) {
            setServiceCallError(true);
        } else {
            props.history.push('/recipes');
        }
    };

    const deleteRecipeFunc = async () => {
        const response = await deleteRecipe(props.recipe, googleId, googleAuth);
        if (response.error) {
            setServiceCallError(true);
        } else {
            props.history.push('/recipes');
        }
    };

    const addToLibrary = async () => {
        const response = await putNewRecipeRelationship(googleId, props.recipe.recipeId, googleAuth);
        if (response.error) {
            setServiceCallError(true);
        } else {
            window.location.reload();
        }
    };

    const errorSection = serviceCallError ? <p>Error Updating Recipe</p> : <></>;

    const libraryButton = props.userRecipeIds.includes(props.recipe.recipeId) ? (
        <Button color="orange" onClick={removeRecipe}>
            Remove From Library
        </Button>
    ) : (
        <Button color="orange" onClick={addToLibrary}>
            Add To Library
        </Button>
    );

    const deleteButton =
        props.recipe.origin.ownerId === googleId ? (
            <Button color="red" onClick={deleteRecipeFunc}>
                Delete
            </Button>
        ) : (
            <></>
        );

    const copyToClipboard = () => {
        const el = document.createElement('textarea');
        el.value = window.location.href;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    return (
        <div className="recipe-detail-wrapper container">
            <RecipeViewModeToggle />
            <h2>{props.recipe.recipeName}</h2>
            <p>
                Author: {props.recipe.origin.authorName} /{' '}
                <a target="_blank" rel="noopener noreferrer" href={props.recipe.origin.url}>
                    {props.recipe.origin.website}
                </a>
            </p>
            <div>
                <Button color="green" onClick={editRecipe}>
                    Edit
                </Button>
                <Popup
                    content="URL Copied"
                    on="click"
                    pinned
                    trigger={<Button content="Share" color="yellow" onClick={copyToClipboard} />}
                />
                {libraryButton}
                {deleteButton}
            </div>
            {errorSection}
            <img src={props.recipe.image} alt="" />
            <div className="recipe-detail-meta row">
                <div className="col-1-4">
                    <p>
                        <strong>Servings:</strong>
                    </p>
                    {/* TODO scale servings too */}
                    <p>{props.recipe.servings}</p>
                </div>
                <p className="slash col-1-8">&sect;</p>
                <div className="col-1-4">
                    <p>
                        <strong>Active Time:</strong>
                    </p>
                    <p>{minutesToTime(props.recipe.activeTimeMinutes)}</p>
                </div>
                <p className="slash col-1-8">&sect;</p>
                <div className="col-1-4">
                    <p>
                        <strong>Total Time:</strong>
                    </p>
                    <p>{minutesToTime(props.recipe.totalTimeMinutes)}</p>
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
                    <ol>
                        {props.recipe.steps.split('\n').map(step => (
                            <li>{step}</li>
                        ))}
                    </ol>
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
