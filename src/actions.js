export const ADD_LINK = 'CADMUS_NAVBAR_ADMIN_ADD_LINK';
export const ADD_SECTION = 'CADMUS_NAVBAR_ADMIN_ADD_SECTION';
export const CANCEL_EDITING_NAVIGATION_ITEM = 'CADMUS_NAVBAR_ADMIN_CANCEL_EDITING_NAVIGATION_ITEM';
export const CHANGE_EDITING_NAVIGATION_ITEM = 'CADMUS_NAVBAR_ADMIN_CHANGE_EDITING_NAVIGATION_ITEM';
export const COMMIT_EDITING_NAVIGATION_ITEM_REQUEST =
  'CADMUS_NAVBAR_ADMIN_COMMIT_EDITING_NAVIGATION_ITEM_REQUEST';
export const COMMIT_EDITING_NAVIGATION_ITEM_FAILURE =
  'CADMUS_NAVBAR_ADMIN_COMMIT_EDITING_NAVIGATION_ITEM_FAILURE';
export const COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS =
  'CADMUS_NAVBAR_ADMIN_COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS';
export const DELETE_NAVIGATION_ITEM_REQUEST =
  'CADMUS_NAVBAR_ADMIN_DELETE_NAVIGATION_ITEM_REQUEST';
export const DELETE_NAVIGATION_ITEM_FAILURE = 'CADMUS_NAVBAR_ADMIN_DELETE_NAVIGATION_ITEM_FAILURE';
export const DELETE_NAVIGATION_ITEM_SUCCESS = 'CADMUS_NAVBAR_ADMIN_DELETE_NAVIGATION_ITEM_SUCCESS';
export const EDIT_NAVIGATION_ITEM = 'CADMUS_NAVBAR_ADMIN_EDIT_NAVIGATION_ITEM';
export const FETCH_NAVIGATION_ITEMS_REQUEST = 'CADMUS_NAVBAR_ADMIN_FETCH_NAVIGATION_ITEMS_REQUEST';
export const FETCH_NAVIGATION_ITEMS_FAILURE = 'CADMUS_NAVBAR_ADMIN_FETCH_NAVIGATION_ITEMS_FAILURE';
export const FETCH_NAVIGATION_ITEMS_SUCCESS = 'CADMUS_NAVBAR_ADMIN_FETCH_NAVIGATION_ITEMS_SUCCESS';
export const FETCH_PAGES_REQUEST = 'CADMUS_NAVBAR_ADMIN_FETCH_PAGES_REQUEST';
export const FETCH_PAGES_FAILURE = 'CADMUS_NAVBAR_ADMIN_FETCH_PAGES_FAILURE';
export const FETCH_PAGES_SUCCESS = 'CADMUS_NAVBAR_ADMIN_FETCH_PAGES_SUCCESS';
export const SORT_NAVIGATION_ITEMS_REQUEST = 'CADMUS_NAVBAR_ADMIN_SORT_NAVIGATION_ITEMS_REQUEST';
export const SORT_NAVIGATION_ITEMS_FAILURE = 'CADMUS_NAVBAR_ADMIN_SORT_NAVIGATION_ITEMS_FAILURE';
export const SORT_NAVIGATION_ITEMS_SUCCESS = 'CADMUS_NAVBAR_ADMIN_SORT_NAVIGATION_ITEMS_SUCCESS';
export const TOGGLE_SECTION_EXPANDED = 'CADMUS_NAVBAR_ADMIN_TOGGLE_SECTION_EXPANDED';

export function addLink(navigationSectionId) {
  return {
    type: ADD_LINK,
    navigationSectionId,
  };
}

export function addSection() {
  return {
    type: ADD_SECTION,
  };
}

export function cancelEditingNavigationItem() {
  return {
    type: CANCEL_EDITING_NAVIGATION_ITEM,
  };
}

export function changeEditingNavigationItem(newProps) {
  return {
    type: CHANGE_EDITING_NAVIGATION_ITEM,
    newProps,
  };
}

export function commitEditingNavigationItemRequest() {
  return {
    type: COMMIT_EDITING_NAVIGATION_ITEM_REQUEST,
  };
}

export function commitEditingNavigationItemFailure(error) {
  return {
    type: COMMIT_EDITING_NAVIGATION_ITEM_FAILURE,
    error,
  };
}

