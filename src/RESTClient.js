import fetch from 'isomorphic-fetch';
import jsonFetch from 'json-fetch';

function expectResponseStatuses(statuses) {
  return (response) => {
    if (!statuses.includes(response.status)) {
      return response.json().then(
        json => new Error(json.error),
      ).catch(() => (
        response.text().then(
          text => new Error(text),
        )
      )).then(
        (error) => { throw error; },
      );
    }

    return response;
  };
}

class APIClient {
  constructor({ baseUrl, pagesUrl, csrfToken }) {
    this.baseUrl = baseUrl;
    this.pagesUrl = pagesUrl;
    this.csrfToken = csrfToken;
    this.requestsInProgress = {
      savingNavigationItem: false,
      deletingNavigationItem: false,
      loadingNavigationItems: false,
      loadingPages: false,
      sortingNavigationItems: false,
    };
  }

  saveUrlForNavigationItem(navigationItem) {
    let url = `${this.baseUrl}`;
    if (navigationItem.id) {
      url += `/${navigationItem.id}`;
    }

    return url;
  }

  async fetchNavigationItems() {
    this.requestsInProgress.loadingNavigationItems = true;

    try {
      const response = await jsonFetch(this.baseUrl, { method: 'GET', expectedStatuses: [200] });
      this.csrfToken = response.body.csrf_token;
      return response.body.navigation_items;
    } finally {
      this.requestsInProgress.loadingNavigationItems = false;
    }
  }

  async fetchPages() {
    this.requestsInProgress.loadingPages = true;

    try {
      const response = await jsonFetch(this.pagesUrl, { method: 'GET', expectedStatuses: [200] });
      return response.body;
    } finally {
      this.requestsInProgress.loadingPages = false;
    }
  }

  async saveNavigationItem(navigationItem) {
    let method = 'POST';
    if (navigationItem.id) {
      method = 'PATCH';
    }

    this.requestsInProgress.savingNavigationItem = true;

    try {
      return await jsonFetch(this.saveUrlForNavigationItem(navigationItem), {
        method,
        headers: {
          'X-CSRF-Token': this.csrfToken,
        },
        body: { navigation_item: navigationItem },
        expectedStatuses: [201, 202],
      });
    } finally {
      this.requestsInProgress.savingNavigationItem = false;
    }
  }

  async deleteNavigationItem(navigationItem) {
    this.requestsInProgress.deletingNavigationItem = true;

    try {
      return await fetch(`${this.baseUrl}/${navigationItem.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': this.csrfToken,
        },
        credentials: 'include',
      }).then(expectResponseStatuses([200]));
    } finally {
      this.requestsInProgress.deletingNavigationItem = false;
    }
  }

  async sortNavigationItems(newNavigationItems) {
    const payload = {
      navigation_items: newNavigationItems.map(navigationItem => ({
        id: navigationItem.id,
        position: navigationItem.position,
        navigation_section_id: navigationItem.navigation_section_id,
      })),
    };

    this.requestsInProgress.sortingNavigationItems = true;
    try {
      return await fetch(`${this.baseUrl}/sort`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.csrfToken,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      }).then(expectResponseStatuses([200]));
    } finally {
      this.requestsInProgress.sortingNavigationItems = false;
    }
  }
}

export default APIClient;
