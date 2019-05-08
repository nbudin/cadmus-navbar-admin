import React from 'react';
import PropTypes from 'prop-types';
import MultiBackend, { Preview } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'; // or any other pipeline
import { DragDropContext } from 'react-dnd';
import AddButton from './AddButton';
import { withClient } from '../ClientContext';
import { withDataContext } from '../DataContext';
import NavigationItem from './NavigationItem';
import { navigationItemEditingController } from '../EditingNavigationItemContext';
import NavigationItemList from './NavigationItemList';
import NavigationItemEditorModal from './NavigationItemEditorModal';
import PreviewNavigationBar from './PreviewNavigationBar';

class NavbarAdminForm extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      error: PropTypes.string,
      requestsInProgress: PropTypes.shape({
        loadingNavigationItems: PropTypes.bool.isRequired,
        loadingPages: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
    error: PropTypes.string,
    newNavigationLink: PropTypes.func.isRequired,
    newNavigationSection: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isLoadingNavigationItems: false,
    isLoadingPages: false,
    error: null,
  };

  generatePreview = (type, item, style) => {
    if (type === 'NAVIGATION_ITEM') {
      return (
        <div style={{ ...style, width: `${this.wrapperDiv.offsetWidth}px` }}>
          <NavigationItem navigationItem={item} />
        </div>
      );
    }

    return null;
  }

  renderError = (error) => {
    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }

    return null;
  }

  render = () => {
    const { loadingNavigationItems, loadingPages } = this.props.client.requestsInProgress;
    if (loadingNavigationItems || loadingPages) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <div ref={(div) => { this.wrapperDiv = div; }}>
        {this.renderError(this.props.client.error)}

        <PreviewNavigationBar />
        <NavigationItemList />

        <ul className="list-inline mt-2">
          <li className="list-inline-item">
            <AddButton onClick={this.props.newNavigationSection}>Add section</AddButton>
          </li>
          <li className="list-inline-item">
            <AddButton onClick={() => { this.props.newNavigationLink(); }}>Add link</AddButton>
          </li>
        </ul>

        <Preview generator={this.generatePreview} />
        <NavigationItemEditorModal />
      </div>
    );
  }
}

export default withClient(
  withDataContext(
    navigationItemEditingController(
      DragDropContext(MultiBackend(HTML5toTouch))(
        NavbarAdminForm,
      ),
    ),
  ),
);
