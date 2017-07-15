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
    error: PropTypes.string,
    csrfToken: PropTypes.string,
  };

  static defaultProps = {
    isLoadingNavigationItems: false,
    isLoadingPages: false,
    error: null,
    csrfToken: null,
  };

  componentDidMount = () => {
    this.props.fetchNavigationItems();
    this.props.fetchPages();
  }

  renderError = () => {
    if (this.props.error) {
      return <div className="alert alert-danger">{this.props.error}</div>;
    }

    return null;
  }

  render = () => {
    if (this.props.isLoadingNavigationItems || this.props.isLoadingPages) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {this.renderError()}

        <NavigationItemList
          baseUrl={this.props.baseUrl}
          csrfToken={this.props.csrfToken}
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

        <NavigationItemEditor baseUrl={this.props.baseUrl} csrfToken={this.props.csrfToken} />
      </div>
    );
  }
}

export default NavbarAdminForm;
