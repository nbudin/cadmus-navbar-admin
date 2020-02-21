import React, { useContext, useMemo } from 'react';
import DataContext from '../DataContext';
import itemType from '../itemType';
import PreviewLink from './PreviewLink';
import PreviewSection from './PreviewSection';

function PreviewNavigationBar() {
  const { navigationItemStore } = useContext(DataContext);

  const roots = useMemo(
    () => navigationItemStore.getRoots(),
    [navigationItemStore],
  );

  const renderNavigationItems = () => roots.map((item) => {
    const type = itemType(item);

    if (type === 'Link') {
      return <PreviewLink navigationItem={item} key={item.id} />;
    }

    return <PreviewSection navigationItem={item} key={item.id} />;
  });

  return (
    <nav className="navbar navbar-light bg-faded navbar-toggleable-md mb-4">
      <div className="navbar-brand">
        Preview
      </div>

      <div className="collapse navbar-collapse" id="preview-navbar-collapse-1">
        <ul className="nav navbar-nav mr-auto">
          {renderNavigationItems()}
        </ul>
      </div>
    </nav>
  );
}

export default PreviewNavigationBar;
