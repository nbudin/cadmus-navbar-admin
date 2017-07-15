import {
  COMMIT_EDITING_NAVIGATION_ITEM_REQUEST,
  COMMIT_EDITING_NAVIGATION_ITEM_FAILURE,
  COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS,
  DELETE_NAVIGATION_ITEM_REQUEST,
  DELETE_NAVIGATION_ITEM_FAILURE,
  DELETE_NAVIGATION_ITEM_SUCCESS,
  FETCH_NAVIGATION_ITEMS_REQUEST,
  FETCH_NAVIGATION_ITEMS_FAILURE,
  FETCH_NAVIGATION_ITEMS_SUCCESS,
  FETCH_PAGES_REQUEST,
  FETCH_PAGES_SUCCESS,
  FETCH_PAGES_FAILURE,
  SORT_NAVIGATION_ITEMS_REQUEST,
  SORT_NAVIGATION_ITEMS_FAILURE,
  SORT_NAVIGATION_ITEMS_SUCCESS,
} from '../actions';

const initialState = {
  committingEditingNavigationItem: false,
  deletingNavigationItem: false,
  loadingNavigationItems: false,
  loadingPages: false,
  sortingNavigationItems: false,
};

export default function requestsInProgress(requests = initialState, action) {
  switch (action.type) {
    case COMMIT_EDITING_NAVIGATION_ITEM_REQUEST:
      return {
        ...requests,
        committingEditingNavigationItem: true,
      };
    case COMMIT_EDITING_NAVIGATION_ITEM_FAILURE:
    case COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS:
      return {
        ...requests,
        committingEditingNavigationItem: false,
      };
    case DELETE_NAVIGATION_ITEM_REQUEST:
      return {
        ...requests,
        deletingNavigationItem: true,
      };
    case DELETE_NAVIGATION_ITEM_FAILURE:
    case DELETE_NAVIGATION_ITEM_SUCCESS:
      return {
        ...requests,
        deletingNavigationItem: false,
      };
    case FETCH_NAVIGATION_ITEMS_REQUEST:
      return {
        ...requests,
        loadingNavigationItems: true,
      };
    case FETCH_NAVIGATION_ITEMS_FAILURE:
    case FETCH_NAVIGATION_ITEMS_SUCCESS:
      return {
        ...requests,
        loadingNavigationItems: false,
      };
    case FETCH_PAGES_REQUEST:
      return {
        ...requests,
        loadingPages: true,
      };
    case FETCH_PAGES_FAILURE:
    case FETCH_PAGES_SUCCESS:
      return {
        ...requests,
        loadingPages: false,
      };
    case SORT_NAVIGATION_ITEMS_REQUEST:
      return {
        ...requests,
        sortingNavigationItems: true,
      };
    case SORT_NAVIGATION_ITEMS_FAILURE:
    case SORT_NAVIGATION_ITEMS_SUCCESS:
      return {
        ...requests,
        sortingNavigationItems: false,
      };
  }

  return requests;
}