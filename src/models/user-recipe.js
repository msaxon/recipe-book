class UserRecipe {
    constructor(userId, recipeId) {
        this._userId = userId;
        this._recipeId = recipeId;
    }

    get userId() {
        return this._userId;
    }

    set userId(x) {
        this._userId = x;
    }

    get recipeId() {
        return this._recipeId;
    }

    set recipeId(x) {
        this._recipeId = x;
    }
}
