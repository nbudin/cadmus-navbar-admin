import {
  ADD_LINK,
  ADD_SECTION,
  CANCEL_EDITING_NAVIGATION_ITEM,
  CHANGE_EDITING_NAVIGATION_ITEM,
  COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS,
  EDIT_NAVIGATION_ITEM,
} from '../actions';

export default function editingNavigationItem(currentEditingNavigationItem = null, action) {
  switch (action.type) {
    case ADD_LINK:
      return {
        id: null,
        type: 'link',
        navigation_section_id: action.navigationSectionId,
        title: '',
        page_id: null,
      };
    case ADD_SECTION:
      return {
        id: null,
        type: 'section',
        title: '',
      };
    case CANCEL_EDITING_NAVIGATION_ITEM:
      return null;
    case CHANGE_EDITING_NAVIGATION_ITEM:
      return {
        ...currentEditingNavigationItem,
        ...action.newProps,
      };
    case COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS:
      return null;
    case EDIT_NAVIGATION_ITEM:
      return { ...action.navigationItem };
    default:
      return currentEditingNavigationItem;
  }
}
