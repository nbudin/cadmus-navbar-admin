import { NavigationItem } from '../NavigationItem';

export type PreviewLinkProps = {
  navigationItem: Pick<NavigationItem, 'title' | 'navigation_section_id'>;
};

function PreviewLink({ navigationItem }: PreviewLinkProps): JSX.Element {
  if (navigationItem.navigation_section_id) {
    return (
      <a className="dropdown-item" href="#">
        {navigationItem.title}
      </a>
    );
  }

  return (
    <a className="nav-item nav-link" href="#">
      {navigationItem.title}
    </a>
  );
}

export default PreviewLink;
