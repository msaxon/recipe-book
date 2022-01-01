import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'semantic-ui-react';
import { getRandomPhrase } from '../../data/fun-phrases';
import './community.scss';
import { getAllUsers } from '../../aws/dynamo-facade';
import { useQuery } from 'react-query';
import { GET_ALL_USERS } from '../../utils/constants';
import AsyncLoader from '../shared/interstitial/async-loader';
import { AuthContext } from '../../App';

export default function Community() {
  const { googleAuth } = useContext(AuthContext);

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery(GET_ALL_USERS, () => getAllUsers(googleAuth));

  if (isLoading) {
    return <AsyncLoader />;
  } else if (isError || !users) {
    return <p>Error loading data</p>;
  } else {
    return (
      <div>
        <h2>Community Recipes</h2>
        <p>Click on someone to see their recipes.</p>
        <div className="user-cards">
          {users.map((user) => {
            return (
              <Card key={user.userId}>
                <Card.Content>
                  <Card.Header>{user.username}</Card.Header>
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
}
