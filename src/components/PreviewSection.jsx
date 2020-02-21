import React, { useContext } from 'react';
import { NavigationItemPropType } from '../propTypes';
import PreviewLink from './PreviewLink';
import DataContext from '../DataContext';

function PreviewSection({ navigationItem }) {
  const { navigationItemStore } = useContext(DataContext);
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
};

export default PreviewSection;
