import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import itemType from '../itemType';
import LinkEditor from '../containers/LinkEditor';
import { NavigationItemPropType } from '../propTypes';
import SectionEditor from '../containers/SectionEditor';

const renderTitle = (navigationItemType) => {
  if (navigationItemType === 'Link') {
    return 'Link properties';
  } else if (navigationItemType === 'Section') {
    return 'Section properties';
  }

  return '';
};

const renderForm = (navigationItem, navigationItemType, onSave) => {
  if (navigationItemType === 'Link') {
    return (
      <LinkEditor navigationItem={navigationItem} onSubmit={onSave} />
    );
  } else if (navigationItemType === 'Section') {
    return (
      <SectionEditor navigationItem={navigationItem} onSubmit={onSave} />
    );
  }

  return null;
};

const NavigationItemEditorModal = ({ navigationItem, onSave, onCancel, isCommittingEditingNavigationItem }) => {
  let navigationItemType;
  if (navigationItem) {
    navigationItemType = itemType(navigationItem);
  }

  return (
    <Modal visible={!!navigationItem}>
      <div className="modal-header">
        <h5 className="modal-title">{renderTitle(navigationItemType)}</h5>
      </div>
      <div className="modal-body">
        {renderForm(navigationItem, navigationItemType, onSave)}
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isCommittingEditingNavigationItem}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSave}
          disabled={isCommittingEditingNavigationItem}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

NavigationItemEditorModal.propTypes = {
  navigationItem: NavigationItemPropType,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isCommittingEditingNavigationItem: PropTypes.bool.isRequired,
};

export default NavigationItemEditorModal;
