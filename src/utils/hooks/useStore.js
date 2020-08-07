import { useContext } from 'react';
import { Store } from '../../state/store';

export function useStore(findFunction) {
    const { state } = useContext(Store);
    return findFunction ? findFunction(state) : state;
}

export function useDispatch() {
    const { dispatch } = useContext(Store);
    return dispatch;
}
