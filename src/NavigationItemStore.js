function sortNavigationItems(navigationItems) {
  return navigationItems.sort((a, b) => a.position - b.position);
}

export default class NavigationItemStore {
  constructor(navigationItems) {
    if (Array.isArray(navigationItems)) {
      this.navigationItems = navigationItems.reduce((navigationItemsById, item) => ({
        ...navigationItemsById,
        [item.id]: item,
      }), {});
    } else {
      this.navigationItems = navigationItems;
    }
  }

  get(id) {
    return this.navigationItems[id];
  }

  getRoots() {
    return sortNavigationItems(
      Object.values(this.navigationItems).filter(
        navigationItem => !navigationItem.navigation_section_id,
      ),
    );
  }

  getNavigationItemsInSection(navigationSectionId) {
    if (!navigationSectionId) {
      return this.getRoots();
    }

    return sortNavigationItems(
      Object.values(this.navigationItems).filter(
        navigationItem => navigationItem.navigation_section_id === navigationSectionId,
      ),
    );
  }

  map(...args) {
    return Object.values(this.navigationItems).map(...args);
  }

  add(navigationItem) {
    return new NavigationItemStore({
      ...this.navigationItems,
      [navigationItem.id]: navigationItem,
    });
  }

  update(id, updater) {
    return new NavigationItemStore({ ...this.navigationItems, [id]: updater(this.get(id)) });
  }

  delete(id) {
    const newItems = { ...this.navigationItems };
    delete newItems[id];
    return new NavigationItemStore(newItems);
  }

  reposition(id, newNavigationSectionId, newPosition) {
    const item = this.get(id);
    const itemsInSection = this.getNavigationItemsInSection(newNavigationSectionId).filter(
      sectionItem => sectionItem.id !== item.id,
    );

    let insertIndex = itemsInSection.findIndex(sectionItem => sectionItem.position >= newPosition);
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
    return new NavigationItemStore(newItemsWithPositions.reduce(
      (acc, newItem) => ({ ...acc, [newItem.id]: newItem }),
      this.navigationItems,
    ));
  }

  applySort(newNavigationItems) {
    return new NavigationItemStore(Object.values(newNavigationItems.navigationItems).reduce(
      (result, newNavigationItem) => ({
        ...result,
        [newNavigationItem.id]: {
          ...result[newNavigationItem.id],
          position: newNavigationItem.position,
          navigation_section_id: newNavigationItem.navigation_section_id,
        },
      }),
      this.navigationItems,
    ));
  }
}
