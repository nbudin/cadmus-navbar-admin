import {
  ADD_LINK,
  ADD_SECTION,
  CANCEL_EDITING_NAVIGATION_ITEM,
  CHANGE_EDITING_NAVIGATION_ITEM,
  COMMIT_EDITING_NAVIGATION_ITEM_REQUEST,
  COMMIT_EDITING_NAVIGATION_ITEM_FAILURE,
  COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS,
  DELETE_NAVIGATION_ITEM_REQUEST,
  DELETE_NAVIGATION_ITEM_FAILURE,
  DELETE_NAVIGATION_ITEM_SUCCESS,
  EDIT_NAVIGATION_ITEM,
  FETCH_NAVIGATION_ITEMS_REQUEST,
  FETCH_NAVIGATION_ITEMS_FAILURE,
  FETCH_NAVIGATION_ITEMS_SUCCESS,
  FETCH_PAGES_REQUEST,
  FETCH_PAGES_SUCCESS,
  FETCH_PAGES_FAILURE,
  SORT_NAVIGATION_ITEMS_REQUEST,
  SORT_NAVIGATION_ITEMS_FAILURE,
  SORT_NAVIGATION_ITEMS_SUCCESS,
  MOVE_NAVIGATION_ITEM,
  MOVE_NAVIGATION_ITEM_INTO_SECTION,
  TOGGLE_SECTION_EXPANDED,
} from './actions';
import NavigationItemStore from './NavigationItemStore';

const initialState = {
  csrfToken: null,
  isLoadingNavigationItems: false,
  isLoadingPages: false,
  navigationItems: new NavigationItemStore([]),
  pages: [],
  error: null,
  editingNavigationItem: null,
  isCommittingEditingNavigationItem: false,
  isDeletingNavigationItem: false,
  isSortingNavigationItems: false,
};

function navbarAdminApp(state = initialState, action) {
  switch (action.type) {
    case ADD_LINK:
      return {
        ...state,
        editingNavigationItem: {
          id: null,
          type: 'link',
          navigation_section_id: action.navigationSectionId,
          title: '',
          page_id: null,
        },
      };
    case ADD_SECTION:
      return {
        ...state,
        editingNavigationItem: {
          id: null,
          type: 'section',
          title: '',
        },
      };
    case CANCEL_EDITING_NAVIGATION_ITEM:
      return {
        ...state,
        editingNavigationItem: null,
      };
    case CHANGE_EDITING_NAVIGATION_ITEM:
      return {
        ...state,
        editingNavigationItem: {
          ...state.editingNavigationItem,
          ...action.newProps,
        },
      };
    case COMMIT_EDITING_NAVIGATION_ITEM_REQUEST:
      return {
        ...state,
        isCommittingEditingNavigationItem: true,
      };
    case COMMIT_EDITING_NAVIGATION_ITEM_FAILURE:
      return {
        ...state,
        isCommittingEditingNavigationItem: false,
        error: action.error.message,
      };
    case COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS:
      return {
        ...state,
        navigationItems: state.navigationItems.update(
        action.json.navigation_item.id,
        item => action.json.navigation_item,
      ),
        editingNavigationItem: null,
        isCommittingEditingNavigationItem: false,
      };
    case DELETE_NAVIGATION_ITEM_REQUEST:
      return {
        ...state,
        isDeletingNavigationItem: true,
      };
    case DELETE_NAVIGATION_ITEM_FAILURE:
      return {
        ...state,
        isDeletingNavigationItem: false,
        error: action.error.message,
      };
    case DELETE_NAVIGATION_ITEM_SUCCESS:
      return {
        ...state,
        navigationItems: state.navigationItems.delete(action.navigationItem.id),
        isDeletingNavigationItem: false,
      };
    case EDIT_NAVIGATION_ITEM:
      return {
        ...state,
        editingNavigationItem: { ...action.navigationItem },
      };
    case FETCH_NAVIGATION_ITEMS_REQUEST:
      return {
        ...state,
        isLoadingNavigationItems: true,
      };
    case FETCH_NAVIGATION_ITEMS_FAILURE:
      return {
        ...state,
        isLoadingNavigationItems: false,
        error: action.error.message,
      };
    case FETCH_NAVIGATION_ITEMS_SUCCESS:
      return {
        ...state,
        navigationItems: new NavigationItemStore(action.json),
        isLoadingNavigationItems: false,
        csrfToken: action.csrfToken,
      };
    case FETCH_PAGES_REQUEST:
      return {
        ...state,
        isLoadingPages: true,
      };
    case FETCH_PAGES_FAILURE:
      return {
        ...state,
        isLoadingPages: false,
        error: action.error.message,
      };
    case FETCH_PAGES_SUCCESS:
      return {
        ...state,
        pages: action.json,
        isLoadingPages: false,
      };
    case MOVE_NAVIGATION_ITEM:
      return {
        ...state,
        navigationItems: state.navigationItems.reposition(
        action.navigationItem.id,
        action.targetItem.navigation_section_id,
        action.targetItem.position,
      ),
      };
    case MOVE_NAVIGATION_ITEM_INTO_SECTION:
      return {
        ...state,
        navigationItems: state.navigationItems.reposition(
        action.navigationItem.id,
        action.targetSection.id,
        1,
      ),
      };
    case SORT_NAVIGATION_ITEMS_REQUEST:
      return {
        ...state,
        isSortingNavigationItems: true,
      };
    case SORT_NAVIGATION_ITEMS_FAILURE:
      return {
        ...state,
        isSortingNavigationItems: false,
        error: action.error.message,
      };
    case SORT_NAVIGATION_ITEMS_SUCCESS:
      return {
        ...state,
        navigationItems: state.navigationItems.applySort(action.newNavigationItems),
        isSortingNavigationItems: false,
      };
    case TOGGLE_SECTION_EXPANDED:
      return {
        ...state,
        navigationItems: state.navigationItems.update(
        action.navigationSectionId,
        section => ({ ...section, expanded: !section.expanded }),
      ),
      };
  }

  return state;
}

export default navbarAdminApp;
