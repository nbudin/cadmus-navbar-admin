import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import DataContext from '../DataContext';
import NavigationItem from './NavigationItem';

function NavigationItemList({ navigationSectionId }) {
  const { navigationItemStore } = useContext(DataContext);

  const navigationItems = useMemo(
    () => {
      if (navigationSectionId != null) {
        return navigationItemStore.getNavigationItemsInSection(navigationSectionId);
      }

      return navigationItemStore.getRoots();
    },
    [navigationItemStore, navigationSectionId],
  );

  const renderNavigationItems = () => (
    navigationItems.map(navigationItem => (
      <NavigationItem
        key={navigationItem.id}
        navigationItem={navigationItem}
      />
    ))
  );

  return (
    <ul className="list-group navigation-item-list">
      {renderNavigationItems()}
    </ul>
  );
}

NavigationItemList.propTypes = {
  navigationSectionId: PropTypes.number,
};

NavigationItemList.defaultProps = {
  navigationSectionId: null,
};

export default NavigationItemList;
