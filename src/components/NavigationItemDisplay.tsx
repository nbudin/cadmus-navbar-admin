import { useContext, useState } from 'react';
import { ConfirmModal } from 'react-bootstrap4-modal';
import itemType from '../itemType';
import { useNavigationItemEditing } from '../EditingNavigationItemContext';
import { NavigationItem } from '../NavigationItem';
import SectionDisclosureTriangle from './SectionDisclosureTriangle';
import ClientContext from '../ClientContext';
import DataContext from '../DataContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddButton from './AddButton';

export type NavigationItemDisplayProps = {
  navigationItem: NavigationItem;
  isBeingDragged?: boolean;
};

function NavigationItemDisplay({
  navigationItem,
  isBeingDragged,
}: NavigationItemDisplayProps): JSX.Element {
  const { navigationItemStore, setNavigationItemStore } = useContext(DataContext);
  const { editNavigationItem, newNavigationLink } = useNavigationItemEditing();
  const client = useContext(ClientContext);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { setNodeRef, transform, transition, attributes, listeners } = useSortable({
    id: navigationItem.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    opacity: isBeingDragged ? 0.5 : undefined,
  };

  const onClickDelete = () => {
    setIsConfirmingDelete(true);
  };
  const cancelDelete = () => {
    setIsConfirmingDelete(false);
  };
  const confirmDelete = async () => {
    await client.deleteNavigationItem(navigationItem);

    const newStore = navigationItemStore.delete(navigationItem.id);
    setNavigationItemStore(newStore);
  };

  const editNavigationItemClicked = () => {
    editNavigationItem({
      ...navigationItem,
      type: navigationItem.page_id == null ? 'section' : 'link',
    });
  };

  const renderDisclosureTriangle = () => {
    if (itemType(navigationItem) !== 'Section') {
      return null;
    }

    return (
      <span>
        <SectionDisclosureTriangle navigationSectionId={navigationItem.id} />{' '}
      </span>
    );
  };

  const renderConfirmDelete = () => (
    <ConfirmModal visible={isConfirmingDelete} onCancel={cancelDelete} onOK={confirmDelete}>
      Are you sure you want to delete {navigationItem.title} from the navigation bar?
    </ConfirmModal>
  );

  const renderItemContent = () => (
    <div className="row w-100">
      <div className="col">
        <i className="bi-grip-vertical draggable" {...attributes} {...listeners} />{' '}
        {renderDisclosureTriangle()}
        <strong>{itemType(navigationItem)}:</strong> {navigationItem.title}
      </div>
      <div className="col text-right">
        {itemType(navigationItem) === 'Section' && (
          <>
            <AddButton onClick={() => newNavigationLink(navigationItem.id)}>Add link</AddButton>{' '}
          </>
        )}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={editNavigationItemClicked}
        >
          Edit
        </button>{' '}
        <button type="button" className="btn btn-danger btn-sm" onClick={onClickDelete}>
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <li className="list-group-item" ref={setNodeRef} style={style}>
      {renderItemContent()}
      {renderConfirmDelete()}
    </li>
  );
}

export default NavigationItemDisplay;
