import { FETCH_NAVIGATION_ITEMS_SUCCESS } from '../actions';

export default function csrfToken(csrfToken = null, action) {
  switch (action.type) {
    case FETCH_NAVIGATION_ITEMS_SUCCESS:
      return action.csrfToken;
  }

  return csrfToken;
}