export function commitEditingNavigationItemSuccess(json) {
  return {
    type: COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS,
    json,
  };
}

export function commitEditingNavigationItem(client) {
  return (dispatch, getState) => {
    const { editingNavigationItem } = getState();

    dispatch(commitEditingNavigationItemRequest());
    client.saveNavigationItem(editingNavigationItem).then(
      response => dispatch(commitEditingNavigationItemSuccess(response.body)),
    ).catch(
      error => dispatch(commitEditingNavigationItemFailure(error)),
    );
  };
}

export function deleteNavigationItemRequest(navigationItem) {
  return {
    type: DELETE_NAVIGATION_ITEM_REQUEST,
    navigationItem,
  };
}

export function deleteNavigationItemFailure(error, navigationItem) {
  return {
    type: DELETE_NAVIGATION_ITEM_FAILURE,
    error,
    navigationItem,
  };
}

export function deleteNavigationItemSuccess(json, navigationItem) {
  return {
    type: DELETE_NAVIGATION_ITEM_SUCCESS,
    json,
    navigationItem,
  };
}

export function deleteNavigationItem(client, navigationItem) {
  return (dispatch) => {
    dispatch(deleteNavigationItemRequest(navigationItem));
    client.deleteNavigationItem(navigationItem).then(
      response => dispatch(deleteNavigationItemSuccess(response.body, navigationItem)),
    ).catch(
      error => dispatch(deleteNavigationItemFailure(error, navigationItem)),
    );
  };
}

export function editNavigationItem(navigationItem) {
  return {
    type: EDIT_NAVIGATION_ITEM,
    navigationItem,
  };
}

export function fetchNavigationItemsRequest() {
  return {
    type: FETCH_NAVIGATION_ITEMS_REQUEST,
  };
}

export function fetchNavigationItemsFailure(error) {
  return {
    type: FETCH_NAVIGATION_ITEMS_FAILURE,
    error,
  };
}

export function fetchNavigationItemsSuccess(navigationItems) {
  return {
    type: FETCH_NAVIGATION_ITEMS_SUCCESS,
    navigationItems,
  };
}

export function fetchNavigationItems(client) {
  return (dispatch) => {
    dispatch(fetchNavigationItemsRequest());
    client.fetchNavigationItems().then(
      navigationItems => dispatch(fetchNavigationItemsSuccess(navigationItems)),
    ).catch(
      error => dispatch(fetchNavigationItemsFailure(error)),
    );
  };
}

export function fetchPagesRequest() {
  return {
    type: FETCH_PAGES_REQUEST,
  };
}

export function fetchPagesFailure(error) {
  return {
    type: FETCH_PAGES_FAILURE,
    error,
  };
}

export function fetchPagesSuccess(pages) {
  return {
    type: FETCH_PAGES_SUCCESS,
    pages,
  };
}

export function fetchPages(client) {
  return (dispatch) => {
    dispatch(fetchPagesRequest());
    client.fetchPages().then(
      pages => dispatch(fetchPagesSuccess(pages)),
    ).catch(
      error => dispatch(fetchPagesFailure(error)),
    );
  };
}

export function sortNavigationItemsRequest(newNavigationItems) {
  return {
    type: SORT_NAVIGATION_ITEMS_REQUEST,
    newNavigationItems,
  };
}

export function sortNavigationItemsFailure(error) {
  return {
    type: SORT_NAVIGATION_ITEMS_FAILURE,
    error,
  };
}

export function sortNavigationItemsSuccess(newNavigationItems) {
  return {
    type: SORT_NAVIGATION_ITEMS_SUCCESS,
    newNavigationItems,
  };
}

export function sortNavigationItems(client, newNavigationItems) {
  return (dispatch) => {
    dispatch(sortNavigationItemsRequest(newNavigationItems));
    client.sortNavigationItems(newNavigationItems).then(
      () => dispatch(sortNavigationItemsSuccess(newNavigationItems)),
    ).catch(
      error => dispatch(sortNavigationItemsFailure(error)),
    );
  };
}

export function toggleSectionExpanded(navigationSectionId) {
  return {
    type: TOGGLE_SECTION_EXPANDED,
    navigationSectionId,
  };
}
