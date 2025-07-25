import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ErrorMessage } from '@hookform/error-message';
import { Button } from '@mantine/core';

import { postNewRecipe, updateRecipe } from '../../aws/dynamo-facade';
import { useAuthContext } from '../../context/auth-context.tsx';
import { useDispatch, useStore } from '../../hooks/useStore';
import type { Origin, Recipe } from '../../models/interfaces';
import { setImportedRecipe } from '../../state/actions';
import MultiTextInput from '../shared/input/multi-text-input';
import TimeDurationInput from './time-duration-input';

import './create-recipe.scss';

export default function CreateRecipePage() {
  const { importedRecipe: recipe } = useStore();
  const { googleId, googleAuth } = useAuthContext();
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
        notes: recipe.notes,
      }
    : undefined;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (values: any) => {
    const origin: Origin = {
      ownerId: googleId,
      authorName: values.authorName,
      url: values.url,
      website: values.website,
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
      creationTimeStamp: values.creationTimeStamp || undefined,
    };

    try {
      let recipeId;
      if (recipeToPost.recipeId) {
        recipeId = await updateRecipe(recipeToPost, googleId, googleAuth);
      } else {
        recipeId = await postNewRecipe(recipeToPost, googleId, googleAuth);
      }

      dispatch(setImportedRecipe(null));
      navigate('/recipes/details?recipeId=' + recipeId);
    } catch (err) {
      console.log('error!', err);
    }
  };

  return (
    <div className="container create-recipe-container">
      <h2>Create a New Recipe</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <label>Recipe Name</label>
            <input
              {...register('recipeName', {
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
          </div>
          <div className="col-md-6 col-sm-12">
            <label>Author Name</label>
            <input {...register('authorName')} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 col-sm-12">
            <label>URL</label>
            <input {...register('url')} />
          </div>
          <div className="col-md-4 col-sm-12">
            <label>Website</label>
            <input {...register('website')} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 col-sm-12">
            <label>Image Link</label>
            <input {...register('image')} />
          </div>
          <div className="col-md-4 col-sm-12">
            <label>Tags</label>
            <Controller
              render={({ field }) => (
                <MultiTextInput tags={recipe?.tags || []} {...field} />
              )}
              name="tags"
              defaultValue={[]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-sm-12">
            <label>Servings</label>
            <input
              {...register('servings', {
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
          </div>
          <div className="col-md-4 col-sm-12">
            <label>Active Time</label>
            <Controller
              render={({ field }) => (
                <TimeDurationInput
                  {...field}
                  name="activeTimeMinutes"
                  minutes={recipe?.activeTimeMinutes || 0}
                />
              )}
              name="activeTimeMinutes"
              defaultValue={recipe?.activeTimeMinutes || 0}
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <label>Total Time</label>
            <Controller
              render={({ field }) => (
                <TimeDurationInput
                  {...field}
                  name="activeTimeMinutes"
                  minutes={recipe?.totalTimeMinutes || 0}
                />
              )}
              name="totalTimeMinutes"
              defaultValue={recipe?.totalTimeMinutes || 0}
            />
          </div>
        </div>

        <div>
          <label>Ingredients</label>
          <textarea
            {...register('ingredients', {
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
        </div>
        <div>
          <label>Steps</label>
          <textarea
            {...register('steps', {
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
        </div>
        <div>
          <label>Notes</label>
          <textarea {...register('notes')} />
        </div>
        <Button type="submit" className="submit-button">
          Save Recipe
        </Button>
      </form>
    </div>
  );
}
