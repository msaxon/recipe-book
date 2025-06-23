import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { Button, Card, Text } from '@mantine/core';

import { getAllUsers } from '../../aws/dynamo-facade';
import { useAuthContext } from '../../context/auth-context.tsx';
import { getRandomPhrase } from '../../data/fun-phrases';
import { GET_ALL_USERS } from '../../utils/constants';
import AsyncLoader from '../shared/interstitial/async-loader';

import './community.scss';

export default function Community() {
  const { googleAuth } = useAuthContext();

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
                <Card.Section>
                  <Text>{user.username}</Text>
                  <Text size="sm">{getRandomPhrase()}</Text>
                </Card.Section>
                <Card.Section>
                  <Link to={'/recipes?userId=' + user.userId}>
                    <Button color="green">See Recipes</Button>
                  </Link>
                </Card.Section>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
}
