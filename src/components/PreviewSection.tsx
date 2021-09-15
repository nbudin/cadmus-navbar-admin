import { useContext } from 'react';
import { NavigationItem } from '../NavigationItem';
import PreviewLink from './PreviewLink';
import DataContext from '../DataContext';

export type PreviewSectionProps = {
  navigationItem: NavigationItem;
};

function PreviewSection({ navigationItem }: PreviewSectionProps): JSX.Element {
  const { navigationItemStore } = useContext(DataContext);
  const sectionItems = navigationItemStore.getNavigationItemsInSection(navigationItem.id);
  const links = sectionItems.map((item) => <PreviewLink navigationItem={item} key={item.id} />);

  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        data-toggle="dropdown"
        role="button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {navigationItem.title}
      </a>
      <div className="dropdown-menu">{links}</div>
    </li>
  );
}

export default PreviewSection;
