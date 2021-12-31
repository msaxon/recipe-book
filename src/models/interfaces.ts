export interface UserRecipe {
    userId: string;
    recipeId: string[];
}

export interface Origin {
    ownerId: string | undefined;
    authorName: string;
    url: string;
    website: string;
}

export interface RecipeBase {
    recipeName: string;
    origin: Origin;
    ingredients: string;
    steps: string;
    servings: string;
    activeTimeMinutes?: number;
    totalTimeMinutes?: number;
    image?: string;
    notes?: string;
    tags?: string[];
    creationTimeStamp?: number;
}

export interface Recipe extends RecipeBase {
    recipeId: string;
}

export interface User {
    userId: string;
    username: string;
}