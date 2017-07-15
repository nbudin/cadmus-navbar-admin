import fetch from 'isomorphic-fetch';
import jsonFetch from 'json-fetch';

export const ADD_LINK = 'ADD_LINK';
export const ADD_SECTION = 'ADD_SECTION';
export const CANCEL_EDITING_NAVIGATION_ITEM = 'CANCEL_EDITING_NAVIGATION_ITEM';
export const CHANGE_EDITING_NAVIGATION_ITEM = 'CHANGE_EDITING_NAVIGATION_ITEM';
export const COMMIT_EDITING_NAVIGATION_ITEM_REQUEST = 'COMMIT_EDITING_NAVIGATION_ITEM_REQUEST';
export const COMMIT_EDITING_NAVIGATION_ITEM_FAILURE = 'COMMIT_EDITING_NAVIGATION_ITEM_FAILURE';
export const COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS = 'COMMIT_EDITING_NAVIGATION_ITEM_SUCCESS';
export const DELETE_NAVIGATION_ITEM_REQUEST = 'DELETE_NAVIGATION_ITEM_REQUEST';
export const DELETE_NAVIGATION_ITEM_FAILURE = 'DELETE_NAVIGATION_ITEM_FAILURE';
export const DELETE_NAVIGATION_ITEM_SUCCESS = 'DELETE_NAVIGATION_ITEM_SUCCESS';
export const EDIT_NAVIGATION_ITEM = 'EDIT_NAVIGATION_ITEM';
export const FETCH_NAVIGATION_ITEMS_REQUEST = 'FETCH_NAVIGATION_ITEMS_REQUEST';
export const FETCH_NAVIGATION_ITEMS_FAILURE = 'FETCH_NAVIGATION_ITEMS_FAILURE';
export const FETCH_NAVIGATION_ITEMS_SUCCESS = 'FETCH_NAVIGATION_ITEMS_SUCCESS';
export const FETCH_PAGES_REQUEST = 'FETCH_PAGES_REQUEST';
export const FETCH_PAGES_FAILURE = 'FETCH_PAGES_FAILURE';
export const FETCH_PAGES_SUCCESS = 'FETCH_PAGES_SUCCESS';
export const MOVE_NAVIGATION_ITEM = 'MOVE_NAVIGATION_ITEM';
export const MOVE_NAVIGATION_ITEM_INTO_SECTION = 'MOVE_NAVIGATION_ITEM_INTO_SECTION';
export const SORT_NAVIGATION_ITEMS_REQUEST = 'SORT_NAVIGATION_ITEMS_REQUEST';
export const SORT_NAVIGATION_ITEMS_FAILURE = 'SORT_NAVIGATION_ITEMS_FAILURE';
export const SORT_NAVIGATION_ITEMS_SUCCESS = 'SORT_NAVIGATION_ITEMS_SUCCESS';
export const TOGGLE_SECTION_EXPANDED = 'TOGGLE_SECTION_EXPANDED';

function getCSRFToken() {
  return document.querySelectorAll('meta[name=csrf-token]')[0].content;
}

function saveUrlForNavigationItem(navigationItem, baseUrl) {
  let url = baseUrl;
  if (navigationItem.id) {
    url += `/${navigationItem.id}`;
  }

  return url;
}

function saveNavigationItem(navigationItem, url, csrfToken) {
  let method = 'POST';
  if (navigationItem.id) {
    method = 'PATCH';
  }

  return jsonFetch(url, {
    method,
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    body: navigationItem,
    expectedStatuses: [201, 202],
  });
}

function expectResponseStatuses(statuses) {
  return (response) => {
    if (!statuses.includes(response.status)) {
      return response.json().then(
        (json) => { return new Error(json.error); }
      ).catch(() => (
        response.text().then(
          (text) => { return new Error(text); }
        )
      )).then(
        (error) => { throw error; }
      );
    }

    return response;
  }
}

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

export function commitEditingNavigationItemRequest(url) {
  return {
    type: COMMIT_EDITING_NAVIGATION_ITEM_REQUEST,
    url,
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

export function commitEditingNavigationItem(baseUrl, csrfToken) {
  return (dispatch, getState) => {
    const { editingNavigationItem } = getState();

    const url = saveUrlForNavigationItem(editingNavigationItem, baseUrl);

    dispatch(commitEditingNavigationItemRequest(url));
    saveNavigationItem(editingNavigationItem, url, csrfToken).then(
      response => dispatch(commitEditingNavigationItemSuccess(response.body)),
    ).catch(
      error => dispatch(commitEditingNavigationItemFailure(error)),
    );
  };
}

export function deleteNavigationItemRequest(url, navigationItem) {
  return {
    type: DELETE_NAVIGATION_ITEM_REQUEST,
    url,
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

export function deleteNavigationItem(baseUrl, navigationItem, csrfToken) {
  return (dispatch) => {
    const url = `${baseUrl}/${navigationItem.id}`;
    dispatch(deleteNavigationItemRequest(url, navigationItem));
    fetch(url, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'include',
    }).then(expectResponseStatuses([200])).then(
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

export function fetchNavigationItemsRequest(url) {
  return {
    type: FETCH_NAVIGATION_ITEMS_REQUEST,
    url,
  };
}

export function fetchNavigationItemsFailure(error) {
  return {
    type: FETCH_NAVIGATION_ITEMS_FAILURE,
    error,
  };
}

export function fetchNavigationItemsSuccess(json, csrfToken) {
  return {
    type: FETCH_NAVIGATION_ITEMS_SUCCESS,
    json,
    csrfToken,
  };
}

export function fetchNavigationItems(url) {
  return (dispatch) => {
    dispatch(fetchNavigationItemsRequest(url));
    jsonFetch(url, { method: 'GET', expectedStatuses: [200] }).then(
      response => dispatch(
        fetchNavigationItemsSuccess(response.body.navigation_items, response.body.csrf_token)
      ),
    ).catch(
      error => dispatch(fetchNavigationItemsFailure(error)),
    );
  };
}

export function fetchPagesRequest(url) {
  return {
    type: FETCH_PAGES_REQUEST,
    url,
  };
}

export function fetchPagesFailure(error) {
  return {
    type: FETCH_PAGES_FAILURE,
    error,
  };
}

export function fetchPagesSuccess(json) {
  return {
    type: FETCH_PAGES_SUCCESS,
    json,
  };
}

export function fetchPages(url) {
  return (dispatch) => {
    dispatch(fetchPagesRequest(url));
    jsonFetch(url, { method: 'GET', expectedStatuses: [200] }).then(
      response => dispatch(fetchPagesSuccess(response.body)),
    ).catch(
      error => dispatch(fetchPagesFailure(error)),
    );
  };
}

export function sortNavigationItemsRequest(url, newNavigationItems) {
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

export function sortNavigationItems(baseUrl, newNavigationItems, csrfToken) {
  return (dispatch) => {
    const payload = {
      navigation_items: newNavigationItems.map(navigationItem => ({
        id: navigationItem.id,
        position: navigationItem.position,
        navigation_section_id: navigationItem.navigation_section_id,
      })),
    };

    const url = `${baseUrl}/sort`;

    dispatch(sortNavigationItemsRequest(url, newNavigationItems));
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    }).then(expectResponseStatuses([200])).then(
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

