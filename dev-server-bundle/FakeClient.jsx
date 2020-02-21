export default class FakeClient {
  constructor() {
    this.pages = [
      { id: 1, name: 'Home' },
      { id: 2, name: 'About us' },
      { id: 3, name: 'Policies' },
    ];

    this.navigationItems = [
      { id: 1, position: 1, title: 'Home', page_id: 1 },
      { id: 2, position: 2, title: 'More info' },
      { id: 3, position: 1, navigation_section_id: 2, title: 'About us', page_id: 2 },
      { id: 4, position: 2, navigation_section_id: 2, title: 'Policies', page_id: 3 },
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

  addErrorSubscriber(subscriber) {
    this.errorSubscribers.push(subscriber);
  }

  onError(error) {
    this.errorSubscribers.forEach((errorSubscriber) => { errorSubscriber(error); });
  }

  async fetchNavigationItems() {
    return this.navigationItems;
  }

  async fetchPages() {
    return this.pages;
  }

  async saveNavigationItem(navigationItem) {
    const existingItemIndex = this.navigationItems.findIndex(item => item.id === navigationItem.id);

    if (existingItemIndex !== -1) {
      this.navigationItems.splice(existingItemIndex, 1, navigationItem);
      return navigationItem;
    }

    const navigationItemWithId = { ...navigationItem, id: new Date().getTime() };
    this.navigationItems.push(navigationItemWithId);
    return navigationItemWithId;
  }

  async deleteNavigationItem(navigationItem) {
    this.navigationItems = this.navigationItems.filter(item => item.id !== navigationItem.id);
  }

  async sortNavigationItems(navigationItems) {
    this.navigationItems = navigationItems.map(item => item);
  }
}
