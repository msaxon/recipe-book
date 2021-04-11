import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import { useStore } from '../../utils/hooks/useStore';
import { getAllUsers } from '../../importer/persistance';
import { getRandomPhrase } from '../../data/fun-phrases';
import './community.scss';

export default function Community() {
    const [users, setUsers] = useState([]);
    const { googleAuth, googleId } = useStore();

    /**
     *  Grab all recipes/some subset of random recipes
     *      Hit db
     *      Filter out Recipes already in your book
     *  Show them all using recipeBookCards
     * 
     *  Considerations
     *      Store "community" recipes in state somewhere else
     *      Maybe have to rename
     */

    useEffect(() => {
        async function getUsers() {
            const response = await getAllUsers(googleAuth);
            setUsers(response);
        }

        getUsers();

    }, [googleAuth, googleId])

    return (
        <div>
            <h2>Community Recipes</h2>
            <p>Click on someone to see their recipes.</p>
            <div className="user-cards">
                {users.map(user => {
                    return (
                        <Card>
                            <Card.Content>
                                <Card.Header>
                                    {user.username.S}
                                </Card.Header>
                                <Card.Meta>{getRandomPhrase()}</Card.Meta>
                            </Card.Content>
                            <Card.Content>
                            <Link to={'/recipes?userId=' + user.userId.S}>
                                <Button color="green">See Recipes</Button>
                            </Link>
                                
                            </Card.Content>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}