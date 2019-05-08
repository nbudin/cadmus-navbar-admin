import React from 'react';
import { withDataContext } from '../DataContext';
import { NavigationItemPropType, NavigationItemStorePropType } from '../propTypes';
import PreviewLink from './PreviewLink';

function PreviewSection({ navigationItem, navigationItemStore }) {
  const sectionItems = navigationItemStore
    .getNavigationItemsInSection(navigationItem.id);
  const links = sectionItems.map(item => <PreviewLink navigationItem={item} key={item.id} />);

  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
        {navigationItem.title}
      </a>
      <div className="dropdown-menu">
        {links}
      </div>
    </li>
  );
}

PreviewSection.propTypes = {
  navigationItem: NavigationItemPropType.isRequired,
  navigationItemStore: NavigationItemStorePropType.isRequired,
};

export default withDataContext(PreviewSection);
