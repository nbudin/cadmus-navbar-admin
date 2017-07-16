import { Map } from 'immutable';

function sortNavigationItems(navigationItems) {
  return navigationItems.sortBy(item => item.position);
}

export default class NavigationItemStore {
  constructor(navigationItems) {
    if (Map.isMap(navigationItems)) {
      this.navigationItems = navigationItems;
    } else {
      this.navigationItems = new Map(navigationItems.map(item => [item.id, item]));
    }
  }

  get(id) {
    return this.navigationItems.get(id);
  }

  getRoots() {
    return sortNavigationItems(
      this.navigationItems.valueSeq().filter(
        navigationItem => !navigationItem.navigation_section_id,
      ),
    );
  }

  getNavigationItemsInSection(navigationSectionId) {
    if (!navigationSectionId) {
      return this.getRoots();
    }

    return sortNavigationItems(
      this.navigationItems.valueSeq().filter(
        navigationItem => navigationItem.navigation_section_id === navigationSectionId,
      ),
    );
  }

  map(...args) {
    return this.navigationItems.valueSeq().map(...args);
  }

  update(id, updater) {
    const updatedItem = updater(this.get(id));
    return new NavigationItemStore(this.navigationItems.set(id, updatedItem));
  }

  delete(id) {
    return new NavigationItemStore(this.navigationItems.delete(id));
  }

  reposition(id, newNavigationSectionId, newPosition) {
    const item = this.get(id);
    const itemsInSection = this.getNavigationItemsInSection(newNavigationSectionId).filter(
      sectionItem => sectionItem.id !== item.id,
    ).toList();

    let insertIndex = itemsInSection.findIndex(sectionItem => sectionItem.position >= newPosition);
    if (insertIndex === -1) {
      insertIndex = itemsInSection.size;
    }

    const newItems = itemsInSection.insert(insertIndex, {
      ...item,
      navigation_section_id: newNavigationSectionId,
    });
    const newItemsWithPositions = newItems.map((newItem, index) => (
      { ...newItem, position: index + 1 }
    ));
    const newItemsMap = new Map(newItemsWithPositions.map(newItem => [newItem.id, newItem]));

    return new NavigationItemStore(this.navigationItems.merge(newItemsMap));
  }

  applySort(newNavigationItems) {
    return new NavigationItemStore(this.navigationItems.withMutations(
      navigationItems => newNavigationItems.navigationItems.reduce(
        (result, newNavigationItem) => result.set(newNavigationItem.id, {
          ...result.get(newNavigationItem.id),
          position: newNavigationItem.position,
          navigation_section_id: newNavigationItem.navigation_section_id,
        }),
        navigationItems,
      ),
    ));
  }
}
