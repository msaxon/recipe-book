import { useContext } from 'react';

import { Store } from '../state/store';

export function useStore() {
  const { state } = useContext(Store);
  return state;
}

export function useDispatch() {
  const { dispatch } = useContext(Store);
  return dispatch;
}
