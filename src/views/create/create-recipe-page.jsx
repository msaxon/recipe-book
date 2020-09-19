import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import TimeDurationInput from './time-duration-input';
import MultiTextInput from '../shared/input/multi-text-input';
import Origin from '../../models/origin';
import { useStore } from '../../utils/hooks/useStore';
import { putNewRecipe, updateOldRecipe } from '../../importer/persistance';
import Recipe from '../../models/recipe';
import './create-recipe.scss';

/**
 * TODO:
 *
 * allow edit
 */

export default function CreateRecipePage(props) {
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

    const { handleSubmit, register, errors, control } = useForm({ defaultValues });

    const onSubmit = async values => {
        const origin = new Origin(googleId, values.authorName, values.url, values.website);

        const recipeToPost = new Recipe(
            recipe && recipe.recipeId ? recipe.recipeId : null,
            values.recipeName,
            origin,
            values.ingredients,
            values.steps,
            values.servings,
            values.activeTimeMinutes,
            values.totalTimeMinutes,
            values.image,
            values.notes,
            values.tags
        );

        try {
            let response;
            if (recipeToPost.recipeId) {
                response = await updateOldRecipe(recipeToPost, googleId, googleAuth);
            } else {
                response = await putNewRecipe(recipeToPost, googleId, googleAuth);
            }

            console.log(response);
            if (response.error) {
                console.log('there was an error hitting aws');
            } else {
                props.history.push('/recipes/details?recipeId=' + response.recipeId);
            }
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
                        <Controller as={MultiTextInput} name="tags" control={control} defaultValue={[]} />
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
                        <Controller
                            as={TimeDurationInput}
                            name="activeTimeMinutes"
                            control={control}
                            minutes={recipe ? recipe.activeTimeMinutes : 0}
                        />
                    </Form.Field>
                    <Form.Field className="col-md-4 col-sm-12">
                        <label>Total Time</label>
                        <Controller
                            as={TimeDurationInput}
                            name="totalTimeMinutes"
                            control={control}
                            minutes={recipe ? recipe.totalTimeMinutes : 0}
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
