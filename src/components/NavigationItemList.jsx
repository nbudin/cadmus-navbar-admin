import React from 'react';
import PropTypes from 'prop-types';
import EditableNavigationItem from '../containers/EditableNavigationItem';
import { NavigationItemStorePropType } from '../propTypes';

function NavigationItemList({ client, navigationItems, navigationSectionId = null }) {
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
      client={client}
    />
    ));

  return <ul className="list-group navigation-item-list">{renderedItems}</ul>;
}

NavigationItemList.propTypes = {
  client: PropTypes.shape({}).isRequired,
  navigationItems: NavigationItemStorePropType.isRequired,
  navigationSectionId: PropTypes.number,
};

NavigationItemList.defaultProps = {
  navigationSectionId: null,
};

export default NavigationItemList;
