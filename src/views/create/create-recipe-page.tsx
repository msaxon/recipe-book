import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import TimeDurationInput from './time-duration-input';
import MultiTextInput from '../shared/input/multi-text-input';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import { setImportedRecipe } from '../../state/actions';
import {useNavigate} from "react-router-dom";
import './create-recipe.scss';
import {Origin, Recipe} from "../../models/interfaces";
import {postNewRecipe, updateRecipe} from "../../aws/dynamo-facade";

export default function CreateRecipePage() {
    const { googleId, googleAuth, importedRecipe: recipe } = useStore();
    const defaultValues = recipe
        ? {
              recipeName: recipe.recipeName,
              authorName: recipe.origin.authorName,
              url: recipe.origin.url,
              website: recipe.origin.website,
              image: recipe.image,
              tags: recipe.tags,
              servings: recipe.servings,
              ingredients: recipe.ingredients,
              steps: recipe.steps,
              notes: recipe.notes
          }
        : undefined;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { handleSubmit, register, errors, control } = useForm({ defaultValues });

    const onSubmit = async (values: any) => {
        const origin: Origin = {
            ownerId: googleId,
            authorName: values.authorName,
            url: values.url,
            website: values.website
        };

        const recipeToPost: Recipe = {
            recipeId: recipe && recipe.recipeId ? recipe.recipeId : '',
            recipeName: values.recipeName,
            origin: origin,
            ingredients: values.ingredients,
            steps: values.steps,
            servings: values.servings,
            activeTimeMinutes: values.activeTimeMinutes,
            totalTimeMinutes: values.totalTimeMinutes,
            image: values.image,
            notes: values.notes,
            tags: values.tags,
            creationTimeStamp: values.creationTimeStamp || undefined
        }

        try {
            let recipeId;
            if (recipeToPost.recipeId) {
                recipeId = await updateRecipe(recipeToPost, googleId, googleAuth);
            } else {
                recipeId = await postNewRecipe(recipeToPost, googleId, googleAuth);
            }

            dispatch(setImportedRecipe(null));
            navigate('/recipes/details?recipeId=' + recipeId)

        } catch (err) {
            console.log('error!', err);
        }
    };

    return (
        <div className="container create-recipe-container">
            <h2>Create a New Recipe</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <Form.Field className="col-md-6 col-sm-12">
                        <label>Recipe Name</label>
                        <input
                            name="recipeName"
                            ref={register({
                                required: true
                            })}
                        />
                        <ErrorMessage
                            as="p"
                            className="error-message"
                            errors={errors}
                            name="recipeName"
                            message="This is required."
                        />
                    </Form.Field>
                    <Form.Field className="col-md-6 col-sm-12">
                        <label>Author Name</label>
                        <input name="authorName" ref={register} />
                    </Form.Field>
                </div>
                <div className="row">
                    <Form.Field className="col-md-8 col-sm-12">
                        <label>URL</label>
                        <input name="url" ref={register} />
                    </Form.Field>
                    <Form.Field className="col-md-4 col-sm-12">
                        <label>Website</label>
                        <input name="website" ref={register} />
                    </Form.Field>
                </div>
                <div className="row">
                    <Form.Field className="col-md-8 col-sm-12">
                        <label>Image Link</label>
                        <input name="image" ref={register} />
                    </Form.Field>
                    <Form.Field className="col-md-4 col-sm-12">
                        <label>Tags</label>
                        {/* @ts-ignore */}
                        <Controller 
                            as={MultiTextInput} 
                            name="tags" 
                            control={control} 
                            defaultValue={[]} 
                            tags={recipe?.tags || []}
                        />
                    </Form.Field>
                </div>
                <div className="row">
                    <Form.Field className="col-md-4 col-sm-12">
                        <label>Servings</label>
                        <input
                            name="servings"
                            ref={register({
                                required: true
                            })}
                        />
                        <ErrorMessage
                            as="p"
                            className="error-message"
                            errors={errors}
                            name="servings"
                            message="This is required"
                        />
                    </Form.Field>
                    <Form.Field className="col-md-4 col-sm-12">
                        <label>Active Time</label>
                        {/* @ts-ignore */}
                        <Controller
                            as={TimeDurationInput}
                            name="activeTimeMinutes"
                            control={control}
                            minutes={recipe?.activeTimeMinutes || 0}
                        />
                    </Form.Field>
                    <Form.Field className="col-md-4 col-sm-12">
                        <label>Total Time</label>
                        {/* @ts-ignore */}
                        <Controller
                            as={TimeDurationInput}
                            name="totalTimeMinutes"
                            control={control}
                            minutes={recipe?.totalTimeMinutes || 0}
                        />
                    </Form.Field>
                </div>

                <Form.Field>
                    <label>Ingredients</label>
                    <textarea
                        name="ingredients"
                        ref={register({
                            required: true
                        })}
                    />
                    <ErrorMessage
                        as="p"
                        className="error-message"
                        errors={errors}
                        name="ingredients"
                        message="This is required"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Steps</label>
                    <textarea
                        name="steps"
                        ref={register({
                            required: true
                        })}
                    />
                    <ErrorMessage
                        as="p"
                        className="error-message"
                        errors={errors}
                        name="steps"
                        message="This is required"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Notes</label>
                    <textarea name="notes" ref={register} />
                </Form.Field>
                <Button primary type="submit" className="submit-button">
                    Save Recipe
                </Button>
            </Form>
        </div>
    );
}
