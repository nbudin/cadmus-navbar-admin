import React from 'react';
import PropTypes from 'prop-types';
import { withDataContext } from '../DataContext';
import NavigationItem from './NavigationItem';
import { NavigationItemStorePropType } from '../propTypes';

class NavigationItemList extends React.Component {
  static propTypes = {
    navigationItemStore: NavigationItemStorePropType.isRequired,
    navigationSectionId: PropTypes.number,
  };

  static defaultProps = {
    navigationSectionId: null,
  };

  getNavigationItems = () => {
    const { navigationItemStore } = this.props;
    if (this.props.navigationSectionId != null) {
      return navigationItemStore.getNavigationItemsInSection(this.props.navigationSectionId);
    }

    return navigationItemStore.getRoots();
  }

  renderNavigationItems = () => (
    this.getNavigationItems().map(navigationItem => (
      <NavigationItem
        key={navigationItem.id}
        navigationItem={navigationItem}
      />
    ))
  )

  render = () => (
    <ul className="list-group navigation-item-list">
      {this.renderNavigationItems()}
    </ul>
  );
}

export default withDataContext(NavigationItemList);
