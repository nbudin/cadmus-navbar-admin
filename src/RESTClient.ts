import { CadmusNavbarAdminClient, ErrorSubscriber } from './CadmusNavbarAdminClient';
import { Page } from './DataContext';
import { EditingNavigationItem } from './EditingNavigationItemContext';
import NavigationItemStore from './NavigationItemStore';
import { NavigationItem } from './NavigationItem';

function expectResponseStatuses(statuses: number[]) {
  return (response: Response) => {
    if (!statuses.includes(response.status)) {
      return response
        .json()
        .then((json) => new Error(json.error))
        .catch(() => response.text().then((text) => new Error(text)))
        .then((error) => {
          throw error;
        });
    }

    return Promise.resolve(response);
  };
}

function getJSON(url: string, disableCORS: boolean) {
  return fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'include',
    mode: disableCORS ? 'no-cors' : 'cors',
  })
    .then(expectResponseStatuses([200]))
    .then((resp) => resp.json());
}

function stringifyNavigationItemIdFields(navigationItem: NavigationItem): NavigationItem {
  return {
    ...navigationItem,
    id: navigationItem.id.toString(),
    navigation_section_id: navigationItem.navigation_section_id?.toString(),
    page_id: navigationItem.page_id?.toString(),
  };
}

export default class RESTClient implements CadmusNavbarAdminClient {
  private baseUrl: string;

  private pagesUrl: string;

  private csrfToken: string;

  private disableCORS: boolean;

  public requestsInProgress: {
    savingNavigationItem: boolean;
    deletingNavigationItem: boolean;
    loadingNavigationItems: boolean;
    loadingPages: boolean;
    sortingNavigationItems: boolean;
  };

  private errorSubscribers: ErrorSubscriber[];

  constructor({
    baseUrl,
    pagesUrl,
    csrfToken,
    disableCORS,
  }: {
    baseUrl: string;
    pagesUrl: string;
    csrfToken: string;
    disableCORS?: boolean;
  }) {
    this.baseUrl = baseUrl;
    this.pagesUrl = pagesUrl;
    this.csrfToken = csrfToken;
    this.disableCORS = disableCORS ?? false;
    this.requestsInProgress = {
      savingNavigationItem: false,
      deletingNavigationItem: false,
      loadingNavigationItems: false,
      loadingPages: false,
      sortingNavigationItems: false,
    };
    this.errorSubscribers = [];
  }

  addErrorSubscriber(subscriber: ErrorSubscriber<Error>): void {
    this.errorSubscribers.push(subscriber);
  }

  private onError(error: Error) {
    this.errorSubscribers.forEach((errorSubscriber) => {
      errorSubscriber(error);
    });
  }

  private saveUrlForNavigationItem(navigationItem: EditingNavigationItem) {
    let url = `${this.baseUrl}`;
    if (navigationItem.id) {
      url += `/${navigationItem.id}`;
    }

    return url;
  }

  async fetchNavigationItems(): Promise<NavigationItem[]> {
    this.requestsInProgress.loadingNavigationItems = true;

    try {
      const response = await getJSON(this.baseUrl, this.disableCORS);
      this.csrfToken = response.csrf_token;
      return response.navigation_items.map(stringifyNavigationItemIdFields);
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.loadingNavigationItems = false;
    }
  }

  async fetchPages(): Promise<Page[]> {
    this.requestsInProgress.loadingPages = true;

    try {
      const response = await getJSON(this.pagesUrl, this.disableCORS);
      return response.map((page: Page) => ({
        ...page,
        id: page.id.toString(),
      }));
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.loadingPages = false;
    }
  }

  async saveNavigationItem(navigationItem: EditingNavigationItem): Promise<NavigationItem> {
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ navigation_item: navigationItem }),
        mode: this.disableCORS ? 'no-cors' : 'cors',
      })
        .then(expectResponseStatuses([201, 202]))
        .then((resp) => resp.json());
      return stringifyNavigationItemIdFields(response.navigation_item);
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.savingNavigationItem = false;
    }
  }

  async deleteNavigationItem(navigationItem: NavigationItem): Promise<void> {
    this.requestsInProgress.deletingNavigationItem = true;

    try {
      await fetch(`${this.baseUrl}/${navigationItem.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': this.csrfToken,
        },
        credentials: 'include',
        mode: this.disableCORS ? 'no-cors' : 'cors',
      }).then(expectResponseStatuses([200]));
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.deletingNavigationItem = false;
    }
  }

  async sortNavigationItems(newNavigationItems: NavigationItemStore): Promise<void> {
    const payload = {
      navigation_items: newNavigationItems.map((navigationItem) => ({
        id: navigationItem.id,
        position: navigationItem.position,
        navigation_section_id: navigationItem.navigation_section_id,
      })),
    };

    this.requestsInProgress.sortingNavigationItems = true;
    try {
      await fetch(`${this.baseUrl}/sort`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.csrfToken,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
        mode: this.disableCORS ? 'no-cors' : 'cors',
      }).then(expectResponseStatuses([200]));
    } catch (error) {
      this.onError(error);
      throw error;
    } finally {
      this.requestsInProgress.sortingNavigationItems = false;
    }
  }
}
