import React from 'react';
import itemType from '../itemType';
import { NavigationItemStorePropType } from '../propTypes';
import PreviewLink from './PreviewLink';
import PreviewSection from './PreviewSection';

function PreviewNavigationBar({ navigationItems }) {
  const items = navigationItems.getRoots().map((item) => {
    const type = itemType(item);

    if (type === 'Link') {
      return <PreviewLink navigationItem={item} key={item.id} />;
    }

    return <PreviewSection navigationItem={item} navigationItems={navigationItems} key={item.id} />;
  });

  return (
    <nav className="navbar navbar-light bg-faded navbar-toggleable-md mb-4">
      <div className="navbar-brand">
        Preview
      </div>

      <div className="collapse navbar-collapse" id="preview-navbar-collapse-1">
        <ul className="nav navbar-nav mr-auto">
          {items}
        </ul>
      </div>
    </nav>
  );
}

PreviewNavigationBar.propTypes = {
  navigationItems: NavigationItemStorePropType.isRequired,
};

export default PreviewNavigationBar;
