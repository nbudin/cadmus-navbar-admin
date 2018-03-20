import React from 'react';
import PropTypes from 'prop-types';
import MultiBackend, { Preview } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline
import { DragDropContext } from 'react-dnd';
import AddLinkButton from '../containers/AddLinkButton';
import AddSectionButton from '../containers/AddSectionButton';
import EditableNavigationItem from '../containers/EditableNavigationItem';
import NavigationItemList from './NavigationItemList';
import NavigationItemEditor from '../containers/NavigationItemEditor';
import { NavigationItemStorePropType } from '../propTypes';
import PreviewNavigationBar from './PreviewNavigationBar';

@DragDropContext(MultiBackend(HTML5toTouch))
class NavbarAdminForm extends React.Component {
  static propTypes = {
    fetchNavigationItems: PropTypes.func.isRequired,
    fetchPages: PropTypes.func.isRequired,
    navigationItems: NavigationItemStorePropType.isRequired,
    isLoadingNavigationItems: PropTypes.bool,
    isLoadingPages: PropTypes.bool,
    client: PropTypes.shape({}).isRequired,
    error: PropTypes.string,
  };

  static defaultProps = {
    isLoadingNavigationItems: false,
    isLoadingPages: false,
    error: null,
  };

  componentDidMount = () => {
    this.props.fetchNavigationItems();
    this.props.fetchPages();
  }

  generatePreview = (type, item, style) => {
    if (type === 'NAVIGATION_ITEM') {
      return (
        <div style={{ ...style, width: `${this.wrapperDiv.offsetWidth}px` }}>
          <EditableNavigationItem
            client={this.props.client}
            navigationItem={item}
          />
        </div>
      );
    }

    return null;
  }

  renderError = () => {
    if (this.props.error) {
      return <div className="alert alert-danger">{this.props.error}</div>;
    }

    return null;
  }

  render = () => {
    if (this.props.isLoadingNavigationItems || this.props.isLoadingPages) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div ref={(div) => { this.wrapperDiv = div; }}>
        {this.renderError()}

        <PreviewNavigationBar navigationItems={this.props.navigationItems} />

        <NavigationItemList
          client={this.props.client}
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

        <NavigationItemEditor client={this.props.client} />
        <Preview generator={this.generatePreview} />
      </div>
    );
  }
}

export default NavbarAdminForm;
