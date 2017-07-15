import {
  COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS,
  DELETE_NAVIGATION_ITEM_SUCCESS,
  FETCH_NAVIGATION_ITEMS_SUCCESS,
  SORT_NAVIGATION_ITEMS_SUCCESS,
  TOGGLE_SECTION_EXPANDED,
} from '../actions';
import NavigationItemStore from '../NavigationItemStore';

export default function navigationItems(navigationItems = new NavigationItemStore([]), action) {
  switch (action.type) {
    case COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS:
      return navigationItems.update(
        action.json.navigation_item.id,
        item => action.json.navigation_item,
      );
    case DELETE_NAVIGATION_ITEM_SUCCESS:
      return navigationItems.delete(action.navigationItem.id);
    case FETCH_NAVIGATION_ITEMS_SUCCESS:
      return new NavigationItemStore(action.json);
    case SORT_NAVIGATION_ITEMS_SUCCESS:
      return navigationItems.applySort(action.newNavigationItems);
    case TOGGLE_SECTION_EXPANDED:
      return navigationItems.update(
        action.navigationSectionId,
        section => ({ ...section, expanded: !section.expanded }),
      );
  }

  return navigationItems;
}