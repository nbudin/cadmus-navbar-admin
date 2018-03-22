import fetch from 'unfetch';

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

function getJSON(url) {
  return fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'include',
  }).then(expectResponseStatuses([200])).then(resp => resp.json());
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
    this.errorSubscribers = [];
  }

  addErrorSubscriber(subscriber) {
    this.errorSubscribers.push(subscriber);
  }

  onError(error) {
    this.errorSubscribers.forEach((errorSubscriber) => { errorSubscriber(error); });
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
      const response = await getJSON(this.baseUrl);
      this.csrfToken = response.csrf_token;
      return response.navigation_items;
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.loadingNavigationItems = false;
    }
  }

  async fetchPages() {
    this.requestsInProgress.loadingPages = true;

    try {
      const response = await getJSON(this.pagesUrl);
      return response;
    } catch (error) {
      this.onError(error);
      throw error;
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
      const response = await fetch(this.saveUrlForNavigationItem(navigationItem), {
        method,
        headers: {
          'X-CSRF-Token': this.csrfToken,
        },
        body: { navigation_item: navigationItem },
      }).then(expectResponseStatuses([201, 202])).then(resp => resp.json());
      return response.navigation_item;
    } catch (error) {
      this.onError(error);
      throw error;
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
    } catch (error) {
      this.onError(error);
      throw error;
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
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.sortingNavigationItems = false;
    }
  }
}

export default APIClient;
