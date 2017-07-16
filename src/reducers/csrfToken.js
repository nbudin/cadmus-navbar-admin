import { FETCH_NAVIGATION_ITEMS_SUCCESS } from '../actions';

export default function csrfToken(currentCsrfToken = null, action) {
  switch (action.type) {
    case FETCH_NAVIGATION_ITEMS_SUCCESS:
      return action.csrfToken;
    default:
      return currentCsrfToken;
  }
}
