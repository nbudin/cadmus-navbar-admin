import React, { useContext, useMemo } from 'react';
import Modal from 'react-bootstrap4-modal';
import itemType from '../itemType';
import LinkForm from './LinkForm';
import EditingNavigationItemContext from '../EditingNavigationItemContext';
import SectionForm from './SectionForm';
import ClientContext from '../ClientContext';

function NavigationItemEditorModal() {
  const {
    navigationItem, navigationItemChanged, cancel, save,
  } = useContext(EditingNavigationItemContext);
  const client = useContext(ClientContext);

  const itemIsValid = useMemo(
    () => {
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
    },
    [navigationItem],
  );

  const renderTitle = () => {
    const navigationItemType = itemType(navigationItem);

    if (navigationItemType === 'Link') {
      return 'Link properties';
    } else if (navigationItemType === 'Section') {
      return 'Section properties';
    }

    return '';
  };

  const renderForm = () => {
    const navigationItemType = itemType(navigationItem);

    if (navigationItemType === 'Link') {
      return (
        <LinkForm
          navigationItem={navigationItem}
          onSubmit={save}
          onChange={navigationItemChanged}
        />
      );
    } else if (navigationItemType === 'Section') {
      return (
        <SectionForm
          navigationItem={navigationItem}
          onSubmit={save}
          onChange={navigationItemChanged}
        />
      );
    }

    return null;
  };

  return (
    <Modal visible={!!navigationItem} dialogClassName="modal-lg">
      <div className="modal-header">
        <h5 className="modal-title">{renderTitle()}</h5>
      </div>
      <div className="modal-body">
        {renderForm()}
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={cancel}
          disabled={client.requestsInProgress.savingNavigationItem}
        >
          Cancel
          </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={save}
          disabled={
            client.requestsInProgress.savingNavigationItem ||
            !itemIsValid
          }
        >
          Save
          </button>
      </div>
    </Modal>
  );
}

export default NavigationItemEditorModal;
