import React from 'react';
import PropTypes from 'prop-types';
import EditableNavigationItem from '../containers/EditableNavigationItem';
import { NavigationItemStorePropType } from '../propTypes';

function NavigationItemList({ baseUrl, navigationItems, navigationSectionId = null, csrfToken = null }) {
  let itemsInList;
  if (navigationSectionId) {
    itemsInList = navigationItems.getNavigationItemsInSection(navigationSectionId);
  } else {
    itemsInList = navigationItems.getRoots();
  }

  const renderedItems = itemsInList.map(navigationItem => (
    <EditableNavigationItem
      key={navigationItem.id}
      navigationItem={navigationItem}
      baseUrl={baseUrl}
    />
    ));

  return <ul className="list-group navigation-item-list">{renderedItems}</ul>;
}

NavigationItemList.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  navigationItems: NavigationItemStorePropType.isRequired,
  navigationSectionId: PropTypes.number,
  csrfToken: PropTypes.string,
};

export default NavigationItemList;
