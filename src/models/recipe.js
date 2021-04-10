import AWS from 'aws-sdk';

export default class Recipe {
    constructor(
        recipeId,
        recipeName,
        origin,
        ingredients,
        steps,
        servings,
        activeTimeMinutes,
        totalTimeMinutes,
        image,
        notes,
        tags,
        creationTimestamp
    ) {
        this.recipeId = recipeId;
        this.recipeName = recipeName;
        this.origin = origin;
        this.ingredients = ingredients;
        this.steps = steps;
        this.servings = servings;
        this.activeTimeMinutes = activeTimeMinutes;
        this.totalTimeMinutes = totalTimeMinutes;
        this.image = image;
        this.notes = notes;
        this.tags = tags;
        this.creationTimestamp = creationTimestamp ? creationTimestamp : (new Date()).getTime();
    }

    toDatabaseParams = () => {
        return AWS.DynamoDB.Converter.marshall(this);
    };
}
