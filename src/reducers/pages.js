import { FETCH_PAGES_SUCCESS } from '../actions';

export default function pages(currentPages = [], action) {
  switch (action.type) {
    case FETCH_PAGES_SUCCESS:
      return action.pages;
    default:
      return currentPages;
  }
}
