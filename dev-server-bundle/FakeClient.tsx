import { CadmusNavbarAdminClient, ErrorSubscriber } from '../src/CadmusNavbarAdminClient';
import { Page } from '../src/DataContext';
import { EditingNavigationItem } from '../src/EditingNavigationItemContext';
import { NavigationItem } from '../src/NavigationItem';
import NavigationItemStore from '../src/NavigationItemStore';

export default class FakeClient implements CadmusNavbarAdminClient {
  pages: Page[];
  navigationItems: NavigationItem[];
  errorSubscribers: ErrorSubscriber[];
  requestsInProgress: {
    savingNavigationItem: boolean;
    deletingNavigationItem: boolean;
    loadingNavigationItems: boolean;
    loadingPages: boolean;
    sortingNavigationItems: boolean;
  };

  constructor() {
    this.pages = [
      { id: '1', name: 'Home' },
      { id: '2', name: 'About us' },
      { id: '3', name: 'Policies' },
    ];

    this.navigationItems = [
      { id: '1', position: 1, title: 'Home', page_id: '1' },
      { id: '2', position: 2, title: 'More info' },
      { id: '3', position: 1, navigation_section_id: '2', title: 'About us', page_id: '2' },
      { id: '4', position: 2, navigation_section_id: '2', title: 'Policies', page_id: '3' },
    ];

    this.errorSubscribers = [];
    this.requestsInProgress = {
      savingNavigationItem: false,
      deletingNavigationItem: false,
      loadingNavigationItems: false,
      loadingPages: false,
      sortingNavigationItems: false,
    };
  }

  addErrorSubscriber(subscriber: ErrorSubscriber): void {
    this.errorSubscribers.push(subscriber);
  }

  onError(error: Error): void {
    this.errorSubscribers.forEach((errorSubscriber) => {
      errorSubscriber(error);
    });
  }

  async fetchNavigationItems(): Promise<NavigationItem[]> {
    return this.navigationItems;
  }

  async fetchPages(): Promise<Page[]> {
    return this.pages;
  }

  async saveNavigationItem(navigationItem: EditingNavigationItem): Promise<NavigationItem> {
    const existingItemIndex = this.navigationItems.findIndex(
      (item) => item.id === navigationItem.id,
    );
    const existingItem =
      existingItemIndex === -1 ? undefined : this.navigationItems[existingItemIndex];

    if (existingItem) {
      const fullItem = {
        ...existingItem,
        ...navigationItem,
      };
      this.navigationItems.splice(existingItemIndex, 1, fullItem);
      return fullItem;
    }

    const navigationItemWithId = {
      ...navigationItem,
      id: new Date().getTime().toString(),
      position: this.navigationItems.length,
    };
    this.navigationItems.push(navigationItemWithId);
    return navigationItemWithId;
  }

  async deleteNavigationItem(navigationItem: NavigationItem): Promise<void> {
    this.navigationItems = this.navigationItems.filter((item) => item.id !== navigationItem.id);
  }

  async sortNavigationItems(navigationItems: NavigationItemStore): Promise<void> {
    this.navigationItems = navigationItems.map((item: NavigationItem) => item);
  }
}
