import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import itemType from '../itemType';
import LinkForm from './LinkForm';
import { navigationItemEditor } from '../EditingNavigationItemContext';
import { NavigationItemPropType } from '../propTypes';
import SectionForm from './SectionForm';
import { withClient } from '../ClientContext';

@withClient
@navigationItemEditor
class NavigationItemEditorModal extends React.Component {
  static propTypes = {
    navigationItem: NavigationItemPropType,
    navigationItemChanged: PropTypes.func.isRequired,
    saveNavigationItem: PropTypes.func.isRequired,
    cancelEditingNavigationItem: PropTypes.func.isRequired,
    client: PropTypes.shape({
      requestsInProgress: PropTypes.shape({
        savingNavigationItem: PropTypes.bool,
      }),
    }).isRequired,
  };

  static defaultProps = {
    navigationItem: null,
  };

  itemIsValid = () => {
    const { navigationItem } = this.props;

    if (!navigationItem) {
      return false;
    }

    if (itemType(navigationItem) === 'Link' && !navigationItem.page_id) {
      return false;
    }

    if (!navigationItem.title || navigationItem.title.trim() === '') {
      return false;
    }

    return true;
  }

  renderTitle = () => {
    const navigationItemType = itemType(this.props.navigationItem);

    if (navigationItemType === 'Link') {
      return 'Link properties';
    } else if (navigationItemType === 'Section') {
      return 'Section properties';
    }

    return '';
  };

  renderForm = () => {
    const navigationItemType = itemType(this.props.navigationItem);

    if (navigationItemType === 'Link') {
      return (
        <LinkForm
          navigationItem={this.props.navigationItem}
          onSubmit={this.props.saveNavigationItem}
          onChange={this.props.navigationItemChanged}
        />
      );
    } else if (navigationItemType === 'Section') {
      return (
        <SectionForm
          navigationItem={this.props.navigationItem}
          onSubmit={this.props.saveNavigationItem}
          onChange={this.props.navigationItemChanged}
        />
      );
    }

    return null;
  };

  render = () => {
    const {
      navigationItem,
      saveNavigationItem,
      cancelEditingNavigationItem,
      client,
    } = this.props;

    return (
      <Modal visible={!!navigationItem} dialogClassName="modal-lg">
        <div className="modal-header">
          <h5 className="modal-title">{this.renderTitle()}</h5>
        </div>
        <div className="modal-body">
          {this.renderForm()}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={cancelEditingNavigationItem}
            disabled={client.requestsInProgress.savingNavigationItem}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={saveNavigationItem}
            disabled={
              client.requestsInProgress.savingNavigationItem ||
              !this.itemIsValid()
            }
          >
            Save
          </button>
        </div>
      </Modal>
    );
  }
}

export default NavigationItemEditorModal;
