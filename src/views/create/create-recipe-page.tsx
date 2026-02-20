import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { ErrorMessage } from '@hookform/error-message';
import { Button, SimpleGrid, Stack, TextInput, Textarea } from '@mantine/core';

import { postNewRecipe, updateRecipe } from '../../aws/dynamo-facade';
import { useAuthContext } from '../../context/auth-context.tsx';
import { usePageTitle } from '../../hooks/usePageTitle.ts';
import { useDispatch, useStore } from '../../hooks/useStore';
import type { Origin, Recipe } from '../../models/interfaces';
import { setImportedRecipe } from '../../state/actions';
import MultiTextInput from '../shared/input/multi-text-input';
import TimeDurationInput from './time-duration-input';

import './create-recipe.scss';

export default function CreateRecipePage() {
  const { importedRecipe: recipe } = useStore();
  usePageTitle('New Recipe');
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
    control,
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
        <Stack px="3rem">
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <div>
              <TextInput
                label="Recipe Name"
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
            <TextInput label="Author Name" {...register('authorName')} />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <TextInput label="URL" {...register('url')} />
            <TextInput label="website" {...register('website')} />
            <TextInput label="Image Link" {...register('image')} />
            <div>
              <label>Tags</label>
              <Controller
                render={({ field }) => <MultiTextInput {...field} />}
                name="tags"
                defaultValue={[]}
                control={control}
              />
            </div>
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            <div>
              <TextInput
                label="Servings"
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
            <div>
              <label>Active Time</label>
              <Controller
                render={({ field }) => (
                  <TimeDurationInput
                    {...field}
                    name="activeTimeMinutes"
                    minutes={recipe?.activeTimeMinutes || 0}
                  />
                )}
                // @ts-expect-error one
                name="activeTimeMinutes"
                // @ts-expect-error one
                defaultValue={recipe?.activeTimeMinutes || 0}
                control={control}
              />
            </div>
            <div>
              <label>Total Time</label>
              <Controller
                render={({ field }) => (
                  <TimeDurationInput
                    {...field}
                    name="activeTimeMinutes"
                    minutes={recipe?.totalTimeMinutes || 0}
                  />
                )}
                // @ts-expect-error three
                name="totalTimeMinutes"
                // @ts-expect-error four
                defaultValue={recipe?.totalTimeMinutes || 0}
                control={control}
              />
            </div>
          </SimpleGrid>

          <div>
            <Textarea
              label="Ingredients"
              autosize
              minRows={4}
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
            <Textarea
              label="Steps"
              autosize
              minRows={4}
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
          <Textarea label="Notes" minRows={4} autosize {...register('notes')} />
          <Button type="submit" className="submit-button">
            Save Recipe
          </Button>
        </Stack>
      </form>
    </div>
  );
}
