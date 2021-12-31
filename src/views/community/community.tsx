import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import { useStore } from '../../utils/hooks/useStore';
import { getRandomPhrase } from '../../data/fun-phrases';
import './community.scss';
import {getAllUsers} from "../../aws/dynamo-facade";
import {User} from "../../models/interfaces";
import useAsyncEffect from "use-async-effect";

export default function Community() {
    const [users, setUsers] = useState<User[]>([]);
    const { googleAuth } = useStore();


    useAsyncEffect(async () => {
        const response = await getAllUsers(googleAuth);
        setUsers(response);
    }, [googleAuth])

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
                                    {user.username}
                                </Card.Header>
                                <Card.Meta>{getRandomPhrase()}</Card.Meta>
                            </Card.Content>
                            <Card.Content>
                            <Link to={'/recipes?userId=' + user.userId}>
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