import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import AddLinkButton from '../containers/AddLinkButton';
import AddSectionButton from '../containers/AddSectionButton';
import NavigationItemList from './NavigationItemList';
import NavigationItemEditor from '../containers/NavigationItemEditor';
import { NavigationItemStorePropType } from '../propTypes';

@DragDropContext(HTML5Backend)
class NavbarAdminForm extends React.Component {
  static propTypes = {
    fetchNavigationItems: PropTypes.func.isRequired,
    fetchPages: PropTypes.func.isRequired,
    navigationItems: NavigationItemStorePropType.isRequired,
    isLoadingNavigationItems: PropTypes.bool,
    isLoadingPages: PropTypes.bool,
    baseUrl: PropTypes.string.isRequired,
  };

  static defaultProps = {
    isLoadingNavigationItems: false,
    isLoadingPages: false,
  };

  componentDidMount = () => {
    this.props.fetchNavigationItems();
    this.props.fetchPages();
  }

  render = () => {
    if (this.props.isLoadingNavigationItems || this.props.isLoadingPages) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <NavigationItemList
          baseUrl={this.props.baseUrl}
          navigationItems={this.props.navigationItems}
        />

        <ul className="list-inline mt-2">
          <li className="list-inline-item">
            <AddSectionButton />
          </li>
          <li className="list-inline-item">
            <AddLinkButton />
          </li>
        </ul>

        <NavigationItemEditor baseUrl={this.props.baseUrl} />
      </div>
    );
  }
}

export default NavbarAdminForm;
