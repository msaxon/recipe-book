import Recipe from '../models/recipe';
import Origin from '../models/origin';

const butterChickenOrigin = new Origin(
    'maestromattaeus@gmail.com',
    'HAULBUR',
    'https://www.allrecipes.com/recipe/24002/famous-butter-chicken/',
    'AllRecipes'
);

const butterChicken = new Recipe(
    '1234',
    'Butter Chicken (Ritz Crackers)',
    butterChickenOrigin,
    '2 eggs, beaten\n1cup crushed ritz crackers\n1/2 teaspoon garlic salt\n2 boneless skinless chicken breasts sliced in half\n1/2 cup butter, cut into tablespoon sized pieces\freshly ground black pepper to taste',
    'Preheat oven to 375 degrees F.\nPlace eggs and ritz crackers into two seperate shallow bowls. Mix cracker crumbs with garlic salt and pepper. Dip chicken in eggs, then into ritz mixture to coat./nArrange coated chicken in a 9/3 backing dish. Place pieces of butter around the chicken./nBake in the oven fof 37 minutes.',
    '4 servings',
    15,
    60,
    'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F296379.jpg&w=596&h=399&c=sc&poi=face&q=85',
    'Very delicious',
    ['chicken', 'chicken breast', '1 hour or under', 'poulty', 'meat']
);

const vodkaSauceOrigin = new Origin(
    'maestromattaeus@gmail.com',
    'MARRIED',
    'https://www.allrecipes.com/recipe/24082/easy-vodka-sauce/',
    'AllRecipes'
);

const vodkaSauce = new Recipe(
    '2345',
    'Penne Vodka Sauce',
    vodkaSauceOrigin,
    `1/4 cup butter\n1 onion, diced \n1 cup vodka\n2 28 oz cans of tomato sauce\n1 pint heavy cream`,
    '1. In a skillet over medium heat, saute onion in butter until slightly brown and soft.\n2. Pour in vodka and let cook 10 minutes.\n3. Mix tomatoes and cook for 30 minutes.\n4. Pour in heavy cream and cook for 30 minutes.\n5. Pour on pasta.',
    '4-8 servings',
    15,
    70,
    'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fimages.media-allrecipes.com%2Fuserphotos%2F6515209.jpg&w=596&h=596&c=sc&poi=face&q=85',
    'Goes well with any pasta that has room for sauce.',
    ['pasta', 'pasta sauce', 'over 1 hour']
);

export const recipes = [butterChicken, vodkaSauce];
