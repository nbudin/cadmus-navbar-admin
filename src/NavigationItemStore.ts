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

  getFlattenedItems(includeCollapsedChildren = false): NavigationItem[] {
    const flattenList = (items: NavigationItem[]): NavigationItem[] => {
      return items.reduce(
        (acc, item) => [
          ...acc,
          item,
          ...(includeCollapsedChildren || item.expanded
            ? flattenList(this.getNavigationItemsInSection(item.id))
            : []),
        ],
        [],
      );
    };

    return flattenList(this.getRoots());
  }

  map<U>(
    ...args: [
      callbackfn: (value: NavigationItem, index: number, array: NavigationItem[]) => U,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    newIndex: number,
  ): NavigationItemStore {
    const item = this.get(id);
    const itemsInSection = this.getNavigationItemsInSection(newNavigationSectionId).filter(
      (sectionItem) => sectionItem.id !== item.id,
    );

    const newItems = [...itemsInSection];
    newItems.splice(newIndex, 0, {
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
}
