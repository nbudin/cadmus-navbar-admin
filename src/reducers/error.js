import {
  COMMIT_EDITING_NAVIGATION_ITEM_FAILURE,
  COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS,
  DELETE_NAVIGATION_ITEM_FAILURE,
  DELETE_NAVIGATION_ITEM_SUCCESS,
  FETCH_NAVIGATION_ITEMS_FAILURE,
  FETCH_PAGES_FAILURE,
  SORT_NAVIGATION_ITEMS_FAILURE,
  SORT_NAVIGATION_ITEMS_SUCCESS,
} from '../actions';

export default function error(currentError = null, action) {
  switch (action.type) {
    case COMMIT_EDITING_NAVIGATION_ITEM_FAILURE:
    case DELETE_NAVIGATION_ITEM_FAILURE:
    case FETCH_NAVIGATION_ITEMS_FAILURE:
    case FETCH_PAGES_FAILURE:
    case SORT_NAVIGATION_ITEMS_FAILURE:
      return action.error.message;

    case COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS:
    case DELETE_NAVIGATION_ITEM_SUCCESS:
    case SORT_NAVIGATION_ITEMS_SUCCESS:
      return null;

    default:
      return currentError;
  }
}