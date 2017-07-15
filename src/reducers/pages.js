import { FETCH_PAGES_SUCCESS } from '../actions';

export default function pages(pages = [], action) {
  switch (action.type) {
    case FETCH_PAGES_SUCCESS:
      return action.json;
  }

  return pages;
}