import React from 'react';
import { withDataContext } from '../DataContext';
import { NavigationItemPropType, NavigationItemStorePropType } from '../propTypes';
import PreviewLink from './PreviewLink';

@withDataContext
class PreviewSection extends React.Component {
  static propTypes = {
    navigationItem: NavigationItemPropType.isRequired,
    navigationItemStore: NavigationItemStorePropType.isRequired,
  };

  render = () => {
    const sectionItems = this.props.navigationItemStore
      .getNavigationItemsInSection(this.props.navigationItem.id);
    const links = sectionItems.map(item => <PreviewLink navigationItem={item} key={item.id} />);

    return (
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
          {this.props.navigationItem.title}
        </a>
        <div className="dropdown-menu">
          {links}
        </div>
      </li>
    );
  }
}

export default PreviewSection;
