import { NavigationItem } from './NavigationItem';

function sortNavigationItems(navigationItems: NavigationItem[]): NavigationItem[] {
  return navigationItems.sort((a, b) => a.position - b.position);
}

export default class NavigationItemStore {
  private navigationItems: {
    [id: string]: NavigationItem;
  };

  constructor(navigationItems: NavigationItem[] | { [id: string]: NavigationItem }) {
    if (Array.isArray(navigationItems)) {
      this.navigationItems = navigationItems.reduce(
        (navigationItemsById, item) => ({
          ...navigationItemsById,
          [item.id]: item,
        }),
        {},
      );
    } else {
      this.navigationItems = navigationItems;
    }
  }

  get(id: string): NavigationItem {
    const item = this.navigationItems[id];
    if (item == null) {
      throw new Error(`No navigation item with ID ${id} in store`);
    }
    return item;
  }

  getRoots(): NavigationItem[] {
    return sortNavigationItems(
      Object.values(this.navigationItems).filter(
        (navigationItem) => !navigationItem.navigation_section_id,
      ),
    );
  }

  getNavigationItemsInSection(navigationSectionId: string | undefined): NavigationItem[] {
    if (navigationSectionId == null) {
      return this.getRoots();
    }

    return sortNavigationItems(
      Object.values(this.navigationItems).filter(
        (navigationItem) => navigationItem.navigation_section_id === navigationSectionId,
      ),
    );
  }

  map<U>(
    ...args: [
      callbackfn: (value: NavigationItem, index: number, array: NavigationItem[]) => U,
      thisArg?: any,
    ]
  ): U[] {
    return Object.values(this.navigationItems).map(...args);
  }

  add(navigationItem: NavigationItem): NavigationItemStore {
    return new NavigationItemStore({
      ...this.navigationItems,
      [navigationItem.id]: navigationItem,
    });
  }

  update(id: string, updater: (item: NavigationItem) => NavigationItem): NavigationItemStore {
    return new NavigationItemStore({ ...this.navigationItems, [id]: updater(this.get(id)) });
  }

  delete(id: string): NavigationItemStore {
    const newItems = { ...this.navigationItems };
    delete newItems[id];
    return new NavigationItemStore(newItems);
  }

  reposition(
    id: string,
    newNavigationSectionId: string | undefined,
    newPosition: number,
  ): NavigationItemStore {
    const item = this.get(id);
    const itemsInSection = this.getNavigationItemsInSection(newNavigationSectionId).filter(
      (sectionItem) => sectionItem.id !== item.id,
    );

    let insertIndex = itemsInSection.findIndex(
      (sectionItem) => sectionItem.position >= newPosition,
    );
    if (insertIndex === -1) {
      insertIndex = itemsInSection.length;
    }

    const newItems = [...itemsInSection];
    newItems.splice(insertIndex, 0, {
      ...item,
      navigation_section_id: newNavigationSectionId,
    });
    const newItemsWithPositions = newItems.map((newItem, index) => ({
      ...newItem,
      position: index + 1,
    }));
    return new NavigationItemStore(
      newItemsWithPositions.reduce(
        (acc, newItem) => ({ ...acc, [newItem.id]: newItem }),
        this.navigationItems,
      ),
    );
  }

  applySort(newNavigationItems: NavigationItemStore): NavigationItemStore {
    return new NavigationItemStore(
      Object.values(newNavigationItems.navigationItems).reduce(
        (result, newNavigationItem) => ({
          ...result,
          [newNavigationItem.id]: {
            ...result[newNavigationItem.id],
            position: newNavigationItem.position,
            navigation_section_id: newNavigationItem.navigation_section_id,
          },
        }),
        this.navigationItems,
      ),
    );
  }
}
