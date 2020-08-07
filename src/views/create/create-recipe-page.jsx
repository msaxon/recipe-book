import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useForm, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import TimeDurationInput from './time-duration-input';
import MultiTextInput from './multi-text-input';
import Origin from '../../models/origin';
import { useStore } from '../../utils/hooks/useStore';
import { putNewRecipe } from '../../importer/persistance';
import Recipe from '../../models/recipe';

export default function CreateRecipePage(props) {
    const { handleSubmit, register, errors, control } = useForm();
    const googleId = useStore((state) => state.googleId);
    const googleAuth = useStore((state) => state.googleAuth);

    const onSubmit = async (values) => {
        const origin = new Origin(googleId, values.authorName, values.url, values.website);

        const recipe = new Recipe(
            null,
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
            const response = await putNewRecipe(recipe, googleId, googleAuth);
            console.log(response);
            if (response.error) {
            } else {
                props.history.push('/recipes/details?recipeId=' + response.recipeId);
            }
        } catch (err) {
            console.log('error!', err);
        }
    };

    return (
        <div className="container">
            <h2>Create a New Recipe</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <Form.Field className="col-md-6 col-sm-12">
                        <label>Recipe Name</label>
                        <input
                            name="recipeName"
                            ref={register({
                                required: true,
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
                                required: true,
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
                        <Controller as={TimeDurationInput} name="activeTimeMinutes" control={control} defaultValue="" />
                    </Form.Field>
                    <Form.Field className="col-md-4 col-sm-12">
                        <label>Total Time</label>
                        <Controller as={TimeDurationInput} name="totalTimeMinutes" control={control} defaultValue="" />
                    </Form.Field>
                </div>

                <Form.Field>
                    <label>Ingredients</label>
                    <textarea
                        name="ingredients"
                        ref={register({
                            required: true,
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
                            required: true,
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
                <Button type="submit">Save Recipe</Button>
            </Form>
        </div>
    );
}
