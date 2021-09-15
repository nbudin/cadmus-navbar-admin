import { useContext, useMemo } from 'react';
import DataContext from '../DataContext';
import NavigationItemDisplay from './NavigationItemDisplay';

export type NavigationItemListProps = {
  navigationSectionId?: string;
};

function NavigationItemList({ navigationSectionId }: NavigationItemListProps): JSX.Element {
  const { navigationItemStore } = useContext(DataContext);

  const navigationItems = useMemo(() => {
    if (navigationSectionId != null) {
      return navigationItemStore.getNavigationItemsInSection(navigationSectionId);
    }

    return navigationItemStore.getRoots();
  }, [navigationItemStore, navigationSectionId]);

  const renderNavigationItems = () =>
    navigationItems.map((navigationItem) => (
      <NavigationItemDisplay key={navigationItem.id} navigationItem={navigationItem} />
    ));

  return <ul className="list-group navigation-item-list">{renderNavigationItems()}</ul>;
}

export default NavigationItemList;
